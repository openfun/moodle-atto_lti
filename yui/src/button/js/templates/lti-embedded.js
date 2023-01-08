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
    '<iframe id="contentframe" height="600px" width="100%" src="{{launchur}}" allow="microphone {{ltiallowurl}}; ' +
    'camera {{ltiallowurl}}; ' +
    'geolocation {{ltiallowurl}}; ' +
    'midi {{ltiallowurl}}; ' +
    'encrypted-media {{ltiallowurl}}; ' +
    'autoplay {{ltiallowurl}} " allowfullscreen="1">' +
    '<form action="{{ltiinitiatelogin}}" name="ltiInitiateLoginForm" id="ltiInitiateLoginForm" method="post"' +
    '   encType="application/x-www-form-urlencoded">' +
    '  {{#ltiparameters}}' +
    '   <input type ="hidden" name="{{key}}" value="{{value}}">' +
    '  {{/ltiparameters}}' +
    '</form>' +
    '<script type="text/javascript">' +
    ' document.ltiInitiateLoginForm.submit();' +
    '</script>' +
    '<script type="text/javascript">' +
    'YUI().use("node", "event", function(Y) {' +
    '  var doc = Y.one("body");' +
    '  var frame = Y.one("#contentframe");' +
    '  var padding = 15;' +
    ' var lastHeight;' +
    ' var resize = function() {' +
    ' var viewportHeight = doc.get("winHeight");' +
    '   if(lastHeight !== Math.min(doc.get("docHeight"), viewportHeight)){' +
    '      frame.setStyle("height", viewportHeight - frame.getY() - padding + "px");' +
    '       lastHeight = Math.min(doc.get("docHeight"), doc.get("winHeight"));' +
    '  }};' +
    ' resize();' +
    ' Y.on("windowresize", resize);' +
    '   });' +
    '</script>' +
    '</div>' +
    '{{#if addParagraphs}}<p><br></p>{{/if}}';
