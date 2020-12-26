<?php
namespace bdt;

if (! class_exists('SimplePie', false)) {
    require_once ABSPATH . WPINC . '/class-simplepie.php';
}

function fetch_feed()
{
    $file = new \SimplePie_File(dirname(__FILE__) . '/fixtures/letterboxd.rss');
    $feed = new \SimplePie();
    $feed->set_file($file);
    $feed->init();
    return $feed;
}

require_once dirname(dirname(__FILE__)) . '/lib/letterboxd-fetcher.php';
class LetterboxdFetcherTest extends \WP_UnitTestCase
{
    public function test_excludes_non_watches()
    {
        $this->assertEquals(4, count(get_updated_feeds()));
    }

    public function test_excludes_previous_watches()
    {
        $this->factory->post->create(array('post_type' => 'bdt_film', 'meta_input' => [
            'link' => 'https://letterboxd.com/simonscarfe/film/nina-conti-her-masters-voice/'
        ]));
        $this->assertEquals(3, count(get_updated_feeds()));
    }
}
