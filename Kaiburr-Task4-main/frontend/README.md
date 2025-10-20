# Task Manager Frontend

This is a React 19 + TypeScript single-page application for the Task Manager backend. It is built with Vite and Ant Design and focuses on a fast, accessible operator experience.

## Highlights
- Task table with sort-friendly columns, quick search by name or number, and pagination
- Drawer-based task creation with inline validation mirroring backend rules
- One-click task execution with toast feedback and automatic refresh
- Timeline drawer that renders the full execution history with formatted timestamps and syntax-friendly output
- Resilient error handling surfaced via Ant Design `message` toasts

## Requirements
- Node.js 18+ (or any modern Node LTS)
- npm (bundled with Node) or yarn
- Backend API running locally on `http://localhost:8081` (Spring Boot app from Task 1)

## Getting Started
```bash
cd frontend
npm install
npm run dev
```

- The Vite dev server runs on http://localhost:3000
- API requests to `/tasks` are proxied to `http://localhost:8081` (configure in `vite.config.ts`)
- Start the Spring Boot backend and MongoDB prior to launching the UI to avoid network errors

## Accessibility & Usability
- Ant Design components with clear focus states, labels, and keyboard support
- New-task drawer keeps focus trapped while open and resets fields on submission
- Execution history uses a timeline layout with semantic headings and readable code blocks
- Informational copy guides new users on how to manage tasks effectively

## Production Build
```bash
npm run build
npm run preview   # optional: serve the production bundle locally
```

## Notes
- The backend validates command strings against shell chain operators (`;`, `&&`, `|`, `` ` ``, `&`). The UI enforces the same rule client-side.
- If you change the backend port, update `server.proxy` in `vite.config.ts` to keep the proxy aligned.
