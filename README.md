# orangehrm-login-tests

Playwright (JavaScript) login suite for OrangeHRM, generated from ContextQA test cases
**30257** and **30258** and verified there before export.

| TC | Test | Linear | Verified run | Spec |
|----|------|--------|--------------|------|
| 30257 | HR-LOGIN-001 — valid HR admin signs in | [CON-4983](https://linear.app/contextqa/issue/CON-4983) | 124521 — SUCCESS | `tests/hr-login-001-valid-admin-signin.spec.js` |
| 30258 | HR-LOGIN-002 — invalid password rejected | [CON-4984](https://linear.app/contextqa/issue/CON-4984) | 124524 — SUCCESS | `tests/hr-login-002-invalid-password-rejected.spec.js` |

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env     # fill in HR_ADMIN_USERNAME / HR_ADMIN_PASSWORD
npm test
```

`playwright.config.js` fails fast if any required variable is missing, so a
misconfigured run stops immediately instead of producing a confusing timeout.

In CI, inject the variables from the secret store rather than committing a `.env`.
`.env` and `credentials.env` are both git-ignored.

## Environment variables

Mirror ContextQA environment **QA-OrangeHRM** (id 676) on the `errorsquad` QA tenant.

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Application root; defaults to the public demo instance |
| `HR_ADMIN_USERNAME` | Valid admin username |
| `HR_ADMIN_PASSWORD` | Valid admin password |
| `HR_INVALID_PASSWORD` | Deliberately wrong password for the negative test |

## Differences from the raw ContextQA export

The generated export was not mergeable as-is. Three things were changed, all of them
strengthening rather than weakening the checks:

1. **Environment tokens resolved.** The export emitted `*|HR_ADMIN_USERNAME|` as a
   literal string into `.fill()`. These now read `process.env`.
2. **Assertions made blocking.** Every check came back as `aiVerify`, which logs a
   banner and is assumed to pass. A suite of non-blocking assertions cannot fail on a
   broken login, so each one is now a real `expect()`.
3. **`verifyCurrentURL` implemented.** The export marked it UNSUPPORTED and turned it
   into a manual `aiAgent` checkpoint that blocks forever in CI. It is now
   `expect(page).toHaveURL(...)`, which is the assertion that actually proves the
   "no authenticated page is accessible" clause.

No acceptance criterion was altered, softened, or dropped. Locators were rewritten to
role- and placeholder-based queries instead of the exported CSS chains, which are
brittle against OrangeHRM's generated class names.
