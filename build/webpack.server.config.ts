import * as path from 'path';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const dev = process.env.NODE_ENV === "development";

const finalConfig: webpack.Configuration = {
  name: 'server',
  target: 'node',
  mode: dev ? "development" : "production",
  performance: {
    hints: false,
  },
  entry: {
    server: [
      require.resolve('core-js/stable'),
      require.resolve('regenerator-runtime/runtime'),
      path.resolve(__dirname, '../src/server/index.ts'),
    ],
  },
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: /\.css$/,
    }),
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.js',
    publicPath: '/dist/',
    // libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.mjs', '.json', '.jsx', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "../src/server"),
        exclude: /node_modules/,
        use: ["ts-loader"],
      }, 
    ],
  },
  plugins: dev ? [
    new WriteFileWebpackPlugin(),
    new webpack.DefinePlugin({
        __SERVER__: 'true',
        __BROWSER__: 'false',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ] : [
      new webpack.DefinePlugin({
        __SERVER__: 'true',
        __BROWSER__: 'false',
      }),
  ],
  stats: {
    colors: true,
  },
};

export default finalConfig;
