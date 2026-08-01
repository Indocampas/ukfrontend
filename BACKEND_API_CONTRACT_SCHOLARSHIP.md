# Scholarship Management — required backend endpoints

The frontend is fully built (admin side + student side) and calling these
endpoints against `VITE_API_BASE_URL`. None of it is live until your Spring
Boot backend implements them. This is the biggest lift in the whole request —
please read the "Design decisions" section at the bottom, since a few things
had to be decided that weren't fully specified.

## Student identity (separate from admin login)

Students authenticate with Google, email+OTP, or phone+OTP — never a
password. All three end in the same shape of response so the frontend
doesn't care which method was used:

```json
{ "token": "jwt-or-opaque-token", "student": { "id": "s1", "name": "...", "email": "...", "phone": "..." } }
```

| Method | Path | Body | Notes |
|---|---|---|---|
| GET  | `/api/scholarship/auth/me` | – (Bearer token) | Validates an existing student session |
| POST | `/api/scholarship/auth/google` | `{ "idToken": "..." }` | `idToken` is a Google Identity Services JWT from the frontend button. Backend verifies it with Google's tokeninfo endpoint or a Google API client library, extracts email/name, creates the student if new |
| POST | `/api/scholarship/auth/email/otp` | `{ "email": "..." }` | Sends a one-time code to that email (needs an email provider — SES, SendGrid, etc.) |
| POST | `/api/scholarship/auth/email/verify` | `{ "email": "...", "otp": "..." }` | Returns token+student on success |
| POST | `/api/scholarship/auth/phone/otp` | `{ "phone": "..." }` | Sends an SMS code (needs an SMS provider — Twilio, MSG91, etc.) |
| POST | `/api/scholarship/auth/phone/verify` | `{ "phone": "...", "otp": "..." }` | Returns token+student on success |

**Google requires `VITE_GOOGLE_CLIENT_ID`** in the frontend's `.env` (a
Google Cloud OAuth Client ID, "Web application" type) — without it, the UI
shows Email/Phone OTP only and tells the student Google isn't configured yet.

## Exam object shape

```json
{
  "id": "e1",
  "title": "NEET Scholarship Test 2026",
  "categorySlug": "neet",
  "examDate": "2026-08-15",
  "examTime": "10:00",
  "durationMinutes": 90,
  "description": "...",
  "registrationOpen": true,
  "questionPaperUrl": "https://.../paper.pdf",
  "answerKeyUrl": "https://.../key.pdf",
  "resultsPublished": false
}
```

## Admin endpoints (require admin Bearer token, same as Gallery/Courses)

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/api/scholarship/exams` | – | Public — list all exams |
| POST | `/api/scholarship/exams` | Exam object (no id) | Create/schedule |
| PUT | `/api/scholarship/exams/{id}` | Partial exam object | Edit any field |
| DELETE | `/api/scholarship/exams/{id}` | – | Also should cascade-delete registrations |
| GET | `/api/scholarship/exams/{id}/students` | – | Returns `[{ id, name, email, phone, score, isWinner, submitted }]` |
| POST | `/api/scholarship/exams/{id}/question-paper` | multipart, field `file` | Store the file, return updated exam with `questionPaperUrl` set |
| POST | `/api/scholarship/exams/{id}/answer-key` | multipart, field `file` | Same, sets `answerKeyUrl` |
| POST | `/api/scholarship/exams/{id}/publish-results` | – | Sets `resultsPublished: true`; from this point students can see their score |
| PUT | `/api/scholarship/exams/{id}/students/{studentId}` | `{ "score": 85 }` or `{ "isWinner": true }` | Admin sets score / toggles winner per student |

## Student endpoints (require student Bearer token from the auth endpoints above)

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/scholarship/exams/{id}/register` | `{}` (student identified via token) | Registers the signed-in student for this exam |
| GET | `/api/scholarship/my-registrations` | – | Returns `[{ id, exam: {...exam fields}, submitted, score, isWinner }]` — the frontend expects the exam embedded per registration |
| GET | `/api/scholarship/exams/{id}/question-paper` | – | **Must return 403** unless (a) this student is registered for this exam AND (b) current server time is within `[examDate+examTime, +durationMinutes]`. Returns `{ "url": "..." }` on success |
| POST | `/api/scholarship/exams/{id}/submit` | multipart, field `file` | Student's answer sheet upload. Should also be time-gated to the exam window |
| GET | `/api/scholarship/exams/{id}/my-result` | – | Returns this student's score/winner status once published |

## Design decisions made (not fully specified in the original request)

1. **Exam format = paper-based, done online.** The request describes
   "upload question paper," "upload answer key," "upload results" and "view
   scores" — the pattern of a traditional written exam administered
   digitally, not an in-browser MCQ engine with auto-grading. So the student
   flow is: view/download the question paper during the exam window, then
   upload a scanned/photographed answer sheet; the admin manually enters
   scores afterward. If you actually want a live, auto-graded MCQ exam
   experience instead, that's a materially different (and larger) build —
   let me know and I'll redo this part.
2. **Time-gating must be enforced server-side**, not just hidden in the UI.
   The frontend checks the exam window to decide what to *show*, but the
   `/question-paper` and `/submit` endpoints must independently re-check
   registration + timing before releasing the file — otherwise a student
   could just call the API directly before the exam starts.
3. **"Winners" is a manual admin toggle per student**, not an automatic
   top-N calculation, since the request didn't specify a cutoff rule (score
   threshold vs. rank vs. category-wise winners). Easy to automate later once
   you tell me the rule.
