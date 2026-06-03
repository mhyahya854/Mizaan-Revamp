# Mizaan Red-Flag Scan Rules

These rules define how automated scans should be interpreted. They do not replace code review.

## localStorage

Allowed contexts:

- Browser prototype provider.
- Theme or session preferences.
- Right-panel or UI state.
- Tests that prove browser persistence behavior.
- Documentation that clearly labels localStorage as prototype storage.

Not allowed:

- Claims that localStorage is final lifetime storage.
- Destructive clearing of user data.

## Cloud, Auth, Backend, And Payments

Forbidden in runtime code unless a future phase explicitly changes the product law:

- Google, Drive, OAuth, Firebase, Supabase, Clerk.
- Auth systems.
- Cloud sync.
- Bank integrations.
- Plaid, Stripe, PayPal, Wise.
- Backend sync services.

Docs may mention these only as non-goals, future exclusions, or risks.

## Fake Native Readiness

Forbidden claims in runtime code and docs:

- `portable vault ready`
- `SQLite ready`
- `Tauri ready`
- `folder picker ready`
- `USB vault ready`
- `native backup ready`
- `SQLite backup ready`

Allowed wording:

- Future native work.
- Not implemented.
- Planning only.

## Fake Import And Export

Do not add controls that imply real file import, native folder import, Markdown export, CSV export, PDF export, native backup, or encrypted backup unless the behavior is genuinely implemented and tested.

Disabled controls are acceptable only when they are visibly labeled as future, unsupported, or unavailable.

## Console And Debugger

Runtime source must not contain:

- `console.log`
- `debugger`

Test output helpers and scripts may print summaries through PowerShell or Node process output. They must not add browser runtime debug statements.

## Runtime URLs And Fonts

Runtime source must not silently load external URLs, Google Fonts, or remote assets unless the phase explicitly approves it and the PRD/Blueprint are updated.

## Placeholder Text

Placeholder text is not automatically fake UI. It becomes a red flag when it represents an action or completed feature that is not implemented.

## Generated Route Casts

Generated route casts may include `any` where the router generator requires it. Treat these as generated-code exceptions, not product shortcuts.

## Privacy And Encryption Honesty

Current private and sensitive flags are metadata only unless code proves otherwise. Do not claim encryption, app lock, hidden search behavior, or hidden graph behavior until those systems are implemented and tested.
