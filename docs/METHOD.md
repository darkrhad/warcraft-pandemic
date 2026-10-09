# Method: from rulebook to game

The same method as clank-demo (`github.com/darkrhad/clank`, its `PLAYBOOK.md` explains every idea with
code you can read). Short version, applied to this game.

## The rules of the code

1. **Two halves that never mix.** `src/engine/` = the rules, no React, no DOM, no network.
   `src/ui/` = what you see and click. `src/net/` = online play (docs/ONLINE.md). If the rulebook says it,
   it goes in `engine/`.
2. **The state is plain data.** One `GameState` object (`src/engine/types.ts`), no classes, no functions inside.
   Saving = `JSON.stringify`. Sending over the network works the same way.
3. **Content is data.** Board, heroes, quests, cards and rewards are tables. Each value has a `source`
   (`'rulebook'`, `'picture'`, `'photo'`, `'assumed'`) so it's clear what still has to be checked (docs/CONTENT.md).
4. **One entry point:** `applyMove(state, { by, move })` returns the new state or throws a `RuleError` with a message
   written for players (it's shown as a toast). It uses Immer's `produce`: a move happens completely or not at all.
5. **Compute, don't store.** Anything that follows from other facts is a function: `moveOptions(state)`,
   `waitingFor(state)`, `canEndActions(state)`, `lichKingBonus(state)`. The UI calls the same functions.
6. **Choices are state.** A choice or a reaction window is `state.pending`; nothing else may happen until it's answered.
7. **Seeded randomness.** Dice and shuffles use `state.seed` (copy `rng.ts` from clank-demo). Never `Math.random()` in the engine.
8. **Every rule has a test.** Helpers like clank-demo's `game()`, `withHand()`, `edit()`, `expectRule()`.
   docs/RULES.md is written so each bullet can become one test.
9. **Bots playing whole games.** Random legal moves, 50+ games, invariants checked after every move. No AI opponents
   are needed (cooperative), but these test bots are.
10. **Check the evidence before fixing.** Read `state.log` before guessing why something went wrong.

## Steps

| # | Step | Output | Status |
|---|---|---|---|
| 1 | Read the rulebook, text and pictures | docs/RULES.md | ✅ 2026-10-09 |
| 2 | List the components | `src/engine/types.ts`, `constants.ts` | ✅ 2026-10-09 |
| 3 | Digitize the content | `map.ts`, `heroes.ts`, `quests.ts`, `cards.ts`, `rewards.ts` | ⏳ needs photos (docs/CONTENT.md) |
| 4 | Write down the unknowns | `source: 'assumed'`, docs/CONTENT.md, README "Differences" | ⏳ ongoing |
| 5 | Rules engine, one move at a time, with tests | `engine.ts`, `setup.ts`, `engine.test.ts` | ⬜ can start before the photos, with assumed content |
| 6 | Bots and invariants | `simulation.test.ts` | ⬜ |
| 7 | Screens (hot-seat on one screen first) | `src/ui/` | ⬜ |
| 8 | Online | `src/net/` (docs/ONLINE.md) | ⬜ |
| 9 | Play it to the end, in real browsers | | ⬜ |

**Order matters:** online comes after the game works on one screen. Because the engine is pure, the online layer only
carries `{ move }` and `{ state }`, and the screens don't change.

## Suggested engine order (step 5)

1. `setup.ts`: `createGame(players, heroes, difficulty, seed)`: hero deck piles, setup spawn, starting hands.
2. Move, Rest, Flight Path, Travel and Heal cards (no dice choices).
3. Dice + Fight with `assignHits`, enemy damage, blocks.
4. Damage windows: Defend cards from heroes on the space, defeat (despair +2, back to start).
5. Quest with contributions from other heroes, quest damage, completing a quest, rewards to hand.
6. End of actions: draw 2, Stronghold, The Scourge Rises, hand limit.
7. Spawn ghouls, overruns, running out of components.
8. Abominations: BFS toward the nearest hero, ties as `pending`, simultaneous damage.
9. Lich King bonus, Icecrown opening, win/lose.
10. Hero abilities and quest effects, one test each.
11. Reward cards (playable on any turn, not while a card is resolving).

## Expected test invariants

- ghouls on the board + supply = 36; abominations ≤ 3; strongholds ≤ 3
- at most 3 ghouls per space; never a ghoul or abomination on a closed Icecrown
- 0 ≤ health ≤ max; every hand ≤ 7 when no `discardToLimit` is pending
- hero cards: deck + discard + hands + removed = 63
- despair and Scourge marker only move forward; `result` set ⇒ no more moves accepted
