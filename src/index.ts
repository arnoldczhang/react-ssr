import * as path from 'path';
import * as Koa from 'koa';
import * as body from 'koa-body';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';
import * as staticServer from 'koa-static';
import * as webpack from 'webpack';
import * as nodemon from 'nodemon';
import * as webpackDevMiddleware from 'koa-webpack-dev-middleware';
import * as webpackHotMiddleware from 'koa-webpack-hot-middleware';
import clientWebpackConfig from '../build/webpack.dev.config';
import serverWebpackConfig from '../build/webpack.server.config';
const rimraf = require('rimraf');

const compilerPromise = (name: string, compiler: any) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      console.log(`[${name}] Compiling `);
    });
    compiler.hooks.done.tap(name, (stats: any) => {
      if (!stats.hasErrors()) {
        console.log(`[${name}] Compiled `);
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};


const app = new Koa();
const port = 1024;
const HOST = '//localhost';
const PORT = 2048;

const run = async () => {
  rimraf.sync(path.join(__dirname, '../dist'));
  (clientWebpackConfig.entry as any).app = [
    `webpack-hot-middleware/client?noInfo=true&reload=true&path=${HOST}:${port}/__webpack_hmr`,
    (clientWebpackConfig.entry as any).app,
  ];

  clientWebpackConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  clientWebpackConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';

  const watchOptions = {
    ignored: /node_modules/,
    stats: clientWebpackConfig.stats,
  };

  const publicPath = clientWebpackConfig.output.publicPath;

  clientWebpackConfig.output.publicPath = [`${HOST}:${port}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/');

  serverWebpackConfig.output.publicPath = [`${HOST}:${port}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/');
  
  const multiCompiler = webpack([clientWebpackConfig, serverWebpackConfig]);

  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client');
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server');

  app.use((ctx: Koa.Context, next: Function) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    return next();
  }).use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientWebpackConfig.output.publicPath,
      stats: clientWebpackConfig.stats,
      watchOptions,
    })
  ).use(webpackHotMiddleware(clientCompiler))
    .use(staticServer(path.resolve(__dirname, '../dist')))
    .use(body())
    .use(logger())
    .use(compress())
    .listen(port, () => {
      console.log(`listening on ${port}`);
    });

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      return;
    } else {
      console.log(error, 'error');
    }
  });

  const clientPromise = compilerPromise('client', serverCompiler);
  const serverPromise = compilerPromise('server', serverCompiler);

  try {
    await clientPromise;
    await serverPromise;
  } catch (error) {
    console.log(error, 'error');
  }

  const script = nodemon({
    script: path.resolve(__dirname, '../dist/server.js'),
    ignore: ['src', 'scripts', 'config', './*.*', 'build/client'],
    cwd: __dirname,
    delay: 200,
  });

  script.on('restart', () => {
    console.log('Server side app has been restarted.', 'warning');
  });

  script.on('quit', () => {
    console.log('Process ended');
    process.exit();
  });

  script.on('error', () => {
    console.log('An error occured. Exiting', 'error');
    process.exit(1);
  });
};

run();