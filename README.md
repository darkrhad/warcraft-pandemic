# Wrath of the Lich King (web)

An online, cooperative web version of *World of Warcraft: Wrath of the Lich King – A Pandemic System Board Game*
(Z-Man Games), for 1–5 players on their own devices. A fan learning project built with the method of
[clank-demo](https://github.com/darkrhad/clank). Not affiliated with Blizzard or Z-Man Games.

## Status

Steps 1–2 of 9 are done: the rules are written down and every component exists as a type.
No game code yet. Next: content (needs photos of the components) and the rules engine.
See the step list in [docs/METHOD.md](docs/METHOD.md).

## Where to start

| Read | For |
|---|---|
| [CLAUDE.md](CLAUDE.md) | decisions and rules for changes (also read by Claude Code) |
| [docs/METHOD.md](docs/METHOD.md) | how the code is built, the steps and their status |
| [docs/RULES.md](docs/RULES.md) | the complete rules, with rulebook pages |
| [docs/CONTENT.md](docs/CONTENT.md) | board, heroes, quests, cards: known and missing |
| [docs/ONLINE.md](docs/ONLINE.md) | online multiplayer design |
| [docs/ANALYSIS.md](docs/ANALYSIS.md) | complexity compared to clank-demo |
| `src/engine/types.ts`, `src/engine/constants.ts` | the game state, moves and numbers from the rulebook |

## How it will be organized

| Folder | What | Depends on React? |
|---|---|---|
| `src/engine/` | The rules: game state, content, `applyMove(state, { by, move })` | no |
| `src/net/` | Online: Firestore lobby, WebRTC, host runs the engine | no |
| `src/ui/` | Screens: board, hero panels, quest sheets, prompts | yes |
| `assets/` | Local only, never pushed: the rulebook PDF and photos of the components | |

## Deploy (Vercel)

Project: [darkowoodpeckers-projects/warcraft-pandemic](https://vercel.com/darkowoodpeckers-projects/warcraft-pandemic),
connected to this repo: every push to `main` deploys, every pull request gets a preview link.
There is no app yet, so the site shows a 404 until the Vite app exists. When it's added, copy `vercel.json` from
clank-demo (`framework: vite`, `npm ci`, `npm run build`, output `dist/`).

## Not in this repo

The rulebook PDF and photos of the real components stay in `assets/` (git-ignored). Ask the project owner for them,
or work from docs/RULES.md and docs/CONTENT.md.

## Differences from the real game

- None decided yet. Every guess is marked `'assumed'` in the data and listed in docs/CONTENT.md.
