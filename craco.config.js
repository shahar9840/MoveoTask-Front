module.exports = {
    devServer: (devServerConfig) => {
      // Modify devServer configuration here if needed
      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        // Add custom middleware logic here
        return middlewares;
      };
      return devServerConfig;
    },
  };