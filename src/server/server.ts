import * as path from 'path';
import Helmet from 'react-helmet';
import { htmlTemplate }  from '../common/utils';
import getRenderDom from '../common/utils/render-dom';
import createStore, { initializeSession } from '../common/store';

import * as Koa from 'koa';
import * as body from 'koa-body';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';
import * as Router from 'koa-router';
import * as staticServer from 'koa-static';
import * as mount from 'koa-mount';
import * as graphqlHTTP from'koa-graphql';
import { buildSchema } from 'graphql';

import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'koa-webpack-dev-middleware';
import * as webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpackConfig from '../../build/webpack.dev.config';
import { Store } from 'redux';

const dev = process.env.NODE_ENV === 'development';
const app = new Koa();
const router = new Router();
const port = 2048;


if (dev) {
  (webpackConfig.entry as any).app = [
    `webpack-hot-middleware/client?path=//localhost:${port}/__webpack_hmr`,
    (webpackConfig.entry as any).app
  ];
  webpackConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  webpackConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';

  const watchOptions = {
    ignored: /node_modules/,
    stats: webpackConfig.stats
  };

  const compiler = webpack([webpackConfig]);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats,
      watchOptions
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

router.get('/*', (ctx: Koa.Context, next) => {
  const context = {};
  const { req } = ctx;
  const store: Store = createStore();

  try {
    store.dispatch(initializeSession());
    const reactDom = getRenderDom(context, req, store);
    const reduxState = store.getState();
    const helmetData = Helmet.renderStatic();

    ctx.status = 200;
    // ctx.set('Content-Type', 'text/html');
    ctx.body = htmlTemplate(reactDom, reduxState, helmetData);
  } catch (err) {
    console.log(err);
    next();
  }
});

const GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => 'Hello 11211221world!' };

app
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    return next();
  })
  .use(staticServer(path.resolve(__dirname, '../../dist')))
  .use(body())
  .use(logger())
  .use(compress())
  .use(mount('/graphql', graphqlHTTP({
    schema: GraphQLSchema,
    rootValue: root,
    graphiql: true
  })))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => console.log(`listening on port ${port}`));
