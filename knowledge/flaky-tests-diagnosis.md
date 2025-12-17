# Diagnosing Flaky Tests in Playwright

## Context
Flaky tests are a symptom, not a root problem.
Retries may hide failures temporarily but increase long-term uncertainty.

## Recommended approach
Senior QAs classify flakiness before fixing it:
- Timing issues (async assumptions)
- Environment instability
- Shared state between tests
- Incorrect test boundaries

The first step is always understanding *why* the test is flaky.

## Trade-offs
Strict synchronization and isolation increase reliability but may:
- Reduce execution speed
- Require better test architecture

This trade-off is usually worth it.

## Common mistakes
- Adding hard waits
- Increasing retries without investigation
- Blaming Playwright instead of test design
- Ignoring flaky tests until CI becomes unreliable

## When NOT to do this
In early prototypes, temporary flakiness may be acceptable.
In CI pipelines, flaky tests erode trust and slow teams down.
