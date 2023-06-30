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

/*
 * @package    atto_lti
 * @copyright  2022 Laurent David <laurent@call-learning.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
Y.namespace('M.atto_lti').LTI_TEMPLATE = '' +
    '{{#if addParagraphs}}<p><br></p>{{/if}}' +
    '<div class="lti-placeholder" contenteditable="false">' +
    '{{name}}' +
    '<iframe height="260px" width="100%" src="{{launchurl}}" class="atto-lti" allowfullscreen allow="microphone {{ltiallowurl}}; ' +
    'camera {{ltiallowurl}}; ' +
    'geolocation {{ltiallowurl}}; ' +
    'autoplay {{ltiallowurl}}; ' +
    'display-capture {{ltiallowurl}}; "' +
    '>' +
    '<div class="att-lti-login-info">' +
    '{{#loginparameters}}' +
    '<div class="d-none" data-name="{{key}}" data-value="{{value}}"></div>' +
    ' {{/loginparameters}}' +
    '</div>' +
    '</iframe>' +
    '</div>' +
    '{{#if addParagraphs}}<p><br></p>{{/if}}';
