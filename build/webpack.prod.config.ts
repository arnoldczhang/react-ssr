import { Configuration } from 'webpack';
import * as webpack from "webpack";
import * as merge from "webpack-merge";
import * as WebpackDeepScopeAnalysisPlugin from "webpack-deep-scope-plugin";
import config from "./webpack.base.config";
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prodConfig: Configuration = {
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

const finalConfig: Configuration = merge(config, prodConfig);

export default finalConfig;
