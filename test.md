Summary - E2E Testing Workflow with Maestro
Here's your complete E2E testing workflow:

1. Build the app for testing:
npx expo run:android --variant release --no-install
2. Install the APK:
adb install android/app/build/outputs/apk/release/app-release.apk
3. Run E2E tests:
# Run a specific test
maestro test flows/basic_test.yaml

# Run all tests in the flows directory
npm run test:e2e
# or
maestro test flows/