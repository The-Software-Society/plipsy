// Mia's garden friends: named animals living in fixed nooks of the overworld.
// Each lists only its BUILT stories; add more story ids here as they're authored.
// `spot` is a percent position on the square world map (see scripts
// world.bg nooks) and `sprite` is the transparent cutout drawn there.

export type Friend = {
  id: string;
  name: string;
  animal: string;
  vowel: 'A' | 'E' | 'I' | 'O' | 'U';
  sprite: string; // transparent cutout illustration key
  spot: { x: number; y: number }; // % position on the square world map
  storyIds: string[]; // built stories, in play order
};

// Array order is the wake order (canonical vowel order A I O E U, matching
// pathways.ts and words.ts): a friend stays asleep until every friend before it
// is finished. Finished friends never re-lock (see world/state.ts).
export const FRIENDS: Friend[] = [
  { id: 'waldo', name: 'Waldo', animal: 'cat', vowel: 'A', sprite: 'world.waldo', spot: { x: 22, y: 24 }, storyIds: ['cat', 'pat', 'fan', 'map', 'pat2'] },
  { id: 'rosie', name: 'Rosie', animal: 'pig', vowel: 'I', sprite: 'world.rosie', spot: { x: 22, y: 74 }, storyIds: ['pig', 'pin', 'bit', 'pigcat', 'wig'] },
  { id: 'biscuit', name: 'Biscuit', animal: 'dog', vowel: 'O', sprite: 'world.biscuit', spot: { x: 80, y: 56 }, storyIds: ['doglog', 'pot', 'dogpig'] },
  { id: 'ruby', name: 'Ruby', animal: 'hen', vowel: 'E', sprite: 'world.ruby', spot: { x: 78, y: 22 }, storyIds: ['hen'] },
  { id: 'bea', name: 'Bea', animal: 'bug', vowel: 'U', sprite: 'world.bea', spot: { x: 52, y: 82 }, storyIds: ['bug'] },
];

export const friendById = (id: string): Friend | undefined => FRIENDS.find((f) => f.id === id);
