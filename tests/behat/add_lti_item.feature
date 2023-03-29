@editor @atto @editor_atto @atto_lti @javascript @_switch_iframe
Feature: Add content in a text box
  I can add a LTI preconfigured tool content in a text box of an HTML block

  Background:
    Given I log in as "admin"
    And I navigate to "Plugins > Activity modules > External tool > Manage tools" in site administration
    And I follow "configure a tool manually"
    And I set the field "Tool name" to "Teaching Tool 1"
    And I set the field "Tool URL" to local url "/lib/editor/atto/plugins/lti/tests/fixtures/lti_activity.php"
    And I set the field "Tool configuration usage" to "Show as preconfigured tool when adding an external tool"
    And I press "Save changes"
    And I follow "configure a tool manually"
    And I set the field "Tool name" to "Teaching Tool 2"
    And I set the field "Tool URL" to local url "/lib/editor/atto/plugins/lti/tests/fixtures/lti_activity.php"
    And I expand all fieldsets
    And I set the field "Content-Item Message" to "1"
    And I set the field "Content Selection URL" to "/lib/editor/atto/plugins/lti/tests/fixtures/lti_activity_chooser.php"
    And I press "Save changes"
    And I should see "Teaching Tool 1"
    And I should see "Teaching Tool 2"
    And I navigate to "Plugins > Text editors > Atto HTML editor > Atto toolbar settings" in site administration
    And I set the field "Toolbar config" to multiline:
    """
    collapse = collapse
    style1 = title, bold, italic
    other = lti
    """
    And I click on "Save changes" "button"
    And I log out

  Scenario: I should be able to insert an LTI predefined tool in a text box
    Given I log in as "admin"
    And I am on site homepage
    When I turn editing mode on
    And I add the "HTML" block
    And I configure the "(new HTML block)" block
    And I click on "Insert LTI" "button" in the "#fitem_id_config_text" "css_element"
    And I should see "Teaching Tool 1"
    And I click on "button[data-title='Teaching Tool 1']" "css"
    And I click on "Save changes" "button"
    And I switch to "contentframe" iframe
    Then I should see "Testing fixture for LTI activity"
    And I switch to the main window
    And I log out

  Scenario: I should be able to insert an LTI predefined tool with content selector in a text box
    Given I log in as "admin"
    And I am on site homepage
    When I turn editing mode on
    And I add the "HTML" block
    And I configure the "(new HTML block)" block
    And I click on "Insert LTI" "button" in the "#fitem_id_config_text" "css_element"
    And I should see "Teaching Tool 1"
    And I click on "button[data-title='Teaching Tool 2']" "css"
    And I switch to "contentitem-page-iframe" iframe
    Then I should see "Testing fixture for LTI activity chooser"
    And I switch to the main window
    And I log out
