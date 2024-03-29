module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          '@components': './app/components',
          '@pages': './app/pages',
          '@stores': './app/stores',
          '@themes': './app/themes',
          '@utils': './app/utils'
        },
      },
    ],
    'react-native-reanimated/plugin',
  ]
};
