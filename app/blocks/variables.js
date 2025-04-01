// Variable block with text input for renaming
Blockly.Blocks['variables_get'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("variable:")
      .appendField(new Blockly.FieldTextInput("speed"), "VAR");
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip("Get a variable's value. Click to rename.");
  }
};