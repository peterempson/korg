/*
 * WebPack is used to compile the "frontend" code that will run in the Electron
 * browser. This configuration is used for a lot of the logic, but some of it
 * is also in gulp/frontend.js
 */
var path = require("path");
var webpack = require('webpack');

module.exports = {
	target: 'electron-renderer',

    entry: ["./src/index.tsx"],

    output: {
        // Why this has to be an absolute path is beyond me .. fucking NodeJS
        // developers...
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "dist/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    plugins: [
    	 new webpack.LoaderOptionsPlugin({
    	       debug: true
    	     })

    ],

    module: {
        rules: [
            {
            	enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            { 
            	test: /\.(jpe?g|gif|png|ttf)$/, 
            	loader: "file-loader"
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};