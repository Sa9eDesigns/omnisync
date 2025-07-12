module.exports = {
  extends: ["@omnisync/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
