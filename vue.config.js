module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/risk-maps/'
        : '/',
    devServer: {
        historyApiFallback: false /* Not compatible with router in history mode, but at least we get a proper error 404 if a GeoTiff file is missing. See: https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback and https://cli.vuejs.org/config/#devserver */ 
    }
}