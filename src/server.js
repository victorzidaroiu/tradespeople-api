import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import debug from 'debug';
import config from './config';

const apiDebug = debug('API');

export default (schema) => {
  const app = express();

  app.use(
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  );

  app.listen(config.port, () => {
    apiDebug(`Server listening on port ${config.port}`);
  });
};
