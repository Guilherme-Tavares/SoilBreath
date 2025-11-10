// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicione esta configuração para proxy
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Redireciona requisições /api para o backend
      if (req.url.startsWith('/api')) {
        req.url = req.url.replace('/api', '');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;