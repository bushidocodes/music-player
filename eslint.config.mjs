import react from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["public/**", "node_modules/**", "coverage/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],

    plugins: {
      react,
      "@typescript-eslint": tseslint.plugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      semi: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        args: "none",
        ignoreRestSiblings: true,
      }],

      "object-shorthand": ["error", "always"],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  }
);
