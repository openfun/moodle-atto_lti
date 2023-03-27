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
//
// This file is part of BasicLTI4Moodle
//
// BasicLTI4Moodle is an IMS BasicLTI (Basic Learning Tools for Interoperability)
// consumer for Moodle 1.9 and Moodle 2.0. BasicLTI is a IMS Standard that allows web
// based learning tools to be easily integrated in LMS as native ones. The IMS BasicLTI
// specification is part of the IMS standard Common Cartridge 1.1 Sakai and other main LMS
// are already supporting or going to support BasicLTI. This project Implements the consumer
// for Moodle. Moodle is a Free Open source Learning Management System by Martin Dougiamas.
// BasicLTI4Moodle is a project iniciated and leaded by Ludo(Marc Alier) and Jordi Piguillem
// at the GESSI research group at UPC.
// SimpleLTI consumer for Moodle is an implementation of the early specification of LTI
// by Charles Severance (Dr Chuck) htp://dr-chuck.com , developed by Jordi Piguillem in a
// Google Summer of Code 2008 project co-mentored by Charles Severance and Marc Alier.
//
// BasicLTI4Moodle is copyright 2009 by Marc Alier Forment, Jordi Piguillem and Nikolas Galanis
// of the Universitat Politecnica de Catalunya http://www.upc.edu
// Contact info: Marc Alier Forment granludo @ gmail.com or marc.alier @ upc.edu.

/**
 * This file contains all necessary code to view a lti activity instance
 *
 * @package    atto_lti
 * @copyright  2022 Laurent David <laurent@call-learning.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


require_once("../../../../../config.php");
require_once($CFG->dirroot . '/mod/lti/lib.php');
require_once($CFG->dirroot . '/mod/lti/locallib.php');
$typeid = required_param('id', PARAM_INT); // LTI Activity Type.
$courseid = optional_param('courseid', SITEID, PARAM_INT); // Course id.
$instanceid = optional_param('instanceid', 1, PARAM_INT); // Activity instance id.
$toolurl = optional_param('toolurl', '', PARAM_URL); // Activity instance id.
require_course_login($courseid);
$config = lti_get_type_type_config($typeid);

// TODO: deal with LTI_VERSION_1P3.

$typeconfig = lti_get_type_config($typeid);
$endpoint = $typeconfig['toolurl'];
$mockinstance = (object) array(
    'id' => $instanceid,
    'course' => $courseid,
    'name' => '',
    'intro' => '',
    'introformat' => '1',
    'typeid' => $typeid,
    'toolurl' => $toolurl,
    'securetoolurl' => '',
    'instructorchoicesendname' => '1',
    'instructorchoicesendemailaddr' => '1',
    'instructorchoiceallowroster' => null,
    'instructorchoiceallowsetting' => null,
    'instructorcustomparameters' => 'embedded_resource=1',
    'instructorchoiceacceptgrades' => '1',
    'launchcontainer' => LTI_LAUNCH_CONTAINER_EMBED,
    'debuglaunch' => '0',
    'showtitlelaunch' => '1',
    'showdescriptionlaunch' => '0',
    'icon' => '',
);
lti_launch_tool($mockinstance);
