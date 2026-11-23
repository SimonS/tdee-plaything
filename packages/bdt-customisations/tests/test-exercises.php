<?php
namespace bdt;

class Test_Exercise_Duplicates extends \WP_UnitTestCase
{
    /**
     * @var \WP_REST_Server
     */
    private $server;

    public function setUp(): void
    {
        parent::setUp();

        // The test case resets registered meta between tests; init registers it only once.
        bdt_register_exercise();

        global $wp_rest_server;
        $this->server = $wp_rest_server = new \WP_REST_Server;
        do_action('rest_api_init');

        wp_set_current_user(self::factory()->user->create(['role' => 'administrator']));
    }

    private function post_exercise($source_id, $route = '/wp/v2/bdt_exercises')
    {
        $request = new \WP_REST_Request('POST', $route);
        $request->set_header('content-type', 'application/json');
        $request->set_body(wp_json_encode([
            'title' => 'Evening Run',
            'status' => 'publish',
            'meta' => [
                'source_platform' => 'strava',
                'source_id' => $source_id,
                'activity_type' => 'Run',
            ],
        ]));

        return $this->server->dispatch($request);
    }

    private function exercises_with_source_id($source_id)
    {
        return (new \WP_Query([
            'post_type' => 'bdt_exercise',
            'post_status' => 'any',
            'meta_key' => 'source_id',
            'meta_value' => $source_id,
            'fields' => 'ids',
        ]))->posts;
    }

    public function test_rejects_a_second_exercise_with_the_same_source_id()
    {
        $this->assertEquals(201, $this->post_exercise('17954327092')->get_status());

        $second = $this->post_exercise('17954327092');

        $this->assertEquals(409, $second->get_status());
        $this->assertEquals('duplicate_exercise', $second->get_data()['code']);
        $this->assertCount(1, $this->exercises_with_source_id('17954327092'));
    }

    public function test_accepts_an_exercise_with_a_different_source_id()
    {
        $this->post_exercise('17954327092');

        $this->assertEquals(201, $this->post_exercise('17954327093')->get_status());
        $this->assertCount(1, $this->exercises_with_source_id('17954327093'));
    }

    public function test_accepts_exercises_without_a_source_id()
    {
        $this->assertEquals(201, $this->post_exercise('')->get_status());
        $this->assertEquals(201, $this->post_exercise('')->get_status());
    }

    public function test_updating_an_existing_exercise_is_not_rejected()
    {
        $id = $this->post_exercise('17954327092')->get_data()['id'];

        $update = $this->post_exercise('17954327092', "/wp/v2/bdt_exercises/$id");

        $this->assertEquals(200, $update->get_status());
        $this->assertCount(1, $this->exercises_with_source_id('17954327092'));
    }
}
