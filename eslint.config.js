import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        // Default: camelCase for anything not covered below
        { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
        // Variables: allow PascalCase for React components e.g App, StockCard
        { selector: "variable", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        // Function declarations: also allow PascalCase for React components
        { selector: "function", format: ["camelCase", "PascalCase"] },
        // Imports: allow PascalCase e.g React, lucide icons, component imports
        { selector: "import", format: ["camelCase", "PascalCase"] },
        // Types, interfaces, enums, classes in PascalCase only
        { selector: "typeLike", format: ["PascalCase"] },
        // No enforcement on literal Object property keys e.g lookup maps, CSS, etc
        { selector: "objectLiteralProperty", format: null },
      ],
    },
  },
])
