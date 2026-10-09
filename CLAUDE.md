# Working on this repo

An online, cooperative web version of *World of Warcraft: Wrath of the Lich King – A Pandemic System Board Game*,
built with the same method as clank-demo (`github.com/darkrhad/clank`). Read these first:

1. `docs/METHOD.md`: the rules of the code and the step list with its status
2. `docs/RULES.md`: the complete rules with rulebook pages, so you don't need the PDF
3. `docs/CONTENT.md`: board, heroes, quests, cards: what's known, what's missing
4. `docs/ONLINE.md`: the online design
5. `docs/ANALYSIS.md`: complexity compared to clank-demo
6. `src/engine/types.ts`, `src/engine/constants.ts`: the components as code

## Decisions

- **Online multiplayer** across devices, host browser + WebRTC + Firestore lobby (docs/ONLINE.md). No AI opponents.
- **Original World of Warcraft names** (heroes, places, quests). No Blizzard art or the rulebook PDF in git.
- Stack like clank-demo: Vite + React 18 + TypeScript, Immer, Vitest; deployed on Vercel.

## Rules for changes

- Engine code never imports React, the DOM or the network. The UI never decides what's allowed; it asks the engine.
- Every rule gets a test; every content value gets a `source`. When a value is a guess, mark it `'assumed'` and add it
  to docs/CONTENT.md.
- When a rule is unclear, write the question in docs/CONTENT.md or README "Differences" instead of inventing a rule silently.
- Update the status column in docs/METHOD.md when a step is done.
- Publisher material (rulebook PDF, photos of components) lives in `assets/`, which is git-ignored. The repo is public.
- Write docs and UI texts in plain, short English. Error messages are shown to players as toasts: write them for players.
