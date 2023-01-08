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
Y.namespace('M.atto_lti').Dialogue = (function() {
    return {
        getDialogueContent: function(currentButton) {
            var template = Y.Handlebars.compile(Y.M.atto_lti.FORM_TEMPLATE);
            var content = Y.Node.create(template({
                    elementid: currentButton.get('host').get('elementid'),
                    CSS: CSS,
                    component: Y.M.atto_lti.COMPONENTNAME,
                }));
            return content;
        },
    };
}());