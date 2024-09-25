module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: ["config/*"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  globals: {
    process: "readonly",
    require: "readonly",
  },
  plugins: ["react", "import", "n", "promise"],
  extends: ["standard", "plugin:react/recommended"],
  rules: {
    "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    "no-prototype-builtins": "off",
    "react-hooks/exhaustive-deps": "off",
    semi: ["error", "always"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "comma-dangle": ["error", "only-multiline"],
    "space-before-function-paren": "off",
    "no-trailing-spaces": "off",
    "padded-blocks": "off",
    "object-shorthand": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
