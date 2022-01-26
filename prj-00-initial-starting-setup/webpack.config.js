const path = require("path");

module.exports = {
  entry: "./src/app.ts", // Entry root file.
  // output 先の path と filename を指定している
  output: {
    // filename: "bundle.[contenthash].js", // contenthash is create a unique hash for every build.
    filename: "bundle.js", // output file name.
    path: path.resolve(__dirname, "dist"), // 絶対パスを指定
  },
  devtool: "inline-source-map", // tsconfig.json の sourceMap を使用するように支持
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // import するときに拡張子をスキップできるようになる
  },
};
