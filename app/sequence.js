class SequencePlayer {
  constructor() {
    this.sequence = [];
    this.isPlaying = false;
    this.currentIndex = 0;
    this.pathHistory = [];
    this.currentPosition = { x: 200, y: 200, angle: 0 }; // Center of canvas
    this.pathDistance = 0;
    this.pathTurns = 0;
    
    // Initialize canvas
    this.initCanvas();
    
    // Setup clear path button
    document.getElementById('clear-path')?.addEventListener('click', () => {
      this.clearPath();
    });
  }

  initCanvas() {
    this.canvas = document.getElementById('pathCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.drawGrid();
  }

  drawGrid() {
    this.ctx.strokeStyle = '#4a5568';
    this.ctx.lineWidth = 1;
    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  clearPath() {
    this.pathHistory = [];
    this.currentPosition = { x: 200, y: 200, angle: 0 };
    this.pathDistance = 0;
    this.pathTurns = 0;
    this.updateStats();
    this.drawGrid();
    debugManager.log('Path visualization cleared');
  }

  updateStats() {
    document.getElementById('path-distance').textContent = this.pathDistance.toFixed(1);
    document.getElementById('path-turns').textContent = this.pathTurns;
  }

  async play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentIndex = 0;
    debugManager.logProgramEvent({
      type: 'SEQUENCE_START',
      data: { 
        timestamp: Date.now(),
        sequenceLength: this.sequence.length 
      }
    });
    
    while (this.currentIndex < this.sequence.length && this.isPlaying) {
      const command = this.sequence[this.currentIndex];
      await this.executeCommand(command);
      this.currentIndex++;
    }
    
    this.isPlaying = false;
  }

  async executeCommand(command) {
    return new Promise((resolve) => {
      switch(command.type) {
        case 'move':
          this.updatePath(command.duration/10, 0); // Convert duration to distance estimate
          sendCommand(command.direction.toLowerCase(), command.speed);
          setTimeout(() => {
            sendCommand('stop');
            resolve();
          }, command.duration);
          break;

        case 'move_distance':
          const distance = command.unit === 'CM' ? 
            command.distance : command.distance * 2.54;
          this.updatePath(distance, 0);
          // Bluetooth implementation would go here
          setTimeout(resolve, distance * 50); // Simulate movement time
          break;

        case 'turn_angle':
          this.updatePath(0, command.angle);
          // Bluetooth implementation would go here
          setTimeout(resolve, Math.abs(command.angle) * 20); // Simulate turn time
          break;
          
        case 'wait':
          setTimeout(resolve, command.duration);
          break;
          
        case 'stop':
          sendCommand('stop');
          resolve();
          break;
      }
    });
  }

  updatePath(distance, angle) {
    // Convert angle to radians
    const rad = this.currentPosition.angle * Math.PI / 180;
    
    // Calculate new position
    const newX = this.currentPosition.x + distance * Math.sin(rad);
    const newY = this.currentPosition.y - distance * Math.cos(rad);
    const newAngle = this.currentPosition.angle + angle;

    // Add to path history
    this.pathHistory.push({
      from: { ...this.currentPosition },
      to: { x: newX, y: newY, angle: newAngle },
      distance,
      angle
    });

    // Update stats
    if (distance > 0) this.pathDistance += distance;
    if (angle !== 0) this.pathTurns++;

    // Update current position
    this.currentPosition = { x: newX, y: newY, angle: newAngle };
    this.drawPath();
    this.updateStats();
  }

  drawPath() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    
    // Draw path segments
    this.ctx.strokeStyle = '#f7ec13';
    this.ctx.lineWidth = 2;
    this.pathHistory.forEach(segment => {
      this.ctx.beginPath();
      this.ctx.moveTo(segment.from.x, segment.from.y);
      this.ctx.lineTo(segment.to.x, segment.to.y);
      this.ctx.stroke();
    });

    // Draw current position indicator
    this.ctx.fillStyle = '#FF0000';
    this.ctx.beginPath();
    this.ctx.arc(
      this.currentPosition.x, 
      this.currentPosition.y, 
      8, 0, Math.PI * 2
    );
    this.ctx.fill();

    // Draw orientation indicator
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.currentPosition.x,
      this.currentPosition.y
    );
    this.ctx.lineTo(
      this.currentPosition.x + 20 * Math.sin(this.currentPosition.angle * Math.PI / 180),
      this.currentPosition.y - 20 * Math.cos(this.currentPosition.angle * Math.PI / 180)
    );
    this.ctx.stroke();
  }

  stop() {
    this.isPlaying = false;
    sendCommand('stop');
    debugManager.logProgramEvent({
      type: 'SEQUENCE_STOP',
      data: {
        timestamp: Date.now(),
        executedCommands: this.currentIndex
      }
    });
  }

  clear() {
    this.sequence = [];
    this.currentIndex = 0;
  }

  addCommand(command) {
    this.sequence.push(command);
  }
}

const sequencePlayer = new SequencePlayer();

// Initialize Blockly workspace
function initBlockly() {
  const workspace = Blockly.inject('blocklyDiv', {
    zoom: {
      controls: false, // Disable default controls
      wheel: true,
      startScale: 0.9,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      },
      drag: true,
      wheel: true
    },
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    toolbox: document.getElementById('toolbox'),
    trashcan: true,
    horizontalLayout: false,
    sounds: true,
    renderer: 'zelos',
    theme: Blockly.Themes.Zelos
  });

  // Robust zoom implementation with proper event handling
  function safeZoom(factor) {
    try {
      const newScale = workspace.getScale() * factor;
      workspace.setScale(newScale);
      workspace.resize();
      Blockly.svgResize(workspace);
      return true;
    } catch (e) {
      console.error("Zoom error:", e);
      return false;
    }
  }

  document.getElementById('zoom-in').addEventListener('click', () => {
    if (safeZoom(1.2)) {
      workspace.scrollCenter();
    }
  });
  
  document.getElementById('zoom-out').addEventListener('click', () => {
    if (safeZoom(0.8)) {
      workspace.scrollCenter();
    }
  });
  
  document.getElementById('zoom-reset').addEventListener('click', () => {
    workspace.setScale(1.0);
    workspace.scrollCenter();
    workspace.resize();
    Blockly.svgResize(workspace);
  });

  // Ensure proper initialization
  workspace.addChangeListener(Blockly.Events.disableOrphans);

  // Configure workspace appearance with solid blocks
  const customTheme = Blockly.Themes.Zelos;
  customTheme.blockStyles = {
    ...customTheme.blockStyles,
    movement_blocks: {
      colourPrimary: '#4285F4',
      colourSecondary: '#3367D6',
      colourTertiary: '#2A56C0',
      opacity: 1.0  // Ensure full opacity
    },
    logic_blocks: {
      colourPrimary: '#8E24AA',
      colourSecondary: '#7B1FA2',
      colourTertiary: '#6A1B9A',
      opacity: 1.0
    },
    math_blocks: {
      colourPrimary: '#F57C00',
      colourSecondary: '#EF6C00',
      colourTertiary: '#E65100',
      opacity: 1.0
    }
  };
  workspace.setTheme(customTheme);
  Blockly.svgResize(workspace);

  workspace.addChangeListener(() => {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    sequencePlayer.clear();
    // Parse generated code and build sequence
    try {
      const commands = parseBlocklyCode(code);
      commands.forEach(cmd => sequencePlayer.addCommand(cmd));
    } catch (e) {
      console.error("Error parsing blockly code:", e);
    }
  });
}

function parseBlocklyCode(code) {
  try {
    const commands = [];
    const lines = code.split('\n');
    
    for (const line of lines) {
      if (line.includes('motor_move')) {
        const dirMatch = line.match(/DIRECTION:\s*'([^']*)'/);
        const speedMatch = line.match(/SPEED:\s*(\d+)/);
        const durationMatch = line.match(/DURATION:\s*(\d+)/);
        
        if (dirMatch && speedMatch && durationMatch) {
          commands.push({
            type: 'move',
            direction: dirMatch[1],
            speed: parseInt(speedMatch[1]),
            duration: parseInt(durationMatch[1])
          });
        }
      }
      else if (line.includes('motor_stop')) {
        commands.push({type: 'stop'});
      }
      else if (line.includes('wait')) {
        const durationMatch = line.match(/DURATION:\s*(\d+)/);
        if (durationMatch) {
          commands.push({
            type: 'wait',
            duration: parseInt(durationMatch[1])
          });
        }
      }
    }
    
    return commands;
  } catch (e) {
    console.error("Error parsing Blockly code:", e);
    return [];
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBlockly);