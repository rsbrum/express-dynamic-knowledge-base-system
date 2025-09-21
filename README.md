### Instructions
```bash
npm install
```

```bash
npm run dev
```

To test the application, I created a simple interface. Open `./app.html` and play around with the functionality.

If you don't want to use the interface, you can attach a header `x-user-role` to your request, with one of the following user roles `Admin`, `Editor`, `Viewer`

## Architecture Overview

I took inspiration from NestJS to build a modular architecture.

### Directory Structure

```
src/
├── core/           # Application configuration and shared utilities
├── features/       # Feature-specific modules and business logic
├── lib/           # Type definitions, interfaces, and enums
└── tests/         # Tests
```

### Feature Module Structure

Features are divided in four modules:

- **Repository**: database communication and data persistence
- **Service**: business logic and data manipulation
- **Controller**: entry point for HTTP requests
- **Routes**: Manages endpoint registration and dependency injection

The application bootstraps by importing feature route modules into `registerRoutes()`, which is called during `App` instantiation to wire up all dependencies.

## Data Model Design

### Topic Versioning System

Altough this was no specified in the assignment document, I decided to create a new entity called TopicVersion to better manage different versions of topics.

- **`Topic`**: topic identity
- **`TopicVersion`**: versioned content and topic information

### Database

SQLite and TypeORM

## Security & Access Control

### Authentication
I chose to keep authentication very simple. It is handled by `auth.middleware`. A request must contain a `x-user-role` header, which must be one of the available user roles `Admin`, `Editor`, `Viewer`. The middleware then associates a user based on the provided role.

### Authorization

Access control is managed through `permissions.middleware` with role-based permissions:

#### User Roles & Permissions

ADMIN: Can create, view, update and delete Topics and Resource and Users.
EDITOR: Can create, view and update Topics and Resources. Cannot delete Topics or Resources. Cannot manage users.
VIEWER: Can only view Topics and Resources

## API Endpoints

All endpoints require authentication via the `x-user-role` header with values: `Admin`, `Editor`, or `Viewer`.

### Users API (`/users`)

| Method | Endpoint | Permission Required | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/users` | `CAN_MANAGE_USERS` | Get all users |
| `POST` | `/users` | `CAN_MANAGE_USERS` | Create a new user |
| `PUT` | `/users/:id` | `CAN_MANAGE_USERS` | Update user by ID |
| `DELETE` | `/users/:id` | `CAN_MANAGE_USERS` | Delete user by ID |

**Access**: Admin only

### Topics API (`/topics`)

| Method | Endpoint | Permission Required | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/topics` | `CAN_VIEW` | Get all topics |
| `GET` | `/topics/:id` | `CAN_VIEW` | Get topic by ID |
| `GET` | `/topics/:id/version/:version` | `CAN_VIEW` | Get specific version of a topic |
| `GET` | `/topics/shortest-path/:fromId/:toId` | `CAN_VIEW` | Find shortest path between two topics |
| `POST` | `/topics` | `CAN_EDIT` | Create a new topic |
| `PUT` | `/topics/:id` | `CAN_EDIT` | Update topic by ID |
| `DELETE` | `/topics/:id` | `CAN_DELETE` | Delete topic by ID |

**Access**:
- View operations: Admin, Editor, Viewer
- Create/Update operations: Admin, Editor
- Delete operations: Admin only

### Resources API (`/resources`)

| Method | Endpoint | Permission Required | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/resources` | `CAN_VIEW` | Get all resources |
| `POST` | `/resources` | `CAN_EDIT` | Create a new resource |
| `PUT` | `/resources/:id` | `CAN_EDIT` | Update resource by ID |
| `DELETE` | `/resources/:id` | `CAN_DELETE` | Delete resource by ID |

**Access**:
- View operations: Admin, Editor, Viewer
- Create/Update operations: Admin, Editor
- Delete operations: Admin only

### Root Endpoint

| Method | Endpoint | Permission Required | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/` | None | Health check - returns "Hello World" |
