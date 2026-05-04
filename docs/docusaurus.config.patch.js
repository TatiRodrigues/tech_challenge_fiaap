// Patch for webpack ProgressPlugin compatibility issue
// This intercepts the webpack configuration before it's passed to webpack

module.exports = function patchWebpackConfig(config) {
  // Remove the deprecated ProgressPlugin options that are causing the validation error
  if (config.plugins) {
    config.plugins = config.plugins.map((plugin) => {
      // Find and fix the ProgressPlugin
      if (plugin.constructor && plugin.constructor.name === 'ProgressPlugin') {
        // Return without the problematic options
        return new (require('webpack').ProgressPlugin)({
          activeModules: true,
          modules: true,
          entries: true,
          dependencies: true,
        });
      }
      return plugin;
    });
  }
  return config;
};
