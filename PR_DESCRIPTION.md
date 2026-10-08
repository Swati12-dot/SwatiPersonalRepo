# OrangeHRM login suite regenerated from fully-typed ContextQA cases (TC 31979, 31980)

**Branch:** `contextqa/orangehrm-login-31979-31980` → `main` (supersedes #1)
**ContextQA:** tenant `errorsquad`, workspace "Swati Test" (v161)
- Test cases: [31979](https://errorsquad.qa.contextqa.com/td/cases/31979/steps) (HR-LOGIN-001), [31980](https://errorsquad.qa.contextqa.com/td/cases/31980/steps) (HR-LOGIN-002)
- Suite 2243 "OrangeHRM Login" · Plan [1210](https://errorsquad.qa.contextqa.com/td/161/plans/1210/overview) "OrangeHRM Login – Chromium" · Environment 749 "QA-OrangeHRM"

## What changed vs #1
- Source cases are now **fully typed** (12 and 13 steps, zero AI steps, zero AI verifications) instead of a single AI Agent step each. A failure now names the step in both ContextQA and Playwright.
- Every `test.step` carries its ContextQA step id (e.g. `[274276] URL is the dashboard`).
- CI moved to Node 22 (clears the Node 20 deprecation warning).

## Acceptance criteria
```
HR-LOGIN-001  Given a valid HR admin test account / When the user signs in /
              Then the Dashboard is displayed / And the authenticated navigation is available
HR-LOGIN-002  Given an invalid password / When the user attempts to sign in /
              Then an "Invalid credentials" error is shown / And no authenticated page is accessible
```

## Verification evidence (ContextQA, Chromium, fully-typed steps)
| TC | Run | Result | Steps | Duration | Result view |
|----|-----|--------|-------|----------|-------------|
| 31979 | 131431 (#04b53a) | **SUCCESS** | 12/12 | 43s | [view](https://errorsquad.qa.contextqa.com/run-result-view?testCaseId=31979&runResultId=131431) |
| 31980 | 131433 (#166278) | **SUCCESS** | 13/13 | 44s | [view](https://errorsquad.qa.contextqa.com/run-result-view?testCaseId=31980&runResultId=131433) |
| Plan 1210 | execution 66818 | **SUCCESS** | 2/2 cases | 63s |  [plan](https://errorsquad.qa.contextqa.com/td/161/plans/1210/overview) |

**Network.** HR-LOGIN-001: `POST /auth/validate` → 302 → `GET /dashboard/index` 200, then
authenticated-only calls (`/api/v2/dashboard/*`, `/pim/viewPhoto/...`, `/api/v2/buzz/feed`) all 200.
HR-LOGIN-002: `POST /auth/validate` → 302 → `/auth/login`; direct `GET /dashboard/index` → **302**
→ `/auth/login`; no authenticated resource fetched in 43 requests.

**Console.** One Chrome VERBOSE autocomplete notice; no errors, warnings or exceptions.

**Failure evidence also captured (useful for the triage demo):**
- Run 131424 — HR-LOGIN-001 correctly **failed** with "Invalid credentials" while the environment held a wrong password; ContextQA named the cause.
- Plan execution 66812 — failed on `verifyCurrentURL` authored with a relative path; ContextQA RCA classified it `TEST_NEEDS_UPDATE` / not a product bug (confidence 0.95) and recommended `*|login_url|`, the fix that was applied.

## Changes to the generated export
The raw export is not runnable. All seven defects are documented in `EXPORT_NOTES.md`. No acceptance criterion was altered, softened or dropped.

## Reviewer checklist
- [ ] No credential literals in the diff (`.env`, `credentials.env` are git-ignored)
- [ ] Secrets `HR_ADMIN_USERNAME`, `HR_ADMIN_PASSWORD`, `HR_INVALID_PASSWORD` exist (already used by #1)
- [ ] CI green on this PR
- [ ] Assertions match the acceptance criteria, not a weaker version
- [ ] ContextQA test and step ids present in spec headers / step titles
