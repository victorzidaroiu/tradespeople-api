/* eslint-disable import/no-extraneous-dependencies */
import { join } from 'path';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import resolvers from './resolvers';
import server from './server';
import getDb from './db';

const db = getDb();
db.connect();

const schema = loadSchemaSync(join(__dirname, './schema.graphql'), {
  loaders: [
    new GraphQLFileLoader(),
  ],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

server(schemaWithResolvers);
