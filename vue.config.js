// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString();

module.exports = {
  publicPath: process.env.NODE_ENV === "production"
    ? "/risk-maps/"
    : "/",
  devServer: {
    historyApiFallback: false /* Not compatible with router in history mode, but at least we get a proper error 404 if a GeoTiff file is missing. See: https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback and https://cli.vuejs.org/config/#devserver */ 
  },
  outputDir: "docs",
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash),
      })
    ]
  },
}
