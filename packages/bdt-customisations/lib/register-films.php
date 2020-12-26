<?php
use function bdt\fetchMovieMetaData;
use function bdt\get_updated_feeds;

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
    register_post_meta('bdt_film', 'link', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
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
                "link" => $film['link']
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
add_filter('register_taxonomy_args', function ($args, $taxonomy) {
    if ('kind' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'Kind';
        $args['graphql_plural_name'] = 'Kinds';
    }

    return $args;
}, 10, 2);

add_action('graphql_register_types', 'register_watchof_type');

function register_watchof_type()
{
    register_graphql_object_type('WatchOf', [
        'description' => __("A watch, typically of a film or TV show", 'bdt'),
        'fields' => [
            'name' => [
                'type' => 'String',
                'description' => __('The title of the film', 'bdt'),
            ],
            'rating' => [
                'type' => 'Float',
                'description' => __('My rating, if applicable', 'bdt'),
            ],
            'review' => [
                'type' => 'String',
                'description' => __('A review or summary, if applicable', 'bdt'),
            ],
            'url' => [
                'type' => 'String',
                'description' => __('The URL of thing we have watched', 'bdt'),
            ],
            'year' => [
                'type' => 'Integer',
                'description' => __('The year the film of TV show was released', 'bdt'),
            ],
            'meta' => [
                'type' => 'FilmMeta',
                'description' => __('Metadata around a film, retrieved from TMDB', 'bdt'),
            ]
        ],
    ]);
}

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

function rating_to_float($rating)
{
    return (mb_substr($rating, -1) === '½') ? mb_strlen($rating) - .5 : mb_strlen($rating);
}

add_action('graphql_register_types', function () {
    $post_types = WPGraphQL::get_allowed_post_types();

    if (!empty($post_types) && is_array($post_types)) {
        foreach ($post_types as $post_type) {
            $post_type_object = get_post_type_object($post_type);

            register_graphql_field($post_type_object->graphql_single_name, 'syndication', [
                'type' => 'String',
                'description' => __('Syndication', 'mf2'),
                'resolve' => function ($post) {
                    $syndication = get_post_meta($post->ID, 'mf2_syndication', true);
                    return !empty($syndication) ? $syndication[0] : null;
                },
            ]);

            register_graphql_field($post_type_object->graphql_single_name, 'watchOf', [
                'type' => 'WatchOf',
                'description' => __('Watch Of', 'mf2'),
                'resolve' => function ($post) {
                    $watchOf = get_post_meta($post->ID, 'mf2_watch-of', true);

                    $watchOfObject = array();

                    if (!empty($watchOf["properties"])) {
                        $props = $watchOf["properties"];
                        if (!empty($props["summary"])) {
                            $watchOfObject["review"] = $props["summary"][0];
                        }
                        $watchOfObject["url"] = $props["url"][0];

                        preg_match('/A (\x{2605}*\x{00BD}?)(?:\s)?(?:review of|diary entry for) (.*) \((\d+)\)/u', $props['name'][0], $splitTitle);

                        $watchOfObject["name"] = $splitTitle[2];
                        $watchOfObject["year"] = $splitTitle[3];
                        $watchOfObject["rating"] = rating_to_float($splitTitle[1]) > 0 ? rating_to_float($splitTitle[1]) : null;

                        $watchOfObject["meta"] = fetchMovieMetaData($watchOfObject["name"], $watchOfObject["year"]);
                    }
                    return !empty($watchOfObject) ? $watchOfObject : null;
                },
            ]);
        }
    }
});
