# moodle-atto_lti

Moodle Atto plugin which allows to embed LTI resources through Deep Linking.

## Pre-requisites

Make sure that you have at least one external tool with supports Deep Linking configured in your Moodle site.

See [Moodle documentation about external tools settings](https://docs.moodle.org/401/en/External_tool_settings) for more information.

## Installation

Download the plugin from the [releases page](https://github.com/openfun/moodle-atto_lti/releases).

Install the plugin to folder
/lib/editor/atto/plugins/lti

See [Moodle documentation about installing a plugin](https://docs.moodle.org/401/en/Installing_plugins#Installing_a_plugin) for more information.

## Usage

Once installed, the plugin will be available in the Atto toolbar.

A button will be added to the Atto toolbar.

Clicking on the button will open a popup window where you can select an external LTI tool.

Once you select the tool, you will be redirected to the tool to select the resource to embed.

Once you select the resource, you will be redirected back to Moodle and the resource will be embedded in the editor.
