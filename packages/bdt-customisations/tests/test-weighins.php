<?php
namespace bdt;

class Test_Weighin_Filter extends \WP_UnitTestCase
{
    /**
     * Holds the WP REST Server object
     *
     * @var WP_REST_Server
     */
    private $server;

    /**
     * Holds user id.
     *
     * @var int
     */
    private $user_id;

    /**
     * Holds post id.
     *
     * @var int
     */
    private $post_id;

    /**
     * Create a user and a post for our test.
     */
    public function setUp(): void
    {
        parent::setUp();

        // Initiating the REST API.
        global $wp_rest_server;
        $this->server = $wp_rest_server = new \WP_REST_Server;
        do_action('rest_api_init');

        $this->user_id = wp_insert_user([
            'user_login' => 'test_user',
            'user_pass' => 'test_password',
            'role' => 'administrator'
        ]);
        wp_set_current_user($this->user_id);
    }

    public function tearDown(): void
    {
        parent::tearDown();

        wp_delete_user($this->user_id);
    }


    public function test_weighin_filter_lets_valid_post_through()
    {
        $request = new \WP_REST_Request('POST', '/wp/v2/bdt_weighin');
        $request->set_body_params(
            array(
                "meta" => array(
                    "weight" => "10",
                    "weighin_time" => "November 30, 2024 at 05:49AM",
                    "body_fat_percentage" => "2323"
                ),
                "status" => "publish"
            )
        );
        $response = $this->server->dispatch($request);
        $data = $response->get_data();

        $weighin_id = $data['id'];
        $post = get_post($weighin_id);

        $this->assertEquals('bdt_weighin', $post->post_type);
    }
}