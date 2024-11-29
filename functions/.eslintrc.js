module.exports = {e
  env: {
    es6: true,
    node: true,
    browser: true, // Ajouté pour le développement React
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module", // Ajouté pour supporter les imports/exports
    ecmaFeatures: {
      jsx: true, // Ajouté pour supporter JSX
    },
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:react/recommended", // Ajouté pour React
  ],
  plugins: [
    "react", // Ajouté pour React
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "react/prop-types": "off", // Désactivé pour simplifier, activez-le si vous utilisez PropTypes
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
  settings: {
    react: {
      version: "detect", // Détecte automatiquement la version de React
    },
  },
};
