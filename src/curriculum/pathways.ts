// Curriculum backbone: ordered Pathway → Unit[]. Each unit is delivered by one
// story and declares the new words it teaches + prior words it reviews. The SRS
// engine handles mastery/decay underneath; the pathway provides the order.

export type Unit = {
  id: string;
  storyId: string;
  title: string;
  focus: string; // phonics focus label
  targetWords: string[]; // new words introduced
  reviewWords: string[]; // prior words practiced
  moral: string;
  spiral?: boolean; // advancing-version / review-heavy story
};

export type Pathway = {
  id: string;
  title: string;
  units: Unit[];
};

export const MODULE_1: Pathway = {
  id: 'module-1',
  title: 'First Sounds',
  units: [
    // Canonical vowel order: A → I → O → E → U (matches words.ts / PhonicsPhase).
    // A (Waldo the cat)
    { id: 'm1u1', storyId: 'cat', title: 'Mia and the Cat', focus: 'mixed CVC', targetWords: ['CAT', 'SIT', 'PET', 'RUN'], reviewWords: [], moral: 'friendship' },
    { id: 'm1u2', storyId: 'pat', title: 'Pat the Cat', focus: 'short A · -at', targetWords: ['HAT', 'MAT', 'PAT'], reviewWords: ['CAT'], moral: 'a kind friend makes you cozy' },
    { id: 'm1u3', storyId: 'fan', title: 'Fan the Cat', focus: 'short A · -an', targetWords: ['FAN', 'CAN', 'RAN'], reviewWords: ['HAT'], moral: 'helping a friend feels good' },
    { id: 'm1u4', storyId: 'map', title: 'The Map', focus: 'short A · -ap', targetWords: ['MAP', 'TAP', 'CAP'], reviewWords: ['CAN'], moral: 'sharing the treasure is the best part' },
    { id: 'm1u5', storyId: 'pat2', title: 'The New Friend', focus: 'short A · spiral', targetWords: ['BAT', 'RAT', 'SAT'], reviewWords: ['HAT'], moral: 'welcome a new friend', spiral: true },
    // I (Rosie the pig)
    { id: 'm1u6', storyId: 'pig', title: 'The Big Pig', focus: 'short I · -ig', targetWords: ['BIG', 'DIG', 'PIG'], reviewWords: ['SIT'], moral: 'use what makes you special to help' },
    { id: 'm1u7', storyId: 'pin', title: 'Win a Pin', focus: 'short I · -in', targetWords: ['PIN', 'WIN', 'FIN'], reviewWords: ['PIG'], moral: 'playing together is the real prize' },
    { id: 'm1u8', storyId: 'bit', title: 'A Bit More Room', focus: 'short I · -it', targetWords: ['HIT', 'FIT', 'BIT'], reviewWords: ['SIT'], moral: 'there is always room for one more' },
    { id: 'm1u9', storyId: 'pigcat', title: 'A Gift for Waldo', focus: 'short I · -ip', targetWords: ['TIP', 'ZIP', 'RIP'], reviewWords: ['PIG'], moral: 'giving a gift feels wonderful' },
    { id: 'm1u10', storyId: 'wig', title: 'The Dress Up Show', focus: 'short I · spiral', targetWords: ['WIG', 'LIP'], reviewWords: ['HAT', 'ZIP'], moral: 'being silly together is the best', spiral: true },
    // O (Biscuit the dog)
    { id: 'm1u11', storyId: 'doglog', title: 'The Dog and the Log', focus: 'short O · -og/-op', targetWords: ['LOG', 'HOP', 'DOG'], reviewWords: ['PIG'], moral: 'help a friend be brave' },
    { id: 'm1u12', storyId: 'pot', title: 'Hot Pot', focus: 'short O · -ot/-op', targetWords: ['POT', 'TOP', 'HOT'], reviewWords: ['DOG'], moral: 'share a warm meal' },
    { id: 'm1u13', storyId: 'dogpig', title: 'The Dog and the Pig', focus: 'short O · spiral', targetWords: ['MOP', 'POP', 'DOT'], reviewWords: ['DOG'], moral: 'teamwork makes cleanup fun', spiral: true },
    // E (Ruby the hen) - placed after O so DOG is taught before hen reviews it
    { id: 'm1u14', storyId: 'hen', title: 'The Wet Hen', focus: 'short E · -et/-en', targetWords: ['NET', 'WET', 'HEN'], reviewWords: ['DOG'], moral: 'help a friend in trouble' },
    // U (Bea the bug)
    { id: 'm1u15', storyId: 'bug', title: 'Hug the Bug', focus: 'short U · -ug/-un', targetWords: ['HUG', 'SUN', 'BUG'], reviewWords: ['RUN'], moral: 'kindness to the smallest' },
    { id: 'm1u16', storyId: 'party', title: "Mia's Big Day", focus: 'all vowels · boss', targetWords: ['CUT', 'NUT', 'FUN'], reviewWords: ['SUN'], moral: 'sharing with everyone you love', spiral: true },
  ],
};

export const PATHWAYS: Pathway[] = [MODULE_1];

export const unitForStory = (storyId: string): Unit | undefined =>
  PATHWAYS.flatMap((p) => p.units).find((u) => u.storyId === storyId);
