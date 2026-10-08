# Raw export vs. committed specs

Source: `export_to_playwright(test_case_ids=[31979, 31980])`, run 2026-10-08 against the
`errorsquad` QA tenant. The ContextQA cases were fully typed at export time (no AI steps,
no AI verifications). The raw export still could not run unattended.

| # | Defect in raw export | Effect | Fix in committed spec |
|---|----------------------|--------|-----------------------|
| 1 | `*\|login_url\|`, `*\|hr_admin_username\|` etc. emitted as literal strings in `goto()` / `fill()` | First line navigates to an invalid URL; every test fails | `BASE_URL` + paths; `process.env.HR_*` |
| 2 | `verifyCurrentURL` exported as UNSUPPORTED → blocking `aiAgent` checkpoint | Hangs locally, throws in CI | `expect(page).toHaveURL(...)` |
| 3 | `verifyElementVisible` exported as UNSUPPORTED | same | `toBeVisible()` |
| 4 | `verifyElementIsNotVisible` exported as UNSUPPORTED | same — and these carry the "no authenticated page" clause | `toHaveCount(0)` |
| 5 | `verifyTextAbsent` exported as UNSUPPORTED | same | `getByText(...).toHaveCount(0)` |
| 6 | `credentials.env` exported with blank `URL/USERNAME/PASSWORD`; env params not mapped | No way to supply data without editing code | `.env.example` + CI secrets |
| 7 | Locators use legacy `text=` / CSS chains (`button >> text=Login`, `div > input[...]`) | Brittle; not the house style | Role/placeholder locators |

Blocking checkpoints in raw export: **3 of 12 steps (HR-LOGIN-001), 6 of 13 (HR-LOGIN-002)**.
The only verification the exporter turns into real Playwright today is `verifyTextContains`.

Implication: with the current exporter, *hardening* a ContextQA case (replacing AI
verifications with typed checks) makes the export *less* runnable. Exporter support for
items 1–6 is the milestone for a zero-edit export.

## Platform findings while hardening the ContextQA cases (not export issues)

- **`verifyCurrentURL` is an exact full-URL match.** The AI→typed converter wrote it with a
  relative path, which only "passed" while AI-evaluated. Fixed by using `*|login_url|` /
  `*|dashboard_url|`. The Playwright specs use an anchored regex, which is equivalent.
- **`verifyElementIsNotVisible` (action 548) fails when the element is absent.** Run 131432
  reported "element not found in both image and HTML" yet marked the step failed after ~150s of
  healing. Steps 274265/274270 were switched to `verifyTextAbsent` ("Dashboard", "PIM"). The
  Playwright specs keep the stricter element checks (`heading` / `.oxd-sidepanel` count 0).
