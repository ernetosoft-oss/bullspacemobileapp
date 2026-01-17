# Building Installable APK - Quick Guide

## What We're Building
An installable `.apk` file for Android that can be installed directly on any Android phone without needing Expo Go.

## Steps to Build

### 1. Login to Expo (First Time Only)
```bash
cd C:\earneto\earneto\backtest_solution\MobileApp
eas login
```

**If you don't have an account:**
- Go to https://expo.dev
- Click "Sign Up" (it's FREE)
- Create account with email
- Return to terminal and login

### 2. Build the APK
```bash
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo's build servers
- Build the APK file (takes 10-20 minutes)
- Give you a download link when complete

### 3. Monitor Build Progress
- Check terminal for updates
- Or visit https://expo.dev/accounts/[your-account]/projects/backtest-mobile-app/builds
- You'll get email notification when done

### 4. Download APK
When build completes, you'll get a link like:
```
https://expo.dev/artifacts/[long-id]/application-[id].apk
```

### 5. Install on Phone

**Option A: Download directly on phone**
1. Open the download link on your Android phone
2. Download the APK
3. Tap to install
4. Enable "Install from Unknown Sources" if prompted

**Option B: Transfer from computer**
1. Download APK to computer
2. Connect phone via USB
3. Copy APK to phone's Downloads folder
4. On phone: Files → Downloads → Tap APK → Install

## Build Profiles

We have 3 build profiles configured:

- **preview** (Recommended for testing)
  - Builds APK file (easy to install)
  - Quick distribution
  - Good for testing
  
- **production**
  - Builds AAB file (for Play Store)
  - Optimized and compressed
  - Use when publishing to Google Play

- **development**
  - Development build with debugging
  - Advanced use case

## Common Commands

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build for Play Store
eas build --platform android --profile production

# Check build status
eas build:list

# View build details
eas build:view [build-id]
```

## Troubleshooting

### "Not logged in"
```bash
eas login
```

### "Project not configured"
Already configured! The eas.json file is ready.

### Build fails
- Check terminal logs
- Visit https://expo.dev for detailed logs
- Common issues: missing assets, incorrect package name

### Can't install APK
- Settings → Security → Enable "Unknown Sources"
- Or Settings → Apps → Special access → Install unknown apps

## File Locations

After build completes:
- APK download link in terminal
- Also available at expo.dev
- Can download multiple times
- Share link with others to install

## Next Steps After Build

1. **Test the APK** on your phone
2. **Share with team** - send them the download link
3. **Publish to Play Store** (optional):
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

## Cost

- **EAS Build**: FREE tier includes builds
- **Unlimited builds** on paid plans
- **No credit card required** to start

## Support

- Build logs: https://expo.dev
- Documentation: https://docs.expo.dev/build/introduction/
- Status: Check expo.dev for your builds

---

**Ready to build?** Run the command below!

```bash
cd C:\earneto\earneto\backtest_solution\MobileApp
eas login
eas build --platform android --profile preview
```
