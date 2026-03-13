export type Phase =
  | 'start'
  | 'morning'
  | 'build'
  | 'pitch'
  | 'night'
  | 'actionResult'
  | 'event'
  | 'stream'
  | 'dayEnd'
  | 'ending'
  | 'dead';

export type ActionStyle = 'surveillance';

export type SvFootage = 'rest' | 'eat' | 'phone' | 'desk' | 'walk' | 'setup' | 'relax' | 'video' | 'game';

export type ActionPhase = 'morning' | 'build' | 'pitch' | 'night';

export type DeathCause = 'energy' | 'composure' | 'runway' | 'vision';

export interface DeathContext {
  labelZh: string;
  labelEn: string;
  delta: number;
  displayValue: number;
}

export type EndingType = 'unicorn' | 'corporate' | 'bootstrap' | 'sold_out' | 'burnout' | 'indie' | 'shutdown';

export type JennyEmotion = 'normal' | 'happy' | 'sad' | 'surprised' | 'tired' | 'focused' | 'stressed' | 'shy';

export interface StatEffect {
  energy?: number;
  composure?: number;
  vision?: number;
  runway?: number;
  morale?: number;
  flag?: string;
}

export interface GameAction {
  id: string;
  phase: ActionPhase;
  labelZh: string;
  labelEn: string;
  descZh: string;
  descEn: string;
  effect: StatEffect;
  emotion?: JennyEmotion;
  style: ActionStyle;
  svFootage?: SvFootage;
  /** action triggers pitch session mini-game */
  isPitch?: true;
  /** action not available if this returns false */
  condition?: (state: GameStats & { flags: string[] }) => boolean;
  /** volatile outcome type — set at runtime */
  volatileType?: VolatileType;
}

export interface GameStats {
  energy: number;
  composure: number;
  vision: number;
  runway: number;
}

export interface StoryEvent {
  id: string;
  day: number;
  phase: ActionPhase;
  textZh: string;
  textEn: string;
  jennyEmotion?: JennyEmotion;
  choices?: StoryChoice[];
  visitorImg?: string;
  visitorName?: string;
  /** After resolving, skip action and go directly into a pitch session */
  autoStream?: boolean;
}

export interface StoryChoice {
  labelZh: string;
  labelEn: string;
  resultZh?: string;
  resultEn?: string;
  effect: StatEffect;
  emotion?: JennyEmotion;
}

export interface StreamEvent {
  id: string;
  textZh: string;
  textEn: string;
  choices: StreamChoice[];
  tag?: { zh: string; en: string; color?: string };
}

export interface StreamChoice {
  labelZh: string;
  labelEn: string;
  resultZh?: string;
  resultEn?: string;
  effect: StatEffect;
  emotion?: JennyEmotion;
}

export type ResponseSpeed = 'fast' | 'normal' | 'slow' | 'timeout';

export type VolatileType = 'viral' | 'boost' | 'normal' | 'flop' | 'controversy';

export interface DayLog {
  energyDelta: number;
  composureDelta: number;
  visionDelta: number;
  runwayDelta: number;
  pitchedToday: boolean;
  lineZh: string;
  lineEn: string;
}

export interface GameState {
  phase: Phase;
  day: number;
  prevPhase: ActionPhase;
  lastAction: GameAction | null;
  energy: number;
  composure: number;
  vision: number;
  runway: number;
  morale: number;              // hidden, 0–10
  flags: string[];
  pendingEvent: StoryEvent | null;
  streamQueue: StreamEvent[];
  streamIndex: number;
  streamRunwayGained: number;
  streamLastEvent: { delta: number; type: VolatileType; key: number } | null;
  streamPendingEnd: boolean;
  streamResultPending: boolean;
  dayLogStart: GameStats;
  pitchedToday: boolean;
  showDrainNotice: boolean;
  drainAppliedDay: number;
  checkEventAfterDrain: boolean;
  showConditionSprite: boolean;
  statAnimFrom: GameStats | null;
  streamStartStats: GameStats | null;
  deathCause: DeathCause | null;
  deathContext: DeathContext | null;
  endingType: EndingType | null;
}
