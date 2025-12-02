# QA Framework and API Tests
This repository contains a Quality Assurance (QA) testing framework for APIs, along with testing examples and CI/CD configurations.

### Technologies and Tools Used
Testing Framework: Playwright.
CI/CD Tools: GitHub Actions.
API Testing: Playwright.

### Design Decisions
Project Structure: The project is divided into two main parts:
tests: The core framework, including configurations and reusable functions.
api-tests: Contains the actual API tests and example data.

### How to Run the Project
Clone the repository.
Install dependencies with npm install.
Execute the tests with npm test.
To integrate with CI/CD, configure the GitHub Actions workflows.

# Design Decisions:
Modular Framework: The modular structure allows for the reuse of configuration functions and utilities across all tests. This approach facilitates project scalability.

API Mocking: For API tests, a mocking system has been implemented to avoid dependencies on external services during test execution.

Integrated CI/CD: With GitHub Actions, tests are run automatically on every commit, ensuring that any errors are identified quickly.