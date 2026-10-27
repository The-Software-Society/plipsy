// Little nature collectibles a child earns for finishing an activity. Calm,
// on-aesthetic (watercolor items), gathered in a basket (app/treasures.tsx).
// Sprite key shape: `treasure.<id>` (generated on white, cut out like world.*).

export type Treasure = {
  id: string;
  name: string; // spoken + shown, e.g. "a shell"
  sprite: string; // illustration key
};

export const TREASURES: Treasure[] = [
  { id: 'shell', name: 'a shell', sprite: 'treasure.shell' },
  { id: 'leaf', name: 'a leaf', sprite: 'treasure.leaf' },
  { id: 'acorn', name: 'an acorn', sprite: 'treasure.acorn' },
  { id: 'pebble', name: 'a pebble', sprite: 'treasure.pebble' },
  { id: 'feather', name: 'a feather', sprite: 'treasure.feather' },
  { id: 'berry', name: 'a berry', sprite: 'treasure.berry' },
  { id: 'pinecone', name: 'a pinecone', sprite: 'treasure.pinecone' },
  { id: 'stone', name: 'a stone', sprite: 'treasure.stone' },
];

export const treasureById = (id: string): Treasure | undefined =>
  TREASURES.find((t) => t.id === id);
