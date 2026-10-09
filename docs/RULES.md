# Rules reference

*World of Warcraft: Wrath of the Lich King – A Pandemic System Board Game* (Z-Man Games, 2021).
The rulebook PDF is **not in git** (publisher material, kept in local `assets/`). This page is the
complete rules in our own words, with the rulebook page in brackets, so you can build the engine without it.
Each rule here should become one test in `engine.test.ts`.

## Goal and losing [1, 4, 9]

- Cooperative, 1–5 players. Everyone wins or loses together. Hands are **faceup**: no hidden information.
- **Win:** complete the 3 regional quests, which opens Icecrown Citadel, then complete the Icecrown quest.
  You win **immediately**: remaining enemies and effects (including Icecrown's damage) don't matter [10].
- **Lose:** the despair marker reaches the end of the despair track.

## Setup [2–3]

1. Board in the middle; ghouls, abominations and strongholds next to it.
2. Scourge marker and despair marker on the first space of their tracks.
3. Icecrown Citadel base on the Icecrown space, walls up, tower inside (= Icecrown is closed).
4. Icecrown quest sheet **facedown** on its space.
5. **Rewards:** 1 random reward card facedown on each of the 3 quest-sheet spots. The rest go back in the box.
6. **Quests:** 1 random quest sheet **of each color** (red, yellow, purple) on its spot, on top of the reward.
   A progress marker on the first space of each sheet's track. Each quest marker goes on the board space named by its sheet.
   - *First game:* rewards Argent Crusaders, Borrowed Time, One Quiet Night; quests Naxxramas, The Nexus, Ulduar.
7. **Spawn enemies:** shuffle the Scourge deck. Draw and place:
   - 1 card → 3 ghouls on that space, **and the Lich King goes on the Lich King space of that card's color**
   - 1 card → 3 ghouls
   - 3 cards → 2 ghouls each
   - 3 cards → 1 ghoul each
   - 1 card → 1 abomination
   - All 9 cards go faceup on the Scourge discard pile.
8. **Heroes:** each player picks a hero sheet and a reference card, puts a slider on the **leftmost** space of the
   health track (= full health) and the figure on the start space printed on the back of the sheet.
9. **Deal hero cards:** take out the Scourge Rises and Stronghold cards, shuffle the rest and deal faceup:
   2 players → 3 each, 3 → 3, 4 → 2, 5 → 2.
10. **Hero deck:** split the remaining hero cards into N facedown piles as evenly as possible (smaller piles to the right).
    Shuffle 1 Scourge Rises into **each** pile, and 1 Stronghold into each of the **leftmost** S piles.
    Stack them: leftmost pile on top, rightmost at the bottom. Unused special cards go back in the box.

    | Difficulty | Piles (N) | Stronghold cards (S) |
    |---|---|---|
    | Introductory | 5 | 3 |
    | Normal | 6 | 3 |
    | Heroic | 7 | 2 |
    | Mythic | 8 | 1, in the **second** pile from the left |
11. **First player:** whoever has been furthest north (in the app: the host picks, or random).

## A turn [5]

1. Do 4 actions
2. Draw 2 hero cards
3. Spawn ghouls
4. Activate abominations

### 1. Actions [5–7]

Up to 4 actions, the same action may be repeated. Some heroes have their own actions.

- **Move:** to a connected space (a line on the board). Enemies don't block movement.
- **Fight:** only on a space with enemies [10]. Roll both dice. Each success = 1 damage to an enemy on your space,
  split as you like. A ghoul is removed at 1 damage, an abomination at **3 damage in the same action**
  (damage is not remembered between actions). Removed enemies go back to the supply.
  Then **every enemy still on the space deals 1 damage** to you; each block on the dice prevents 1.
  - After the roll, **any hero on that space** may play any number of *Fight* cards (+1 or +2 successes each).
- **Quest:** only on a quest space (a space with a quest marker). Roll both dice and count successes. Then, in any order:
  - each hero **on the quest space** may contribute **1 card per quest action** (even when it isn't their turn) whose icon
    matches the **next** track space: the marker moves to that space. **Contributed cards are kept, not discarded** [6, 10].
    A card's value doesn't matter here: Fight 2 still moves the marker only 1 space [10].
  - each success moves the marker 1 space, whatever the icon.
  - Then the hero who did the action suffers the quest sheet's **damage**, minus 1 per block. Enemies don't affect quest actions.
  - When the marker reaches the last space, the quest is complete (below).
- **Rest:** roll both dice, heal 1 per success. **Not on a quest space.** Enemies don't affect it.
- **Flight Path:** move straight to any space with a stronghold.

**Free actions** [7]: don't count toward the 4. Only during your own "Do 4 actions" step, never in the middle of another action,
never on someone else's turn.

### Hero cards [7]

Played cards go faceup to the hero discard pile (except quest contributions, which stay in hand).

| Card | When | Effect |
|---|---|---|
| **Fight (1 or 2)** | in a fight on your space, after the roll | +1 or +2 successes. Any hero on that space may play any number. |
| **Defend** | when any hero on your space suffers damage | prevent up to 2 damage per card, any number of cards, any number of heroes on the space |
| **Travel (2 or 4)** | free action | move **any hero on your space** up to 2 or 4 spaces |
| **Heal** | free action | **any hero on your space** does a free rest and heals 1 extra; allowed on a quest space |
| **Stronghold** | the moment it's drawn | place 1 stronghold on any space without a quest or a stronghold; the card goes back in the box |
| **The Scourge Rises** | the moment it's drawn | see step 2 |

Moving or otherwise affecting **another** hero needs that player's agreement [10] (in the app: they confirm).
Several extra heals stack: Heal card, stronghold, Liadrin's Lay on Hands [10].

**Strongholds** [7]: allow Flight Path to that space, and resting there heals 1 extra.

**Lich King** [7, 9]: stands on one of the 3 Lich King spaces (one per region; not normal spaces, he can't be fought).
Every **fight or quest action in his region** deals +1 damage to the hero doing it, even if all enemies are removed
or the quest is completed by that action. Abomination activations are not affected.

### 2. Draw 2 hero cards [8]

Draw the top 2 together.

- **Stronghold:** resolve right away (place a stronghold). No replacement card [10].
- **The Scourge Rises** (the epidemic):
  1. Scourge marker 1 space to the right (a higher Scourge rate).
  2. Draw the **bottom** card of the Scourge deck: the Lich King moves to that region's Lich King space; fill that space
     **up to 3 ghouls** (this never causes an overrun [10]); place 1 abomination there.
  3. Shuffle the Scourge discard pile (with the card from step 2) and put it **on top** of the Scourge deck.
  - The card goes back in the box, no replacement. Two at once: resolve one after the other. With a Stronghold at the same time:
    the Scourge Rises first.
- **Hand limit 7** at all times: discard hero cards or play reward cards until you have 7.

### 3. Spawn ghouls [8]

Flip as many Scourge cards as the current Scourge rate, one at a time. Each: 1 ghoul on its space, card to the discard pile.
If the Scourge deck runs out, shuffle the discard pile into a new deck.

**Overrun:** a 4th ghoul would be placed → don't place it; despair +1 and 1 abomination on that space.
There is **no chain reaction** to neighbouring spaces (unlike Pandemic).

### 4. Activate abominations [8]

One at a time, each abomination moves **1 space toward the nearest hero**, then deals 1 damage to 1 hero on its space.
Ties (nearest hero, or several heroes on the space): the current player chooses.
Several abominations hitting the same hero deal their damage **at the same time**, so 1 Defend card can cover them all.

## Completing a quest [9]

Finish the quest's effects (including its damage), then the sheet, progress marker and quest marker go back in the box.
The **current player** takes the reward card from under the sheet into their hand.

**Reward cards:** playing one isn't an action; the player who plays it decides how it's used; then it goes back in the box.
Most can be played **at any time, also on other players' turns**, but never while a card is already being resolved
(once a Scourge card is flipped it's too late to stop that ghoul).

## Icecrown Citadel [9]

Closed until all 3 quests are done: heroes and abominations can't enter. When the 3rd quest is completed:
1. Remove the tower, flip the base.
2. The Lich King moves to Icecrown and stays there. His +1 damage now applies only to fights and quests on Icecrown.
3. Flip the Icecrown quest sheet faceup, put a progress marker on its first space.

Icecrown is now a quest space that heroes and abominations can enter. Completing its quest wins the game.

## Running out [9]

- A ghoul or abomination must be placed and the supply is empty → despair +1 per enemy that can't be placed.
- A hero card must be drawn and the deck is empty → despair +1 per card that can't be drawn.

## Damage and defeat [9]

Damage moves the health slider. At 0 health the hero is defeated:
1. discard the whole hand, 2. despair **+2**, 3. back to the start space at full health.
If it happens during your actions, stop and go on with drawing hero cards.
Heroes never damage other heroes [10].

## Solo [10]

3 heroes, one shared hand of 4 starting cards (limit 7). Play their turns left to right (solo marker).
Cards may be played on the current hero or other heroes on that space. In a quest action, you may contribute as many cards
as there are heroes on that quest space.

## Fine points [10–11]

**Heroes**
- *Tirion, Press Forward!:* on a hero on **any** space, any number of times per turn.
- *Liadrin, Indomitable:* when several ghouls are placed on her space, each one can be prevented separately.
- *Thrall, Chain Lightning:* not an attack: no damage to Thrall, no Fight cards. It hits a line of connected spaces
  (example: Warsong Hold → The Nexus → Valiance Keep, or Warsong Hold → Temple City of En'Kilah → Azjol-Nerub).
- *Thrall, I Am The Warchief:* still only 1 card per quest action in his region.
- *Sylvanas, Wailing Arrow:* heroes on **Sylvanas's** space can add Fight cards; heroes on the target space can't.
  (Sheet text, from the components picture: fight on a connected space as if you were there, take no damage, once per turn.)
- *Muradin, Legacy of the Bronzebeard:* +1 card only on his own quest actions.
- *Jaina, Teleport:* can't count spaces through a closed Icecrown.
- *Varian, For the Alliance!:* may move ghouls onto Icecrown once it's open.

**Quests**
- *Naxxramas* (sheet: after each quest action here, spawn 1 ghoul on this space): also when the action completes the quest.
- *Ulduar* (sheet: during quest actions here, cancel 1 rolled success).
- *Azjol-Nerub:* Heal cards also work on spaces connected to Azjol-Nerub.
- *Argent Tournament:* the effect is only on the current player; others on the space contribute normally. Muradin may add his 1 extra card.

**Hero cards:** any number of Fight cards per action from any heroes on the space; any number of Defend cards against one
source of damage; any number of Travel and Heal cards per turn.

**Rewards**
- *Alexstrasza's Cleansing:* may be played between steps 2 and 3 of The Scourge Rises; doesn't affect abominations.
- *Blessing of the Light:* heals all heroes, even if some are at full health.
- *Borrowed Time:* +3 actions this turn; you don't have to use them all.
- *Gunship Support:* the free fight is optional.
- *New Allies:* works on the hero discard pile (Scourge Rises, Stronghold and rewards are never there).
- *Onward to Victory:* 5 moves, split among the heroes as you like, each resolved right away.
- *Argent Crusaders, One Quiet Night:* effects not described in the rulebook (unknown). The 9th reward is not named.
