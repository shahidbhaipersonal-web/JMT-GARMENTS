# Security Checklist — JMT Wholesale (future development)

Follow this on EVERY change. See audit report in chat for rationale.

## Auth & sessions
- [ ] New admin APIs use `requireAdmin()` (DB-verified), never `getAdmin()` alone.
- [ ] New admin mutations also check `sameOrigin(req)` + role where needed.
- [ ] New admin pages add `if (!(await requireAdmin())) redirect("/admin/login")`.
- [ ] Cookie stays `__Host-` prefixed in prod (Secure + Path=/ + no Domain).
- [ ] JWT payload = id/email/role only. Expiry ≤ 12h.

## Input & output
- [ ] Every POST body goes through `readJson(req)` (100KB cap) or zod schema.
- [ ] Numbers clamped to sane ranges; strings length-capped; arrays length-capped.
- [ ] No `dangerouslySetInnerHTML`. No `eval`. No raw SQL (`queryRaw/executeRaw`).
- [ ] Secrets/floor prices NEVER in API responses. Check new fields twice.

## Logging
- [ ] Log logins (ok + failed), password changes, privilege/config changes via `logSecurity`/auditLog.
- [ ] NEVER log passwords, OTPs, tokens, or full user input dumps.

## Headers & config
- [ ] Keep CSP/HSTS in `next.config.mjs`. Test pages after adding external scripts.
- [ ] `poweredByHeader: false` stays. Debug off in prod. Generic error messages.

## Deps & deploy
- [ ] `npm audit` clean (no critical/high) before every release.
- [ ] `.env` never committed. New secrets go to `.env.example` as EMPTY placeholders.
- [ ] Vercel env vars updated when adding new `process.env.*` usage.

## Manual (platform) controls — review quarterly
- [ ] Cloudflare (or Vercel Firewall) in front: WAF + DDoS + Turnstile CAPTCHA on enquiry/bargain forms.
- [ ] Redis-backed rate limiting (Upstash) — in-memory limiter does NOT work across serverless instances.
- [ ] Neon: least-privilege DB role for the app, IP allow-list if available, backups on.
- [ ] Rotate AUTH_SECRET + API keys yearly (or after any leak). Previous chat contains old secrets — rotate if shared.
- [ ] Yearly pen-test; Dependabot/Snyk alerts ON for the GitHub repo.
