module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        }
      }
    ]
  },
  env: {
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  }
};
