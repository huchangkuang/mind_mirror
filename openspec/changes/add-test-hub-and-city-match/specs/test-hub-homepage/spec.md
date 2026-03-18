## ADDED Requirements

### Requirement: Display test collection homepage
The system SHALL display a homepage that serves as a navigation hub for all available tests.

#### Scenario: Homepage loads
- **WHEN** user navigates to root path `/`
- **THEN** the system displays the test collection homepage

### Requirement: Show test cards grid
The system SHALL display available tests as interactive cards in a responsive grid layout.

#### Scenario: Multiple tests available
- **WHEN** the homepage loads
- **THEN** the system displays a card for each available test
- **AND** each card shows: test icon, title, brief description, estimated duration

#### Scenario: Responsive layout
- **WHEN** user views homepage on mobile device
- **THEN** cards display in single column layout
- **WHEN** user views on tablet
- **THEN** cards display in 2-column layout
- **WHEN** user views on desktop
- **THEN** cards display in 2-3 column layout

### Requirement: Navigate to test from card
The system SHALL allow users to start a test by clicking on its card.

#### Scenario: Click test card
- **WHEN** user clicks on a test card or its "开始测试" button
- **THEN** the system navigates to the test's introduction page

### Requirement: Consistent visual design
The system SHALL maintain consistent visual design with existing MBTI test.

#### Scenario: Visual consistency
- **WHEN** homepage renders
- **THEN** it uses the same glassmorphism style as MBTI pages
- **AND** it uses the same gradient hero background
- **AND** it uses the same typography (Outfit + Work Sans)
