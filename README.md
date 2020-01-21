## Description

Nest Boilerplate

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

# build
$ npm run build

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## CLI

There exists a CLI for the app that can be run with the `cli` script in the root directory of the project. Simply run `./cli --help` or just without any arguments to see the available commands.

## Directory structure

- logs
  - All log files for the app
- public
  - Any static files that need to be served directly (SPA files).
- seedData
  - Contains data to be used in seeding new instances of the database
- src
  - middleware
    - Any middleware to be used on routes in the app
  - scripts
    - Any scripts that are used to support the app.
  - shared
    - Any files/classes that are needed in multiple places in the app that don't fit into a particular module.
  - modules
    - Core code resides here. Each main "resource" of the application is split into a module. Each module can consist of the following:
      - Resolver: GraphQL resolver
      - Entity: Database model/GraphQL schema
      - Service: Main business logic for the resource
      - Controller: REST API endpoints if needed for resource
      - Spec: Unit testing for module
  - testing
    - Contains E2E tests, test setup/config, and text fixtures
  - main.ts
    - Main run script for application

## Environment Variables

We use dotenv to handle environment variables for things like database credentials and the secret app key. A `.env.example` file is provided as a blueprint for values to input.

### Troubleshooting

- Circular dependency (`Nest can't resolve dependencies of the ...`)

Circular dependencies and module dependencies in general are sometimes a struggle with Nest mainly due to a lack of debugging information that is printed out (although this has gotten better). If you are sure that a service you are trying to inject is available either via a global module or a module you've certainly imported it can be possible that there is a circular dependency that Nest isn't telling you about. Add a `@inject(forwardRef(() => ServiceYouAreTryingToInject))` to the constructor parameter to the service you're trying to inject and see if that fixes the problem.
