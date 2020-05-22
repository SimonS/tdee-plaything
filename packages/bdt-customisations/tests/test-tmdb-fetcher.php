<?php
namespace bdt;

require dirname(dirname(__FILE__)) . '/lib/tmdb-fetcher.php';


function wp_remote_get()
{
    return 1;
}

class TMDBFetcherTest extends \WP_UnitTestCase
{
    public function test_remote_get()
    {
        $result = fetchMovieMetaData("Fight Club");

        $this->assertEquals($result, 1);
    }
}
