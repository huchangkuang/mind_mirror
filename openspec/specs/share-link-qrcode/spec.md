## ADDED Requirements

### Requirement: Default share URL from page URL

The system SHALL expose a function that derives a default share base URL from a full page URL string. The derived URL MUST be formed as the URL `origin` concatenated with the first non-empty path segment of the URL pathname (the segment immediately after the leading `/`), without query or hash. If the pathname has no such segment (e.g. `/` or empty pathname), the function MUST return the `origin` only.

#### Scenario: Deep path uses first segment only

- **WHEN** the input is `http://39.102.102.50:3000/mbti/test?mode=deep`
- **THEN** the result is `http://39.102.102.50:3000/mbti`

#### Scenario: Single-segment path

- **WHEN** the input is `https://example.com/mbti`
- **THEN** the result is `https://example.com/mbti`

#### Scenario: Root path yields origin only

- **WHEN** the input is `https://example.com/` or `https://example.com`
- **THEN** the result is `https://example.com`

### Requirement: QR code generation from target URL

The system SHALL expose a function (or small API) that produces a raster QR code encoding a given target URL string, suitable for use in share posters (e.g. as a PNG Data URL or equivalent bitmap representation consumable by `<img>` or canvas). The implementation MUST document or enforce that it is used in a browser-capable context consistent with Next.js client usage (no accidental use from React Server Components without an explicit supported path).

#### Scenario: Generate QR for explicit URL

- **WHEN** the caller requests a QR code for the URL string `http://39.102.102.50:3000/mbti`
- **THEN** the system returns a non-empty bitmap representation that encodes exactly that string

#### Scenario: Caller supplies custom URL

- **WHEN** the caller passes a full HTTPS or HTTP URL different from the default-derived value
- **THEN** the QR code encodes the caller-supplied URL, not the default

### Requirement: Composed helper optional URL override

The system MAY expose a convenience entry that accepts an optional explicit target URL and an optional page URL for default resolution. When the explicit target URL is provided and non-empty, the encoded QR payload MUST use the explicit value. When it is omitted or empty, the system MUST derive the target using the default share URL rule from the provided page URL (or from the current browsing context when the API is defined to use `window.location.href`, if so specified in implementation docs).

#### Scenario: Override wins over default

- **WHEN** the explicit target is `https://example.com/custom` and the page URL would default to `https://example.com/mbti`
- **THEN** the QR code encodes `https://example.com/custom`

#### Scenario: No override uses default from page URL

- **WHEN** no explicit target is provided and the page URL is `http://host/app/foo/bar`
- **THEN** the QR code encodes `http://host/app`
