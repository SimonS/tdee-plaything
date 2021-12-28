<?php

// ---- Register Podcast Listen Post Type
function bdt_register_podcast_listen()
{
    $labels = array(
        'name'                  => 'Podcasts',
        'singular_name'         => 'Podcast',
        'add_new_item'          => 'Add New Podcast Listen',
    );
    $args = array(
        'labels'                => $labels,
        'has_archive'           => false,
        'public'                => true,
        'hierarchical'          => false,
        'supports'              => array('editor', 'thumbnail', 'custom-fields'),
        'rewrite'               => array('slug' => 'podcast_listen'),
        'show_in_rest'          => true,
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'rest_base' => 'bdt_podcast_listen',
        'show_in_graphql' => true,
        'graphql_single_name' => 'podcast',
        'graphql_plural_name' => 'podcasts',
    );

    register_post_type('bdt_podcast', $args);
    register_post_meta('bdt_podcast', 'podcast_title', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'publish_date', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'overcast_url', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'source_url', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'url', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'listen_date', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'feed_url', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'feed_title', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'feed_image', array('type' => 'string', 'show_in_rest' => true, 'single' => true));
}
add_action('init', 'bdt_register_podcast_listen', 0, 9);

function is_duplicate_podcast($response, $handler, $request)
{
    if ($request->get_route() === "/wp/v2/bdt_podcast_listen") {
        $sourceUrl = json_decode($request->get_body(), true)["meta"]["source_url"];

        if ((new \WP_Query([
            'post_type' => 'bdt_podcast',
            'meta_key' => 'source_url',
            'meta_value' => $sourceUrl
        ]))->have_posts()) {
            return new WP_Error(
                'duplicate_podcast',
                'Podcast already exists',
                array(
                    'status' => 409,
                )
            );
        }
    }

    return $response;
}

add_filter('rest_request_before_callbacks', 'is_duplicate_podcast', 10, 3);

function new_podcast($post, $request, $update)
{
    $feed_url = get_post_meta($post->ID, 'feed_url', true);

    add_post_meta($post->ID, "feed_title", fetch_feed($feed_url)->get_title());
    add_post_meta($post->ID, "feed_image", fetch_feed($feed_url)->get_image_url());
}

add_action('rest_after_insert_bdt_podcast', 'new_podcast', 10, 3);

add_filter('manage_bdt_podcast_posts_columns', 'bdt_podcast_filter_posts_columns');

function bdt_podcast_filter_posts_columns($columns)
{
    $columns = array(
        'cb' => $columns['cb'],
        'image' => __('Image'),
        'podcast_title' => __('Podcast Title'),
        'listen_date' => __('Listen Date')
    );

    return $columns;
}

add_action('manage_bdt_podcast_posts_custom_column', 'bdt_podcast_column', 10, 2);
function bdt_podcast_column($column, $post_id)
{
    if ('image' === $column) {
        $img = get_post_meta($post_id, 'feed_image', true);

        echo '<img src="' . $img . '" style="max-width:100px;">';
    }

    if ($column === 'podcast_title') {
        $title = get_post_meta($post_id, 'podcast_title', true);

        echo $title;
    }

    if ($column === 'listen_date') {
        $listen_date = get_post_meta($post_id, 'listen_date', true);

        echo $listen_date;
    }
}

add_filter('manage_edit-bdt_podcast_sortable_columns', 'bdt_podcast_sortable_columns');
function bdt_podcast_sortable_columns($columns)
{
    $columns['podcast_title'] = 'podcast_title';
    $columns['listen_date'] = 'listen_date';
    return $columns;
}

add_action('pre_get_posts', 'bdt_posts_orderby');
function bdt_posts_orderby($query)
{
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== 'bdt_podcast') {
        return;
    }

    if ($query->get('orderby') === 'podcast_title') {
        $query->set('orderby', 'meta_value');
        $query->set('meta_key', 'podcast_title');
    }

    if ($query->get('orderby') === 'listen_date' || $query->get('orderby') === '') {
        $query->set('orderby', 'meta_value');
        $query->set('meta_key', 'listen_date');
        $query->set('meta_type', 'DATE');
    }
}

// ---- GraphQL set-up
add_action('graphql_register_types', function () {
    $post_types = WPGraphQL::get_allowed_post_types();
    $type_name = get_post_type_object($post_types['bdt_podcast'])->graphql_single_name;

    register_graphql_field($type_name, 'podcastTitle', [
        'type' => 'string',
        'description' => __('Name of podcast episode'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'podcast_title', true);
        },
    ]);

    register_graphql_field($type_name, 'publishDate', [
        'type' => 'string',
        'description' => __('Publish date of podcast episode'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'publish_date', true);
        },
    ]);

    register_graphql_field($type_name, 'sourceURL', [
        'type' => 'string',
        'description' => __('Direct link to the episode MP3'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'source_url', true);
        },
    ]);

    register_graphql_field($type_name, 'overcastURL', [
        'type' => 'string',
        'description' => __('Link to the overcast enclosure for an episode'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'overcast_url', true);
        },
    ]);

    register_graphql_field($type_name, 'episodeURL', [
        'type' => 'string',
        'description' => __('Link to the URL as listed for that episode'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'url', true);
        },
    ]);

    register_graphql_field($type_name, 'listenDate', [
        'type' => 'string',
        'description' => __('Date listened to'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'listen_date', true);
        },
    ]);

    register_graphql_field($type_name, 'feedURL', [
        'type' => 'string',
        'description' => __('Podcast RSS feed URL'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'feed_url', true);
        },
    ]);

    register_graphql_field($type_name, 'feedTitle', [
        'type' => 'string',
        'description' => __('Title of podcast this episode is from'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'feed_title', true);
        },
    ]);

    register_graphql_field($type_name, 'feedImage', [
        'type' => 'string',
        'description' => __('Thumbnail for podcast'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'feed_image', true);
        },
    ]);


    add_filter('graphql_PostObjectsConnectionOrderbyEnum_values', function ($values) {
        $values['LISTEN_DATE'] = [
            'value'       => 'listen_date',
            'description' => __('Order by podcast listen date', 'bdt'),
        ];
        return $values;
    });

    add_filter('graphql_post_object_connection_query_args', function ($query_args, $source, $input) {
        if (isset($input['where']['orderby']) && is_array($input['where']['orderby'])) {
            foreach ($input['where']['orderby'] as $orderby) {
                if (!isset($orderby['field']) || 'listen_date' !== $orderby['field']) {
                    continue;
                }

                $query_args['meta_key'] = 'listen_date';
                $query_args['meta_type'] = 'DATE';
                $query_args['orderby'] = 'meta_value';
                $query_args['order'] = $orderby['order'];
            }
        }

        return $query_args;
    }, 10, 3);
});
