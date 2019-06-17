import { Configuration } from 'webpack';
import * as webpack from "webpack";
import * as merge from "webpack-merge";
import config from "./webpack.base.config";
const WriteFileWebpackPlugin = require("write-file-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devConfig: Configuration = {
  mode: "development",
  plugins: [
    new CleanWebpackPlugin(),
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

const finalConfig: Configuration = merge(config, devConfig);

export default finalConfig;
