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
                tagMatchRequiresAll: false
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
            // Set the dialogue content, and then show the dialogue.
            Y.M.atto_lti.Dialogue.setDialogueContent(this, this._displayForm.bind(this, dialogue));

        },
        /**
         * Display the LTI selector form
         *
         * @param {ModalDialog }dialogue
         * @param {Y.Node} ltiSelectorForm
         * @private
         */
        _displayForm: function(dialogue, ltiSelectorForm) {
            var courseid = this.get('courseid');
            var thisButton = this;
            dialogue.set('bodyContent', ltiSelectorForm).show();
            ltiSelectorForm.all(Y.M.atto_lti.CSS_SELECTORS.LTI_SELECTOR).each(
                function(node) {
                    var contentItemUrl = node.getData('contentitemurl');
                    var ltiTypeID = Number.parseInt(node.getData().value);
                    if (contentItemUrl) {
                        node.on('click', function(e) {
                            e.preventDefault();
                            require(['mod_lti/contentitem'], function(contentitem) {
                                var contentItemUrl = node.getData('contentitemurl');
                                // Set data to be POSTed.
                                var postData = {
                                    id: node.getData('value'),
                                    course: courseid,
                                    title: '',
                                    text: ''
                                };
                                contentitem.init(contentItemUrl, postData, function() {
                                    M.mod_lti.editor.toggleGradeSection();
                                });

                                // Hack here to get the data returned.
                                // Original processContentItemReturnData is stored in window
                                // to prevent multiple wrapping.
                                if (!window.originalProcessContentItemReturnData) {
                                    window.originalProcessContentItemReturnData = window.processContentItemReturnData;
                                }
                                window.processContentItemReturnData = function(returnData) {
                                    // we don't want the introeditor content to be replaced
                                    delete returnData.introeditor;
                                    thisButton._setLTI(ltiTypeID, returnData.toolurl, returnData.name);
                                    window.originalProcessContentItemReturnData(returnData);
                                };

                                dialogue.hide();
                            });
                        }, this);
                    } else {
                        node.on('click', function(e) {
                            e.preventDefault();
                            thisButton._setLTI(ltiTypeID, "");
                            dialogue.hide();
                        });
                    }
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
            if (!selectednodes) {
                return null;
            }
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
         * @param {number} ltiTypeID LTI type id
         * @param {string} toolURL LTI tool URL
         * @param {string} name LTI tool name
         * @private
         */
        _setLTI: function(ltiTypeID, toolURL, name) {
            var currentDiv = this._getLTIDiv();
            var host = this.get('host');
            // Focus on the editor in preparation for inserting the LTI.
            host.focus();
            // If a LTI placeholder was selected we can destroy it now.
            if (currentDiv) {
                currentDiv.remove();
            }
            host.setSelection(this._currentSelection);
            var thisButton = this;
            require(['core/ajax', 'core/notification'], function(Ajax, Notification) {
                var args = {
                    'typeid': ltiTypeID,
                    'courseid': thisButton.get("courseid"),
                    'toolurl': toolURL
                };
                Ajax.call([{methodname: 'atto_lti_fetch_param', args: args}])[0]
                    .then(
                        function(data) {
                            var ltiTemplate = Y.Handlebars.compile(Y.M.atto_lti.LTI_TEMPLATE);

                            data.name = name;
                            var ltiHtml = ltiTemplate(data);
                            host.insertContentAtFocusPoint(ltiHtml);
                            thisButton.markUpdated();
                            return true;
                    }
                ).catch(Notification.exception);
            });
        },
        /**
         * Handle a click on a LTI Placeholder.
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
         * Handle a double click on a LTI Placeholder.
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
            },
            /**
             * Courseid
             *
             * @attribute courseid
             * @type int
             */
            courseid: {
                value: 1
            },
            /**
             * Content Item URL
             *
             * @attribute contentitemurl
             * @type string
             */
            contentitemurl: {
                value: ""
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
            require(['core/ajax', 'core/notification'], function(Ajax, Notification) {
                return Ajax.call([{
                    methodname: 'atto_lti_get_tool_types_config', args: {}
                }])[0].then(
                        function(data) {
                            var template = Y.Handlebars.compile(Y.M.atto_lti.FORM_TEMPLATE);
                            var content = Y.Node.create(template({
                                elementid: currentButton.get('host').get('elementid'),
                                CSS: Y.M.atto_lti.CSS_SELECTORS,
                                component: Y.M.atto_lti.COMPONENTNAME,
                                ltitypes: data,
                                contentitemurl: currentButton.get('contentitemurl')
                            }));
                            contentCallback(content);
                            return true;
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
    LTI_SELECTOR: '.lti-content-selector',
};

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
