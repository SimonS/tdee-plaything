<?php
namespace bdt;

require dirname(dirname(__FILE__)) . '/lib/tmdb-fetcher.php';

// Things to test:
// [ ] retrieve film happy path
// [ ] handles 404
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

        // runtime, poster, original language
        $result = fetchMovieMetaData("Titanic", 1997);

        $this->assertEquals(array('runtime' => 194), $result);
    }
}
