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
}
add_action('init', 'bdt_register_podcast_listen', 0, 9);
