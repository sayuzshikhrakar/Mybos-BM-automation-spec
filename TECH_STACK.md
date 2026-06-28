# Tech Stack

## Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **WebdriverIO** | v8 | Test runner & automation framework |
| **Appium** | v3 | Mobile device automation server |
| **Appium uiautomator2-driver** | v7 | Android driver for Appium |
| **Mocha** | — | BDD-style test framework |
| **TypeScript** | v5 | Language (compiled via `ts-node`) |

## Reporting
- **Allure** — test reporting (`@wdio/allure-reporter` + `allure-commandline`)

## Target Application
- **Flutter** — the app under test is Flutter-based
- **Android** — automation targets physical devices & emulators

## CI/CD
- **GitHub Actions** — CI pipelines (`.github/workflows/`)

## Project Structure (`src/`)
| Directory | Purpose |
|---|---|
| `pages/` | Page Object Models |
| `tests/` | Test specs |
| `core/` | Core framework utilities |
| `data/` | Test data |
| `assertions/` | Custom assertions |
| `platform/` | Platform-specific configuration |
| `draft_tests/` | WIP / incomplete tests |
