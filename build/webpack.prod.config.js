"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const merge = require("webpack-merge");
const WebpackDeepScopeAnalysisPlugin = require("webpack-deep-scope-plugin");
const webpack_base_config_1 = require("./webpack.base.config");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const prodConfig = {
    mode: "production",
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackDeepScopeAnalysisPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    optimization: {
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors'
                }
            }
        }
    },
    externals: {
        'react-dom': 'ReactDOM',
    }
};
const finalConfig = merge(webpack_base_config_1.default, prodConfig);
exports.default = finalConfig;
