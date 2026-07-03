## ADDED Requirements

### Requirement: Database connection configuration
The system SHALL support configurable MySQL database connections via environment variables for the **API application** (`apps/api`) only. The web application SHALL NOT open direct MySQL connections.

#### Scenario: Local development connection
- **WHEN** the API application starts in development mode
- **THEN** it SHALL read database credentials from `apps/api/.env` or root `.env`
- **AND** connect to the local MySQL instance via Prisma `DATABASE_URL`

#### Scenario: Production connection
- **WHEN** the API application runs in production environment
- **THEN** it SHALL read `DATABASE_URL` from environment variables
- **AND** connect to the configured MySQL instance (ECS)

### Requirement: Database connection management
The system SHALL provide database access through **Prisma Client** in `apps/api`. The web application SHALL NOT include `lib/db.ts` or mysql2-based connection utilities.

#### Scenario: API service requests database access
- **WHEN** a NestJS service needs to query the database
- **THEN** it SHALL use Prisma Client injected via `PrismaModule`
- **AND** the web application SHALL NOT import mysql2 or `lib/db.ts`

### Requirement: Connection error handling
The system SHALL handle database connection failures gracefully in the API layer.

#### Scenario: Database unreachable
- **WHEN** the API database connection fails
- **THEN** the API SHALL return a 500-series error with an appropriate message
- **AND** the error SHALL be logged for debugging

### Requirement: Environment variable validation
The API application SHALL validate required database environment variables on startup.

#### Scenario: Missing environment variables
- **WHEN** `DATABASE_URL` is not set for the API application
- **THEN** the API SHALL fail to start or log a clear error message
- **AND** the web application SHALL NOT require database environment variables
