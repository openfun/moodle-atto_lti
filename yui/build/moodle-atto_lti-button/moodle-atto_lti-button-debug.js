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
        /**
         * A reference to the current selection at the time that the dialogue
         * was opened.
         *
         * @property _currentSelection
         * @type Range
         * @private
         */
        _currentSelection: null,
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
            this.editor.delegate('dblclick', this._handleDblClick, '.lti-placeholder', this);
            this.editor.delegate('click', this._handleClick, '.lti-placeholder', this);
        },
        /**
         * Display the lti selection tool.
         *
         * @method _displayDialogue
         * @private
         */
        _displayDialogue: function() {
            // Store the current selection.
            this._currentSelection = this.get('host').getSelection();

            if (this._currentSelection === false) {
                return;
            }
            var dialogue = this.getDialogue({
                headerContent: M.util.get_string('pluginname', Y.M.atto_lti.COMPONENTNAME),
                width: 'auto',
                focusAfterHide: true
            });
            var thisButton = this;
            // Set the dialogue content, and then show the dialogue.
            Y.M.atto_lti.Dialogue.setDialogueContent(this, function(form) {
                dialogue.set('bodyContent', form).show();
                M.form.shortforms({formid: thisButton.get('host').get('elementid') + '_atto_lti_form'});
                form.one("." + Y.M.atto_lti.CSS_SELECTORS.INPUTSUBMIT).on('click', function (e) {
                    e.preventDefault();
                    thisButton._setLTI(1);
                }, this);
            });

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
         * @param {number} ltiTypeID lti type id
         * @private
         */
        _setLTI: function(ltiTypeID) {
            var currentDiv = this._getLTIDiv();
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
            host.setSelection(this._currentSelection);
            var thisButton = this;
            require(['core/ajax','core/notification'], function(Ajax, Notification) {
                var args = {
                    'typeid': ltiTypeID,
                    'instanceid': 12345,
                };
                Ajax.call([{methodname: 'atto_lti_fetch_param', args: args}])[0]
                    .then(
                        function (data) {
                            var ltiTemplate = Y.Handlebars.compile(Y.M.atto_lti.LTI_TEMPLATE);

                            var ltiHtml = ltiTemplate(data);
                            host.insertContentAtFocusPoint(ltiHtml);
                            thisButton.markUpdated();
                    }
                ).catch(Notification.exception);
            });
        },
        /**
         * Handle a click on a H5P Placeholder.
         *
         * @method _handleClick
         * @param {EventFacade} e
         * @private
         */
        _handleClick: function(e) {
            var selection = this.get('host').getSelectionFromNode(e.target);
            if (this.get('host').getSelection() !== selection) {
                this.get('host').setSelection(selection);
            }
        },
        /**
         * Handle a double click on a H5P Placeholder.
         *
         * @method _handleDblClick
         * @private
         */
        _handleDblClick: function() {
            this._displayDialogue();
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
                                CSS: Y.M.atto_lti.CSS_SELECTORS,
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
    '<iframe id="contentframe" height="600px" width="100%" src="{{launchurl}}" allow="microphone {{ltiallowurl}}; ' +
    'camera {{ltiallowurl}}; ' +
    'geolocation {{ltiallowurl}}; ' +
    'midi {{ltiallowurl}}; ' +
    'encrypted-media {{ltiallowurl}}; ' +
    'autoplay {{ltiallowurl}} " allowfullscreen="1">' +
    '<div class="att-lti-login-info">' +
    '{{#loginparameters}}' +
    '<div class="d-none" data-name="{{key}}" data-value="{{value}}"></div>' +
    ' {{/loginparameters}}' +
    '</div>' +
    '</iframe>' +
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
    '<input type="radio" id="{{id}}-{{name}}" name="{{name}}" value="{{id}}"/>' +
    '<label for="{{id}}-{{name}}">' +
    '<div class="card">' +
    '<img class="card-img-top" src="{{urls.icon}}">' +
    '<div class="card-body">' +
    '<div class="card-title">' +
    '<h5 class="card-title">{{name}}</h5>' +
    '<p class="card-text">{{description}}</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</label>' +
    '{{/ltitypes}}' +
    '</fieldset>' +
    '<div class="text-center">' +
    '<button class="btn btn-secondary {{CSS.INPUTSUBMIT}}" type="submit">' + '' +
    '{{get_string "pluginname" component}}</button>' +
    '</div>' +
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
