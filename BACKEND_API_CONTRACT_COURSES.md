# Course Management — required backend endpoints

The frontend (`src/context/CourseContext.jsx`) is already wired to call these
against your Spring Boot backend at `VITE_API_BASE_URL` (defaults to
`https://ukacademy.onrender.com`), the same base URL Gallery already uses. Auth
follows the same pattern as Gallery: `Authorization: Bearer <token>` from the
existing `/api/auth/login` token, sent on every write.

## Course object shape

```json
{
  "id": "c123",
  "name": "NEET 2-Year Classroom Program",
  "categorySlug": "neet",          // "neet" | "jee" | "foundation" | "pre-foundation"
  "courseType": "classroom",       // "classroom" | "online" | "recorded" | "test-series" | "study-materials"
  "classGrade": "Class 11–12",
  "description": "...",
  "price": 45000,
  "duration": "2 Years",
  "features": ["Live Doubt Solving", "Weekly Tests"],
  "status": "Active",              // "Active" | "Inactive"
  "image": "data:image/png;base64,...",   // classroom / test-series / study-materials
  "video": "https://.../intro.mp4"        // online / recorded only
}
```

## Endpoints

| Method | Path                          | Body                                  | Notes |
|--------|-------------------------------|----------------------------------------|-------|
| GET    | `/api/courses`                | –                                      | Public — powers the admin list; can later power public course pages too |
| POST   | `/api/courses`                | Course object (no `id`)                | Returns created course with `id` |
| PUT    | `/api/courses/{id}`           | Partial course object                  | Any subset of fields (name, price, status, description, features, classGrade, duration, categorySlug, courseType) |
| DELETE | `/api/courses/{id}`           | –                                      | 200 or 204 |
| PUT    | `/api/courses/{id}/image`     | `{ "image": "data:image/...;base64,.." }` | Same pattern as `/api/gallery/{id}/image` — fine for images since they're small |
| POST   | `/api/courses/{id}/video`     | `multipart/form-data`, field name `video` | **Not** base64 — video files are too large for JSON. Backend should store the file (disk/S3/CDN) and return the updated course with `video` set to a playable URL |

All write endpoints require `Authorization: Bearer <token>` (same admin token
Gallery already validates via `/api/auth/me`).

## Why video isn't base64 like images

Gallery images are small enough to round-trip as base64 JSON. Real course
videos won't be — a multipart upload endpoint is required, or admins can
paste an existing hosted/CDN/YouTube URL directly (the UI already supports
both).

## Note on the public-facing pages

Today, `/all-courses`, `/courses/*`, and each category's Online/Recorded/Test
Series pages render from **static, hardcoded data** (`src/data/courseTree.jsx`,
`src/data/coursePlans.js` — the latter even fakes prices with a hash function).
This new admin catalog is a separate, real, backend-persisted dataset. Wiring
the public pages to read from `/api/courses` instead of the static tree is a
follow-up step — happy to do that next once this backend contract is in
place and you've confirmed the data reflects correctly in the admin.
