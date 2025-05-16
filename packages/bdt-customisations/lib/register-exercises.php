<?php

function bdt_register_exercise()
{
    $labels = array(
        'name'                  => 'Exercises',
        'singular_name'         => 'Exercise',
        'add_new_item'          => 'Add New Exercise',
    );

    $args = array(
        'labels'             => $labels,
        'menu_icon'          => 'dashicons-universal-access',
        'has_archive'        => false,
        'public'             => true,
        'hierarchical'       => false,
        'supports'           => array('title', 'editor', 'custom-fields'),
        'show_in_rest'       => true,
        'rest_base'          => 'bdt_exercises',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'show_in_graphql'    => true,
        'graphql_single_name' => 'exercise',
        'graphql_plural_name' => 'exercises',
    );

    register_post_type('bdt_exercise', $args);

    $meta_fields_to_register = [
        'source_platform' => [
            'type' => 'string',
            'description' => 'The platform where the activity originated (e.g., "strava").'
        ],
        'source_id' => [
            'type' => 'string',
            'description' => 'The unique identifier for the activity from the source platform.'
        ],
        'activity_type' => [
            'type' => 'string',
            'description' => 'Type of activity (e.g., Run, Ride, Walk).'
        ],
        'distance_meters' => [
            'type' => 'number',
            'description' => 'Distance of the activity in meters.'
        ],
        'moving_time_seconds' => [
            'type' => 'integer',
            'description' => 'Moving time in seconds.'
        ],
        'elapsed_time_seconds' => [
            'type' => 'integer',
            'description' => 'Total elapsed time in seconds.'
        ],
        'total_elevation_gain_meters' => [
            'type' => 'number',
            'description' => 'Total elevation gain in meters.'
        ],
        'start_date_local_iso' => [
            'type' => 'string',
            'description' => 'Activity start date and time in local timezone (ISO8601 format).'
        ],
        'map_summary_polyline' => [
            'type' => 'string',
            'description' => 'Encoded summary polyline for the map.'
        ],
        '_raw_data_json' => [
            'type' => 'string',
            'description' => 'Full raw JSON response from the source API for this activity.',
            'auth_callback' => function() {
                return current_user_can( 'edit_posts' );
            }
        ],
    ];

    foreach ($meta_fields_to_register as $meta_key => $meta_args) {
        register_post_meta('bdt_exercise', $meta_key, array(
            'type'              => $meta_args['type'],
            'description'       => $meta_args['description'],
            'single'            => true,
            'show_in_rest'      => true,
            'auth_callback'     => $meta_args['auth_callback'] ?? null,
        ));
    }
}

add_action('init', 'bdt_register_exercise');
