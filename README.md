# orangehrm-login-tests

Playwright (JavaScript) login suite for OrangeHRM, generated from ContextQA test cases
**31979** and **31980** and verified there before export.

| TC | Test | Verified run | Spec |
|----|------|--------------|------|
| 31979 | HR-LOGIN-001 — valid HR admin signs in | 131431 — SUCCESS (12/12) | `tests/hr-login-001-valid-admin-signin.spec.js` |
| 31980 | HR-LOGIN-002 — invalid password rejected | 131433 — SUCCESS (13/13) | `tests/hr-login-002-invalid-password-rejected.spec.js` |

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

Mirror ContextQA environment **QA-OrangeHRM** (id 749) in workspace "Swati Test" on the `errorsquad` QA tenant.

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Application root; defaults to the public demo instance |
| `HR_ADMIN_USERNAME` | Valid admin username |
| `HR_ADMIN_PASSWORD` | Valid admin password |
| `HR_INVALID_PASSWORD` | Deliberately wrong password for the negative test |

## Differences from the raw ContextQA export

The raw `export_to_playwright` output is not runnable. See `EXPORT_NOTES.md` for the
exact defects. Every spec step is labelled with its ContextQA step id, so the code and
the platform stay traceable one-to-one, and no acceptance criterion was weakened.
