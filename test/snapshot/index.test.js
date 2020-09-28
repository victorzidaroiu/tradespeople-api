/* eslint-disable import/no-extraneous-dependencies */
import 'babel-polyfill'
import { join } from 'path';
import { graphql } from 'graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import resolvers from '../../src/resolvers';
import getDb from '../../src/db';
import config from '../../src/config';

const schema = loadSchemaSync(join(__dirname, '../../src/schema.graphql'), {
  loaders: [
    new GraphQLFileLoader(),
  ],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

describe('Snapshots tests', () => {
  beforeEach(async () => {
    config.db.storage = ':memory:';
    const db = getDb();
    await db.connect();
    await db.createTables();
  });

  afterEach(async () => {
    config.db.storage = ':memory:';
    const db = getDb();
    await db.removeTables();
  });

  it('Create tradesperson', async () => {
    const response = await graphql(schemaWithResolvers, `
      mutation {
        addTradesperson(input:{ name: "Joe", longitude: 100, latitude: 100 }) {
          success
          tradespersonId
        }
      }
    `);

    expect(JSON.stringify(response)).toMatchSnapshot();
  });

  it('Create job', async () => {
    const response = await graphql(schemaWithResolvers, `
      mutation {
        addJob(input:{  description: "Job A", longitude: 101, latitude: 101, maxTradespersonDistance: 100 }) {
          success,
          jobId
        }
      }
    `);

    expect(JSON.stringify(response)).toMatchSnapshot();
  });

  it('Find tradesperson jobs', async () => {
    await graphql(schemaWithResolvers, `
      mutation {
        addTradesperson(input:{ name: "Joe", longitude: 100, latitude: 100 }) {
          success
          tradespersonId
        }
      }
    `);

    await graphql(schemaWithResolvers, `
      mutation {
        addJob(input:{  description: "Job X", longitude: 101, latitude: 101, maxTradespersonDistance: 100 }) {
          success,
          jobId
        }
      }
    `);

    await graphql(schemaWithResolvers, `
      mutation {
        addJob(input:{  description: "Job Y", longitude: 50, latitude: 50, maxTradespersonDistance: 75 }) {
          success,
          jobId
        }
      }
    `);

    const response = await graphql(schemaWithResolvers, `
      query {
        findJobsInRange(tradespersonId: 1) {
          success,
          jobs {
            description,
            latitude,
            longitude
          }
        }
      }
    `);

    expect(JSON.stringify(response)).toMatchSnapshot();
  });
});
