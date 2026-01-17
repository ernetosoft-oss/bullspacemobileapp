# Quick Reference - React Native Mobile App

## Essential Commands

### Start Development
```bash
cd MobileApp
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS (macOS only)
```

### Clean & Restart
```bash
expo start -c         # Clear cache
rm -rf node_modules && npm install  # Reinstall
```

### Check Status
```bash
expo doctor          # Check for issues
npm outdated         # Check outdated packages
```

## Common Code Patterns

### Basic Screen Template
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyScreen() {
  const [data, setData] = useState('');

  return (
    <View style={styles.container}>
      <Text>My Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
```

### API Call Pattern
```typescript
import { backtestService } from '../services/backtestService';

const fetchData = async () => {
  try {
    setLoading(true);
    const data = await backtestService.methodName();
    setData(data);
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

### Button Pattern
```typescript
<TouchableOpacity
  style={styles.button}
  onPress={handlePress}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Press Me</Text>
  )}
</TouchableOpacity>
```

### Input Pattern
```typescript
<TextInput
  style={styles.input}
  value={value}
  onChangeText={setValue}
  placeholder="Enter text"
  keyboardType="default"
/>
```

### List Pattern
```typescript
<ScrollView>
  {items.map((item, index) => (
    <View key={index} style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  ))}
</ScrollView>
```

## File Structure

```
src/
├── screens/        → Full-page components
├── services/       → API calls
├── config/         → Configuration
├── types/          → TypeScript types
├── styles/         → Shared styles
└── utils/          → Helper functions
```

## Screen Navigation

Add to `App.tsx`:
```typescript
<Tab.Screen 
  name="ScreenName" 
  component={ScreenComponent}
  options={{
    tabBarLabel: 'Label',
    title: 'Screen Title',
  }}
/>
```

## Styling Shortcuts

### Common Layouts
```typescript
// Center content
{ flex: 1, justifyContent: 'center', alignItems: 'center' }

// Full width
{ width: '100%' }

// Horizontal row
{ flexDirection: 'row' }

// Space between
{ justifyContent: 'space-between' }

// Padding
{ padding: 20 }        // All sides
{ paddingHorizontal: 20 }  // Left & right
{ paddingVertical: 10 }    // Top & bottom
```

### Common Colors
```typescript
primary: '#007bff'
success: '#28a745'
danger: '#dc3545'
warning: '#ffc107'
light: '#f8f9fa'
dark: '#343a40'
```

## Debugging

### View in Browser
Press `w` in terminal → Opens in web browser

### Reload App
- Shake device
- Android: Ctrl+M
- iOS: Cmd+D
- Select "Reload"

### View Logs
```bash
npx react-native log-android  # Android logs
npx react-native log-ios      # iOS logs
```

### Debug Console
Add to code:
```typescript
console.log('Debug:', value);
console.error('Error:', error);
```

## TypeScript Types

### Props Type
```typescript
interface MyScreenProps {
  title: string;
  onPress: () => void;
}

export default function MyScreen({ title, onPress }: MyScreenProps) {
  // ...
}
```

### State Type
```typescript
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);
```

## Common Issues & Fixes

### Module not found
```bash
npm install
```

### Metro bundler error
```bash
expo start -c
```

### Android build error
Check ANDROID_HOME environment variable

### iOS build error (macOS)
```bash
cd ios && pod install && cd ..
```

### Network error
Check API URLs in `src/config/api.ts`

## Platform-Specific Code

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  // Android-specific code
}

if (Platform.OS === 'ios') {
  // iOS-specific code
}

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      ios: { fontFamily: 'Helvetica' },
      android: { fontFamily: 'Roboto' },
    }),
  },
});
```

## Environment Variables

Create `.env` file:
```
API_URL=https://api.example.com
DEBUG=true
```

Access in code:
```typescript
import Constants from 'expo-constants';
const apiUrl = Constants.manifest?.extra?.apiUrl;
```

## Useful Packages

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack

# HTTP Client
npm install axios

# Storage
npm install @react-native-async-storage/async-storage

# Icons
npm install @expo/vector-icons

# Date handling
npm install date-fns
```

## Testing

### Run Tests
```bash
npm test
```

### Test Pattern
```typescript
import { render, fireEvent } from '@testing-library/react-native';

test('button press works', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress} />);
  fireEvent.press(getByText('Press'));
  expect(onPress).toHaveBeenCalled();
});
```

## Performance Tips

1. Use `React.memo` for expensive components
2. Implement `FlatList` for long lists
3. Optimize images (compress, use appropriate sizes)
4. Avoid inline functions in renders
5. Use `useCallback` and `useMemo` wisely

## Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)

## Need Help?

1. Check SETUP.md for detailed instructions
2. Review existing screens for examples
3. Check React Native documentation
4. Ask the team!

---
**Quick Tip**: Press `?` in Expo CLI to see all available commands!
