// Enhanced motor control blocks for Blockly
Blockly.Blocks['motor_move'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["🡅 Forward","FORWARD"],
        ["🡇 Backward","BACKWARD"], 
        ["🡄 Left","LEFT"],
        ["🡆 Right","RIGHT"]
      ]), "DIRECTION");
    this.appendValueInput("DURATION")
      .setCheck("Number")
      .appendField("for")
      .appendField(new Blockly.FieldNumber(1000, 100, 10000), "DURATION")
      .appendField("ms");
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .appendField("at speed")
      .appendField(new Blockly.FieldNumber(150, 0, 255), "SPEED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip("Move motors in specified direction for duration at speed (0-255)");
  }
};

Blockly.Blocks['motor_stop'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🛑 Stop motors");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip("Immediately stop all motors");
  }
};

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendValueInput("DURATION")
      .setCheck("Number")
      .appendField("⏱ Wait")
      .appendField(new Blockly.FieldNumber(500, 100, 10000), "DURATION")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip("Pause the sequence for specified milliseconds");
  }
};

// Move Distance Block
Blockly.Blocks['move_distance'] = {
  init: function() {
    this.appendValueInput("DISTANCE")
      .setCheck("Number")
      .appendField("Move")
      .appendField(new Blockly.FieldNumber(10, 1, 500), "DISTANCE")
      .appendField(new Blockly.FieldDropdown([
        ["cm","CM"],
        ["inches","INCHES"]
      ]), "UNIT");
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .appendField("at speed")
      .appendField(new Blockly.FieldNumber(150, 0, 255), "SPEED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip("Move forward specified distance at given speed");
  }
};

// Turn Angle Block
Blockly.Blocks['turn_angle'] = {
  init: function() {
    this.appendValueInput("ANGLE")
      .setCheck("Number")
      .appendField("Turn")
      .appendField(new Blockly.FieldNumber(90, -180, 180), "ANGLE")
      .appendField("degrees");
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .appendField("at speed")
      .appendField(new Blockly.FieldNumber(100, 0, 255), "SPEED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip("Turn specified angle (positive=right, negative=left)");
  }
};

// Loop block
Blockly.Blocks['loop'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🔁 Repeat")
      .appendField(new Blockly.FieldNumber(5, 1, 100), "COUNT")
      .appendField("times");
    this.appendStatementInput("DO")
      .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Repeat enclosed blocks specified number of times");
  }
};