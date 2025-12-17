# Selector Strategy for Long-Term Stability

## Context
Most Playwright test failures in mature suites are caused by selector instability.
UI refactors, design changes, or localization often break tests that rely on fragile selectors.

## Recommended approach
Senior QAs treat selectors as a **public contract** between the application and the test suite.

Preferred order of selectors:
1. data-testid (explicit testing contract)
2. ARIA roles with accessible names
3. Semantic structure (only when stable)

Selectors should describe **intent**, not appearance.

## Trade-offs
Using data-testid requires coordination with developers.
This upfront cost is offset by:
- Reduced maintenance
- Clear ownership
- Faster debugging

ARIA-based selectors improve accessibility but may still change with UX decisions.

## Common mistakes
- Using CSS classes tied to styling
- Deep DOM traversal
- Text-based selectors in localized applications
- Reusing selectors across unrelated tests

## When NOT to do this
For exploratory or throwaway tests, selector purity may not be critical.
In any long-lived suite, shortcuts accumulate technical debt quickly.
