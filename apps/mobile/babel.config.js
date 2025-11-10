module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Performance: Module resolver para evitar deep imports e melhorar bundle size
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': '../../src',
            '@/components': '../../src/components',
            '@/screens': '../../src/screens',
            '@/navigation': '../../src/navigation',
            '@/services': '../../src/services',
            '@/hooks': '../../src/hooks',
            '@/utils': '../../src/utils',
            '@/contexts': '../../src/contexts',
            '@/theme': '../../src/theme',
            '@/types': '../../src/types',
            '@/features': '../../src/features',
            '@/shared': '../../src/shared',
            '@/config': '../../src/config',
            '@/constants': '../../src/constants',
            '@/lib': '../../src/lib',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
      // Performance: Remove console.log em produção
      ['transform-remove-console', { exclude: ['error', 'warn'] }],
      // Performance: Suporte a Reanimated (animações nativas)
      'react-native-reanimated/plugin',
    ],
  };
};
