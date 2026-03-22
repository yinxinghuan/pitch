import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { useGameScore, Leaderboard } from '@shared/leaderboard';
import { usePitch } from './hooks/usePitch';
import type { GameState } from './types';
import StatusBar from './components/StatusBar';
import ActionPanel from './components/ActionPanel';
import EventOverlay from './components/EventOverlay';
import StreamSession from './components/StreamSession';
import DayEndScreen from './components/DayEndScreen';
import EndingScreen from './components/EndingScreen';
import DeathScreen from './components/DeathScreen';
import ActionResultScreen from './components/ActionResultScreen';
import SplashScreen from './components/SplashScreen';
import NoiseCanvas from './components/NoiseCanvas';
import HelpPanel from './components/HelpPanel';
import DailyDrainNotice from './components/DailyDrainNotice';
import bgRoom from './img/bg_room.png';
import jennyIdle from './img/jenny_idle.png';
import jennyHappy from './img/jenny_happy.png';
import jennySad from './img/jenny_sad.png';
import jennySurprised from './img/jenny_surprised.png';
import jennyTired from './img/jenny_tired.png';
import jennyFocused from './img/jenny_focused.png';
import jennyShy from './img/jenny_shy.png';
import jennyStressed from './img/jenny_stressed.png';
import jennyWorn from './img/jenny_worn.png';
import jennyRundown from './img/jenny_rundown.png';
import jennyWreck from './img/jenny_wreck.png';
import jennyManic from './img/jenny_manic.png';
import {
  resumeAudio, playClick, playConfirm, playPanelOpen,
  playGameStart, playStreamStart, playEvent, playStatUp, playStatDown,
  playDayEnd, playGameOver, playVictory,
} from './utils/sounds';
import { startAmbient, setAmbientScene, stopAmbient } from './utils/ambient';
import './Pitch.less';


const JENNY_IMGS: Record<string, string> = {
  normal:    jennyIdle,
  idle:      jennyIdle,
  happy:     jennyHappy,
  sad:       jennySad,
  surprised: jennySurprised,
  tired:     jennyTired,
  focused:   jennyFocused,
  shy:       jennyShy,
  stressed:  jennyStressed,
};

function getConditionSprite(energy: number, composure: number, vision: number): string {
  if (energy < 30 && vision > 65) return jennyManic;
  if (energy < 20 && composure < 20) return jennyWreck;
  if (energy < 30 || composure < 30) return jennyRundown;
  if (energy < 45 || composure < 45) return jennyWorn;
  if (energy >= 65 && composure >= 65) return jennyHappy;
  return jennyIdle;
}

function getJennyVisible(state: GameState): { visible: boolean; emotion: string } {
  const { phase, pendingEvent } = state;
  if (phase === 'event' && pendingEvent) {
    return { visible: true, emotion: pendingEvent.jennyEmotion ?? 'normal' };
  }
  return { visible: false, emotion: 'normal' };
}

// CSS filter classes for time of day
const PHASE_FILTER: Record<string, string> = {
  morning:   'pt--morning',
  build:     'pt--build',
  pitch:     'pt--pitch',
  night:     'pt--night',
  stream:    'pt--pitch',
  event:     'pt--night',
  dayEnd:    'pt--night',
};

const Pitch = React.memo(
  forwardRef<HTMLDivElement, Record<string, never>>(function Pitch(_props, ref) {
    const { state, actions, currentPhaseActions, hasSave } = usePitch();
    const { phase, day, energy, composure, vision, runway, pitchedToday } = state;

    const [showSplash, setShowSplash] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showResume, setShowResume] = useState(() => !!hasSave);
    const { isInAigram, submitScore, fetchGlobalLeaderboard, fetchFriendsLeaderboard } = useGameScore('pitch');

    // 游戏结束时提交分数
    useEffect(() => {
      if (phase === 'ending' || phase === 'dead') {
        const score = runway + day * 100;
        if (score > 0) submitScore(score);
      }
    }, [phase]);

    // ── Phase-change sound effects ────────────────────────────────────────────
    const prevPhase = useRef(phase);
    useEffect(() => {
      const prev = prevPhase.current;
      prevPhase.current = phase;
      if (prev === phase) return;
      setAmbientScene(phase);
      if (phase === 'stream')    playStreamStart();
      if (phase === 'event')     playEvent();
      if (phase === 'dayEnd')    playDayEnd();
      if (phase === 'dead')      { playGameOver(); stopAmbient(); }
      if (phase === 'ending') {
        stopAmbient();
        if (state.endingType === 'unicorn' || state.endingType === 'bootstrap') playVictory();
        else playGameOver();
      }
    }, [phase, state.endingType]);

    // Stat-change feedback
    const prevStats = useRef({ energy, composure, vision });
    useEffect(() => {
      const prev = prevStats.current;
      prevStats.current = { energy, composure, vision };
      const delta = (energy - prev.energy) + (composure - prev.composure) + (vision - prev.vision);
      if (delta >= 8) playStatUp();
      else if (delta <= -8) playStatDown();
    }, [energy, composure, vision]);

    // ── Sound-wrapped actions ─────────────────────────────────────────────────
    const sfx = {
      startGame: () => {
        resumeAudio();
        playGameStart();
        startAmbient('morning');
        actions.startGame();
      },
      restart: () => {
        resumeAudio();
        playGameStart();
        stopAmbient();
        startAmbient('morning');
        actions.restart();
      },
      resumeGame: () => {
        resumeAudio();
        playGameStart();
        startAmbient('morning');
        actions.resumeGame();
      },
      chooseAction: (action: Parameters<typeof actions.chooseAction>[0]) => {
        playConfirm();
        actions.chooseAction(action);
      },
      chooseEventOption: (choice: Parameters<typeof actions.chooseEventOption>[0]) => {
        playConfirm();
        actions.chooseEventOption(choice);
      },
      chooseStreamOption: (...args: Parameters<typeof actions.chooseStreamOption>) => {
        playConfirm();
        actions.chooseStreamOption(...args);
      },
      dismissActionResult: () => {
        playClick();
        actions.dismissActionResult();
      },
      dismissEvent: () => {
        playClick();
        actions.dismissEvent();
      },
      confirmDayEnd: () => {
        playClick();
        actions.confirmDayEnd();
      },
    };

    const { visible: jennyVisible, emotion: jennyEmotion } = getJennyVisible(state);
    const conditionSprite = state.showConditionSprite ? getConditionSprite(energy, composure, vision) : null;
    const jennySrc = conditionSprite ?? (JENNY_IMGS[jennyEmotion] ?? jennyIdle);
    const jennyShowing = jennyVisible || !!conditionSprite || state.showDrainNotice;
    const filterClass = PHASE_FILTER[phase] ?? 'pt--night';


    // ── Splash screen ─────────────────────────────────────────────────────
    if (showSplash) {
      return (
        <div className="pt" ref={ref}>
          <SplashScreen onDone={() => setShowSplash(false)} />
        </div>
      );
    }

    // ── Start screen ──────────────────────────────────────────────────────
    if (phase === 'start') {
      return (
        <div className="pt" ref={ref}>
          {showLeaderboard && (
            <Leaderboard
              gameName="PITCH"
              isInAigram={isInAigram}
              onClose={() => setShowLeaderboard(false)}
              fetchGlobal={fetchGlobalLeaderboard}
              fetchFriends={fetchFriendsLeaderboard}
            />
          )}
          {showResume && hasSave && (
            <div className="pt-resume">
              <div className="pt-resume__panel">
                <div className="pt-resume__icon">💾</div>
                <div className="pt-resume__title">继续上次游戏？</div>
                <div className="pt-resume__sub">第 {hasSave.day} 天的进度已保存</div>
                <button className="pt-resume__btn pt-resume__btn--yes" onPointerDown={() => { setShowResume(false); sfx.resumeGame(); }}>
                  继续
                </button>
                <button className="pt-resume__btn pt-resume__btn--no" onPointerDown={() => setShowResume(false)}>
                  重新开始
                </button>
              </div>
            </div>
          )}
          <img className="pt__start-bg" src={bgRoom} alt="" draggable={false} />
          <NoiseCanvas opacity={0.35} className="pt__start-noise" />
          <div className="pt__start">
            <div className="pt__start-content">
              <h1 className="pt__start-title">PITCH</h1>
              <p className="pt__start-tagline">SERIES A OR BUST</p>
              <p className="pt__start-subtitle">A 13-day startup survival</p>
              <button className="pt__start-btn" onPointerDown={sfx.startGame}>
                LAUNCH
              </button>
              <button className="pt__lb-icon" onPointerDown={() => setShowLeaderboard(true)}>🏆</button>
            </div>
          </div>
        </div>
      );
    }

    // ── Death screen ──────────────────────────────────────────────────────
    if (phase === 'dead' && state.deathCause) {
      return (
        <div className="pt" ref={ref}>
          <DeathScreen
            cause={state.deathCause}
            deathContext={state.deathContext}
            runway={runway}
            onRestart={sfx.restart}
          />
        </div>
      );
    }

    // ── Ending screen ─────────────────────────────────────────────────────
    if (phase === 'ending' && state.endingType) {
      return (
        <div className="pt" ref={ref}>
          <EndingScreen
            endingType={state.endingType}
            runway={runway}
            morale={state.morale}
            onRestart={sfx.restart}
          />
        </div>
      );
    }

    // ── Day end screen ────────────────────────────────────────────────────
    if (phase === 'dayEnd') {
      return (
        <div className="pt" ref={ref}>
          {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
          <StatusBar
            energy={energy} composure={composure} vision={vision}
            runway={runway} day={day} phase={phase}
            pitchedToday={state.pitchedToday}
            onHelpOpen={() => { playPanelOpen(); setShowHelp(true); }}
          />
          <DayEndScreen state={state} onContinue={sfx.confirmDayEnd} />
        </div>
      );
    }

    // ── Main game screen ──────────────────────────────────────────────────
    return (
      <div className="pt" ref={ref}>
        {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}

        <div className={`pt__bg-wrap${phase === 'event' ? ' pt__bg-wrap--blur' : ''}`}>
          <img
            className={`pt__bg ${filterClass}`}
            src={bgRoom}
            alt=""
            draggable={false}
          />
        </div>

        {phase !== 'event' && (
          <StatusBar
            energy={energy} composure={composure} vision={vision}
            runway={runway} day={day} phase={phase}
            pitchedToday={pitchedToday}
            onHelpOpen={() => { playPanelOpen(); setShowHelp(true); }}
            statAnimFrom={state.statAnimFrom ?? undefined}
            onStatAnimEnd={actions.clearStatAnim}
          />
        )}

        {jennyShowing && (
          <div className={`pt__char-area${phase === 'event' ? ' pt__char-area--event' : ''}`}>
            <img
              className="pt__char"
              src={jennySrc}
              alt="Jenny"
              draggable={false}
            />
          </div>
        )}

        <div className="pt__panel">
          <ActionPanel
            phase={phase}
            actions={currentPhaseActions}
            onChoose={sfx.chooseAction}
          />
        </div>

        {phase === 'stream' && state.streamQueue[state.streamIndex] && (
          <StreamSession
            event={state.streamQueue[state.streamIndex]}
            eventIndex={state.streamIndex}
            totalEvents={state.streamQueue.length}
            onChoose={sfx.chooseStreamOption}
            onAdvance={actions.advanceStream}
            lastFollowerEvent={state.streamLastEvent}
            resultPending={state.streamResultPending}
            pendingEnd={state.streamPendingEnd}
            onStreamEnd={actions.confirmStreamEnd}
          />
        )}

        {phase === 'actionResult' && state.lastAction && (
          <ActionResultScreen
            action={state.lastAction}
            onDismiss={sfx.dismissActionResult}
          />
        )}

        {state.showDrainNotice && <DailyDrainNotice />}

        {phase === 'event' && state.pendingEvent && (
          <EventOverlay
            key={state.pendingEvent.id}
            event={state.pendingEvent}
            onChoice={idx => sfx.chooseEventOption(state.pendingEvent!.choices![idx])}
            onDismiss={sfx.dismissEvent}
          />
        )}
      </div>
    );
  })
);

Pitch.displayName = 'Pitch';
export default Pitch;
