## ADDED Requirements

### Requirement: Get all tests endpoint
The system SHALL provide an API endpoint to retrieve all available tests.

#### Scenario: Successful retrieval
- **WHEN** a GET request is made to `/api/tests`
- **THEN** the system SHALL return HTTP 200 with a JSON array of all tests
- **AND** each test object SHALL include: id, test_id, title, description, icon_name, duration, featured, href, color_from, color_to

#### Scenario: Empty database
- **WHEN** a GET request is made to `/api/tests` and no tests exist
- **THEN** the system SHALL return HTTP 200 with an empty array `[]`

### Requirement: Get test by ID endpoint
The system SHALL provide an API endpoint to retrieve a specific test by its test_id.

#### Scenario: Test found
- **WHEN** a GET request is made to `/api/tests?test_id=mbti`
- **THEN** the system SHALL return HTTP 200 with the test object
- **AND** the response SHALL include all test details

#### Scenario: Test not found
- **WHEN** a GET request is made with a non-existent test_id
- **THEN** the system SHALL return HTTP 404 with error message "Test not found"

### Requirement: Response format compatibility
The system SHALL ensure API responses match the current frontend data structure.

#### Scenario: Frontend compatibility
- **WHEN** the frontend receives test data from `/api/tests`
- **THEN** the data structure SHALL be compatible with the existing hardcoded tests array format
- **AND** icon_name SHALL be transformable to the icon component
- **AND** color_from and color_to SHALL be combinable into the gradient color string
