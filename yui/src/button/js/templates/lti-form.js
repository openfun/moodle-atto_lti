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
Y.namespace('M.atto_lti').FORM_TEMPLATE = '' +
    '<div class="atto_form mform d-flex" id="{{ elementid }}_atto_lti_form">' +
    '{{#ltitypes}}' +
    '<div class="card m-1">' +
    '<div class="card-header d-flex" data-toggle="tooltip" data-placement="top" title="{{ description }}">' +
    '<img class="img-thumbnail" src="{{ urls.icon }}" alt="{{ name }}">' +
    '<h5 class="m-auto">{{ name }}</h5>' +
    '</div>' +
    '<div class="card-body d-flex">' +
    '<button class="m-auto btn btn-secondary ml-0 lti-content-selector" ' +
    ' name="selectcontent-{{ id }}" id="id_selectcontent-{{ id }}" ' +
    ' type="button" {{#hascontentitemurl}}data-contentitemurl="{{ ../../contentitemurl }}"{{/hascontentitemurl}}' +
    ' data-value="{{ id }}" data-title="{{ name }}">\n' +
    '                {{get_string "selectlti" ../component}}' +
    '</button>' +
    '</div>' +
    '</div>' +
    '{{/ltitypes}}' +
    '</div>';
