#include <AFMotor.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

// Bluetooth module setup
SoftwareSerial HC05(1, 0); // RX, TX

// Motor controller setup
AF_DCMotor motor1(1);
AF_DCMotor motor2(2);
AF_DCMotor motor3(3);
AF_DCMotor motor4(4);

// System parameters
#define MAX_SPEED 255
#define SAFETY_TIMEOUT 3000 // 3 seconds

unsigned long lastCommandTime = 0;

void setup() {
  HC05.begin(9600);
  Serial.begin(9600); // For debugging
  
  // Initialize all motors
  stopAllMotors();
  
  // Send ready signal
  HC05.println("{\"status\":\"ready\"}");
}

void loop() {
  // Safety check
  if (millis() - lastCommandTime > SAFETY_TIMEOUT) {
    stopAllMotors();
  }

  // Process incoming commands
  if (HC05.available() > 0) {
    String input = HC05.readStringUntil('\n');
    processCommand(input);
  }
}

void processCommand(String input) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, input);

  if (error) {
    HC05.println("{\"error\":\"invalid_json\"}");
    return;
  }

  lastCommandTime = millis();
  
  const char* cmd = doc["cmd"];
  int speed = doc["speed"] | 255; // Default to max speed like reference

  Stop(); // Initialize with motors stopped like reference

  if (strcmp(cmd, "move") == 0) {
    const char* dir = doc["dir"];
    if (strcmp(dir, "FORWARD") == 0) {
      forward(speed);
    }
    else if (strcmp(dir, "BACKWARD") == 0) {
      back(speed);
    }
    else if (strcmp(dir, "LEFT") == 0) {
      left(speed);
    }
    else if (strcmp(dir, "RIGHT") == 0) {
      right(speed);
    }
  }
  else if (strcmp(cmd, "stop") == 0) {
    Stop();
  }

  HC05.println("{\"status\":\"ok\"}");
}

void forward(int speed)
{
  motor1.setSpeed(speed);
  motor1.run(FORWARD);
  motor2.setSpeed(speed);
  motor2.run(FORWARD);
  motor3.setSpeed(speed);
  motor3.run(FORWARD);
  motor4.setSpeed(speed);
  motor4.run(FORWARD);
}

void back(int speed)
{
  motor1.setSpeed(speed);
  motor1.run(BACKWARD);
  motor2.setSpeed(speed);
  motor2.run(BACKWARD);
  motor3.setSpeed(speed);
  motor3.run(BACKWARD);
  motor4.setSpeed(speed);
  motor4.run(BACKWARD);
}

void left(int speed)
{
  motor1.setSpeed(speed * 0.6);
  motor1.run(FORWARD);
  motor2.setSpeed(speed * 0.6);
  motor2.run(FORWARD);
  motor3.setSpeed(0);
  motor3.run(FORWARD);
  motor4.setSpeed(0);
  motor4.run(FORWARD);
}

void right(int speed)
{
  motor1.setSpeed(0);
  motor1.run(FORWARD);
  motor2.setSpeed(0);
  motor2.run(FORWARD);
  motor3.setSpeed(speed * 0.6);
  motor3.run(FORWARD);
  motor4.setSpeed(speed * 0.6);
  motor4.run(FORWARD);
}

void Stop()
{
  motor1.setSpeed(0);
  motor1.run(RELEASE);
  motor2.setSpeed(0);
  motor2.run(RELEASE);
  motor3.setSpeed(0);
  motor3.run(RELEASE);
  motor4.setSpeed(0);
  motor4.run(RELEASE);
}

