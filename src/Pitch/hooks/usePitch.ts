import { useCallback, useState } from 'react';
import type {
  GameState, Phase, ActionPhase, StatEffect, GameStats,
  DeathCause, EndingType, GameAction, StoryChoice, ResponseSpeed, VolatileType,
} from '../types';
import { STORY_EVENTS, pickStreamEvents, pickPrologueStreamEvents } from '../data/events';
import { getActionsForPhase } from '../data/actions';

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_DAYS = 13;

const INITIAL_STATS = {
  energy: 70,
  composure: 60,
  vision: 75,
  runway: 60, // unit = month×10, so 60 = 6.0 months
};

// Passive drain each day at morning start
const DAILY_DRAIN = { energy: -10, composure: -12, vision: -4, runway: -4, morale: -1 };

const PHASE_ORDER: ActionPhase[] = ['morning', 'build', 'pitch', 'night'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

// Adds volatility to runway deltas during pitch sessions.
export function volatileRunway(base: number): { value: number; type: VolatileType } {
  if (base === 0) return { value: 0, type: 'normal' };
  const r = Math.random();
  if (base > 0) {
    if (r < 0.04) return { value: Math.round(base * (5 + Math.random() * 5)),    type: 'viral' };
    if (r < 0.14) return { value: Math.round(base * (1.8 + Math.random())),       type: 'boost' };
    if (r < 0.26) return { value: Math.round(base * (0.3 + Math.random() * 0.3)), type: 'flop' };
    return { value: base, type: 'normal' };
  } else {
    if (r < 0.07) return { value: Math.round(base * (3 + Math.random() * 2)),    type: 'controversy' };
    return { value: base, type: 'normal' };
  }
}

function applyEffect(state: GameState, effect: StatEffect): GameState {
  return {
    ...state,
    energy: clamp(state.energy + (effect.energy ?? 0)),
    composure: clamp(state.composure + (effect.composure ?? 0)),
    vision: clamp(state.vision + (effect.vision ?? 0)),
    runway: Math.max(0, state.runway + (effect.runway ?? 0)),
    morale: Math.min(10, Math.max(0, state.morale + (effect.morale ?? 0))),
    flags: effect.flag ? [...state.flags, effect.flag] : state.flags,
  };
}

function deathDelta(effect: StatEffect, cause: DeathCause): number {
  if (cause === 'energy')    return effect.energy    ?? 0;
  if (cause === 'composure') return effect.composure ?? 0;
  if (cause === 'vision')    return effect.vision    ?? 0;
  return effect.runway ?? 0;
}

function preStat(s: GameState, cause: DeathCause): number {
  if (cause === 'energy')    return s.energy;
  if (cause === 'composure') return s.composure;
  if (cause === 'vision')    return s.vision;
  return s.runway;
}

function snap(s: GameState): GameStats {
  return { energy: s.energy, composure: s.composure, vision: s.vision, runway: s.runway };
}

function checkDeath(state: GameState): DeathCause | null {
  if (state.energy <= 0) return 'energy';
  if (state.composure <= 0) return 'composure';
  if (state.vision <= 0) return 'vision';
  if (state.runway <= 0) return 'runway';
  return null;
}

function calcEnding(state: GameState): EndingType {
  const { runway, morale, energy, composure, vision } = state;
  // Specific conditions checked first
  if (runway > 15 && morale >= 8 && (energy < 15 || composure < 15)) return 'burnout';
  if (morale >= 9 && runway <= 5) return 'indie';
  if (runway > 18 && morale <= 2) return 'sold_out';
  // General conditions
  if (runway > 12 && vision >= 60 && morale >= 6) return 'unicorn';
  if (runway > 12 && vision < 40) return 'corporate';
  if (vision >= 70 && morale >= 7) return 'bootstrap';
  return 'shutdown';
}

function getStoryEvent(day: number, phase: ActionPhase, flags: string[]) {
  return STORY_EVENTS.find(
    e => e.day === day && e.phase === phase && !flags.includes(`ev_${e.id}`)
  ) ?? null;
}

function initialState(): GameState {
  return {
    phase: 'start',
    day: 1,
    prevPhase: 'morning',
    ...INITIAL_STATS,
    morale: 5,
    flags: [],
    pendingEvent: null,
    lastAction: null,
    streamQueue: [],
    streamIndex: 0,
    streamRunwayGained: 0,
    streamLastEvent: null,
    streamPendingEnd: false,
    dayLogStart: { ...INITIAL_STATS },
    pitchedToday: false,
    showDrainNotice: false,
    drainAppliedDay: 1,
    checkEventAfterDrain: false,
    showConditionSprite: false,
    statAnimFrom: null,
    streamStartStats: null,
    deathCause: null,
    deathContext: null,
    endingType: null,
  };
}

function enterPhase(state: GameState, phase: ActionPhase): GameState {
  let next = { ...state, phase: phase as Phase, prevPhase: phase, statAnimFrom: null };

  // Daily drain at morning start
  if (phase === 'morning' && next.drainAppliedDay !== next.day) {
    const preDrain = snap(next);
    next = {
      ...next,
      energy: clamp(next.energy + DAILY_DRAIN.energy),
      composure: clamp(next.composure + DAILY_DRAIN.composure),
      vision: clamp(next.vision + DAILY_DRAIN.vision),
      runway: Math.max(0, next.runway + DAILY_DRAIN.runway),
      morale: Math.min(10, Math.max(0, next.morale + DAILY_DRAIN.morale)),
      drainAppliedDay: next.day,
      pitchedToday: false,
      dayLogStart: {
        energy: next.energy,
        composure: next.composure,
        vision: next.vision,
        runway: next.runway,
      },
    };
    const death = checkDeath(next);
    if (death) { const d = deathDelta(DAILY_DRAIN, death); return { ...next, phase: 'dead', deathCause: death, deathContext: {
      labelZh: '每日消耗', labelEn: 'Daily burn',
      delta: d, displayValue: preDrain[death === 'composure' ? 'composure' : death === 'vision' ? 'vision' : death === 'runway' ? 'runway' : 'energy'] + d,
    }}; }
    (next as GameState).statAnimFrom = preDrain;
    next = { ...next, showDrainNotice: true, checkEventAfterDrain: true, showConditionSprite: true };
    return next;
  }

  // Check for story event
  const event = getStoryEvent(next.day, phase, next.flags);
  if (event) {
    return {
      ...next,
      phase: 'event',
      prevPhase: phase,
      pendingEvent: event,
      flags: [...next.flags, `ev_${event.id}`],
      statAnimFrom: null,
    };
  }

  return next;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePitch() {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback(() => {
    setState(s => enterPhase({ ...s, phase: 'start' }, 'morning'));
  }, []);

  const chooseEventOption = useCallback((choice: StoryChoice) => {
    setState(s => {
      if (s.phase !== 'event' || !s.pendingEvent) return s;
      const before = snap(s);
      const autoStream = s.pendingEvent.autoStream;
      let next = applyEffect(s, choice.effect);
      const death = checkDeath(next);
      if (death) { const d = deathDelta(choice.effect, death); return { ...next, phase: 'dead', deathCause: death, deathContext: {
        labelZh: choice.labelZh, labelEn: choice.labelEn,
        delta: d, displayValue: preStat(s, death) + d,
      }}; }

      if (autoStream) {
        const queue = pickPrologueStreamEvents();
        return {
          ...next,
          pendingEvent: null,
          phase: 'stream' as Phase,
          prevPhase: s.prevPhase,
          lastAction: null,
          streamQueue: queue,
          streamIndex: 0,
          streamRunwayGained: 0,
          streamLastEvent: null,
          streamPendingEnd: false,
          pitchedToday: true,
          streamStartStats: before,
          statAnimFrom: null,
        };
      }

      const result = enterPhase({ ...next, pendingEvent: null }, s.prevPhase);
      if ((PHASE_ORDER as string[]).includes(result.phase)) {
        return { ...result, statAnimFrom: before };
      }
      return result;
    });
  }, []);

  const dismissEvent = useCallback(() => {
    setState(s => {
      if (s.phase !== 'event' || !s.pendingEvent) return s;
      return enterPhase({ ...s, pendingEvent: null }, s.prevPhase);
    });
  }, []);

  const chooseAction = useCallback((action: GameAction) => {
    setState(s => {
      const currentPhase = s.phase as ActionPhase;
      if (!PHASE_ORDER.includes(currentPhase)) return s;
      const volatileAction: GameAction = action.effect.runway
        ? (() => {
            const { value, type } = volatileRunway(action.effect.runway);
            return { ...action, effect: { ...action.effect, runway: value }, volatileType: type };
          })()
        : action;
      return {
        ...s,
        phase: 'actionResult' as Phase,
        lastAction: volatileAction,
        prevPhase: currentPhase,
        showConditionSprite: false,
      };
    });
  }, []);

  const dismissActionResult = useCallback(() => {
    setState(s => {
      if (s.phase !== 'actionResult' || !s.lastAction) return s;
      const action = s.lastAction;
      const currentPhase = s.prevPhase;
      const before = snap(s);

      if (action.isPitch) {
        const queue = pickStreamEvents();
        let next = applyEffect(s, action.effect);
        return {
          ...next,
          phase: 'stream' as Phase,
          lastAction: null,
          streamQueue: queue,
          streamIndex: 0,
          streamRunwayGained: 0,
          streamLastEvent: null,
          pitchedToday: true,
          streamStartStats: before,
        };
      }

      let next = applyEffect({ ...s, lastAction: null }, action.effect);
      const death = checkDeath(next);
      if (death) { const d = deathDelta(action.effect, death); return { ...next, phase: 'dead', deathCause: death, deathContext: {
        labelZh: action.labelZh, labelEn: action.labelEn,
        delta: d, displayValue: preStat(s, death) + d,
      }}; }

      const result = advancePhase(next, currentPhase);
      if ((PHASE_ORDER as string[]).includes(result.phase)) {
        return { ...result, statAnimFrom: before };
      }
      return result;
    });
  }, []);

  const chooseStreamOption = useCallback((choiceIndex: number, speed: ResponseSpeed) => {
    setState(s => {
      if (s.phase !== 'stream') return s;
      const event = s.streamQueue[s.streamIndex];
      if (!event) return s;
      const choice = event.choices[choiceIndex];
      if (!choice) return s;

      let volatileType: VolatileType = 'normal';
      const volatileEffect: typeof choice.effect = (() => {
        if (!choice.effect.runway) return choice.effect;
        const { value, type } = volatileRunway(choice.effect.runway);
        volatileType = type;
        return { ...choice.effect, runway: value };
      })();

      // Composure multiplier on runway gains
      const composureFactor = s.composure >= 75 ? 1.3
        : s.composure >= 50 ? 1.0
        : s.composure >= 25 ? 0.65
        : 0.35;
      const adjustedEffect = volatileEffect.runway
        ? { ...volatileEffect, runway: Math.round(volatileEffect.runway * composureFactor) }
        : volatileEffect;

      let next = applyEffect(s, adjustedEffect);

      // Speed bonus/penalty
      const speedBonus: Record<ResponseSpeed, number> = {
        fast:    0.5,
        normal:  0,
        slow:    -0.5,
        timeout: -1.0,
      };
      const bonus = speedBonus[speed];
      if (bonus !== 0 && adjustedEffect.runway) {
        const extra = Math.round(adjustedEffect.runway * Math.abs(bonus));
        next = applyEffect(next, {
          runway: bonus > 0 ? extra : -extra,
          composure: speed === 'timeout' ? -5 : 0,
        });
      }

      const death = checkDeath(next);
      if (death) { const d = deathDelta(adjustedEffect, death); return { ...next, phase: 'dead', deathCause: death, deathContext: {
        labelZh: choice.labelZh, labelEn: choice.labelEn,
        delta: d, displayValue: preStat(s, death) + d,
      }}; }

      const gained = next.runway - s.runway;
      const lastEvent = adjustedEffect.runway
        ? { delta: adjustedEffect.runway, type: volatileType, key: (s.streamLastEvent?.key ?? 0) + 1 }
        : s.streamLastEvent;
      next = { ...next, streamRunwayGained: s.streamRunwayGained + Math.max(0, gained), streamLastEvent: lastEvent };

      const nextIndex = s.streamIndex + 1;
      if (nextIndex >= s.streamQueue.length) {
        return { ...next, streamPendingEnd: true };
      }
      return { ...next, streamIndex: nextIndex };
    });
  }, []);

  const confirmStreamEnd = useCallback(() => {
    setState(s => {
      if (s.phase !== 'stream' || !s.streamPendingEnd) return s;
      const result = advancePhase({ ...s, streamPendingEnd: false }, s.prevPhase);
      if ((PHASE_ORDER as string[]).includes(result.phase) && s.streamStartStats) {
        return { ...result, statAnimFrom: s.streamStartStats };
      }
      return result;
    });
  }, []);

  const confirmDayEnd = useCallback(() => {
    setState(s => {
      if (s.phase !== 'dayEnd') return s;
      if (s.day >= TOTAL_DAYS) {
        const endingType = calcEnding(s);
        return { ...s, phase: 'ending', endingType };
      }
      return enterPhase({ ...s, day: s.day + 1 }, 'morning');
    });
  }, []);

  const clearStatAnim = useCallback(() => {
    setState(s => {
      const next = { ...s, statAnimFrom: null, showDrainNotice: false, checkEventAfterDrain: false };
      if (s.checkEventAfterDrain) {
        const event = getStoryEvent(next.day, next.phase as ActionPhase, next.flags);
        if (event) {
          return {
            ...next,
            phase: 'event' as Phase,
            prevPhase: next.phase as ActionPhase,
            pendingEvent: event,
            flags: [...next.flags, `ev_${event.id}`],
          };
        }
      }
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    setState(initialState());
  }, []);

  return {
    state,
    actions: {
      startGame,
      chooseEventOption,
      dismissEvent,
      chooseAction,
      dismissActionResult,
      chooseStreamOption,
      confirmStreamEnd,
      confirmDayEnd,
      clearStatAnim,
      restart,
    },
    currentPhaseActions: PHASE_ORDER.includes(state.phase as ActionPhase)
      ? getActionsForPhase(state.phase as ActionPhase).filter(
          a => !a.condition || a.condition({ ...state })
        )
      : [],
  };
}

// ── Phase advancement ─────────────────────────────────────────────────────────

function advancePhase(state: GameState, currentPhase: ActionPhase): GameState {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  if (idx < PHASE_ORDER.length - 1) {
    return enterPhase(state, PHASE_ORDER[idx + 1]);
  }
  return { ...state, phase: 'dayEnd' };
}
