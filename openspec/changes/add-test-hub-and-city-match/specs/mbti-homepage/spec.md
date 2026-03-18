## MODIFIED Requirements

### Requirement: MBTI test introduction page location
The system SHALL relocate the MBTI test introduction page from `/` to `/mbti`.

#### Scenario: Access MBTI via new route
- **WHEN** user navigates to `/mbti`
- **THEN** the system displays the MBTI introduction page
- **AND** the content remains functionally identical to the previous homepage

#### Scenario: Old route redirect (optional)
- **WHEN** user navigates to root `/`
- **THEN** the system displays the test collection homepage instead

## REMOVED Requirements

### Requirement: MBTI as default homepage
**Reason**: The root path `/` now serves as the test collection navigation hub
**Migration**: Users looking for MBTI should navigate to `/mbti` or click the MBTI card from the new homepage
