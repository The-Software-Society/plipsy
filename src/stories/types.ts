// Story ids are free-form strings now that the catalog grows per curriculum.
export type StoryId = string;

export type IllustrationKey = string;
export type AudioKey = string;

export type HighlightSpan = {
  word: string;
  start: number;
  end: number;
  audioKey: AudioKey;
};

export type NarratorLine = {
  id: string;
  text: string;
  audioKey: AudioKey;
  highlights: HighlightSpan[];
  // Optional delivery hint (e.g. 'giggle', 'soft', 'cheer'); shapes the TTS
  // style directive at generation time without changing the narrator voice.
  tone?: string;
};

export type ChoiceOption = {
  word: string;
  audioKey: AudioKey;
  illustration: IllustrationKey;
  next: string;
};

export type EndAction =
  | { type: 'continue'; next: string }
  | {
      type: 'choice';
      promptText: string;
      promptAudioKey: AudioKey;
      options: ChoiceOption[];
    }
  | {
      // Passive spell-out: letters animate in on a timer (no interaction).
      // Superseded by `spellInteractive` for new authoring; kept for dog/roar.
      type: 'spellOut';
      word: string;
      heroAudioKey: AudioKey;
      letterAudioKeys: AudioKey[];
      expressionIllustration: IllustrationKey;
      backgroundTone?: string;
      next: string;
    }
  | {
      // Interactive drag-to-spell: child drags letter tiles onto dashed,
      // ghosted slots in order. Letter names/sounds and feedback phrases come
      // from the shared audio bank (see src/audio/bank.ts); only the word,
      // instruction, and per-letter sound variants are authored here.
      type: 'spellInteractive';
      word: string;
      promptText: string; // shown + spoken instruction, e.g. "Spell SIT!"
      promptAudioKey: AudioKey;
      // Per-letter sound variant aligned to the word's letters: null/omitted =
      // canonical sound, else a bank variant like 'long' | 'broad' | 'silent'.
      sounds?: (string | null)[];
      expressionIllustration: IllustrationKey;
      backgroundTone?: string;
      isHeroMoment?: boolean; // true only for the canonical hero-word reveal
      next: string;
    }
  | { type: 'end' };

export type Scene = {
  id: string;
  illustration: IllustrationKey;
  lines: NarratorLine[];
  end: EndAction;
};

export type Story = {
  id: StoryId;
  title: string;
  heroWord: string;
  cover: IllustrationKey;
  startSceneId: string;
  scenes: Record<string, Scene>;
  // Curriculum linkage (optional): the new words this story introduces and the
  // prior words it reviews. Used by the SRS/pathway engine.
  targetWords?: string[];
  reviewWords?: string[];
};

export const validateStory = (story: Story): string[] => {
  const errors: string[] = [];
  const sceneIds = new Set(Object.keys(story.scenes));

  if (!sceneIds.has(story.startSceneId)) {
    errors.push(`startSceneId "${story.startSceneId}" not found`);
  }

  for (const sceneId of sceneIds) {
    const scene = story.scenes[sceneId]!;
    if (scene.id !== sceneId) {
      errors.push(`scene "${sceneId}" has mismatched id "${scene.id}"`);
    }

    for (const line of scene.lines) {
      if (line.text.includes('—')) {
        errors.push(`${sceneId}/${line.id}: text contains an em dash (not allowed)`);
      }
      for (const h of line.highlights) {
        const slice = line.text.slice(h.start, h.end);
        if (slice.toLowerCase() !== h.word.toLowerCase()) {
          errors.push(
            `${sceneId}/${line.id}: highlight "${h.word}" does not match text slice "${slice}"`
          );
        }
      }
    }

    const e = scene.end;
    if ((e.type === 'choice' || e.type === 'spellInteractive') && e.promptText.includes('—')) {
      errors.push(`${sceneId}: promptText contains an em dash (not allowed)`);
    }
    if (e.type === 'continue' && !sceneIds.has(e.next)) {
      errors.push(`${sceneId}: continue → unknown scene "${e.next}"`);
    }
    if (e.type === 'choice') {
      for (const opt of e.options) {
        if (!sceneIds.has(opt.next)) {
          errors.push(`${sceneId}: choice "${opt.word}" → unknown scene "${opt.next}"`);
        }
      }
    }
    if (e.type === 'spellOut' && !sceneIds.has(e.next)) {
      errors.push(`${sceneId}: spellOut → unknown scene "${e.next}"`);
    }
    if (e.type === 'spellInteractive') {
      if (!sceneIds.has(e.next)) {
        errors.push(`${sceneId}: spellInteractive → unknown scene "${e.next}"`);
      }
      const letterCount = e.word.toUpperCase().replace(/[^A-Z]/g, '').length;
      if (e.sounds && e.sounds.length !== letterCount) {
        errors.push(
          `${sceneId}: spellInteractive word "${e.word}" has ${letterCount} letters but ${e.sounds.length} sound variants`
        );
      }
    }
  }

  return errors;
};
