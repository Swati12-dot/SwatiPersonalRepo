# Add OrangeHRM login tests (HR-LOGIN-001, HR-LOGIN-002)

**Branch:** `contextqa/con-4983-4984-orangehrm-login-tests`
**Linear:** [CON-4983](https://linear.app/contextqa/issue/CON-4983) · [CON-4984](https://linear.app/contextqa/issue/CON-4984)
**ContextQA test cases:** 30257, 30258 (tenant `errorsquad`, workspace "Web workspace (Live)")

Adds a two-test Playwright login suite for OrangeHRM, generated from ContextQA and
verified there before export. This is the first slice of the ContextQA → Playwright
delivery pilot: prove that generated code is portable, readable and evidence-backed
before any synchronisation is turned on.

## Acceptance criteria

```
HR-LOGIN-001
Given a valid HR admin test account
When the user signs in
Then the Dashboard is displayed
And the authenticated navigation is available

HR-LOGIN-002
Given an invalid password
When the user attempts to sign in
Then an "Invalid credentials" error is shown
And no authenticated page is accessible
```

## Verification evidence

Both cases executed on Chromium against the demo instance before export.

| TC | Test | Run | Result | Steps | Duration | Result view |
|----|------|-----|--------|-------|----------|-------------|
| 30257 | HR-LOGIN-001 | #1ec3e4 | **SUCCESS** | 1/1 | 103s | [124521](https://errorsquad.qa.contextqa.com/run-result-view?testCaseId=30257&runResultId=124521) |
| 30258 | HR-LOGIN-002 | #b4b71e | **SUCCESS** | 1/1 | 113s | [124524](https://errorsquad.qa.contextqa.com/run-result-view?testCaseId=30258&runResultId=124524) |

**Network evidence.** HR-LOGIN-001: `POST /auth/validate` → 302 → `GET /dashboard/index`
→ 200, followed by authenticated-only calls (`/pim/viewPhoto/...`, `/buzz/photo/9`).
HR-LOGIN-002: `POST /auth/validate` → 302 back to `/auth/login`; then the direct
navigation guard, `GET /dashboard/index` → 302 → `/auth/login` → 200, with no
authenticated resource fetched anywhere in the trace.

**Console.** Clean on both runs. The only entries are Chrome's verbose
`[DOM] Input elements should have autocomplete attributes` notice (1 on 30257,
3 on 30258 — once per login page load). No errors, warnings or exceptions.

Screenshots, screen recordings and Playwright traces are attached to each result view
above. Direct S3 links from the execution API are presigned and expire after roughly an
hour, so use the result views for anything shared later.

## Changes to the generated export

The raw export was not mergeable. Three fixes, all strengthening the checks:

1. **Environment tokens resolved.** `*|HR_ADMIN_USERNAME|` was emitted as a literal
   string into `.fill()`; now reads `process.env`.
2. **Assertions made blocking.** Every check exported as `aiVerify`, which is assumed
   to pass. The suite asserted nothing and could not fail on a broken login. Each is
   now a real `expect()`.
3. **`verifyCurrentURL` implemented.** Exported as UNSUPPORTED and converted to a
   manual `aiAgent` checkpoint that blocks forever in CI. Now `expect(page).toHaveURL(...)`
   — the assertion that actually proves the second clause of HR-LOGIN-002.

No acceptance criterion was altered, softened or dropped. Locators were rewritten to
role- and placeholder-based queries rather than the exported CSS chains, which are
brittle against OrangeHRM's generated class names.

## Reviewer checklist

- [ ] No credential literals anywhere in the diff (`.env` and `credentials.env` are git-ignored)
- [ ] `HR_ADMIN_USERNAME` / `HR_ADMIN_PASSWORD` / `HR_INVALID_PASSWORD` exist in the CI secret store
- [ ] Both specs pass locally: `npm test`
- [ ] Assertions match the acceptance criteria above, not a weaker version of them
- [ ] ContextQA test ids remain in the spec headers so traceability survives future edits

## Known limitations

Each ContextQA case is currently a single AI Agent step, so the platform-side verdict
reads "1/1 steps passed" and a failure would point at the whole block rather than a
named step. Splitting the cases into individual steps is tracked separately and should
land before the failure-triage demo. The demo instance is shared and resets
periodically; both tests are scoped to depend on no created records.
