# API Setup vs UI Setup in Playwright

## Context
Test setup through the UI is one of the main causes of slow and flaky Playwright suites.
Logging in, creating entities, or navigating through multiple screens increases execution time and failure surface.

## Recommended approach
Senior QAs usually prefer **API-based setup** for:
- Creating users
- Seeding domain data
- Reaching specific system states

This keeps tests focused on what they intend to validate, not how the state was reached.

## Trade-offs
API setup bypasses UI validation.
This is acceptable only if:
- UI flows are tested elsewhere
- APIs are stable and versioned
- Tests do not depend on internal-only endpoints

## Common mistakes
- Using API setup everywhere, eliminating UI coverage
- Coupling tests to unstable internal APIs
- Mixing UI and API setup inconsistently

## When NOT to do this
- When validating critical onboarding or checkout flows
- When API behavior differs significantly from UI behavior
- When APIs are poorly documented or unstable
