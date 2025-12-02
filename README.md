# QA Automation Portfolio — Playwright + TypeScript + API + Performance

This repository contains a complete **QA Automation Framework** built with **Playwright (TypeScript)**.  
It demonstrates real-world testing practices including UI testing, API testing, performance testing (Artillery & JMeter), environment configurations, fixtures, POM architecture, and CI/CD pipelines using GitHub Actions.

---

## 🚀 Technologies & Tools

- **QA Automation**
  - Playwright (UI + API)
  - TypeScript
  - Page Object Model (POM)
  - Custom Playwright Fixtures
  - Environment-specific configuration files

- **Performance Testing**
  - Artillery (YAML-based load scenarios)
  - Apache JMeter (.jmx test plans)

- **CI/CD**
  - GitHub Actions workflows

---

## 📂 Project Structure

<img width="192" height="794" alt="image" src="https://github.com/user-attachments/assets/1b163ce6-3787-4216-a2d1-9fc2a463e7cf" />


## 🧩 Design Decisions

1. **Modular Framework Architecture**  
   The project is separated into UI tests, API tests, fixtures, helpers, page objects, performance tests, and environment configs. This ensures scalability, maintainability, and clarity.

2. **Page Object Model (POM)**  
   All UI logic is abstracted behind Page Objects to produce clean, readable, reusable test cases.
   - Examples: `login.page.ts`, `dashboard.page.ts`, `base.page.ts`

3. **Custom Fixtures**  
   Fixtures provide clean test setup/teardown and shared utilities such as:
   - Typed API client
   - Context and page initialization
   - Environment injection
   - Authentication helpers  
   This keeps test files minimal and easy to understand.

4. **Environment-Specific Configs**  
   Located under `/config` for `dev`, `qa`, and `prod`.  
   Load them via CLI when required:
   ```bash
   npx playwright test --config=config/qa.config.ts

5. **Integrated API Testing**  
   API tests use:
    - Playwright’s built-in APIRequestContext
    - A small typed API client wrapper
    - Dedicated fixtures and helpers
    - Optional mocking utilities
        Example included: src/api/tests/users.spec.ts   

6. **Performance Testing Included**  
    The framework includes performance tests to showcase load testing skills.
    JMeter
    - .jmx test plans included in performance/jmeter/
    - Dataset folder and run instructions
    - Editors may show the informational warning: “No grammar constraints (DTD or XML Schema)” — this is expected and harmless.
    
    Artillery
    - YAML load-test scenarios in performance/artillery/
    - CLI-ready commands and scenarios

7. **CI/CD with GitHub Actions**   
    The framework includes performance tests to showcase load testing skills     
    Workflows included:
    - ui-tests.yml — Playwright UI tests
    - api-tests.yml — API test pipeline
    - performance.yml — Artillery/JMeter load tests

    Each workflow supports:
    - HTML report artifacts
    - Pull request integration
    - Matrix runs and parallel execution  

## ▶️ How to Run the Project

Install dependencies
```bash
npm install
```

Run all tests (UI + API)
```bash
npx playwright test
```

Run UI tests only
```bash
npx playwright test src/ui/tests
```

Run API tests only
```bash
npx playwright test src/api/tests
```

Run tests with a specific environment
```bash
npx playwright test --config=config/qa.config.ts
```

Run Artillery load tests
```bash
npx artillery run performance/artillery/load-test.yml
```

Run JMeter plans (JMeter must be installed or run via container)
```bash
jmeter -n -t performance/jmeter/login.jmx -l performance/jmeter/results.jtl    
```

## 📌 Notes

- Meter .jmx files are XML and editors may show the warning:
“No grammar constraints (DTD or XML Schema)”. This is informational only and does not affect execution.

- Playwright reports are generated inside playwright-report/ after test runs (if configured in playwright.config.ts).

- Use Node.js >= 16 (recommended 18) when running TypeScript-based fixtures and tests. If necessary, use ts-node for running TypeScript scripts directly.

## 📘 Purpose of This Repository

This project serves as a QA Engineer portfolio, demonstrating skills in:

- Automation framework design

- UI testing with Playwright

- API automation architecture

- Performance testing (Artillery & JMeter)

- CI/CD integration and reporting

- Engineering judgement and QA strategy
