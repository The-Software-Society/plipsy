export type DbVocabRow = {
  child_id: string;
  word: string;
  status: 'introduced' | 'learning' | 'mastered';
  exposure_count: number;
  introduced_at: string;
  last_seen_at: string;
  // SRS columns (added in migration 0002). Optional for back-compat.
  box?: number;
  state?: 'active' | 'longTerm' | 'problem';
  clean_count?: number;
  lapse_count?: number;
  next_review_at?: string | null;
};

export type DbLearnerStateRow = {
  child_id: string;
  pathway_id: string;
  unit_index: number;
  active_cap: number;
  updated_at: string;
};

export type DbSessionRow = {
  id: string;
  child_id: string;
  story_id: string;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
};

export type DbSessionEventRow = {
  id?: string;
  session_id: string;
  event_type:
    | 'scene_enter'
    | 'line_replay'
    | 'line_played'
    | 'highlight_tap'
    | 'choice_made'
    | 'spellout_complete'
    | 'spell_result'
    | 'activity_result'
    | 'review_complete'
    | 'story_end';
  payload: Record<string, unknown>;
  occurred_at?: string;
};
