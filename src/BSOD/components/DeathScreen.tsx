import React, { forwardRef } from 'react';
import type { DeathCause } from '../types';
import bgDark from '../img/bg_ending_bsod.png';
import NoiseCanvas from './NoiseCanvas';
import './DeathScreen.less';

interface Props {
  cause: DeathCause;
  followers: number;
  onRestart: () => void;
}

const CAUSE_ICON: Record<string, string> = {
  energy:    '💤',
  mood:      '🌑',
  followers: '📉',
  focus:     '🔲',
};

const DeathScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function DeathScreen({ cause, followers, onRestart }, ref) {
    const CAUSE_TITLE: Record<string, string> = {
      energy:    'BURNT OUT',
      mood:      'EMOTIONALLY DRAINED',
      followers: 'CHANNEL DEAD',
      focus:     'LOST FOCUS',
    };
    const CAUSE_DESC: Record<string, string> = {
      energy:    'You pushed yourself too hard. Rest is not a luxury — it\'s a requirement.',
      mood:      'The pressure crushed you. A streamer needs to take care of their own heart first.',
      followers: 'The numbers hit zero. The community didn\'t survive.',
      focus:     'Your mind scattered. Without focus, the stream fell apart.',
    };

    return (
      <div className={`bs-death bs-death--${cause}`} ref={ref}>
        <img className="bs-death__bg" src={bgDark} alt="" draggable={false} />
        <NoiseCanvas opacity={0.22} />
        <div className="bs-death__overlay" />

        <div className="bs-death__inner">
          <div className="bs-death__icon">{CAUSE_ICON[cause]}</div>
          <h2 className="bs-death__title">{CAUSE_TITLE[cause]}</h2>
          <p className="bs-death__desc">{CAUSE_DESC[cause]}</p>
          <p className="bs-death__followers">
            Final followers{' '}<strong>{followers.toLocaleString()}</strong>
          </p>
          <button className="bs-death__btn" onPointerDown={onRestart}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  })
);

DeathScreen.displayName = 'DeathScreen';
export default DeathScreen;
