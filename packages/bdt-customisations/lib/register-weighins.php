<?php

function bdt_withingsdate_to_time($date)
{
    return DateTime::createFromFormat(\DateTime::ISO8601, $date) ?
        $date :
        DateTime::createFromFormat('F d, Y \a\t h:ia', $date)->format(DateTime::ISO8601);
}

// Register Weigh In Post Type
function bdt_register_weighin()
{
    $labels = array(
        'name'                  => 'Weigh Ins',
        'singular_name'         => 'Weigh In',
        'add_new_item'          => 'Add New Weigh In',
    );
    $args = array(
        'labels'                => $labels,
        'has_archive'           => false,
        'public'                => true,
        'hierarchical'          => false,
        'supports'              => array( 'custom-fields' ),
        'rewrite'               => array( 'slug' => 'weighin' ),
        'show_in_rest'          => true,
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'rest_base' => 'bdt_weighin',
        'show_in_graphql' => true,
        'graphql_single_name' => 'weighin',
        'graphql_plural_name' => 'weighins',
    );
    register_post_type('bdt_weighin', $args);
    register_post_meta('bdt_weighin', 'weight', array('type'=> 'number', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_weighin', 'body_fat_percentage', array('type'=> 'number', 'show_in_rest' => true, 'single' => true));
    register_post_meta('bdt_weighin', 'weighin_time', array('type'=> 'string', 'show_in_rest' => true, 'single' => true, 'sanitize_callback' => 'bdt_withingsdate_to_time'));
}
add_action('init', 'bdt_register_weighin', 0);
