# External API Migration Notes

## 1. Runtime API Call Inventory

### `lib/api/*`

- `lib/api/auth.ts`
  - `GET /api/auth/me`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `PATCH /api/auth/profile`
  - `POST /api/auth/change-password`
- `lib/api/history.ts`
  - `GET /api/history`
  - `POST /api/history`
  - `DELETE /api/history?id=<id>`
  - `DELETE /api/history`
- `lib/api/feedback.ts`
  - `GET /api/feedback/comments?sort=<sort>`
  - `POST /api/feedback/comments`
  - `POST /api/feedback/comments/<id>/like`
  - `DELETE /api/feedback/comments/<id>`

### 页面 / Store 直连调用点

- `app/page.tsx` -> `GET /api/tests`
- `app/mbti/test/page.tsx` -> `GET /api/mbti/questions?mode=<mode>`
- `app/mbti/result/page.tsx` -> `GET /api/mbti/questions?mode=<mode>`
- `stores/mbti-store.ts` -> `POST /api/mbti/submit`
- `app/city-match/test/page.tsx` -> `GET /api/city-match/questions?mode=<mode>`
- `app/city-match/result/page.tsx` -> `GET /api/city-match/questions?mode=<mode>`

## 2. Unified Routing Strategy

- Base URL source: `NEXT_PUBLIC_API_BASE_URL`
- Local default: `http://localhost:3001`
- Unified client: `lib/api/client.ts`
  - URL building (`buildApiUrl`)
  - timeout control (`NEXT_PUBLIC_API_TIMEOUT_MS`)
  - normalized error extraction (`message`/`error`)
  - default `credentials: "include"` for session continuity

## 3. Response Mapping Notes

To reduce regression risk across backend implementations, the client layer treats fields as follows:

- error message fallback order: `message` -> `error` -> caller fallback
- auth module:
  - `authenticated` defaults to `false` when missing
  - `user` defaults to `null` when missing
  - `isFeedbackModerator` defaults to `false` when missing
- history module:
  - `history` defaults to `[]`
  - `deletedCount` defaults to `0` when missing
- feedback module:
  - `comments` defaults to `[]`
  - `sort` falls back to `"hot"` unless explicitly `"recent"`

## 4. CORS / Credential Checklist

Backend (`mind_mirror_api`) should allow:

- `Access-Control-Allow-Origin: <frontend-origin>`
- `Access-Control-Allow-Credentials: true`
- methods/headers for GET/POST/PATCH/DELETE with JSON

Current auth integration is token-based:

- frontend stores `accessToken` + `refreshToken`
- request header uses `Authorization: Bearer <accessToken>`
- when 401 occurs, frontend auto-calls `/api/v1/auth/refresh` with `refreshToken` and retries once

Cookie/session settings may still be relevant if backend later switches to cookie auth:

- local HTTP: avoid `Secure=true` if not on HTTPS
- production HTTPS: enable `Secure`, choose correct `SameSite` policy

Recommended backend env vars:

- `FRONTEND_ORIGIN=http://localhost:3000`
- `MIND_MIRROR_WEB_ROOT=/Users/qiexuxing/Project/mind_mirror` (optional if using non-default sibling layout)

## 5. Rollback Checklist

If production issues appear after switching to external API:

1. Set `NEXT_PUBLIC_API_BASE_URL` to an empty value or previous internal route target.
2. Redeploy frontend and run smoke checks:
   - homepage test list
   - MBTI question load and submit
   - auth login/me/logout
   - feedback list + post + like
3. Inspect browser network errors for CORS/cookie mismatches.
4. Keep `app/api/*` compatibility routes until one full stable release passes.
