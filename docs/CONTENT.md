# Game content: what we know, what's missing

Step 3 of the method (docs/METHOD.md) turns this into data tables in `src/engine/`
(`map.ts`, `heroes.ts`, `quests.ts`, `cards.ts`, `rewards.ts`). Every value gets a
`source` like in clank-demo: `'rulebook'` (page N), `'picture'` (read from a picture in the
rulebook, may be wrong), `'photo'` (from a photo of the real component), `'assumed'`.

**Status:** only the rulebook (12 pages) is available. Photos of the real components are needed for
everything marked ❌.

## Board ❌ connections, coordinates · ✅ names

30 spaces in 3 regions plus Icecrown Citadel, and 3 Lich King spaces (one per region, off the normal
spaces, can't be entered). Names read from the 2-player setup picture [3] (`source: 'picture'`):

| Red (west) | Yellow (north) | Purple (east) |
|---|---|---|
| Onslaught Harbor | Shadow Vault | Wyrmrest Temple |
| The Avalanche | Argent Tournament | Thrym's End |
| River's Heart | Temple of Storms | Drak'Tharon Keep |
| Vault of Archavon | The Breach (a hero start) | Kolramas |
| Temple City of En'Kilah | Dalaran | Grizzlemaw |
| Warsong Hold | Frosthold | Amberpine Lodge |
| Valiance Keep | Terrace of the Makers | Utgarde Keep |
| The Wrathgate | Thunderfall | Vengeance Landing |
| Azjol-Nerub | Gundrak | Valgarde |
| The Nexus | Ulduar | Naxxramas |

- The bottom row are the first-game quest spaces. Region membership of The Nexus/Ulduar/Naxxramas is
  from the quest sheet colors; the others from the space colors on the picture.
- **Known connections** (rulebook text): Warsong Hold – The Nexus – Valiance Keep; Warsong Hold – Temple City of
  En'Kilah – Azjol-Nerub (Chain Lightning example [11]). Everything else: ❌ needs a board photo.
- 30 spaces = 30 Scourge cards, so assumed one card per space. Setup draws Azjol-Nerub, Kolramas, Shadow Vault,
  Naxxramas, The Wrathgate, Onslaught Harbor, Dalaran [2, 8], so quest spaces have cards too.
- ❌ Hero start spaces (back of the hero sheets), apart from The Breach.
- ❌ Scourge track: 9 spaces, the rate printed on each is unreadable. ❌ Despair track: about 8 spaces.
- Coordinates: like clank-demo, use the board picture's own coordinate system in an SVG `viewBox`, and check with an overlay view.

## Heroes ❌ health, start · ⚠️ abilities

Health track: the setup picture shows about 8 health spaces, ❌ per hero.

| Hero | Title | Abilities (what we know) | Source |
|---|---|---|---|
| Tirion Fordring | Highlord of the Argent Crusade | **Ashbringer:** when you fight, you may treat any number of blocks as successes. **Press Forward!:** action: move another hero up to 2 spaces; any space, any number of times per turn [11] | picture + rulebook |
| Lady Liadrin | ❌ | **Indomitable:** prevent ghouls being placed on her space (each separately) [11]. **Lay on Hands:** extra healing that stacks [10]. Exact text ❌ | rulebook |
| Thrall | ❌ (Warchief) | **Chain Lightning:** hits a line of connected spaces, not an attack [11]. **I Am The Warchief:** something about quests in his region [11]. Exact text ❌ | rulebook |
| Sylvanas Windrunner | Banshee Queen | **Wailing Arrow:** action: fight on a connected space as if you were there; no damage to you; once per turn. **Will of the Forsaken:** during your own actions, when you play a Fight or Defend card, heal 1 | picture |
| Muradin Bronzebeard | ❌ | **Legacy of the Bronzebeard:** +1 card on his own quest actions [11] | rulebook |
| Jaina Proudmoore | Archmage | **Teleport:** action: move directly to any space up to 4 spaces away; once per turn; not through a closed Icecrown. **Frost Armor:** +1 block when you fight | picture + rulebook |
| Varian Wrynn | ❌ | **For the Alliance!:** moves ghouls (onto Icecrown once it's open) [11]. Exact text ❌ | rulebook |

## Quests ❌ tracks, damage, most effects

10 sheets: 3 per region + Icecrown. Each has a track of icons (Fight / Defend / Travel / Heal) and a damage value.

| Quest | Region | Effect | Boss on the sheet |
|---|---|---|---|
| Naxxramas | purple | after each quest action here, spawn 1 ghoul on this space (also on completion) | Kel'Thuzad |
| The Nexus | red | ❌ (flavor: Malygos purges spellcasters) | Malygos |
| Ulduar | yellow | during quest actions here, cancel 1 rolled success | Yogg-Saron |
| Azjol-Nerub | red | Heal cards work on spaces connected to Azjol-Nerub | ❌ |
| Argent Tournament | yellow | something that applies only to the current player | ❌ |
| 4 more + Icecrown | | ❌ | |

The Naxxramas example [6] shows damage 2. Its track (from the example, bottom to top) starts with Fight icons; ❌ full track.

## Hero cards ⚠️ counts

63 = 8 The Scourge Rises + 3 Stronghold + 52 regular (assumed by subtraction).
Kinds: Fight 1, Fight 2, Defend, Travel 2, Travel 4, Heal. ❌ how many of each.

## Reward cards ⚠️

| Reward | Effect | Source |
|---|---|---|
| Borrowed Time | +3 actions this turn (don't have to use all) | rulebook [1, 11] |
| Onward to Victory | 5 moves split among heroes | rulebook [11] |
| Blessing of the Light | heal all heroes (how much ❌) | rulebook [11] |
| Gunship Support | a free fight (optional) | rulebook [11] |
| Alexstrasza's Cleansing | removes ghouls (not abominations); playable inside The Scourge Rises | rulebook [11] |
| New Allies | takes cards from the hero discard pile | rulebook [11] |
| Argent Crusaders | ❌ | |
| One Quiet Night | ❌ (in Pandemic: skip the next spawn step) | |
| 9th reward | ❌ name and effect | |

## Dice ❌

2 identical six-sided dice with success and block icons. ❌ how many faces of each, blank faces, faces with both.

## Photos needed (in this order)

1. 🗺️ The board, top-down, sharp: names, lines, both tracks with numbers.
2. 🧙 7 hero sheets, front and back.
3. 📜 10 quest sheets.
4. 🎲 One die, all 6 faces.
5. 🃏 One of each hero card kind, with the count per kind.
6. 🎁 9 reward cards.

Keep photos in `assets/` (git-ignored). Only the data read from them goes into the code.
