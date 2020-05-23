<?php
namespace bdt;

require dirname(dirname(__FILE__)) . '/lib/tmdb-fetcher.php';

// Things to test:
// [x] retrieve film happy path
// [x] missing info
// [ ] somehow cache using the WordPress transient API

function wp_remote_get($query)
{
    preg_match(
        '/^https:\/\/api.themoviedb.org\/3\/(.*)\/(.*)\?.*$/u',
        $query,
        $urlMatches
    );
    
    parse_str(parse_url($query, PHP_URL_QUERY), $vals);

    switch ($urlMatches[1]) {
        case 'search':
            $filename = "search-{$vals['query']}-{$vals['year']}.json";
            break;
        case 'movie':
            $filename = "movie-{$urlMatches[2]}.json";
            break;
        default:
            $filename = '';
    }

    return array('body' => file_get_contents(dirname(__file__)."/fixtures/$filename"));
}

class TMDBFetcherTest extends \WP_UnitTestCase
{
    public function test_retrieves_basic_meta_fields()
    {
        $result = fetchMovieMetaData("Titanic", 1997);

        $this->assertEquals(
            array(
            'runtime' => 194,
            'original_language' => 'en',
            'image' => 'https://image.tmdb.org/t/p/w154/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'),
            $result
        );
    }

    public function test_deals_with_no_results()
    {
        $result = fetchMovieMetaData("fdssfdsf", 1982);

        $this->assertEquals(
            array(),
            $result
        );
    }

    public function test_initially_reads_from_transient_api()
    {
        $bladeRunnerMeta = array(
            'runtime' => 194,
            'original_language' => 'en',
            'image' => 'https://image.tmdb.org/t/p/w154/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg');

        set_transient('bdt_meta_blade-runner_1982', $bladeRunnerMeta, 12 * HOUR_IN_SECONDS);
        $result = fetchMovieMetaData("blade runner", 1982);

        $this->assertEquals(
            $bladeRunnerMeta,
            $result
        );
    }
}
