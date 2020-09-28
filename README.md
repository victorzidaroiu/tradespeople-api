# Tradesperson Jobs API

## Requirements

- NodeJs 14.10

## Setup

- Run `npm i` (The local DB is created post install)
- Run `npm run start:dev`

## GraphiQL

- http://localhost:3000

## Notes

- For this exercise I am using Sqlite for convenience with the DB stored in a local file. In a production env, the app would use a managed DB service.
- Linting is done via Airbnb's rules have a dependency on several eslint packages.

## Usage examples

```graphql
  mutation {
    addTradesperson(input:{ name: "Joe", longitude: 100, latitude: 100 }) {
      success
      tradespersonId
    }
  }
```

```graphql
  mutation {
    addJob(input:{  description: "Job description", longitude: 101, latitude: 101, maxTradespersonDistance: 100 }) {
      success,
      jobId
    }
  }
```

```graphql
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
```