## ADDED Requirements

### Requirement: Save test result endpoint
The system SHALL provide an API endpoint to save a test result.

#### Scenario: Successful save
- **WHEN** a POST request is made to `/api/history` with body containing `{test_id, result, result_summary}`
- **THEN** the system SHALL insert a new record into `test_history` table
- **AND** return HTTP 201 with the created record including its `id` and `created_at`

#### Scenario: Missing required fields
- **WHEN** a POST request is made without required fields (test_id, result)
- **THEN** the system SHALL return HTTP 400 with error message "Missing required fields: test_id, result"

#### Scenario: Invalid test_id
- **WHEN** a POST request is made with a test_id that doesn't exist in tests table
- **THEN** the system SHALL return HTTP 400 with error message "Invalid test_id"

### Requirement: Get test history endpoint
The system SHALL provide an API endpoint to retrieve test history.

#### Scenario: Get all history
- **WHEN** a GET request is made to `/api/history`
- **THEN** the system SHALL return HTTP 200 with a JSON array of all history records
- **AND** records SHALL be ordered by `created_at` DESC (newest first)
- **AND** each record SHALL include: id, test_id, test_title (joined from tests), result, result_summary, created_at

#### Scenario: Get history by test_id
- **WHEN** a GET request is made to `/api/history?test_id=mbti`
- **THEN** the system SHALL return HTTP 200 with history records filtered by the specified test_id
- **AND** records SHALL be ordered by `created_at` DESC

#### Scenario: Empty history
- **WHEN** a GET request is made and no history records exist
- **THEN** the system SHALL return HTTP 200 with an empty array `[]`

### Requirement: Delete test history endpoint
The system SHALL provide an API endpoint to delete a specific history record.

#### Scenario: Successful deletion
- **WHEN** a DELETE request is made to `/api/history?id=123`
- **THEN** the system SHALL delete the record with the specified id
- **AND** return HTTP 200 with message "Record deleted successfully"

#### Scenario: Record not found
- **WHEN** a DELETE request is made with a non-existent id
- **THEN** the system SHALL return HTTP 404 with error message "Record not found"

### Requirement: Clear all history endpoint
The system SHALL provide an API endpoint to clear all history records.

#### Scenario: Successful clear
- **WHEN** a DELETE request is made to `/api/history` without id parameter
- **THEN** the system SHALL delete all records from test_history table
- **AND** return HTTP 200 with message "All history cleared" and count of deleted records
