// Numbers printed in the rulebook (page numbers in brackets). Values that are
// only on the board or the sheets are in docs/CONTENT.md, marked unknown.

import type { Difficulty } from './types';

export const ACTIONS_PER_TURN = 4; // [5]
export const DRAW_PER_TURN = 2; // [8]
export const HAND_LIMIT = 7; // hero + reward cards, at all times [8]

export const GHOULS = 36; // supply [1]
export const ABOMINATIONS = 3; // supply [1]
export const STRONGHOLDS = 3; // supply [1]
export const MAX_GHOULS_PER_SPACE = 3; // a 4th = overrun [8]
export const ABOMINATION_HEALTH = 3; // damage in one action to remove it [5]
export const GHOUL_HEALTH = 1; // [5]

export const DEFEND_PREVENTS = 2; // per Defend card [7]
export const STRONGHOLD_REST_BONUS = 1; // extra heal when resting at a stronghold [7]
export const HEAL_CARD_BONUS = 1; // extra heal on the free rest from a Heal card [7]
export const LICH_KING_BONUS_DAMAGE = 1; // fight or quest action in his region [7]
export const DESPAIR_PER_DEFEAT = 2; // [9]

export const SCOURGE_RISES_CARDS = 8; // in the hero deck box [1]
export const STRONGHOLD_CARDS = 3; // [1]
export const HERO_CARDS_TOTAL = 63; // including the 11 above [1]

// [3] Starting hand per number of players (solo: 4 cards for the shared hand [10]).
export const STARTING_HAND: Record<number, number> = { 1: 4, 2: 3, 3: 3, 4: 2, 5: 2 };
export const SOLO_HEROES = 3; // [10]

// [3] Hero deck: piles, and how many get a Stronghold card. Every pile gets 1 Scourge Rises.
// Mythic: its single Stronghold card goes into the second pile from the left.
export const DIFFICULTY: Record<Difficulty, { piles: number; strongholds: number }> = {
  introductory: { piles: 5, strongholds: 3 },
  normal: { piles: 6, strongholds: 3 },
  heroic: { piles: 7, strongholds: 2 },
  mythic: { piles: 8, strongholds: 1 },
};

// [2] Setup spawn: Scourge cards drawn in order, and what goes on each card's space.
// The first card also decides where the Lich King starts (its region's Lich King space).
export const SETUP_SPAWN: { cards: number; ghouls: number; abomination?: true }[] = [
  { cards: 1, ghouls: 3 }, // + Lich King
  { cards: 1, ghouls: 3 },
  { cards: 3, ghouls: 2 },
  { cards: 3, ghouls: 1 },
  { cards: 1, ghouls: 0, abomination: true },
];

// [2] First game: fixed quests and rewards instead of random ones.
export const FIRST_GAME = {
  quests: ['naxxramas', 'theNexus', 'ulduar'],
  rewards: ['argentCrusaders', 'borrowedTime', 'oneQuietNight'],
};
