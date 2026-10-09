// The whole game state is plain data: easy to save, send over the network,
// replay and test. Rules will live in engine.ts; screens only read this.
//
// Step 2 of the playbook: every physical component from the rulebook (page 1)
// has a place here. Values not in the rulebook are marked "assumed" or "unknown"
// and listed in ANALYSIS.md.

export type SpaceId = string; // a board space, e.g. "naxxramas"; ~30 spaces + Icecrown Citadel (unknown: full list)
export type Region = 'red' | 'yellow' | 'purple';
export type CardUid = string; // e.g. "fight2#7"; the part before "#" is the card id
export type PlayerId = string;

// --- Heroes (7 figures, 7 hero sheets, 5 sliders, 5 reference cards) ---

export type HeroId = 'tirion' | 'liadrin' | 'thrall' | 'sylvanas' | 'muradin' | 'jaina' | 'varian';

export interface HeroDef {
  id: HeroId;
  name: string;
  health: number; // unknown: read from the hero sheet's health track
  start: SpaceId; // printed on the back of the hero sheet
  abilities: AbilityId[];
}

// Names from the rulebook's Fine Points; the full texts are on the hero sheets (unknown).
export type AbilityId =
  | 'pressForward' // Tirion
  | 'indomitable' | 'layOnHands' // Liadrin
  | 'chainLightning' | 'iAmTheWarchief' // Thrall
  | 'wailingArrow' // Sylvanas: fight on a connected space as if you were there, no damage to you
  | 'legacyOfTheBronzebeard' // Muradin: +1 card to his own quest actions
  | 'teleport' | 'frostArmor' // Jaina (frostArmor: assumed, half-readable on the setup picture)
  | 'forTheAlliance'; // Varian: moves ghouls

// --- Cards (63 hero cards, 9 reward cards, 30 Scourge cards) ---

// 52 regular hero cards (assumed: 63 - 8 Scourge Rises - 3 Stronghold); mix per kind unknown.
export type HeroCardDef =
  | { id: string; kind: 'fight'; value: 1 | 2 } // + successes in a fight on your space
  | { id: string; kind: 'defend' } // prevent 2 damage to a hero on your space
  | { id: string; kind: 'travel'; value: 2 | 4 } // free action: move a hero on your space
  | { id: string; kind: 'heal' } // free action: a hero on your space rests and heals +1
  | { id: string; kind: 'stronghold' } // resolve on draw: place 1 stronghold
  | { id: string; kind: 'scourgeRises' }; // resolve on draw: the "epidemic"

// The icon a quest track space asks for = the kind of hero card that can be contributed.
export type QuestIcon = 'fight' | 'defend' | 'travel' | 'heal';

export type RewardId =
  | 'argentCrusaders' | 'borrowedTime' | 'oneQuietNight' | 'alexstraszasCleansing'
  | 'blessingOfTheLight' | 'gunshipSupport' | 'newAllies' | 'onwardToVictory'
  | string; // the 9th reward is not named in the rulebook

// A Scourge card names one space (and so one region). Assumed: one card per non-quest space.
export interface ScourgeCardDef { id: string; space: SpaceId }

// --- Quests (10 quest sheets incl. Icecrown, 3 quest markers, 3 progress markers) ---

export interface QuestDef {
  id: string; // e.g. "naxxramas", "theNexus", "ulduar", "icecrown"
  region: Region | 'icecrown';
  space: SpaceId; // the quest space on the board
  track: (QuestIcon | 'any')[]; // unknown: icons on each track space ('any' = only dice successes)
  damage: number; // damage after each quest action (Naxxramas example: 2)
  effect?: QuestEffect;
}

// Only three quest effects are described in the rulebook; the rest are on the sheets (unknown).
export type QuestEffect =
  | { kind: 'spawnGhoulAfterQuest' } // Naxxramas
  | { kind: 'cancelSuccess'; count: number } // Ulduar
  | { kind: 'healNearby' } // Azjol-Nerub: Heal cards work on connected spaces
  | { kind: 'currentPlayerOnly' } // Argent Tournament (assumed shape)
  | { kind: 'other'; text: string };

export interface ActiveQuest {
  quest: string; // QuestDef id
  progress: number; // index on the track
  reward: RewardId | null; // the facedown reward card under the sheet
  done: boolean;
}

// --- Dice (2, identical) ---

export type DieFace = 'success' | 'block' | 'blank'; // unknown: how many of each per die

// --- Players ---

export interface Player {
  id: PlayerId;
  name: string;
  hero: HeroId;
  space: SpaceId;
  health: number; // slider position; 0 = defeated
  hand: CardUid[]; // hero cards and reward cards, faceup (cooperative: everyone sees them), max 7
}

// --- Turn ---

export type Step = 'actions' | 'draw' | 'spawn' | 'abominations';

export interface Turn {
  step: Step;
  actionsLeft: number; // 4, +3 with Borrowed Time
  usedOncePerTurn: AbilityId[]; // e.g. Wailing Arrow
}

// A choice, or a window where other heroes may react, that must be closed before
// anything else happens. Unlike Clank!, players other than the current one answer
// these (Fight/Defend cards, quest contributions), so moves carry `by`.
export type Pending =
  | { kind: 'fightCards'; roll: DieFace[]; bonus: number; passed: PlayerId[] } // heroes on the space add Fight cards
  | { kind: 'assignHits'; hits: number } // current player splits successes over ghouls/abominations
  | { kind: 'defendCards'; target: PlayerId; damage: number; passed: PlayerId[] } // heroes on the space prevent damage
  | { kind: 'questCards'; roll: DieFace[]; contributed: Record<PlayerId, CardUid | null> } // each hero on the space: 1 card
  | { kind: 'placeStronghold' } // a Stronghold card was drawn
  | { kind: 'abominationTarget'; abomination: number; tied: PlayerId[] } // current player breaks a tie
  | { kind: 'discardToLimit'; player: PlayerId }; // more than 7 cards

// --- The whole game ---

export type Difficulty = 'introductory' | 'normal' | 'heroic' | 'mythic';

export interface GameState {
  seed: number; // seeded RNG: dice, shuffles
  difficulty: Difficulty;
  players: Player[];
  current: number;
  turn: Turn;

  heroDeck: CardUid[]; // built in piles with Scourge Rises / Stronghold, top = index 0
  heroDiscard: CardUid[];
  scourgeDeck: CardUid[]; // top = index 0; Scourge Rises draws from the bottom
  scourgeDiscard: CardUid[];

  ghouls: Record<SpaceId, number>; // 0..3 per space, 36 in the supply
  abominations: SpaceId[]; // one entry per abomination on the board, 3 in the supply
  strongholds: SpaceId[]; // max 3, never on a quest space
  lichKing: Region | 'icecrown';

  scourgeTrack: number; // index; the Scourge rate per index is unknown
  despair: number; // index; lose when it reaches the end (track length unknown)

  quests: ActiveQuest[]; // the 3 regional quests
  icecrown: { open: boolean; progress: number }; // opens when all 3 quests are done

  pending: Pending | null;
  log: string[];
  result: 'won' | 'lost' | null;
}

// Every action a player can take. `by` is who sends it: reactions and reward
// cards can come from any player, not only the current one.
export type Move =
  // the 4 actions
  | { type: 'move'; to: SpaceId }
  | { type: 'fight'; target?: SpaceId } // target: Wailing Arrow / Chain Lightning
  | { type: 'quest' }
  | { type: 'rest' }
  | { type: 'flightPath'; to: SpaceId }
  | { type: 'ability'; ability: AbilityId; target?: SpaceId | PlayerId; spaces?: SpaceId[] }
  // free actions and reactions
  | { type: 'playCard'; by: PlayerId; uid: CardUid; hero?: PlayerId; to?: SpaceId } // Fight, Defend, Travel, Heal
  | { type: 'contribute'; by: PlayerId; uid: CardUid } // quest card, kept in hand
  | { type: 'playReward'; by: PlayerId; uid: CardUid; choice?: unknown }
  | { type: 'pass'; by: PlayerId } // done reacting in a window
  // answers to pending choices
  | { type: 'assignHits'; ghouls: number; abominations: number[] }
  | { type: 'placeStronghold'; space: SpaceId }
  | { type: 'chooseHero'; player: PlayerId }
  | { type: 'discard'; by: PlayerId; uid: CardUid }
  | { type: 'endActions' };
