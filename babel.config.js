module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',  // Ensure your environment file is named .env
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false
      }]
    ]
  };
};
