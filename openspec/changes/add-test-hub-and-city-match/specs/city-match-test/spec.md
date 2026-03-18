## ADDED Requirements

### Requirement: Display city match introduction page
The system SHALL display an introduction page for the city match test at `/city-match`.

#### Scenario: Introduction page loads
- **WHEN** user navigates to `/city-match`
- **THEN** the system displays the test introduction with: title, description, estimated time, and start button

### Requirement: Load and display test questions
The system SHALL load questions from JSON and display them one at a time during the test.

#### Scenario: Test page loads
- **WHEN** user navigates to `/city-match/test`
- **THEN** the system loads questions from `/data/city-match/questions.json`
- **AND** displays the first question with its options

#### Scenario: Navigate through questions
- **WHEN** user selects an option
- **THEN** the system advances to the next question
- **AND** updates the progress bar

### Requirement: Calculate dimension scores
The system SHALL calculate scores across 4 dimensions based on user's answers.

#### Scenario: Complete all questions
- **WHEN** user answers all questions
- **THEN** the system calculates dimension scores:
  - Lifestyle: Traditional (-100) to Modern (+100)
  - Social: Introverted (-100) to Extroverted (+100)
  - Environment: Natural (-100) to Urban (+100)
  - Pace: Slow (-100) to Fast (+100)

### Requirement: Match and display recommended cities
The system SHALL match user's dimension profile to recommended cities and display results.

#### Scenario: Display results
- **WHEN** user completes the test
- **THEN** the system navigates to `/city-match/result`
- **AND** displays 3 recommended cities with match percentages
- **AND** shows dimension distribution visualization

#### Scenario: City match calculation
- **WHEN** calculating city matches
- **THEN** the system uses cosine similarity between user profile and city profiles
- **AND** returns top 3 matching cities sorted by match percentage

### Requirement: Store and display test history
The system SHALL store completed test results and allow viewing history.

#### Scenario: Save result
- **WHEN** user completes a test
- **THEN** the system saves result to localStorage with timestamp

#### Scenario: View history
- **WHEN** user navigates to `/city-match/history`
- **THEN** the system displays list of past test results
- **AND** allows clicking to view detailed results

### Requirement: Persist test progress
The system SHALL persist test progress to allow resuming after refresh.

#### Scenario: Resume test
- **WHEN** user refreshes page during test
- **THEN** the system restores current question and previous answers from sessionStorage
- **AND** allows user to continue from where they left off

### Requirement: Support retaking test
The system SHALL allow users to retake the test from result or history pages.

#### Scenario: Retake from result
- **WHEN** user clicks "重新测试" on result page
- **THEN** the system clears current progress and starts new test

#### Scenario: Retake from history
- **WHEN** user clicks "重新测试" on history page
- **THEN** the system starts new test without affecting saved history
