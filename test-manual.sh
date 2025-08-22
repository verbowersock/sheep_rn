#!/bin/bash

# Simple script to test basic app functionality
echo "Testing Sheep App on Android Emulator"
echo "========================================"

# Launch the app
echo "1. Launching app..."
adb shell am start -n com.sheeprn/.MainActivity
sleep 3

# Take a screenshot
echo "2. Taking screenshot..."
adb exec-out screencap -p > /tmp/sheep_app_test.png
echo "Screenshot saved to /tmp/sheep_app_test.png"

# Check if app is running
echo "3. Checking if app is running..."
if adb shell ps | grep -q "com.sheeprn"; then
    echo "✅ App is running successfully"
else
    echo "❌ App is not running"
fi

# Basic interaction test using input commands
echo "4. Testing basic interactions..."
# Tap in center of screen
adb shell input tap 540 1200
sleep 1

# Take another screenshot
adb exec-out screencap -p > /tmp/sheep_app_after_tap.png
echo "After interaction screenshot saved to /tmp/sheep_app_after_tap.png"

echo "Manual testing complete. Check screenshots and app on emulator."
