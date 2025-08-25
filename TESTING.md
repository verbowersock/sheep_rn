# Detox E2E Testing Setup

This project is configured with Detox for end-to-end testing of your React Native Expo app.

## Prerequisites

### Android Testing
1. Install Android Studio and set up an Android emulator
2. Create an AVD named `Pixel_7_API_34` (or update `.detoxrc.js` with your AVD name)
3. Make sure the emulator is running before tests

### iOS Testing (macOS only)
1. Install Xcode
2. Install iOS Simulator
3. Make sure you have the iPhone 15 simulator available

## Running Tests

### Android
```bash
# Build the app for testing (first time only)
npm run build:e2e:android

# Run tests
npm run test:e2e:android
```

### iOS
```bash
# Build the app for testing (first time only)
npm run build:e2e:ios

# Run tests
npm run test:e2e:ios
```

## Test Structure

- `e2e/app.test.js` - Main app functionality tests
- `e2e/database.test.js` - Database and data management tests
- `e2e/init.js` - Test initialization and setup
- `e2e/jest.config.js` - Jest configuration for Detox

## Writing Tests

Tests use Detox's API for finding and interacting with elements:

```javascript
// Find elements by testID
await element(by.id('add-sheep-button')).tap();

// Find elements by text
await element(by.text('Submit')).tap();

// Wait for elements to appear
await waitFor(element(by.id('sheep-list')))
  .toBeVisible()
  .withTimeout(10000);

// Assert element visibility
await expect(element(by.text('Sheep Added'))).toBeVisible();
```

## Adding Test IDs to Components

For reliable testing, add `testID` props to your React Native components:

```jsx
<Button testID="add-sheep-button" onPress={addSheep}>
  Add Sheep
</Button>

<View testID="sheep-list-container">
  {/* Sheep list content */}
</View>
```

## Test Coverage

Current tests cover:
- App initialization and splash screen
- Navigation between screens
- Adding new sheep
- Viewing sheep details
- Tab navigation in details
- Database backup functionality
- Medication entry
- Error handling

## Debugging Tests

1. Use `device.log()` to print debug information
2. Take screenshots: `await device.takeScreenshot('test-name')`
3. Use `--loglevel verbose` flag for detailed output
4. Check device logs for React Native errors

## Continuous Integration

To run tests in CI, ensure your CI environment has:
- Android SDK and emulator (for Android tests)
- Xcode and simulators (for iOS tests)
- Sufficient timeout values for slow CI environments

## Troubleshooting

1. **App doesn't launch**: Check that the app builds successfully with `expo run:android/ios`
2. **Elements not found**: Verify testIDs are correctly set in your components
3. **Timeouts**: Increase timeout values in tests for slower devices/emulators
4. **Database issues**: Ensure test data is properly cleaned up between tests
