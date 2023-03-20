YUI.add("moodle-atto_lti-button",function(r,t){r.namespace("M.atto_lti").COMPONENTNAME="atto_lti",r.namespace("M.atto_lti").Button=r.Base.create("button",r.M.editor_atto.EditorPlugin,[],{_currentSelection:null,initializer:function(){this.addButton({icon:"icon",iconComponent:"atto_lti",callback:this._displayDialogue,tags:".lti-placeholder",tagMatchRequiresAll:!1,keys:"66"}),this.editor.all(".lti-placeholder").setAttribute("contenteditable","false"),this.editor.delegate("dblclick",this._handleDblClick,".lti-placeholder",this),this.editor.delegate("click",this._handleClick,".lti-placeholder",this)},_displayDialogue:function(){var t;this._currentSelection=this.get("host").getSelection(),!1!==this._currentSelection&&(t=this.getDialogue({headerContent:M.util.get_string("pluginname",r.M.atto_lti.COMPONENTNAME),width:"auto",focusAfterHide:!0}),r.M.atto_lti.Dialogue.setDialogueContent(this,this._displayForm.bind(this,t)))},_displayForm:function(l,t){var n=this.get("courseid"),c=this;l.set("bodyContent",t).show(),t.all(r.M.atto_lti.CSS_SELECTORS.LTI_SELECTOR).each(function(a){a.on("click",function(t){t.preventDefault(),require(["mod_lti/contentitem"],function(t){var e,i=a.getData("contentitemurl"),o={id:a.getData("value"),course:n,title:"",text:""};t.init(i,o,function(){M.mod_lti.editor.toggleGradeSection()}),e=Number.parseInt(a.getData().value),window.originalProcessContentItemReturnData||(window.originalProcessContentItemReturnData=window.processContentItemReturnData),window.processContentItemReturnData=function(t){c._setLTI(e,t.toolurl),window.originalProcessContentItemReturnData(t)},window.processContentItemReturnData=window.originalProcessContentItemReturnData,l.hide()})},this)})},_getLTIDiv:function(){var t=this.get("host").getSelectedNodes(),e=null;return t.each(function(t){t.hasClass("lti-placeholder")&&(e=t)}),e},_setLTI:function(o,a){var l,t=this._getLTIDiv(),n=this.get("host");n.focus(),t&&t.remove(),n.setSelection(this._currentSelection),l=this,require(["core/ajax","core/notification"],function(t,e){var i={typeid:o,instanceid:12345,courseid:l.get("courseid"),toolurl:a};t.call([{methodname:"atto_lti_fetch_param",args:i}])[0].then(function(t){var e=r.Handlebars.compile(r.M.atto_lti.LTI_TEMPLATE),t=e(t);n.insertContentAtFocusPoint(t),l.markUpdated()})["catch"](e.exception)})},_handleClick:function(t){t=this.get("host").getSelectionFromNode(t.target);this.get("host").getSelection()!==t&&this.get("host").setSelection(t)},_handleDblClick:function(){this._displayDialogue()}},{ATTRS:{langs:{value:["Default","Value"]},courseid:{value:1},contentitemurl:{value:""}}}),r.namespace("M.atto_lti").Dialogue={setDialogueContent:function(i,o){require(["core/ajax","core/notification"],function(t,e){return t.call([{methodname:"mod_lti_get_tool_types",args:{}}])[0].then(function(t){var e=r.Handlebars.compile(r.M.atto_lti.FORM_TEMPLATE),t=r.Node.create(e({elementid:i.get("host").get("elementid"),CSS:r.M.atto_lti.CSS_SELECTORS,component:r.M.atto_lti.COMPONENTNAME,ltitypes:t,contentitemurl:i.get("contentitemurl")}));o(t)})["catch"](e.exception)})}},r.namespace("M.atto_lti").LTI_TEMPLATE='{{#if addParagraphs}}<p><br></p>{{/if}}<div class="lti-placeholder" contenteditable="false"><iframe id="contentframe" height="600px" width="100%" src="{{launchurl}}" allow="microphone {{ltiallowurl}}; camera {{ltiallowurl}}; geolocation {{ltiallowurl}}; midi {{ltiallowurl}}; encrypted-media {{ltiallowurl}}; autoplay {{ltiallowurl}} " allowfullscreen="1"><div class="att-lti-login-info">{{#loginparameters}}<div class="d-none" data-name="{{key}}" data-value="{{value}}"></div> {{/loginparameters}}</div></iframe></div>{{#if addParagraphs}}<p><br></p>{{/if}}',r.namespace("M.atto_lti").FORM_TEMPLATE='<div class="atto_form mform d-flex" id="{{ elementid }}_atto_lti_form">{{#ltitypes}}<div class="tool-card m-1"><div class="tool-card-header"><img class="tool-card-icon mt-4" src="{{ urls.icon }}"><h4 class="name">{{ name }}</h4></div><div class="tool-card-body"><p class="tool-card-text">{{ description }}</p><div class="tool-card-footer"><button class="btn btn-secondary ml-0 lti-content-selector"  name="selectcontent-{{ id }}" id="id_selectcontent-{{ id }}"  type="button" data-contentitemurl="{{ ../contentitemurl }}" data-value="{{ id }}">\n                {{get_string "selectlti" ../component}}</button></div></div></div>{{/ltitypes}}</div>',r.namespace("M.atto_lti").CSS_SELECTORS={LTI_SELECTOR:".lti-content-selector"}},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});