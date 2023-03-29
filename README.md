## Atto LTI extension

[![Moodle Plugin CI](https://github.com/call-learning/moodle-atto_lti/actions/workflows/ci.yml/badge.svg)](https://github.com/call-learning/moodle-atto_lti/actions/workflows/ci.yml)

This extension allows to insert predefined LTI activities in any text box (HTML block for example).

## Installation

1. Copy the source file in the ```/lib/editor/atto/plugins/lti``` folder and run update.
2. Go to 'Site Administration' > 'Atto toolbar settings' and add the lti module in the Toolbar config textbox (maybe next to h5P for example)

To check it is working, open an editor (for example in a new HTML block or a label in a course) and
check that there is a new icon with the 'Insert LTI' tooltip.

## LTI Setup

For this plugin to work, you need to setup a couple of LTI Tools. See for more information
the [official Moodle documentation here](https://docs.moodle.org/401/en/External_tool_settings)

## Status and limitations

So far LTI 1.1 and LTI with content selection have been tested. LTI 1.3 should work but will need some more testing.

Users who wants to be able to insert LTI in a text box should have the **'mod/lti:addpreconfiguredinstance'** capability at site level or at course level. We are aiming to find a way
to disable the atto icon if not but right now everyone can see it even if not able to act on it.

Also, as the LTI that is inserted in the Textbox is not linked to any activity so there is no way we can retrieve information such as grades. 
