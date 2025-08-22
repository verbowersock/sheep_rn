#!/bin/bash

# Detox E2E Test Runner Script

echo "🐑 Sheep App E2E Test Runner"
echo "=========================="

# Check if Android emulator is running
check_android_emulator() {
    if adb devices | grep -q "emulator"; then
        echo "✅ Android emulator detected"
        return 0
    else
        echo "❌ No Android emulator running"
        echo "Please start your Android emulator first"
        return 1
    fi
}

# Check if iOS simulator is available (macOS only)
check_ios_simulator() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if xcrun simctl list devices | grep -q "iPhone"; then
            echo "✅ iOS Simulator available"
            return 0
        else
            echo "❌ iOS Simulator not available"
            return 1
        fi
    else
        echo "ℹ️  iOS testing not available on this platform"
        return 1
    fi
}

# Build and test for Android
test_android() {
    echo "📱 Running Android E2E Tests..."
    
    if ! check_android_emulator; then
        exit 1
    fi
    
    echo "🔨 Building Android app for testing..."
    npm run build:e2e:android
    
    if [ $? -eq 0 ]; then
        echo "🧪 Running Android tests..."
        npm run test:e2e:android
    else
        echo "❌ Android build failed"
        exit 1
    fi
}

# Build and test for iOS
test_ios() {
    echo "📱 Running iOS E2E Tests..."
    
    if ! check_ios_simulator; then
        exit 1
    fi
    
    echo "🔨 Building iOS app for testing..."
    npm run build:e2e:ios
    
    if [ $? -eq 0 ]; then
        echo "🧪 Running iOS tests..."
        npm run test:e2e:ios
    else
        echo "❌ iOS build failed"
        exit 1
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [android|ios|both]"
    echo ""
    echo "Options:"
    echo "  android  - Run tests on Android emulator"
    echo "  ios      - Run tests on iOS simulator (macOS only)"
    echo "  both     - Run tests on both platforms"
    echo ""
    echo "Make sure your emulator/simulator is running before starting tests."
}

# Main script logic
case "${1:-both}" in
    "android")
        test_android
        ;;
    "ios")
        test_ios
        ;;
    "both")
        echo "🚀 Running tests on all available platforms..."
        
        if check_android_emulator; then
            test_android
        fi
        
        if check_ios_simulator; then
            echo ""
            test_ios
        fi
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        echo "❌ Invalid option: $1"
        show_usage
        exit 1
        ;;
esac

echo ""
echo "✅ E2E Tests completed!"
