import { Story, StoryId, validateStory } from './types';
import { catStory } from './cat';
import { dogStory } from './dog';
import { roarStory } from './roar';
import { patStory } from './pat';
import { fanStory } from './fan';
import { mapStory } from './map';
import { pat2Story } from './pat2';
import { pinStory } from './pin';
import { bitStory } from './bit';
import { pigcatStory } from './pigcat';
import { wigStory } from './wig';
import { pigStory } from './pig';
import { doglogStory } from './doglog';
import { potStory } from './pot';
import { dogpigStory } from './dogpig';
import { henStory } from './hen';
import { bugStory } from './bug';
import { partyStory } from './party';

export const stories: Record<StoryId, Story> = {
  cat: catStory,
  pat: patStory,
  fan: fanStory,
  map: mapStory,
  pat2: pat2Story,
  pig: pigStory,
  pin: pinStory,
  bit: bitStory,
  pigcat: pigcatStory,
  wig: wigStory,
  doglog: doglogStory,
  pot: potStory,
  dogpig: dogpigStory,
  hen: henStory,
  bug: bugStory,
  party: partyStory,
  dog: dogStory,
  roar: roarStory,
};

// Authored stories in Module 1 teaching order (more added per curriculum).
export const storyOrder: StoryId[] = [
  'cat',
  'pat',
  'fan',
  'map',
  'pat2',
  'pig',
  'pin',
  'bit',
  'pigcat',
  'wig',
  'doglog',
  'pot',
  'dogpig',
  'hen',
  'bug',
  'party',
];

export const getStory = (id: string): Story | undefined => stories[id as StoryId];

export const allStories = (): Story[] => storyOrder.map((id) => stories[id]);

export const validateAll = (): { storyId: StoryId; errors: string[] }[] =>
  allStories().map((story) => ({ storyId: story.id, errors: validateStory(story) }));

export type { Story, Scene, NarratorLine, HighlightSpan, ChoiceOption, EndAction, StoryId } from './types';
