import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
      "no-prototype-builtins": "off",
      "react-hooks/exhaustive-deps": "off",
      semi: ["error", "always"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
    },
  },
];
