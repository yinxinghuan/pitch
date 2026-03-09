import React, { forwardRef } from 'react';
import type { EndingType } from '../types';
import bgOnline  from '../img/bg_ending_online.png';
import bgOffline from '../img/bg_ending_offline.png';
import bgRestart from '../img/bg_ending_restart.png';
import bgBsodRoom from '../img/bg_ending_bsod.png';
import NoiseCanvas from './NoiseCanvas';
import './EndingScreen.less';

interface Props {
  endingType: EndingType;
  followers: number;
  connection: number;
  onRestart: () => void;
}

const ENDING_BG: Record<string, string> = {
  online:  bgOnline,
  offline: bgOffline,
  restart: bgRestart,
  bsod:    bgBsodRoom,
};

const ENDING_TITLE: Record<string, string> = {
  online:  'Online',
  offline: 'Offline',
  restart: 'Restart',
  bsod:    'BSOD',
};

const ENDING_SUB: Record<string, string> = {
  online:  "You're still here. And so are they.",
  offline: "When the screen goes dark, there's nothing.",
  restart: 'No viral moment. But people showed up.',
  bsod:    'Critical System Failure',
};

const ENDING_TEXT: Record<string, string> = {
  online:  "You won in a game that wasn't supposed to be winnable. Not just the numbers — some people know your name is Laisa, not just \"some streamer\".",
  offline: "The numbers went up. You forgot when you stopped answering messages. The stream was always full. But something felt missing.",
  restart: "No overnight explosion, slow follower growth. But they were there every time you went live, and you knew their usernames. Maybe that's enough.",
  bsod:    'A fatal error has occurred. Your existence could not be saved.',
};

const EndingScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function EndingScreen(
    { endingType, followers, connection, onRestart }, ref
  ) {
    const bg = ENDING_BG[endingType];

    // ── BSOD ending: Windows BSOD aesthetic over the chaos room ──────────────
    if (endingType === 'bsod') {
      return (
        <div className="bs-ending bs-ending--bsod" ref={ref}>
          <img className="bs-ending__bg" src={bg} alt="" draggable={false} />
          <NoiseCanvas opacity={0.18} />
          <div className="bs-ending__bsod-panel">
            <div className="bs-ending__bsod-face">:(</div>
            <p className="bs-ending__bsod-main">
              Your stream encountered a problem and needs to restart.
            </p>
            <p className="bs-ending__bsod-code">0x0000LAISA</p>
            <p className="bs-ending__bsod-code">SYSTEM_THREAD_EXCEPTION_NOT_HANDLED</p>
            <p className="bs-ending__bsod-collecting">
              Collecting error info
              <span className="bs-ending__bsod-dots" />
            </p>
            <div className="bs-ending__bsod-stats">
              <span>Followers: {followers.toLocaleString()}</span>
              <span>Bond: {connection} / 10</span>
            </div>
            <button className="bs-ending__bsod-btn" onPointerDown={onRestart}>
              PLAY AGAIN
            </button>
          </div>
        </div>
      );
    }

    // ── Normal endings: room background + gradient + text ────────────────────
    return (
      <div className={`bs-ending bs-ending--${endingType}`} ref={ref}>
        <img className="bs-ending__bg" src={bg} alt="" draggable={false} />
        <NoiseCanvas opacity={0.18} />
        <div className="bs-ending__overlay" />

        <div className="bs-ending__content">
          <div className="bs-ending__tag">Day 13 · Ending</div>
          <h2 className="bs-ending__title">{ENDING_TITLE[endingType]}</h2>
          <p className="bs-ending__sub">{ENDING_SUB[endingType]}</p>
          <p className="bs-ending__text">{ENDING_TEXT[endingType]}</p>

          <div className="bs-ending__stats">
            <div className="bs-ending__stat">
              <span className="bs-ending__stat-num" style={{ color: 'var(--bs-followers)' }}>
                {followers.toLocaleString()}
              </span>
              <span className="bs-ending__stat-label">final followers</span>
            </div>
            <div className="bs-ending__stat">
              <span className="bs-ending__stat-num" style={{ color: 'var(--bs-connection)' }}>
                {connection} / 10
              </span>
              <span className="bs-ending__stat-label">bond</span>
            </div>
          </div>

          <button className="bs-ending__btn" onPointerDown={onRestart}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  })
);

EndingScreen.displayName = 'EndingScreen';
export default EndingScreen;
