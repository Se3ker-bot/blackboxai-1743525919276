// Custom motor control blocks for Blockly
Blockly.Blocks['motor_move'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["Forward","FORWARD"],
        ["Backward","BACKWARD"], 
        ["Left","LEFT"],
        ["Right","RIGHT"]
      ]), "DIRECTION");
    this.appendValueInput("DURATION")
      .setCheck("Number")
      .appendField("for (ms)");
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .appendField("at speed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Move motors in specified direction");
  }
};

Blockly.Blocks['motor_stop'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Stop motors");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Immediately stop all motors");
  }
};

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendValueInput("DURATION")
      .setCheck("Number")
      .appendField("Wait (ms)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Pause the sequence");
  }
};