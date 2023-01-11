YUI.add("moodle-atto_lti-button",function(o,t){o.namespace("M.atto_lti").COMPONENTNAME="atto_lti",o.namespace("M.atto_lti").Button=o.Base.create("button",o.M.editor_atto.EditorPlugin,[],{_currentSelection:null,initializer:function(){this.addButton({icon:"icon",iconComponent:"atto_lti",callback:this._displayDialogue,tags:".lti-placeholder",tagMatchRequiresAll:!1,inlineFormat:!0,keys:"66"}),this.editor.all(".lti-placeholder").setAttribute("contenteditable","false"),this.editor.delegate("dblclick",this._handleDblClick,".lti-placeholder",this),this.editor.delegate("click",this._handleClick,".lti-placeholder",this)},_displayDialogue:function(){var e,i;this._currentSelection=this.get("host").getSelection(),!1!==this._currentSelection&&(e=this.getDialogue({headerContent:M.util.get_string("pluginname",o.M.atto_lti.COMPONENTNAME),width:"auto",focusAfterHide:!0}),o.M.atto_lti.Dialogue.setDialogueContent(i=this,function(t){e.set("bodyContent",t).show(),M.form.shortforms({formid:i.get("host").get("elementid")+"_atto_lti_form"}),t.one("."+o.M.atto_lti.CSS_SELECTORS.INPUTSUBMIT).on("click",function(t){t.preventDefault(),i._setLTI(1)},this)}))},_getLTIDiv:function(){var t=this.get("host").getSelectedNodes(),e=null;return t.each(function(t){t.hasClass("lti-placeholder")&&(e=t)}),e},_setLTI:function(i){var l,t=this._getLTIDiv(),a=this.get("host");a.focus(),t&&t.remove(),a.setSelection(this._currentSelection),l=this,require(["core/ajax","core/notification"],function(t,e){t.call([{methodname:"atto_lti_fetch_param",args:{typeid:i,instanceid:12345}}])[0].then(function(t){var e=o.Handlebars.compile(o.M.atto_lti.LTI_TEMPLATE),t=e(t);a.insertContentAtFocusPoint(t),l.markUpdated()})["catch"](e.exception)})},_handleClick:function(t){t=this.get("host").getSelectionFromNode(t.target);this.get("host").getSelection()!==t&&this.get("host").setSelection(t)},_handleDblClick:function(){this._displayDialogue()}},{ATTRS:{langs:{value:["Default","Value"]}}}),o.namespace("M.atto_lti").Dialogue={setDialogueContent:function(i,l){require(["core/ajax","core/notification"],function(t,e){return t.call([{methodname:"mod_lti_get_tool_types",args:{}}])[0].then(function(t){var e=o.Handlebars.compile(o.M.atto_lti.FORM_TEMPLATE),t=o.Node.create(e({elementid:i.get("host").get("elementid"),CSS:o.M.atto_lti.CSS_SELECTORS,component:o.M.atto_lti.COMPONENTNAME,ltitypes:t}));l(t)})["catch"](e.exception)})}},o.namespace("M.atto_lti").LTI_TEMPLATE='{{#if addParagraphs}}<p><br></p>{{/if}}<div class="lti-placeholder" contenteditable="false"><iframe id="contentframe" height="600px" width="100%" src="{{launchurl}}" allow="microphone {{ltiallowurl}}; camera {{ltiallowurl}}; geolocation {{ltiallowurl}}; midi {{ltiallowurl}}; encrypted-media {{ltiallowurl}}; autoplay {{ltiallowurl}} " allowfullscreen="1"><div class="att-lti-login-info">{{#loginparameters}}<div class="d-none" data-name="{{key}}" data-value="{{value}}"></div> {{/loginparameters}}</div></iframe></div>{{#if addParagraphs}}<p><br></p>{{/if}}',o.namespace("M.atto_lti").FORM_TEMPLATE='<form class="atto_form mform" id="{{elementid}}_atto_lti_form"><fieldset>{{#ltitypes}}<input type="radio" id="{{id}}-{{name}}" name="{{name}}" value="{{id}}"/><label for="{{id}}-{{name}}"><div class="card"><img class="card-img-top" src="{{urls.icon}}"><div class="card-body"><div class="card-title"><h5 class="card-title">{{name}}</h5><p class="card-text">{{description}}</p></div></div></div></label>{{/ltitypes}}</fieldset><div class="text-center"><button class="btn btn-secondary {{CSS.INPUTSUBMIT}}" type="submit">{{get_string "pluginname" component}}</button></div></form>',o.namespace("M.atto_lti").CSS_SELECTORS={INPUTSUBMIT:"atto_lti_entrysubmit"}},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});