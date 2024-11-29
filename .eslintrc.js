module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    // Commentez temporairement la ligne suivante
    // "plugin:react/recommended",
  ],
  // Commentez temporairement la section plugins
  // plugins: [
  //   "react",
  // ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "react/prop-types": "off",
    "no-unused-vars": "warn"
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
