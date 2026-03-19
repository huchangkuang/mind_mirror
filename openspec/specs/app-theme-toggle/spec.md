## ADDED Requirements

### Requirement: Header theme switch

The system SHALL expose a theme control in the global site header (`SiteHeader`) implemented as a Switch. The control SHALL reflect the currently effective theme (light or dark) and SHALL be operable by keyboard and screen readers (e.g. `role="switch"`, `aria-checked`, visible label or `aria-label`).

#### Scenario: User toggles theme from header

- **WHEN** the user activates the header theme Switch
- **THEN** the effective theme switches between light and dark
- **AND** all Tailwind `dark:` styles and global CSS variables aligned with the theme update accordingly

### Requirement: Default to system preference

The system SHALL determine the effective theme on load as follows: if there is no valid stored override, the effective theme SHALL match the user agent `prefers-color-scheme` (light when not dark, dark when dark).

#### Scenario: First visit with no stored override

- **WHEN** the user opens the application with no applicable stored override
- **THEN** the effective theme matches the current system light/dark preference

#### Scenario: System preference changes without override

- **WHEN** there is no valid stored override and the system `prefers-color-scheme` changes (e.g. OS theme toggle)
- **THEN** the effective theme updates to follow the new system preference

### Requirement: Short-lived local override when differing from system

The system SHALL persist a local override in `localStorage` only when the user-selected theme differs from the current system preference. The override SHALL include an expiration time twelve hours after it is written or last renewed. While a valid override exists, the effective theme SHALL be the stored light/dark mode, not the system preference.

#### Scenario: User selects theme that differs from system

- **WHEN** the user sets the theme to a mode that does not match the current `prefers-color-scheme`
- **THEN** the system stores the override with a twelve-hour expiry
- **AND** subsequent page loads within the expiry use the stored mode

#### Scenario: Stored override expired

- **WHEN** the user loads the application and the stored override exists but is past its expiration
- **THEN** the stored override is treated as absent
- **AND** the effective theme follows the system preference

### Requirement: Clear override when aligned with system

The system SHALL remove the stored override entry when the user-selected theme matches the current system preference, so that no unnecessary local state remains.

#### Scenario: User switches back to match system

- **WHEN** the user changes the theme such that it matches the current `prefers-color-scheme`
- **THEN** the system removes the theme override from `localStorage`
- **AND** subsequent behavior follows the system preference until the user again chooses a differing theme

### Requirement: Root styling consistency

The system SHALL apply the effective theme to the document root in a way consistent with Tailwind `dark` variant usage (e.g. `dark` class on `html`). Global CSS variables used for page background and foreground SHALL match the effective light or dark theme.

#### Scenario: Effective dark theme

- **WHEN** the effective theme is dark
- **THEN** the document root is styled for dark mode and matches Tailwind `dark:` behavior

#### Scenario: Effective light theme

- **WHEN** the effective theme is light
- **THEN** the document root is styled for light mode and non-`dark:` styles apply as expected
