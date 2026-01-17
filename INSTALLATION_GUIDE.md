# How to Install Mobile App on Your Phone

## Quick Testing (Development)

### Method 1: Expo Go (Easiest - No Build Required)

1. **Install Expo Go** on your phone:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Start the server on your computer**:
   ```bash
   cd C:\earneto\earneto\backtest_solution\MobileApp
   npm start
   ```

3. **Connect your phone**:
   - Make sure your phone and computer are on the **same Wi-Fi network**
   - **Android**: Open Expo Go → Scan the QR code from terminal
   - **iOS**: Open Camera app → Point at QR code → Tap notification

4. **Done!** The app will load on your phone

**Pros**: Instant testing, no build process
**Cons**: Requires Expo Go app, needs network connection

---

## Production Installation (Standalone App)

### For Android (.APK File)

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
cd C:\earneto\earneto\backtest_solution\MobileApp
eas login
```

#### Step 3: Configure Build
```bash
eas build:configure
```

#### Step 4: Build APK
```bash
# For development build (easier to install)
eas build --platform android --profile preview

# OR for production build
eas build --platform android --profile production
```

This will:
- Upload your code to Expo servers
- Build the APK file (takes 10-20 minutes)
- Give you a download link

#### Step 5: Install on Phone

**Option A: Direct Download**
1. Open the download link on your Android phone
2. Download the APK file
3. Tap the file to install
4. Enable "Install from Unknown Sources" if prompted

**Option B: Via Computer**
1. Download APK to computer
2. Connect phone via USB
3. Copy APK to phone's Downloads folder
4. On phone: Open Files → Downloads → Tap APK
5. Install

---

### For iOS (.IPA File) - Requires Apple Developer Account ($99/year)

#### Step 1: Setup Apple Developer Account
1. Go to https://developer.apple.com
2. Enroll in Apple Developer Program ($99/year)
3. Create certificates and provisioning profiles

#### Step 2: Configure EAS
```bash
eas build:configure
```

#### Step 3: Build IPA
```bash
eas build --platform ios --profile production
```

#### Step 4: Install via TestFlight
1. Upload IPA to App Store Connect
2. Submit for TestFlight
3. Invite yourself as tester
4. Install TestFlight app on iPhone
5. Install your app through TestFlight

**Note**: iOS requires Apple Developer account for installation outside App Store

---

## Alternative: Local Build (Without EAS)

### For Android (Local APK Build)

1. **Install Android Studio**:
   - Download from https://developer.android.com/studio
   - Install Android SDK

2. **Generate Android project**:
   ```bash
   cd C:\earneto\earneto\backtest_solution\MobileApp
   npx expo prebuild --platform android
   ```

3. **Build APK**:
   ```bash
   cd android
   .\gradlew assembleRelease
   ```

4. **Find APK**:
   ```
   android\app\build\outputs\apk\release\app-release.apk
   ```

5. **Install on phone** (same as above)

---

## Quick Comparison

| Method | Android | iOS | Cost | Time | Best For |
|--------|---------|-----|------|------|----------|
| **Expo Go** | ✅ Free | ✅ Free | Free | Instant | Development/Testing |
| **EAS Build** | ✅ Yes | ✅ Yes | Free tier available | 10-20 min | Production ready |
| **Local Build** | ✅ Yes | ❌ Complex | Free | 5-10 min | Advanced users |
| **App Stores** | ✅ $25 one-time | ✅ $99/year | Paid | Days/Weeks | Public release |

---

## Recommended Approach

### For Testing & Development:
→ **Use Expo Go** (Method 1) - Instant, free, easy

### For Sharing with Others:
→ **Use EAS Build** - Creates proper APK/IPA files

### For Public Release:
→ **Publish to App Stores** - Official distribution

---

## Step-by-Step: EAS Build (Detailed)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Navigate to project
```bash
cd C:\earneto\earneto\backtest_solution\MobileApp
```

### 3. Login to Expo
```bash
eas login
```
(Create free account at expo.dev if you don't have one)

### 4. Configure for first time
```bash
eas build:configure
```

This creates `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### 5. Build APK
```bash
eas build --platform android --profile preview
```

### 6. Wait for build (10-20 minutes)
- Monitor progress at https://expo.dev
- You'll get a download link when complete

### 7. Install APK
- Download on phone or computer
- Install on Android device
- Done!

---

## Troubleshooting

### "Install blocked" on Android
**Solution**: Settings → Security → Enable "Install from Unknown Sources"

### "Cannot install" on Android
**Solution**: Make sure you're using the `preview` profile which builds APK (not AAB)

### iOS won't install
**Solution**: iOS requires Apple Developer account or TestFlight

### App crashes on phone
**Solution**: Check that all APIs are accessible from phone's network

### "Network error" in Expo Go
**Solution**: Ensure phone and computer are on same Wi-Fi network

---

## Publishing to App Stores (Optional)

### Google Play Store (Android)
1. Create Google Play Console account ($25 one-time)
2. Build production AAB: `eas build --platform android --profile production`
3. Upload to Play Console
4. Fill out store listing
5. Submit for review (1-3 days)

### Apple App Store (iOS)
1. Enroll in Apple Developer Program ($99/year)
2. Build production IPA: `eas build --platform ios --profile production`
3. Upload to App Store Connect
4. Fill out store listing
5. Submit for review (1-2 days typically)

---

## Summary

**For immediate testing**: Use Expo Go (5 minutes setup)

**For installable app**: Use EAS Build (30 minutes first time, then 10-20 min per build)

**For public distribution**: Publish to App Stores (requires accounts & fees)

---

## Need Help?

1. Check logs: `npx expo start` shows detailed errors
2. Expo documentation: https://docs.expo.dev
3. Build logs: https://expo.dev (when using EAS)

**Current Status**: Your app is ready to run with Expo Go immediately!
