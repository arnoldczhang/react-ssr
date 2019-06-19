import * as path from 'path';
import Helmet from 'react-helmet';
import * as Koa from 'koa';
import * as body from 'koa-body';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';
import * as Router from 'koa-router';
import * as staticServer from 'koa-static';
import * as mount from 'koa-mount';
import * as graphqlHTTP from 'koa-graphql';
import { buildSchema } from 'graphql';

import { htmlTemplate } from '../common/utils';
import getRenderDom from '../common/utils/render-dom';
import createStore, { initializeSession } from '../common/store';
import getMainFilePath from './get-main-path';

import { Store } from 'redux';

const app = new Koa();
const router = new Router();
const port = 2048;
const genResFiles = getMainFilePath();

router.get('/*', (ctx: Koa.Context, next: Function) => {
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
    ctx.body = htmlTemplate(
      reactDom,
      reduxState,
      helmetData,
      genResFiles.length ? genResFiles : ['./app.js']
    );
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

const root = { hello: () => 'Hello world!' };

app
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    return next();
  })
  .use(staticServer(path.join(process.cwd().replace(/src\/?$/, ''), './dist')))
  .use(body())
  .use(logger())
  .use(compress())
  .use(mount('/graphql', graphqlHTTP({
    schema: GraphQLSchema,
    rootValue: root,
    graphiql: true,
  })))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => console.log(`listening on port ${port}`));
