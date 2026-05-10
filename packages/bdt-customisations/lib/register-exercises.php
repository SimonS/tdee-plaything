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

add_action('graphql_register_types', function () {
    $post_types = WPGraphQL::get_allowed_post_types();
    $type_name = get_post_type_object($post_types['bdt_exercise'])->graphql_single_name;

    register_graphql_field($type_name, 'activity_type', [
        'type' => 'String',
        'description' => __('Type of activity (e.g. Run, Ride, Walk)'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'activity_type', true);
        },
    ]);

    register_graphql_field($type_name, 'distance_meters', [
        'type' => 'Float',
        'description' => __('Distance in metres'),
        'resolve' => function ($post) {
            return (float) get_post_meta($post->ID, 'distance_meters', true);
        },
    ]);

    register_graphql_field($type_name, 'moving_time_seconds', [
        'type' => 'Int',
        'description' => __('Moving time in seconds'),
        'resolve' => function ($post) {
            return (int) get_post_meta($post->ID, 'moving_time_seconds', true);
        },
    ]);

    register_graphql_field($type_name, 'elapsed_time_seconds', [
        'type' => 'Int',
        'description' => __('Elapsed time in seconds'),
        'resolve' => function ($post) {
            return (int) get_post_meta($post->ID, 'elapsed_time_seconds', true);
        },
    ]);

    register_graphql_field($type_name, 'total_elevation_gain_meters', [
        'type' => 'Float',
        'description' => __('Total elevation gain in metres'),
        'resolve' => function ($post) {
            return (float) get_post_meta($post->ID, 'total_elevation_gain_meters', true);
        },
    ]);

    register_graphql_field($type_name, 'start_date_local_iso', [
        'type' => 'String',
        'description' => __('Activity start date/time in local timezone (ISO 8601)'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'start_date_local_iso', true);
        },
    ]);

    register_graphql_field($type_name, 'map_summary_polyline', [
        'type' => 'String',
        'description' => __('Encoded summary polyline'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'map_summary_polyline', true);
        },
    ]);

    register_graphql_field($type_name, 'sourceId', [
        'type' => 'String',
        'description' => __('The unique identifier from the source platform (e.g. Strava activity ID)'),
        'resolve' => function ($post) {
            return get_post_meta($post->ID, 'source_id', true);
        },
    ]);

    add_filter('graphql_PostObjectsConnectionOrderbyEnum_values', function ($values) {
        $values['START_DATE_LOCAL_ISO'] = [
            'value' => 'start_date_local_iso',
            'description' => __('Order by activity start date', 'bdt'),
        ];
        return $values;
    });
});

add_filter('graphql_post_object_connection_query_args', function ($query_args, $source, $input) {
    if (isset($input['where']['orderby']) && is_array($input['where']['orderby'])) {
        foreach ($input['where']['orderby'] as $orderby) {
            if (!isset($orderby['field']) || 'start_date_local_iso' !== $orderby['field']) {
                continue;
            }
            $query_args['meta_key'] = 'start_date_local_iso';
            $query_args['meta_type'] = 'CHAR';
            $query_args['orderby'] = 'meta_value';
            $query_args['order'] = $orderby['order'];
        }
    }
    return $query_args;
}, 10, 3);
