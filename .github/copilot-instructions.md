# Kids Learning Hub — Copilot Instructions

## Project Overview
Kids Learning Hub is a React + TypeScript application that provides interactive educational activities for children. It offers math exercises, memory/space-defender games, and reading comprehension exercises, each accessible through a timed learning session.

## Repository Layout
```
kids-learning-hub/   # React app (Create React App, TypeScript, MUI v7, React Router v7, Zustand)
  src/
    App.tsx                         # Routes: /, /timer/*, /space-defender
    components/
      Home.tsx                      # Landing page: name input, time selector, session start
      ActivityTimer.tsx             # Countdown timer shared across all activity pages
      activities/
        MathActivity.tsx            # Basic math, measurements, and time problems
        GameActivity.tsx            # Memory Match + Space Defender launcher
        ReadingActivity.tsx         # Story reader with multiple-choice questions
        _games/spaceDefender/       # Canvas-based Space Invaders game
MCP/                                # MCP server exposing learning-hub skills to agents
popup.*  /  styles.css / manifest.json  # Browser-extension files (Daily Focus Tasks)
fish-jump/                          # Separate Phaser-based fish-jump game
```

## Technology Stack
- **Frontend:** React 19, TypeScript 4, Material-UI v7
- **Routing:** React Router v7 (`BrowserRouter`)
- **State:** React `useState`/`useEffect`; Zustand for complex state
- **Testing:** Jest + React Testing Library (run with `npm test` inside `kids-learning-hub/`)
- **Build:** `react-scripts` (CRA); deploy target is Vercel

## Coding Conventions
- Functional components with hooks only — no class components
- All new components go under `src/components/`; games go in `src/components/activities/_games/`
- Use MUI `Box`, `Container`, `Paper`, `Typography`, `Button`, `TextField` rather than plain HTML where possible
- Theme colours: primary `#4CAF50`, secondary `#FF9800`, background `#f0f7ff`
- Font family: `"Comic Sans MS", "Comic Sans", cursive` (matches the kids theme)
- Unit tests live next to the component they test in a `__tests__/` sub-directory

## Agent Skills (MCP)
This repository ships an MCP server at `MCP/server.js` that exposes the following tools for Copilot agents:

| Tool | Description |
|---|---|
| `get_math_problem` | Generate a random math problem (basic / measurement / time) |
| `get_reading_story` | Retrieve a reading story with comprehension questions |
| `get_activity_list` | List all available learning activities |

See `MCP/README.md` for setup and usage instructions.
