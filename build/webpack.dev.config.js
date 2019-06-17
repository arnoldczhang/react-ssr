"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpack_base_config_1 = require("./webpack.base.config");
const WriteFileWebpackPlugin = require("write-file-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const devConfig = {
    mode: "development",
    plugins: [
        new CleanWebpackPlugin(),
        new WriteFileWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
const finalConfig = merge(webpack_base_config_1.default, devConfig);
exports.default = finalConfig;
