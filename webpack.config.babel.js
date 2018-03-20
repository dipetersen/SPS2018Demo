const path = require('path');
const appName = 'sps2018demo';
module.exports = {
    entry: './build/main.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: appName + '.min.js',
        sourceMapFilename: '[file].map'
    }
}