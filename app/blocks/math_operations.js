// Essential math operations for path programming
Blockly.Blocks['math_constrain'] = {
  init: function() {
    this.appendValueInput("VALUE")
      .setCheck("Number")
      .appendField("constrain");
    this.appendValueInput("LOW")
      .setCheck("Number")
      .appendField("between");
    this.appendValueInput("HIGH")
      .setCheck("Number")
      .appendField("and");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(90);
    this.setTooltip("Limit a number between two values");
  }
};

Blockly.Blocks['math_map'] = {
  init: function() {
    this.appendValueInput("VALUE")
      .setCheck("Number")
      .appendField("map");
    this.appendValueInput("FROM_LOW")
      .setCheck("Number")
      .appendField("from");
    this.appendValueInput("FROM_HIGH")
      .setCheck("Number")
      .appendField("to");
    this.appendValueInput("TO_LOW")
      .setCheck("Number")
      .appendField("onto");
    this.appendValueInput("TO_HIGH")
      .setCheck("Number")
      .appendField("to");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(90);
    this.setTooltip("Re-map a number from one range to another");
  }
};