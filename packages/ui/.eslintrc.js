module.exports = {
  extends: ["@omnisync/eslint-config/react"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
