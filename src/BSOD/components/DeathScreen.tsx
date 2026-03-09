import React, { forwardRef } from 'react';
import type { DeathCause, DeathContext } from '../types';
import { t, getText } from '../i18n';
import bgDark from '../img/bg_ending_bsod.png';
import iconEnergy from '../img/icon_energy.png';
import iconMood from '../img/icon_mood.png';
import iconFocus from '../img/icon_focus.png';
import iconFollowers from '../img/icon_followers.png';
import NoiseCanvas from './NoiseCanvas';
import './DeathScreen.less';

interface Props {
  cause: DeathCause;
  deathContext: DeathContext | null;
  followers: number;
  onRestart: () => void;
}

const STAT_ZH: Record<DeathCause, string> = {
  energy: '精力', mood: '心情', focus: '专注', followers: '粉丝',
};
const STAT_EN: Record<DeathCause, string> = {
  energy: 'Energy', mood: 'Mood', focus: 'Focus', followers: 'Followers',
};

const CAUSE_ICON: Record<string, string> = {
  energy:    'z(>_<)z',
  mood:      '(T_T)',
  followers: '(X_X)',
  focus:     '(@_@)',
};

const CAUSE_STAT_ICON: Record<string, string> = {
  energy: iconEnergy, mood: iconMood, followers: iconFollowers, focus: iconFocus,
};

const CAUSE_COLOR: Record<string, string> = {
  energy:    'var(--bs-energy)',
  mood:      'var(--bs-mood)',
  followers: 'var(--bs-followers)',
  focus:     'var(--bs-focus)',
};

const DeathScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function DeathScreen({ cause, deathContext, followers, onRestart }, ref) {
    const color = CAUSE_COLOR[cause];
    const displayVal = deathContext?.displayValue ?? 0;
    return (
      <div className={`bs-death bs-death--${cause}`} ref={ref}>
        <img className="bs-death__bg" src={bgDark} alt="" draggable={false} />
        <NoiseCanvas opacity={0.22} />
        <div className="bs-death__overlay" />

        <div className="bs-death__inner">
          <div className="bs-death__icon" data-text={CAUSE_ICON[cause]}>{CAUSE_ICON[cause]}</div>

          <h2 className="bs-death__title">{t(`deathTitle_${cause}`)}</h2>

          <div className="bs-death__stat-cause">
            <img className="bs-death__stat-icon" src={CAUSE_STAT_ICON[cause]} alt="" draggable={false} />
            <span className="bs-death__stat-val" style={{ color }}>{displayVal}</span>
          </div>

          {deathContext && (
            <p className="bs-death__ctx" style={{ color }}>
              {getText(
                `${deathContext.labelZh}，${STAT_ZH[cause]} ${deathContext.delta}`,
                `${deathContext.labelEn} — ${STAT_EN[cause]} ${deathContext.delta}`
              )}
            </p>
          )}

          <p className="bs-death__desc">{t(`deathDesc_${cause}`)}</p>
          <p className="bs-death__followers">
            {getText('最终粉丝', 'Final followers')}{' '}<strong>{followers.toLocaleString()}</strong>
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
