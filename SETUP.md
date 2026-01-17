# MobileApp Development Setup Guide

## Quick Start for New Developers

### 1. Environment Setup

#### Install Required Tools

**Windows:**
```powershell
# Install Node.js from https://nodejs.org/
# Install Git from https://git-scm.com/

# Install Expo CLI globally
npm install -g expo-cli

# Install Android Studio from https://developer.android.com/studio
```

**macOS:**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Expo CLI
npm install -g expo-cli

# Install Xcode from App Store (for iOS development)
```

#### Configure Android Studio (for Android development)

1. Open Android Studio
2. Go to **Tools > SDK Manager**
3. Install:
   - Android SDK Platform 33 (or latest)
   - Android SDK Build-Tools
   - Android Emulator
4. Configure ANDROID_HOME environment variable:
   - Windows: `C:\Users\[YOUR_USER]\AppData\Local\Android\Sdk`
   - macOS/Linux: `~/Library/Android/sdk`

### 2. Project Setup

```bash
# Navigate to the MobileApp directory
cd backtest_solution/MobileApp

# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Development Workflow

#### Running on Physical Device
1. Install **Expo Go** on your phone
2. Run `npm start`
3. Scan the QR code with:
   - Android: Expo Go app
   - iOS: Camera app

#### Running on Emulator/Simulator

**Android:**
```bash
# Start Android emulator from Android Studio first
# Then run:
npm run android
```

**iOS (macOS only):**
```bash
npm run ios
```

### 4. Making Changes

#### Adding a New Screen

1. Create a new file in `src/screens/`:
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewScreen() {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

2. Add to navigation in `App.tsx`:
```typescript
import NewScreen from './src/screens/NewScreen';

// Inside Tab.Navigator:
<Tab.Screen name="NewScreen" component={NewScreen} />
```

#### Adding an API Call

1. Add endpoint to `src/config/api.ts`:
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_ENDPOINT: `${API_BASE_URL}/api/new-endpoint`,
};
```

2. Add service method in `src/services/backtestService.ts`:
```typescript
async fetchNewData(): Promise<any> {
  return apiService.get(API_ENDPOINTS.NEW_ENDPOINT);
}
```

3. Use in component:
```typescript
import { backtestService } from '../services/backtestService';

const fetchData = async () => {
  try {
    const data = await backtestService.fetchNewData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### 5. Debugging

#### React Native Debugger
```bash
# Enable debugging in the app
# Shake device or press Ctrl+M (Android) / Cmd+D (iOS)
# Select "Debug" from the menu
```

#### Console Logs
```typescript
console.log('Debug message');
console.error('Error message');
console.warn('Warning message');
```

#### React DevTools
```bash
npm install -g react-devtools
react-devtools
```

### 6. Common Issues & Solutions

#### Metro Bundler Cache Issues
```bash
expo start -c
```

#### Module Not Found
```bash
rm -rf node_modules
npm install
```

#### Android Build Issues
- Check ANDROID_HOME is set correctly
- Ensure Android SDK is installed
- Try running from Android Studio first

#### iOS Build Issues (macOS)
```bash
cd ios/
pod install
cd ..
npm run ios
```

### 7. Code Style Guidelines

- Use **TypeScript** for all new files
- Follow **functional components** with hooks
- Use **StyleSheet.create()** for styles
- Keep styles at the bottom of files
- Use **async/await** for asynchronous operations
- Handle errors with try/catch blocks
- Add loading and error states to components

### 8. Testing on Different Screen Sizes

The app automatically adapts to different screen sizes. Test on:
- Small phones (iPhone SE, smaller Android devices)
- Regular phones (iPhone 12, Pixel 5)
- Large phones (iPhone 14 Pro Max, Galaxy S21+)
- Tablets (iPad, Android tablets)

### 9. Building for Production

#### Development Build
```bash
expo build:android
expo build:ios
```

#### App Store / Play Store Build
Refer to Expo's documentation for:
- [Android builds](https://docs.expo.dev/build/setup/)
- [iOS builds](https://docs.expo.dev/build/setup/)

### 10. Useful Commands

```bash
# Clear cache and restart
expo start -c

# Run on specific device
npm run android -- --device [device-name]
npm run ios -- --simulator="iPhone 14"

# Check for issues
expo doctor

# Update dependencies
npm update

# Install new package
npm install [package-name]
```

### 11. Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Need Help?

- Check the main README.md for feature documentation
- Review existing screens for code examples
- Search React Native documentation
- Ask the development team

Happy coding! 🚀
