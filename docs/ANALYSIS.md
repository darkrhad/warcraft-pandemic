# Wrath of the Lich King: rulebook analysis

Steps 1 and 2 of the clank-demo playbook (chapter 10): read the rulebook, list the components.
The components as code are in `src/engine/types.ts`. The full rules are in `docs/RULES.md`, the content
in `docs/CONTENT.md`; this page is the summary and the complexity estimate.

## 1. The rules in short

A cooperative Pandemic-system game for 1–5 players. Everyone wins or loses together, and all hands are faceup.

**Goal:** finish 3 quests (one in each region: red, yellow, purple). That opens Icecrown Citadel,
and finishing the Icecrown quest wins the game. **You lose** when the despair marker reaches the end
of its track.

**A turn:**
1. **4 actions:** Move (to a connected space), Fight (roll 2 dice, each success = 1 damage; a ghoul
   dies at 1, an abomination at 3 in one action; then every enemy left deals 1, each block prevents 1),
   Quest (roll and contribute cards, the progress marker moves forward, then the quest deals damage),
   Rest (heal 1 per success, not on a quest space), Flight Path (move to any stronghold), and the heroes' own actions.
   **Free actions:** Travel and Heal cards, some hero abilities.
2. **Draw 2 hero cards.** A *Stronghold* card: place a stronghold right away. *The Scourge Rises* (the epidemic):
   the Scourge marker moves +1, draw the bottom Scourge card, the Lich King moves to that region, fill that space up to 3 ghouls,
   add 1 abomination, shuffle the Scourge discard pile back onto the top of the deck.
3. **Spawn ghouls:** draw Scourge cards equal to the Scourge rate, 1 ghoul for each. A 4th ghoul on a space = an **overrun**:
   despair +1 and an abomination on that space (no chain reaction like in Pandemic).
4. **Abominations:** each moves 1 space toward the nearest hero and deals 1 damage.

**Reactions from other players:** any hero on the space can play *Fight* cards into a fight, *Defend*
cards against damage (−2 each), and 1 card per quest action into a quest. *Reward* cards can be played at any time,
on any player's turn.

**Despair goes up** for each overrun, ×2 for each defeated hero (who discards their hand and starts again at full health),
and +1 for each ghoul, abomination or hero card that can't be taken because the supply or deck is empty.

**Lich King:** +1 damage to every fight and quest action in his region. Once the 3 quests are done he moves to Icecrown and stays there.

**Difficulty** = how many hero-deck piles and Stronghold cards (5/3, 6/3, 7/2, 8/1). **Solo:** 3 heroes, one shared hand.

## 2. Components

| Component | Count | In `types.ts` | Known from the rulebook? |
|---|---|---|---|
| Board: ~30 spaces in 3 regions + Icecrown, 3 Lich King spaces | 1 | `SpaceId`, `Region` | ⚠️ names read from a picture; connections and coordinates missing |
| Heroes (figure + sheet) | 7 | `HeroDef`, `AbilityId` | ⚠️ names and some abilities; health, start space and full texts missing |
| Hero cards | 63 = 52 + 8 Scourge Rises + 3 Stronghold | `HeroCardDef` | ⚠️ 4 kinds known; **how many of each** missing |
| Reward cards | 9 | `RewardId` | ⚠️ 8 names, effects only partly known |
| Scourge cards | 30 | `ScourgeCardDef` | ⚠️ assumed: one card per space |
| Quest sheets | 9 + Icecrown | `QuestDef` | ❌ track icons, damage, effects (3 known) |
| Ghouls / abominations / Lich King | 36 / 3 / 1 | `ghouls`, `abominations`, `lichKing` | ✅ |
| Strongholds | 3 | `strongholds` | ✅ |
| Scourge track / despair track | 1 / 1 | `scourgeTrack`, `despair` | ❌ rate per space, track length |
| Dice | 2 | `DieFace` | ❌ how many success / block / blank faces |
| Progress, quest, solo markers, sliders | 3, 3, 1, 5 | `ActiveQuest`, `Player.health` | ✅ |

Photos still needed: see the list at the end of `docs/CONTENT.md`.

## 3. How complex is it compared to clank-demo?

**Overall: about 60–70% of the clank-demo work for a one-screen game. Online (decided) brings it to roughly the
same size as clank-demo**, mostly the connection layer, which can be copied from dice_king.

| Part | clank-demo | Wrath of the Lich King | Effect |
|---|---|---|---|
| Content to digitize | ~70 different cards with many special fields, 40+ rooms, tunnels with 5 kinds of rules, secrets, market | 4 card kinds with almost no text, ~30 spaces with plain lines, 7 heroes, 10 quests, 9 rewards | 🟢 **much less** |
| Map rules | Boots, locked, one-way, monster tunnels, caves, depths | adjacency only, plus Flight Path and abomination pathing (BFS) | 🟢 less |
| Turn structure | free order of play/buy/move, derived Skill/Swords/Boots | 4 actions + 3 fixed steps | 🟢 less |
| End of turn / "dragon" | dragon bag, rage, countdown | spawn, overruns, Scourge Rises, despair | 🟡 similar |
| **Reactions out of turn** | none: only the current player acts | Fight/Defend cards from anyone on the space, quest contributions, rewards at any time | 🔴 **new and the hardest part** |
| Dice | none | 2 dice, seeded RNG | 🟢 small |
| Hero abilities | (the special cards played that role) | 7 heroes × ~2 abilities, each its own code | 🟡 like clank's ~15 special cards |
| AI opponents | ~400 lines + tournaments | **not needed** ✂️ | 🟢 saves a lot |
| Simulation bots | random bots + invariants | still needed (random legal moves, invariants: 36 ghouls, ≤3 per space, health ≥ 0) | 🟡 same |
| UI | board, hand, Dungeon Row, dialogs | board, 1–5 hero panels side by side, 3 quest sheets, 2 tracks, reaction prompts | 🟡 similar |
| Multiplayer | pass the screen with a hand-over screen | pass-and-play is **easier** (hands are faceup, no hand-over screen) | 🟢 / 🔴 online |

### The two things that are really new

1. **Reaction windows.** In Clank! only the current player ever sent a move. Here, a fight or damage opens a
   window where *other* heroes may play cards. So every `Move` carries `by`, and `Pending` holds who has
   already passed. The engine stays the same (`applyMove` + `pending`); only the turn flow has more stops.
   In a UI with everyone at one table this is a "Play Defend? / Pass" prompt for each hero on the space.
2. **Online multiplayer (decided, see docs/ONLINE.md).** Because the engine is pure and seeded, the approach from
   playbook exercise 7 works: one host (or a small server) runs `applyMove`, everyone else sends moves and
   gets the state. No hidden information here, so the whole state can be sent to everyone, which is simpler than Clank!.
   The new work is the connection (rooms, reconnecting) and reaction windows that wait for remote players.

### Biggest risk: content, not code

Same lesson as clank-demo: the rulebook doesn't contain the board, the quest sheets, the hero sheets or the
card counts. Without the photos above, the engine can be built, but with `source: 'assumed'` everywhere.

## Decisions (2026-10-09)

- **Online multiplayer** across devices: docs/ONLINE.md.
- **Original World of Warcraft names.** No Blizzard art and no rulebook PDF in the (public) repo.
