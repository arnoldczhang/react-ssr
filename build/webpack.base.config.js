"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const plugins = [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
];
const config = {
    context: path_1.join(__dirname, "../src"),
    devtool: "source-map",
    entry: {
        app: "./client.tsx",
    },
    node: {
        net: 'empty',
        fs: 'empty',
    },
    resolve: {
        modules: [
            path_1.resolve("./src"),
            "node_modules"
        ],
        alias: {
            '@common': path_1.resolve(__dirname, '../src/common'),
        },
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path_1.resolve(__dirname, "./src"),
                exclude: /node_modules/,
                use: ["babel-loader", "ts-loader"],
            },
            {
                test: /\.(j)sx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                },
            }, {
                test: /\.(le|c|sa)ss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            },
                        },
                        'less-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    require('autoprefixer')({
                                        browsers: [
                                            'Android >= 4.0',
                                            'last 3 versions',
                                            'iOS > 6'
                                        ],
                                    })
                                ],
                            },
                        }
                    ],
                    fallback: 'style-loader',
                })
            }
        ],
    },
    output: {
        path: path_1.resolve(__dirname, "../dist"),
        filename: "[name].js",
        chunkFilename: "[name].[chunkhash].js",
        publicPath: '/dist/',
    },
    plugins,
    stats: {
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkModules: false,
        colors: true,
        hash: false,
        modules: false,
        reasons: false,
        timings: true,
        version: false,
    },
};
exports.default = config;
