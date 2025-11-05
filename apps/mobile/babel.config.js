module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@screens': './src/screens',
            '@features': './src/features',
            '@shared': './src/shared',
            '@config': './src/config',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  };
};
