/**
 * Character themes inspired by popular hero styles (ninja, warrior, titan).
 * Each has a power-up and distinct 3D look.
 */

export type CharacterId =
  | 'starter'
  | 'ninja'
  | 'warrior'
  | 'titan'
  | 'captain'
  | 'phoenix'
  | 'legend'
  | 'mythic';

export interface PowerUp {
  name: string;
  description: string;
  stats: string[]; // e.g. ["+10% Focus", "Speed Boost"]
}

export interface CharacterSkin {
  id: CharacterId;
  name: string;
  description: string;
  streakRequired: number;
  bodyColor: string;
  headColor: string;
  accentColor: string;
  lightColor: string;
  theme: 'starter' | 'ninja' | 'warrior' | 'titan' | 'captain' | 'phoenix' | 'legend' | 'mythic';
  hasCrown: boolean;
  emoji: string;
  powerUp: PowerUp;
}

export const CHARACTERS: CharacterSkin[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Your first buddy. Begin your journey!',
    streakRequired: 0,
    bodyColor: '#a78bfa',
    headColor: '#c4b5fd',
    accentColor: '#1a1a2e',
    lightColor: '#a78bfa',
    theme: 'starter',
    hasCrown: false,
    emoji: '🌱',
    powerUp: { name: 'First Step', description: 'Every legend starts somewhere.', stats: ['+1 Daily motivation'] },
  },
  {
    id: 'ninja',
    name: 'Naruto',
    description: 'Ninja with headband and spiky hair. Unlock at 1 day streak.',
    streakRequired: 1,
    bodyColor: '#ea580c',
    headColor: '#fef3c7',
    accentColor: '#1e40af',
    lightColor: '#f97316',
    theme: 'ninja',
    hasCrown: false,
    emoji: '🥷',
    powerUp: {
      name: 'Shadow Clone',
      description: 'Multiply your focus. Get things done with ninja speed.',
      stats: ['+15% Task speed', 'Clone focus mode'],
    },
  },
  {
    id: 'warrior',
    name: 'Dragon Warrior',
    description: 'Unleash your inner power. Unlock at 3 days.',
    streakRequired: 3,
    bodyColor: '#f97316',
    headColor: '#fed7aa',
    accentColor: '#1a1a2e',
    lightColor: '#fb923c',
    theme: 'warrior',
    hasCrown: false,
    emoji: '🐉',
    powerUp: {
      name: 'Spirit Energy',
      description: 'Channel unstoppable energy into your daily goals.',
      stats: ['+25% Willpower', 'Kamehameha focus burst'],
    },
  },
  {
    id: 'titan',
    name: 'Hulk',
    description: 'Green powerhouse with massive muscles and fists. Unlock at 7 days.',
    streakRequired: 7,
    bodyColor: '#16a34a',
    headColor: '#4ade80',
    accentColor: '#14532d',
    lightColor: '#22c55e',
    theme: 'titan',
    hasCrown: false,
    emoji: '💪',
    powerUp: {
      name: 'Hulk Smash',
      description: 'Nothing can break your streak. Unstoppable force.',
      stats: ['+30% Resilience', 'Smash procrastination'],
    },
  },
  {
    id: 'captain',
    name: 'Captain America',
    description: 'Star-spangled hero with shield. Unlock at 5 days.',
    streakRequired: 5,
    bodyColor: '#1e40af',
    headColor: '#fef3c7',
    accentColor: '#dc2626',
    lightColor: '#3b82f6',
    theme: 'captain',
    hasCrown: false,
    emoji: '🛡️',
    powerUp: {
      name: 'Shield Block',
      description: 'Defend your streak. No setback can break through.',
      stats: ['+20% Streak shield', 'Captain\'s resolve'],
    },
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    description: 'Rise from the ashes. Unlock at 14 days.',
    streakRequired: 14,
    bodyColor: '#dc2626',
    headColor: '#fca5a5',
    accentColor: '#fde047',
    lightColor: '#ef4444',
    theme: 'phoenix',
    hasCrown: false,
    emoji: '🔥',
    powerUp: {
      name: 'Rebirth',
      description: 'Every setback fuels your comeback.',
      stats: ['+1 Streak shield', 'Auto-recover once per week'],
    },
  },
  {
    id: 'legend',
    name: 'Legend',
    description: '30 day streak. You are a habit master.',
    streakRequired: 30,
    bodyColor: '#7c3aed',
    headColor: '#c4b5fd',
    accentColor: '#4c1d95',
    lightColor: '#a78bfa',
    theme: 'legend',
    hasCrown: true,
    emoji: '👑',
    powerUp: {
      name: 'Crown of Consistency',
      description: 'Wear your streak with pride.',
      stats: ['+50% XP bonus', 'Legendary status', 'Share badge'],
    },
  },
  {
    id: 'mythic',
    name: 'Mythic',
    description: '50 day streak. The ultimate form.',
    streakRequired: 50,
    bodyColor: '#ec4899',
    headColor: '#fbcfe8',
    accentColor: '#9d174d',
    lightColor: '#f472b6',
    theme: 'mythic',
    hasCrown: true,
    emoji: '💎',
    powerUp: {
      name: 'Mythic Form',
      description: 'You have transcended. Inspire others.',
      stats: ['+100% All bonuses', 'Mythic badge', 'Exclusive share card'],
    },
  },
];

export function getCharacterForStreak(streak: number): CharacterSkin {
  let best = CHARACTERS[0];
  for (const c of CHARACTERS) {
    if (streak >= c.streakRequired) best = c;
  }
  return best;
}

export function getUnlockedCharacterIds(streak: number): CharacterId[] {
  return CHARACTERS.filter((c) => streak >= c.streakRequired).map((c) => c.id);
}
