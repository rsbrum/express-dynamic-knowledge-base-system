
### IN PROGRESS


## Instructions

To install `npm install`
To run `npm run dev`

## Architecture

I took inspiration from NestJS to design this application in a modular and scalable way.

Code that is related to application configuration or shared between features live inside the `./src/core` directory.
Code that is related to application functionality live inside the `./src/features` directoy.
Type definitions, interfaces, enums, etc live inside the `./src/lib` directory.
Tests live inside the `./src/tests` directory.

A feature is divided in 4 main modules:
  - repository: Responsible for database communication
	- service: Responsible  for data manipulation and business logic
	- controller: Entry point for requests
	- routes: Responsible for route endpoint registration and dependency injection

The routes module of a feature is imported into `registerRoutes`, which wires everything up when `registerRoutes` is called when an instace of `App` is created .

## Design

I created an additional entity called `TopicVersion` to help manage versions of topics. The entity `Topic` now only holds the identity of a topic, and `TopicVersion` holds the topic information, making it easier to
manage versionin.

## Database

The application uses SQLite and TypeORM for database interactions.

## Authentication

I chose to keep authentication as simple as possible. It is handled by `auth.middleware`. You are not required to be authenticated to test the application. You simply need to attach a header `x-user-role` to your request with one of the possible user roles (Admin, Editor, Viewer) and it will attach one of the users to the request.

## User Roles

ADMIN: Can do everything and manage users.
EDITOR: Can view, create and update Resources and Topics, but cannot delete Resources or Topics.
VIEWER: Can only view Resources and Topics.
