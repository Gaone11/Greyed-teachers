# GreyEd — Platform Documentation

## What it is
GreyEd is an AI-powered teaching platform that helps teachers plan lessons, generate and grade assessments, manage classes, and communicate with tutors — all aligned with the Ministry of Education curriculum (CAPS, IGCSE, BGCSE, JCE).

## Who it's for
**Primary users:** Teachers in Mpumalanga, South Africa, and the broader Southern African region. The platform is currently scoped to teachers — there is no learner-facing app yet. Tutors receive updates as recipients, not as platform users.

**Admin access** (knowledge-base management, system controls) is gated to specific emails (`gaone@orionx.xyz`, `monti@orionx.xyz`, `pax@greyed.org`).

## Architecture

**Frontend** — React 18 + TypeScript, Vite, Tailwind CSS, React Router (HashRouter for GitHub Pages). Deployed as a static SPA to GitHub Pages at `gaone11.github.io/Greyed-teachers/`.

**Backend** — Supabase (Postgres + Auth) for authentication, data storage, and row-level security. Tables include `teacher_ai_conversations`, `teacher_ai_messages`, `class_students`, plus assessment, lesson plan, and tutor-update tables.

**AI layer** — El AI (the in-app assistant) is powered by Uhuru 3 LLM combined with GreyEd's proprietary eLLM (emotional LLM). Curriculum-aware lesson, assessment, and grading flows call into this layer via `lib/api.ts`.

**CI/CD** — GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the Vite app with Supabase env secrets and deploys the `dist/` artifact to GitHub Pages on every push to `main`.

## Core flows

1. **Auth** → Supabase auth issues a session; `AuthContext` and `RoleContext` hydrate the user and role across the app.
2. **Dashboard** → Teacher lands on `/teachers/dashboard`, sees real-time counts (classes, students from `class_students`, lessons, assessments) pulled from Supabase.
3. **Classes** → Create class → open class detail → manage Students, Notes, Settings tabs. Student roster is editable by name (single or bulk add).
4. **Lesson Planner** → Pick subject/grade/topic → El AI generates a CAPS-aligned lesson plan → save, edit, or export to `.docx`.
5. **Assessments** → Generate questions by topic → AI Auto-Grading uploads student work and returns scored feedback.
6. **El AI** → Conversational assistant scoped to teaching tasks. Conversations persist per teacher in Supabase and stream into the sidebar.
7. **Tutor Updates** → Weekly digest per class, previewable and sendable to tutors.
8. **Knowledge Galaxy** → Visual curriculum explorer across 9 subjects with subtopic notes, flashcards, and quizzes.

## Repo layout
- `src/pages/teachers/` — teacher-facing routes
- `src/components/teachers/` — sidebar, chat, class managers, modals
- `src/components/layout/` — public NavBar, Footer, layouts
- `src/lib/` — Supabase client, AI API wrappers
- `src/context/` — Auth, Role, Motion, RoleSelection providers
- `public/` — static assets (logo, manifest, 404 redirect for HashRouter)
