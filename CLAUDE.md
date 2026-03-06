# Project Instructions for Claude

## Source of Truth
Use `requirement/*.md` as the authoritative specification. Implement those requirements exactly and avoid adding unrequested features.

## Project Overview
This project is a **Node.js GalGame generator** and **runtime**. The generator outputs a ZIP containing HTML and images, while the runtime runs the generated game and manages progress data.

## Tech Stack
- Frontend: **HTML** (user-facing interaction kept in `main.html`)
- Backend: **JavaScript on Node.js**

## Frontend Style
- Apply **Material You** design.
- Allow user-controlled theme color.
- Provide light/dark mode switching.

## Architecture Rules
- Place all source code under `src/`.
- Keep frontend and backend concerns separated in the codebase.

## Output Contract
Honor the ZIP structure, LICENSE/README requirements, image grouping, and progress ZIP rules described in `requirement/*.md`.
