# CodeGuard — Angular Security Scanner Dashboard

A personal frontend project built with Angular and TypeScript. CodeGuard is a browser-based prototype that lets a user inspect a source-code snippet and view potential security issues in a dashboard.

> **Important:** This is an educational frontend prototype. Its checks are illustrative regular-expression pattern matches, not static analysis, dynamic analysis, or a production-grade security scanner. A pattern match is not proof of a vulnerability, and the absence of a match does not prove that code is secure.

## Features

- Responsive security-analysis dashboard
- Editable source-code input and local text-file import
- Rule-based demonstration checks for common risky patterns
- Severity classification: Critical, High, Medium, Low
- Filterable findings with code snippets and remediation guidance
- Latest scan summary and a short in-memory scan history
- Local processing: source code is not sent to a server

## Tech stack

- Angular 20 (standalone components)
- TypeScript
- HTML and CSS
- Angular Forms

## Requirements

- Node.js 20.19.0+ or 22.12.0+ (LTS recommended)
- npm (included with Node.js)
- Git (for version control)

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200` in your browser.

Create a production build:

```bash
npm run build
```

## Project structure

```text
src/
  app/
    models/finding.model.ts
    services/scanner.service.ts
    app.component.ts
    app.component.html
    app.component.css
  main.ts
  index.html
  styles.css
```

## Example checks

The demo currently looks for illustrative patterns such as:

- SQL query strings that appear to be concatenated with variables
- Hardcoded password or secret-like values
- Calls to `eval()`
- Direct assignment to `innerHTML`
- Disabled TLS certificate validation
- Use of MD5 or SHA-1

These patterns are intentionally simplified for demonstrating frontend interactions and TypeScript organization. They can produce false positives and false negatives.

## Possible next improvements

- Add unit tests for each detection rule and UI state
- Move scan history to browser storage
- Add pagination and search for findings
- Add a real backend scanner integration (with clear consent and safe file handling)
- Add accessibility checks and end-to-end tests

## License

This project is provided for learning and portfolio purposes. Add a license file if you want to define reuse permissions.
