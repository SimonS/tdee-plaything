<?php

class PlaygroundFilterTest extends \WP_UnitTestCase
{
    private function filterQueryArgs($args)
    {
        return apply_filters('graphql_post_object_connection_query_args', ['post_type' => 'page'], null, $args, null, null);
    }

    public function test_leaves_queries_without_where_args_alone()
    {
        $this->assertEquals(['post_type' => 'page'], $this->filterQueryArgs([]));
    }

    public function test_limits_queries_to_the_playground_value()
    {
        $this->assertEquals(
            [
                'post_type' => 'page',
                'meta_query' => [['key' => 'playground', 'value' => 'true', 'compare' => '=']],
            ],
            $this->filterQueryArgs(['where' => ['playground' => 'true']])
        );
    }
}
