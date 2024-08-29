module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    ['react-native-reanimated/plugin'],
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src/',
          '@router': './src/router',
          '@storage': './src/storage',
          '@store': './src/store',
          '@utils': './src/utils',
          '@locales': './src/locales',
          '@pages': './src/pages',
          '@hooks': './src/hooks',
          '@assets': './assets',
          '@api': './src/api',
          '@components': './src/components',
          '@TUIKit': './src/TUIKit',
        },
      },
      'import-glob',
    ],
  ],
  env: {

  },
};
