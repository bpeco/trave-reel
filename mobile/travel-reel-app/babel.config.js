module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // habilita el soporte de import.meta
          unstable_transformImportMeta: true
        }
      ]
    ],
    // si usas react-native-reanimated, recuerda dejar su plugin aquí
    // plugins: ['react-native-reanimated/plugin'],
  };
};
