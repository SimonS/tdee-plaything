<?php
use function bdt\fetchMovieMetaData;
use function bdt\get_updated_feeds;

// $res = fetch_feed("https://letterboxd.com/simonscarfe/rss/");
// var_dump($res->get_items()[1]->get_item_tags("https://letterboxd.com", "watchedDate")[0]["data"]);
// var_dump($res->get_items()[1]->get_item_tags("https://letterboxd.com", "filmTitle")[0]["data"]);
// var_dump($res->get_items()[1]->get_item_tags("https://letterboxd.com", "memberRating")[0]["data"]);
// var_dump($res->get_items()[1]->get_description());
// var_dump($res->get_items()[1]->get_link());
// var_dump($res->get_items()[1]->get_item_tags("https://letterboxd.com", "filmYear")[0]["data"]);

require dirname(__FILE__) . '/tmdb-fetcher.php';
require dirname(__FILE__) . '/letterboxd-fetcher.php';

// ---- Register Film Watch Post Type
function bdt_register_film_watch()
{
    $labels = array(
        'name'                  => 'Films',
        'singular_name'         => 'Film',
        'add_new_item'          => 'Add New Film Watch',
    );
    $args = array(
        'labels'                => $labels,
        'has_archive'           => false,
        'public'                => true,
        'hierarchical'          => false,
        'supports'              => array( 'editor', 'thumbnail', 'custom-fields' ),
        'rewrite'               => array( 'slug' => 'film_watch' ),
        'show_in_rest'          => true,
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'rest_base' => 'bdt_film_watch',
        'show_in_graphql' => true,
        'graphql_single_name' => 'film',
        'graphql_plural_name' => 'films',
    );
    register_post_type('bdt_film', $args);
    register_post_meta('bdt_film', 'film_title', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_film', 'year', array('type'=> 'number', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_film', 'rating', array('type'=> 'number', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_film', 'watched_date', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_film', 'review_link', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
}
add_action('init', 'bdt_register_film_watch', 0, 9);

add_filter('manage_edit-bdt_film_columns', 'film_watch_columns');
function film_watch_columns($columns)
{
    unset($columns['date']);
    $columns['watched_date'] = 'Date watched';
    $columns['rating'] = 'rating';
    return $columns;
}

add_action('manage_posts_custom_column', 'show_film_watch_columns');
function show_film_watch_columns($name)
{
    global $post;
    switch ($name) {
        case 'watched_date':
            $date = get_post_meta($post->ID, 'watched_date', true);
            if ($date) {
                $parsedDate = new DateTime($date);
                echo $parsedDate->format('Y/m/d');
            }
        break;

        case 'rating':
            echo get_post_meta($post->ID, 'rating', true);
        break;
    }
}

add_filter('manage_edit-bdt_film_sortable_columns', 'sortable_by_film');
function sortable_by_film($columns)
{
    $columns['watched_date'] = 'watched_date';
    return $columns;
}

add_action('pre_get_posts', 'bdt_orderby_watch_date');
function bdt_orderby_watch_date($query)
{
    if (! is_admin() || ! $query->is_main_query()) {
        return;
    }

    if ('watched_date' === $query->get('orderby') || '' === $query->get('orderby')) {
        $query->set('orderby', 'meta_value');
        $query->set('meta_key', 'watched_date');
        $query->set('meta_type', 'DATE');
    }
}

// ---- Consume Letterboxd feed
function add_new_films()
{
    $new_films = get_updated_feeds();
    foreach ($new_films as $film) {
        $newFilm = [
            "post_title" => "Watch of {$film['filmTitle']}",
            "post_type" => "bdt_film",
            "post_status" => "publish",
            "meta_input" => [
                "film_title" => $film['filmTitle'],
                "year" => $film['filmYear'],
                "rating" => $film['rating'],
                "watched_date" => $film['watchedDate'],
                "review_link" => $film['link']
            ]
        ];
        if ($film['review']) {
            $newFilm["post_content"] = $film['review'];
        }
        wp_insert_post($newFilm);
    }
}

add_action("bdt_add_new_films", "add_new_films");
add_action('init', 'bdt_enable_film_cron', 0);

function bdt_enable_film_cron()
{
    if (!wp_next_scheduled('bdt_add_new_films')) {
        wp_schedule_event(time(), "hourly", "bdt_add_new_films");
    }
}

// ---- GraphQL set-up

add_action('graphql_register_types', 'register_film_meta_type');

function register_film_meta_type()
{
    register_graphql_object_type('FilmMeta', [
        'description' => __("Metadata around a film", 'bdt'),
        'fields' => [
            'runtime' => [
                'type' => 'Integer',
                'description' => __('Film length in minutes', 'bdt'),
            ],
            'original_language' => [
                'type' => 'String',
                'description' => __('Language it was filmed in iso-...', 'bdt'),
            ],
            'image' => [
                'type' => 'String',
                'description' => __('a link to the poster image', 'bdt'),
            ],
        ],
    ]);
}

add_action('graphql_register_types', function () {
    $post_types = WPGraphQL::get_allowed_post_types();
    $type_name = get_post_type_object($post_types['bdt_film'])->graphql_single_name;

    register_graphql_field($type_name, 'filmTitle', [
        'type' => 'string',
        'description' => __('Name of film'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'film_title', true);
        },
    ]);

    register_graphql_field($type_name, 'year', [
        'type' => 'number',
        'description' => __('Year of release'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'year', true);
        },
    ]);

    register_graphql_field($type_name, 'rating', [
        'type' => 'number',
        'description' => __('Rating out of 5'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'rating', true);
        },
    ]);

    register_graphql_field($type_name, 'watchedDate', [
        'type' => 'string',
        'description' => __('Date watched on'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'watched_date', true);
        },
    ]);

    register_graphql_field($type_name, 'reviewLink', [
        'type' => 'string',
        'description' => __('Link to original review'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'review_link', true);
        },
    ]);

    register_graphql_field($type_name, 'meta', [
        'type' => 'FilmMeta',
        'description' => __('Information about the film'),
        'resolve' => function ($post) {
            return fetchMovieMetaData(get_post_meta($post->ID, 'film_title', true), get_post_meta($post->ID, 'year', true));
        },
    ]);

    add_filter('graphql_PostObjectsConnectionOrderbyEnum_values', function ($values) {
        $values['DATE_WATCHED'] = [
        'value'       => 'watched_date',
        'description' => __('Order by watched_date', 'bdt'),
    ];
        return $values;
    });
});

add_filter('graphql_post_object_connection_query_args', function ($query_args, $source, $input) {
    if (isset($input['where']['orderby']) && is_array($input['where']['orderby'])) {
        foreach ($input['where']['orderby'] as $orderby) {
            if (! isset($orderby['field']) || 'watched_date' !== $orderby['field']) {
                continue;
            }

            $query_args['meta_key'] = 'watched_date';
            $query_args['meta_type'] = 'DATE';
            $query_args['orderby'] = 'meta_value';
            $query_args['order'] = $orderby['order'];
        }
    }

    return $query_args;
}, 10, 3);
