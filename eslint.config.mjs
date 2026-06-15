import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

export default defineConfig([{
    plugins: {
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: babelParser,
        ecmaVersion: 2021,
        sourceType: "module",

        parserOptions: {
            requireConfigFile: false,

            babelOptions: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
            },
        },
    },

    rules: {
        semi: ["error", "always"],
        "no-var": "error",
        "prefer-const": "error",

        "no-unused-vars": ["error", {
            args: "none",
            ignoreRestSiblings: true,
        }],

        "object-shorthand": ["error", "always"],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
    },
}]);
