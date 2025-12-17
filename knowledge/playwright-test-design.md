# Designing Maintainable Playwright Test Suites

## Context
As Playwright test suites grow, the main problem is no longer writing tests, but maintaining them.
Teams usually experience increasing execution time, flaky tests, and unclear failures when test design is not intentional.

## Recommended approach
Senior QAs treat E2E tests as a **high-cost, high-value asset**.
The goal is not maximum coverage, but **maximum confidence per test**.

Well-designed Playwright suites focus on:
- Critical business flows
- Integration between key systems
- User-visible behavior that unit or API tests cannot cover

Each test should answer a single question clearly.

## Trade-offs
Reducing the number of E2E tests means:
- Less redundancy
- Faster feedback
- Higher confidence in failures

However, it requires:
- Strong API and integration testing
- Discipline to avoid pushing logic into E2E

## Common mistakes
- Testing every possible user path
- Long, end-to-end flows covering multiple responsibilities
- Reusing test logic instead of abstracting intent
- Treating E2E tests as regression
