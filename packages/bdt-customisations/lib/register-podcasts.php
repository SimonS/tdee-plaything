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
        'supports'              => array( 'editor', 'thumbnail', 'custom-fields' ),
        'rewrite'               => array( 'slug' => 'podcast_listen' ),
        'show_in_rest'          => true,
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'rest_base' => 'bdt_podcast_listen',
        'show_in_graphql' => true,
        'graphql_single_name' => 'podcast',
        'graphql_plural_name' => 'podcasts',
    );

    register_post_type('bdt_podcast', $args);
    register_post_meta('bdt_podcast', 'podcast_title', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'publish_date', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'overcast_url', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'source_url', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'url', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'listen_date', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'feed_url', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'feed_title', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_podcast', 'feed_image', array('type'=> 'string', 'show_in_rest' => true, 'single' => true));
}
add_action('init', 'bdt_register_podcast_listen', 0, 9);

function is_duplicate_podcast ($response, $handler, $request) {
    if($request->get_route() === "/wp/v2/bdt_podcast_listen") {
        $sourceUrl = json_decode($request->get_body(), true)["meta"]["source_url"];

        if((new \WP_Query([
                'post_type'=>'bdt_podcast',
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

add_filter('rest_request_before_callbacks', 'is_duplicate_podcast', 0, 3);

function new_podcast($post, $request, $update) {
    var_dump(get_post_meta($post->ID, 'feed_url', true));
// now to furnish that extra data
}

add_action( 'rest_after_insert_bdt_podcast', 'new_podcast', 10, 3 );
