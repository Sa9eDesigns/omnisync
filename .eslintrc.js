module.exports = {
  root: true,
  extends: ["@omnisync/eslint-config"],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".turbo/",
    ".next/",
    ".expo/",
    "coverage/"
  ],
};
