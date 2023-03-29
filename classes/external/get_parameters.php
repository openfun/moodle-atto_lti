<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
namespace atto_lti\external;
defined('MOODLE_INTERNAL') || die();

use external_api;
use external_function_parameters;
use external_single_structure;
use external_value;

global $CFG;
require_once($CFG->libdir . '/externallib.php');

/**
 * LTI parameter helper of atto_lti implementation.
 *
 * @copyright  2022 Laurent David <laurent@call-learning.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @package    atto_lti
 */
class get_parameters extends external_api {
    /**
     * Get all parameters to build an LTI iframe
     *
     * @param int $typeid the type id for the external tool / LTI
     * @param int $courseid
     * @param string $toolurl
     * @param string $title
     * @param string $messagetype
     * @param string $text
     * @return array (empty array for now)
     * @throws \invalid_parameter_exception
     * @throws \moodle_exception
     * @throws \restricted_context_exception
     */
    public static function execute(
        int $typeid,
        int $courseid = SITEID,
        string $toolurl = '',
        string $title = '',
        string $messagetype = 'basic-lti-launch-request',
        string $text = ''
    ): array {
        global $SESSION, $CFG;
        self::validate_parameters(
            self::execute_parameters(),
            compact('typeid', 'courseid', 'toolurl', 'title', 'messagetype', 'text')
        );
        $context = \context_course::instance($courseid);
        self::validate_context($context);

        include_once($CFG->dirroot . '/mod/lti/locallib.php');
        $config = lti_get_type_type_config($typeid);
        $loginrequestparams = lti_build_login_request($courseid, 0, null, $config, $messagetype);
        $SESSION->lti_message_hint = "{$courseid},{$config->typeid},{0}," . base64_encode($title) . ',' .
            base64_encode($text);
        $urlparts = parse_url($config->lti_toolurl);
        $ltiallow = '';
        if ($urlparts && array_key_exists('scheme', $urlparts) && array_key_exists('host', $urlparts)) {
            $ltiallow = $urlparts['scheme'] . '://' . $urlparts['host'];
            // If a port has been specified we append that too.
            if (array_key_exists('port', $urlparts)) {
                $ltiallow .= ':' . $urlparts['port'];
            }
        }
        $loginparams = [];
        foreach ($loginrequestparams as $key => $value) {
            $loginparams[] = [
                'key' => $key,
                'value' => $value
            ];
        }

        $launchurl = new \moodle_url('/lib/editor/atto/plugins/lti/ltilaunch.php', [
            'id' => $typeid,
            'courseid' => $courseid,
            'toolurl' => $toolurl
        ]);
        return [
            'ltiallowurl' => $ltiallow,
            'launchurl' => $launchurl->out(false),
            'loginparameters' => $loginparams
        ];
    }

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'typeid' => new external_value(PARAM_INT, 'lti (external tool) type id', VALUE_REQUIRED),
            'courseid' => new external_value(PARAM_INT, 'LTI course id', VALUE_OPTIONAL, SITEID),
            'toolurl' => new external_value(PARAM_URL, 'LTI tool url', VALUE_OPTIONAL, ''),
            'title' => new external_value(PARAM_TEXT, 'LTI title', VALUE_OPTIONAL, ''),
            'messagetype' => new external_value(PARAM_ALPHAEXT, 'LTI message type', VALUE_OPTIONAL, 'basic-lti-launch-request'),
            'text' => new external_value(PARAM_ALPHAEXT, 'LTI message text', VALUE_OPTIONAL, ''),
        ]);
    }

    /**
     * Describe the return structure of the external service.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'ltiallowurl' => new external_value(PARAM_URL, 'LTI allow url, for this tool'),
            'launchurl' => new external_value(PARAM_LOCALURL, 'LTI allow url, for this tool'),
            'loginparameters' => new \external_multiple_structure(
                new external_single_structure([
                    'key' => new external_value(PARAM_ALPHAEXT, 'LTI parameter key', VALUE_REQUIRED),
                    'value' => new external_value(PARAM_RAW, 'LTI parameter value', VALUE_REQUIRED),
                ])
            )
        ]);
    }
}

