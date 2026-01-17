# Backtest Mobile App

A React Native mobile application for backtesting trading strategies on both Android and iOS platforms. This app is a mobile counterpart to the ClientApp web application.

## Features

- **Dashboard/Backtest**: Run backtests on trading symbols with analytics
- **Live Feeds**: Monitor real-time market data feeds
- **Chat Assistant**: AI-powered trading assistant for market insights
- **Integration**: Manage Kite Connect API integration and tokens
- **Settings**: Configure app preferences and notifications
- **Cross-Platform**: Works on both Android and iOS devices

## Technology Stack

- **React Native** with **Expo** framework
- **TypeScript** for type safety
- **React Navigation** for screen navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## Installation

1. **Navigate to the MobileApp directory**:
   ```bash
   cd backtest_solution/MobileApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## Running the App

### Using Expo Go (Quick Start)

1. Install **Expo Go** app on your mobile device:
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Run the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens in Expo Go)

### Android Emulator

```bash
npm run android
```

### iOS Simulator (macOS only)

```bash
npm run ios
```

## Project Structure

```
MobileApp/
├── App.tsx                     # Main app entry with navigation
├── index.js                    # App registration
├── package.json                # Dependencies and scripts
├── app.json                    # Expo configuration
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
├── src/
│   ├── screens/                # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── IntegrationScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── LiveFeedsScreen.tsx
│   ├── services/               # API services
│   │   ├── apiService.ts
│   │   └── backtestService.ts
│   ├── config/                 # Configuration files
│   │   └── api.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── styles/                 # Shared styles
│       └── common.ts
└── assets/                     # Images and static assets
```

## API Configuration

The app connects to backend APIs configured in `src/config/api.ts`:

- **Backtest API**: Azure Container App for backtest operations
- **Chat API**: AI chat service for trading assistance

To modify API endpoints, edit the `src/config/api.ts` file.

## Key Features

### Dashboard
- Enter symbol and tag to run backtests
- View analytics: total trades, win rates, buy/sell performance
- Display results with P&L visualization

### Live Feeds
- Real-time market data feeds
- Auto-refresh functionality
- Category filtering
- Feed details with timestamps and sizes

### Chat Assistant
- Conversational AI for trading queries
- Streaming responses
- Chat history maintenance
- Voice input support (planned)

### Integration
- Fetch and display Kite access tokens
- Update access tokens
- Start/Stop market data streaming
- Monitor integration status

### Settings
- Configure default symbol and tag
- Set trading strategy parameters
- Enable/disable notifications
- Manage app preferences

## Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

## Converting Web Components to Mobile

Key differences from the web ClientApp:

1. **UI Components**: 
   - Web: HTML elements (`<div>`, `<input>`, etc.)
   - Mobile: React Native components (`<View>`, `<TextInput>`, etc.)

2. **Styling**:
   - Web: CSS classes
   - Mobile: StyleSheet.create() with object-based styles

3. **Navigation**:
   - Web: React Router or page-based
   - Mobile: React Navigation with tabs/stack

4. **Storage**:
   - Web: localStorage
   - Mobile: AsyncStorage

5. **Platform APIs**:
   - Responsive design handled automatically by React Native
   - Platform-specific code using `Platform.OS`

## Common Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache and restart
expo start -c

# Check for issues
expo doctor
```

## Troubleshooting

### Metro bundler issues
```bash
expo start -c
```

### Dependency issues
```bash
rm -rf node_modules
npm install
```

### Android build errors
- Ensure Android Studio and SDK are properly installed
- Check ANDROID_HOME environment variable

### iOS build errors (macOS)
- Ensure Xcode and Command Line Tools are installed
- Run `pod install` in the ios/ directory (if using bare workflow)

## Contributing

When adding new features:

1. Create new screens in `src/screens/`
2. Add navigation entries in `App.tsx`
3. Create services in `src/services/` for API calls
4. Use TypeScript for type safety
5. Follow the existing styling patterns

## Related Projects

- **ClientApp**: Web-based React application (sibling directory)
- **Backend API**: Azure Container Apps providing REST APIs

## License

Copyright © 2026 Earneto

## Support

For issues or questions, contact the development team or open an issue in the repository.
