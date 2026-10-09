# Online multiplayer

**Decision (2026-10-09):** online, across devices. No AI players (cooperative game).
**Proposed design:** the same approach as dice_king (`github.com/darkrhad/diceking`, `src/firestore/`):
the **host's browser runs the game**, guests connect over **WebRTC**, and **Firestore** is only used to find each other.
Nothing to run or pay for besides Firebase's free tier and the static Vercel site.

## Why this is easier than in Clank!

- **No hidden information:** hands are faceup, so every player may see the whole `GameState`. The host just sends it all.
- **The engine is pure and seeded:** `applyMove(state, action)` gives the same result everywhere. Dice and shuffles come
  from `state.seed`, never `Math.random()`.

## How it works

```
 guest browser                 host browser                          guest browser
 ┌───────────┐  {move}         ┌────────────────────────────┐ {state}  ┌───────────┐
 │ UI        │ ──────────────► │ seat = who this channel is │ ───────► │ UI        │
 │ (render)  │                 │ applyMove(state,           │          │ (render)  │
 │           │ ◄────────────── │   { by: seat, move })      │ ───────► │           │
 └───────────┘  {state, ver}   │ or RuleError → that guest  │          └───────────┘
                               └────────────────────────────┘
```

1. **Lobby:** the host creates a room in Firestore (`rooms/{roomId}`), guests join with the room id/link and pick a hero.
2. **Connect:** WebRTC signaling through Firestore (offers, answers, ICE candidates), TURN servers when a direct
   connection fails. Copy this part from dice_king (`signalingConfig.ts`, `deleteRoom.ts`, TTL cleanup with `expireAt`).
3. **Play:** a guest sends only `{ move }`. The host knows which seat each data channel belongs to and builds
   `{ by: seat, move }` itself, so nobody can act as another player. The host applies it and sends
   `{ state, version }` to everyone. A `RuleError` goes back only to the sender, shown as a toast.
4. **Guests never run the rules**, they only render the state they get. The host is also a player and dispatches
   to itself the same way.

## Reaction windows (Fight / Defend / quest cards)

The engine decides who may act now: a function like `waitingFor(state): PlayerId[]`, computed from `state.pending`
(chapter 5 of the method: compute, don't store). Every client shows its own prompt ("Play Defend for Thrall? / Pass")
when its seat is in that list. The engine refuses moves from anyone else.

- Only heroes **on the same space** are asked. Everyone else's screen shows "waiting for Jaina…".
- Quick play: a client may auto-pass when its hand has no card that fits (setting, on by default).
- No timeouts in the engine. If a player disconnects, the host can **pass for them** (a UI button that sends
  `pass` for that seat; the host is allowed to do this only for disconnected seats).

## Reconnecting and saving

- A guest stores its seat token in `localStorage` and rejoins the same seat; the host sends the full state.
- The host writes the state (JSON) to `rooms/{roomId}/save` every turn. If the host leaves, the game can be resumed
  from the save by a new host, since the state is plain data.

## Alternatives considered

| | Host browser + WebRTC (proposed) | Small server (WebSocket / PartyKit / Durable Objects) |
|---|---|---|
| Cost / ops | free tier, static site | a running service |
| Host leaves | game pauses, resume from the save | game continues |
| Cheating | the host could change the state | none |
| Known code | dice_king already works, with e2e tests | new |

For a cooperative game with friends, cheating doesn't matter, so the host approach wins. Because the engine is pure,
moving it to a server later means running the same `applyMove` there; the UI doesn't change.

## Testing

- Unit: host and guests with a fake in-memory transport (like dice_king's `signaling.test.ts` with fake Firestore/WebRTC).
- End-to-end: Playwright with several real Chrome windows and the Firestore emulator (dice_king: `npm run e2e`).
- Engine invariants run in the simulation tests anyway, so the network layer only has to prove it delivers moves and states.
