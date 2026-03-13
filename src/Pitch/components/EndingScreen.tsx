import React, { forwardRef } from 'react';
import type { EndingType } from '../types';
import { t, getText } from '../i18n';
import bgRoom from '../img/bg_room.png';
import jennyHappy     from '../img/jenny_happy.png';
import jennyIdle      from '../img/jenny_idle.png';
import jennyFocused   from '../img/jenny_focused.png';
import jennySad       from '../img/jenny_sad.png';
import jennyTired     from '../img/jenny_tired.png';
import jennySurprised from '../img/jenny_surprised.png';
import NoiseCanvas from './NoiseCanvas';
import './EndingScreen.less';

interface Props {
  endingType: EndingType;
  runway: number;
  morale: number;
  onRestart: () => void;
}

const ENDING_JENNY: Record<EndingType, string> = {
  unicorn:    jennyHappy,
  corporate:  jennySad,
  bootstrap:  jennyFocused,
  sold_out:   jennyIdle,
  burnout:    jennyTired,
  indie:      jennySurprised,
  shutdown:   jennySad,
};

const EndingScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function EndingScreen(
    { endingType, runway, morale, onRestart }, ref
  ) {
    const jennySrc = ENDING_JENNY[endingType];
    const runwayK = Math.round(runway * 10);

    // ── Shutdown ending: 404 style ──────────────────────────────────
    if (endingType === 'shutdown') {
      return (
        <div className="pt-ending pt-ending--shutdown" ref={ref}>
          <img className="pt-ending__bg" src={bgRoom} alt="" draggable={false} />
          <NoiseCanvas opacity={0.18} />
          <div className="pt-ending__shutdown-panel">
            <div className="pt-ending__shutdown-code">404</div>
            <p className="pt-ending__shutdown-main">
              {getText(
                '页面未找到。服务器已关闭。',
                'Page not found. Server has been shut down.'
              )}
            </p>
            <p className="pt-ending__shutdown-cmd">$ shutdown -h now</p>
            <div className="pt-ending__shutdown-stats">
              <span>{getText('资金', 'Runway')}: {runwayK}K</span>
              <span>{getText('士气', 'Morale')}: {morale} / 10</span>
            </div>
            <button className="pt-ending__shutdown-btn" onPointerDown={onRestart}>
              PLAY AGAIN
            </button>
          </div>
          <img className="pt-ending__jenny" src={jennySrc} alt="" draggable={false} />
        </div>
      );
    }

    // ── Normal endings ────────────────────────────────────────────
    return (
      <div className={`pt-ending pt-ending--${endingType}`} ref={ref}>
        <img className="pt-ending__bg" src={bgRoom} alt="" draggable={false} />
        <NoiseCanvas opacity={0.15} />
        <div className="pt-ending__overlay" />
        <img className="pt-ending__jenny" src={jennySrc} alt="" draggable={false} />

        <div className="pt-ending__content">
          <div className="pt-ending__tag">{getText('第 13 天 · 结局', 'Day 13 · Ending')}</div>
          <h2 className="pt-ending__title">{t(`ending.${endingType}.title`)}</h2>
          <p className="pt-ending__sub">{t(`ending.${endingType}.sub`)}</p>
          <p className="pt-ending__text">{t(`ending.${endingType}.text`)}</p>

          <div className="pt-ending__stats">
            <div className="pt-ending__stat">
              <span className="pt-ending__stat-num" style={{ color: 'var(--pt-runway)' }}>
                {runwayK}K
              </span>
              <span className="pt-ending__stat-label">{getText('最终资金', 'final runway')}</span>
            </div>
            <div className="pt-ending__stat">
              <span className="pt-ending__stat-num" style={{ color: 'var(--pt-morale)' }}>
                {morale} / 10
              </span>
              <span className="pt-ending__stat-label">{getText('士气', 'morale')}</span>
            </div>
          </div>

          <button className="pt-ending__btn" onPointerDown={onRestart}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  })
);

EndingScreen.displayName = 'EndingScreen';
export default EndingScreen;
