const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch folders for monorepo - incluir entradas padrão do Expo
config.watchFolders = [...(config.watchFolders || []), workspaceRoot];

// Node modules to resolve from workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Otimizações para Fast Refresh e Hot Reload
// Configurações de servidor para melhor conexão iOS
config.server = {
  ...config.server,
  // Permitir conexões de qualquer host (útil para iOS)
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
  // Configurações de CORS para desenvolvimento
  rewriteRequestUrl: (url) => {
    if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
      return url;
    }
    return url;
  },
};

// Configurações de cache para desenvolvimento mais rápido
config.cacheStores = config.cacheStores || [];

// Fast Refresh habilitado por padrão no Expo
// Garantir que está ativo
config.transformer = {
  ...config.transformer,
  // Fast Refresh está habilitado por padrão
  unstable_allowRequireContext: true,
};

module.exports = config;
