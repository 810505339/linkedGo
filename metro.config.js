const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = {
  transformer: {
    unstable_allowRequireContext: true,
  },
};
const config = mergeConfig(getDefaultConfig(__dirname), defaultConfig);

module.exports = withNativeWind(config, { input: './global.css' });
