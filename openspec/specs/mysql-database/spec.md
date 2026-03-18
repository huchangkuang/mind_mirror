## ADDED Requirements

### Requirement: Database connection configuration
The system SHALL support configurable MySQL database connections via environment variables.

#### Scenario: Local development connection
- **WHEN** the application starts in development mode
- **THEN** it SHALL read database credentials from `.env.local` file
- **AND** connect to the local MySQL instance at localhost:3306

#### Scenario: Production connection
- **WHEN** the application runs in production environment
- **THEN** it SHALL read database credentials from environment variables
- **AND** connect to the configured MySQL instance (ECS)

### Requirement: Database connection management
The system SHALL provide a reusable database connection module.

#### Scenario: API route requests database connection
- **WHEN** an API route handler needs to query the database
- **THEN** it SHALL import a database utility from `lib/db.ts`
- **AND** the utility SHALL create a new connection using mysql2
- **AND** the connection SHALL be properly closed after the query completes

### Requirement: Connection error handling
The system SHALL handle database connection failures gracefully.

#### Scenario: Database unreachable
- **WHEN** the database connection fails
- **THEN** the API SHALL return a 500 error with message "Database connection failed"
- **AND** the error SHALL be logged for debugging

### Requirement: Environment variable validation
The system SHALL validate required database environment variables on startup.

#### Scenario: Missing environment variables
- **WHEN** required environment variables (DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) are not set
- **THEN** the application SHALL log a clear error message
- **AND** the API routes SHALL return appropriate error responses
