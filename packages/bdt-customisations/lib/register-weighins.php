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

add_filter('manage_edit-bdt_weighin_columns', 'weighins_columns');
function weighins_columns($columns)
{
    unset($columns['date']);
    $columns['weighin_date'] = 'Weigh in date';
    $columns['weight'] = 'Weight (kg)';
    return $columns;
}

add_action('manage_posts_custom_column', 'show_weighins_columns');
function show_weighins_columns($name)
{
    global $post;
    switch ($name) {
        case 'weighin_date':
            $date = get_post_meta($post->ID, 'weighin_time', true);
            if ($date) {
                $parsedDate = new DateTime($date);
                echo $parsedDate->format('Y/m/d H:i:s');
            }
        break;
        case 'weight':
            echo get_post_meta($post->ID, 'weight', true);
        break;
            
    }
}

add_filter('manage_edit-bdt_weighin_sortable_columns', 'sortable_by_weighin_date');
function sortable_by_weighin_date($columns)
{
    $columns['weighin_date'] = 'weighin_date';
    return $columns;
}

add_action('graphql_register_types', function () {
    $post_types = WPGraphQL::get_allowed_post_types();
    $type_name = get_post_type_object($post_types['bdt_weighin'])->graphql_single_name;

    register_graphql_field($type_name, 'weight', [
        'type' => 'number',
        'description' => __('Weight (in kgs)'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'weight', true);
        },
    ]);

    register_graphql_field($type_name, 'body_fat_percentage', [
        'type' => 'number',
        'description' => __('Body fat percentage'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'body_fat_percentage', true);
        },
    ]);

    register_graphql_field($type_name, 'weighin_time', [
        'type' => 'string',
        'description' => __('Weigh In Time'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'weighin_time', true);
        },
    ]);
});
