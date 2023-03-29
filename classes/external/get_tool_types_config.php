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
use external_multiple_structure;
use external_value;

global $CFG;
require_once($CFG->libdir . '/externallib.php');
require_once($CFG->dirroot . '/mod/lti/classes/external.php');

/**
 * LTI get all tool types
 *
 * @copyright  2022 Laurent David <laurent@call-learning.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @package    atto_lti
 */
class get_tool_types_config extends external_api {
    /**
     * Get all parameters to build an LTI iframe
     *
     * @return array of tool types
     */
    public static function execute(): array {
        global $COURSE, $CFG;
        require_once($CFG->dirroot . '/mod/lti/locallib.php');
        $courseid = $COURSE->id;
        $types = lti_get_lti_types_by_course($courseid);
        $context = \context_course::instance($courseid);
        self::validate_context($context);
        $tools = array_map("serialise_tool_type", array_values($types));
        foreach ($tools as &$tool) {
            $config = lti_get_type_config($tool['id']);
            $tool['hascontentitemurl'] = false;
            if (isset($config['contentitem']) && intval($config['contentitem']) == 1) {
                $tool['hascontentitemurl'] = true;
            }
        }
        return $tools;
    }

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([]);
    }

    /**
     * Describe the return structure of the external service.
     *
     * @return external_multiple_structure
     */
    public static function execute_returns(): external_multiple_structure {
        $returnvalues = \mod_lti_external::get_tool_types_returns();
        $returnvalues->content->keys['hascontentitemurl'] =
            new external_value(PARAM_BOOL, 'Has this content type a selection url set', VALUE_DEFAULT, false);
        return $returnvalues;
    }
}

