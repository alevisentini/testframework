# Playwright CI Execution Strategy

## Context
Local test execution rarely reflects CI behavior.
Differences in resources, parallelism, and environment expose scalability issues.

## Recommended approach
Senior QAs design CI execution intentionally:
- Parallelize by test file or project
- Use sharding for large suites
- Prefer headless execution
- Collect artifacts for failed tests

CI should provide fast, deterministic feedback.

## Trade-offs
Aggressive parallelization may:
- Increase infrastructure cost
- Expose hidden shared-state issues

These issues should be fixed, not avoided.

## Common mistakes
- Running the full suite on every commit
- Ignoring CI-specific failures
- Treating CI as a slower local machine
- Not analyzing execution time trends

## When NOT to do this
For very small projects, advanced CI strategies may be unnecessary.
As soon as execution time grows, intentional design becomes critical.
