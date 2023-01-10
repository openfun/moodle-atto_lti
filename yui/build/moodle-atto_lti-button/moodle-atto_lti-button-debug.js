YUI.add('moodle-atto_lti-button', function (Y, NAME) {

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
Y.namespace('M.atto_lti').COMPONENTNAME = 'atto_lti';
Y.namespace('M.atto_lti').Button = Y.Base.create(
    'button',
    Y.M.editor_atto.EditorPlugin,
    [],
    {
        initializer: function() {
            this.addButton({
                icon: 'icon',
                iconComponent: 'atto_lti',
                callback: this._displayDialogue,
                // Watch the following tags and add/remove highlighting as appropriate:
                tags: '.lti-placeholder',
                tagMatchRequiresAll: false,
                inlineFormat: true,

                // Key code for the keyboard shortcut which triggers this button:
                keys: '66',
            });
            this.editor.all('.lti-placeholder').setAttribute('contenteditable', 'false');
            //this.editor.delegate('dblclick', this._handleDblClick, '.lti-placeholder', this);
            //this.editor.delegate('click', this._handleClick, '.lti-placeholder', this);
        },
        /**
         * Display the lti selection tool.
         *
         * @method _displayDialogue
         * @private
         */
        _displayDialogue: function() {
            var host = this.get('host');
            // Store the current selection.
            this._currentSelection = this.get('host').getSelection();

            if (this._currentSelection === false) {
                return;
            }

            var currentDiv = this._getLTIDiv();

            var dialogue = this.getDialogue({
                headerContent: M.util.get_string('pluginname', Y.M.atto_lti.COMPONENTNAME),
                width: 'auto',
                focusAfterHide: true
            });
            // Set the dialogue content, and then show the dialogue.
            Y.M.atto_lti.Dialogue.setDialogueContent(this, function(form) {
                dialogue.set('bodyContent', form).show();
                M.form.shortforms({formid: host.get('elementid') + '_atto_lti_form'});
                form.one("." + Y.M.atto_lti.CSS_SELECTORS.INPUTSUBMIT).on('click', function (e) {
                    e.preventDefault();
                }, this);
            });
            this._setLTI(currentDiv);
        },
        /**
         * Get the LTI iframe
         *
         * @return {Node} The LTI iframe selected.
         * @private
         */
        _getLTIDiv: function() {
            var selectednodes = this.get('host').getSelectedNodes();
            var LTIDiv = null;
            selectednodes.each(function(selNode) {
                if (selNode.hasClass('lti-placeholder')) {
                    LTIDiv = selNode;
                }
            });
            return LTIDiv;
        },
        /**
         * Update the lti in the contenteditable.
         *
         * @method _setLTI
         * @param {Element} currentDiv
         * @private
         */
        _setLTI: function(currentDiv) {
            var host = this.get('host');
            // Focus on the editor in preparation for inserting the H5P.
            host.focus();

            // Add an empty paragraph after new H5P container that can catch the cursor.
            var addParagraphs = true;

            // If a LTI placeholder was selected we can destroy it now.
            if (currentDiv) {
                currentDiv.remove();
                addParagraphs = false;
            }
            require(['core/ajax','core/notification'], function(Ajax, Notification) {
                var args = {
                    'typeid': 1,
                    'instanceid': 1,
                };
                Ajax.call([{methodname: 'atto_lti_fetch_param', args: args}])[0]
                    .then(
                        function (data) {
                            var ltiTemplate = Y.Handlebars.compile(Y.M.atto_lti.LTI_TEMPLATE, data);

                            var ltiHtml = ltiTemplate({});
                            host.insertContentAtFocusPoint(ltiHtml);
                            this.markUpdated();
                    }
                ).catch(Notification.exception);
            });
        },
    }, {
        ATTRS: {
            // If any parameters were defined in the 'params_for_js' function,
            // they should be defined here for proper access.
            langs: {
                value: ['Default', 'Value']
            }
        }
    }

);

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
        setDialogueContent: function(currentButton, contentCallback) {
            require(['core/ajax','core/notification'], function(Ajax, Notification) {
                return Ajax.call([{methodname: 'mod_lti_get_tool_types', args: {}}])[0]
                    .then(
                        function (data) {
                            var template = Y.Handlebars.compile(Y.M.atto_lti.FORM_TEMPLATE);
                            var content = Y.Node.create(template({
                                elementid: currentButton.get('host').get('elementid'),
                                CSS: CSS,
                                component: Y.M.atto_lti.COMPONENTNAME,
                                ltitypes : data,
                            }));
                            contentCallback(content);
                        }
                    ).catch(Notification.exception);
            });
        },
    };
}());// This file is part of Moodle - http://moodle.org/
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
    '<form class="atto_form mform" id="{{elementid}}_atto_lti_form">' +
    '<fieldset>' +
    '{{#ltitypes}}' +
    '<input type="radio" id="{{id}}-{{name}}" name="{{name}}" value="{{id}}"><label for="{{id}}-{{name}}">{{name}}</label>' +
    '{{/ltitypes}}' +
    '<div class="text-center">' +
    '<button class="btn btn-secondary {{CSS.INPUTSUBMIT}}" type="submit">' + '' +
    '{{get_string "pluginname" component}}</button>' +
    '</div>' +
    '</fieldset>' +
    '</form>';
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
Y.namespace('M.atto_lti').CSS_SELECTORS = {
    INPUTSUBMIT : 'atto_lti_entrysubmit',
};

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
