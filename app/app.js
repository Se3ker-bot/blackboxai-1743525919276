// [Previous app.js content until debugManager]

window.debugManager = {
  enabled: false,
  
  init() {
    // Initialize panel state based on localStorage
    const debugMode = localStorage.getItem('debugMode') === 'true';
    const debugToggle = document.getElementById('debug-mode');
    
    if (debugToggle) {
      debugToggle.checked = debugMode;
      if (debugMode) {
        this.enable();
      }
    }
  },
  
  enable() {
    this.enabled = true;
    localStorage.setItem('debugMode', 'true');
    document.getElementById('debug-panel').classList.add('active');
    document.getElementById('debug-status').textContent = 'Debug Mode: Active';
    document.getElementById('debug-indicator').style.display = 'flex';
    console.log('Debug mode enabled');
  },

  disable() {
    this.enabled = false;
    localStorage.setItem('debugMode', 'false');
    document.getElementById('debug-panel').classList.remove('active');
    document.getElementById('debug-status').textContent = 'Debug Mode: Inactive';
    document.getElementById('debug-indicator').style.display = 'none';
    console.log('Debug mode disabled');
  },

  log(message) {
    if (!this.enabled) return;
    
    const output = document.querySelector('#debug-panel .debug-output');
    if (output) {
      const entry = document.createElement('div');
      entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      output.appendChild(entry);
      output.scrollTop = output.scrollHeight;
    }
    console.log(message);
  }
};

// Helper function to get Arduino command for action
function getCommandForAction(action) {
  const commands = {
    'forward': 'FWD',
    'back': 'BWD',
    'left': 'LFT', 
    'right': 'RGT',
    'stop': 'STP'
  };
  return commands[action] || action.toUpperCase();
}

// Combined DOMContentLoaded handler to avoid duplicate initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize debug manager first
  debugManager.init();
  
  // Initialize debug mode toggle
  const debugToggle = document.getElementById('debug-mode');
  if (debugToggle) {
    debugToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        debugManager.enable();
      } else {
        debugManager.disable();
      }
    });
    
    // Initialize panel state based on toggle
    if (debugToggle.checked) {
      debugManager.enable();
    }
  }

  // Tab switching functionality
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      // Show selected tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');

      // Update active tab button
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      tab.classList.add('active');

      // Initialize Blockly if program tab selected
      if (tab.dataset.tab === 'program') {
        initBlockly();
      }
    });
  });

  // Clear console button
  document.getElementById('clear-console')?.addEventListener('click', () => {
    const output = document.querySelector('.debug-output');
    if (output) {
      output.innerHTML = '';
      debugManager.log('Debug console cleared');
    }
  });

  // Add logging for workspace controls
  document.getElementById('run-sequence')?.addEventListener('click', () => {
    debugManager.log('Run sequence button pressed');
  });

  document.getElementById('save-sequence')?.addEventListener('click', () => {
    debugManager.log('Save sequence button pressed');
  });

  document.getElementById('load-sequence')?.addEventListener('click', () => {
    debugManager.log('Load sequence button pressed');
  });

  document.getElementById('clear-workspace')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the workspace?')) {
      Blockly.getMainWorkspace().clear();
      debugManager.log('Workspace cleared');
    }
  });

  // Expand panel functionality
  document.getElementById('expand-console')?.addEventListener('click', () => {
    const panel = document.getElementById('debug-panel');
    panel.style.width = panel.style.width === '100%' ? '350px' : '100%';
  });

  // Add event listeners for all interactive elements
  document.querySelectorAll('.direction-btn, .emergency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.id.replace('btn-', '');
      debugManager.log(`Button pressed: ${action}`);
      
      // Log Arduino command status if connection exists
      if (isConnected) {
        const command = getCommandForAction(action);
        debugManager.log(`Sending to Arduino: ${command}`);
        // Actual sendCommand function would go here
        // sendCommand(command).then(success => {
        //   debugManager.log(success ? 'Command successfully sent' : 'Failed to send command');
        // });
      } else {
        debugManager.log('Command not sent - disconnected', 'warning');
      }
    });
  });

  const speedSlider = document.getElementById('speed-slider');
  const speedValue = document.getElementById('speed-value');
  
  speedSlider.addEventListener('input', (e) => {
    // Round to nearest 10
    const roundedValue = Math.round(e.target.value / 10) * 10;
    speedSlider.value = roundedValue;
    speedValue.textContent = roundedValue;
    
    debugManager.log(`Speed set to: ${roundedValue}`);
    
    if (isConnected) {
      debugManager.log(`Sending speed command: SPEED_${roundedValue}`);
      // Actual sendCommand would go here
    }
  });

  document.querySelectorAll('[name="motor"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const state = e.target.checked ? 'enabled' : 'disabled';
      debugManager.log(`Motor ${e.target.value} ${state}`);
    });
  });

  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      debugManager.log(`Tab changed to: ${tab.dataset.tab}`);
    });
  });

  document.getElementById('connect-btn').addEventListener('click', () => {
    debugManager.log('Connect button pressed');
  });

  // Connection status tracking
  let isConnected = false;
  
  document.getElementById('connect-btn').addEventListener('click', () => {
    // Simulate connection logic
    isConnected = !isConnected;
    document.getElementById('status').textContent = isConnected ? 'Connected' : 'Disconnected';
    debugManager.log(isConnected ? 'Connected to Arduino' : 'Disconnected from Arduino');
  });

  // Initialize speed slider
  const initialSpeed = 120; // Default starting speed
  document.getElementById('speed-slider').value = initialSpeed;
  document.getElementById('speed-value').textContent = initialSpeed;

  // Initialize live tab as active by default
  document.getElementById('live-tab').classList.add('active');
  document.querySelector('[data-tab="live"]').classList.add('active');
  
  // Log initial state
  debugManager.log('Application initialized');
});
