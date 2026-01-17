import { StyleSheet } from 'react-native';

// Shared color palette
export const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  border: '#ddd',
  text: '#333',
  textLight: '#6c757d',
  background: '#f8f9fa',
};

// Shared spacing values
export const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
};

// Shared font sizes
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

// Shared styles that can be reused across components
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: fontSize.md,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
  successText: {
    color: colors.success,
    fontSize: fontSize.sm,
  },
});
