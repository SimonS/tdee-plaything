<?php

require_once dirname(dirname(__FILE__)) . '/lib/register-weighins.php';

class RegisterWeighinsTest extends \WP_UnitTestCase
{
    public function test_retrieves_basic_meta_fields()
    {
        $this->assertEquals("2020-11-30T05:49:00+0000", bdt_withingsdate_to_time("November 30, 2020 at 05:49AM"));
    }

    public function test_dont_sanitise_sanitised_field()
    {
        $this->assertEquals("2020-11-30T05:49:00+0000", bdt_withingsdate_to_time("2020-11-30T05:49:00+0000"));
    }
}
