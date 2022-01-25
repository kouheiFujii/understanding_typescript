const path = require("path");

module.exports = {
  entry: "./src/app.ts", // Entry root file.
  output: {
    // filename: "bundle.[contenthash].js", // contenthash is create a unique hash for every build.
    filename: "bundle.js", // output file name.
    path: path.resolve(__dirname, "dist"), // 絶対パスを指定
  },
};
