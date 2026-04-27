const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude web-specific packages from native builds
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
