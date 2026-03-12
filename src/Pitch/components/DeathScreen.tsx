import React, { forwardRef } from 'react';
import type { DeathCause, DeathContext } from '../types';
import { t, getText } from '../i18n';
import bgDark from '../img/bg_room.png';
import iconEnergy from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision from '../img/icon_focus.png';
import iconRunway from '../img/icon_runway.png';
import NoiseCanvas from './NoiseCanvas';
import './DeathScreen.less';

interface Props {
  cause: DeathCause;
  deathContext: DeathContext | null;
  runway: number;
  onRestart: () => void;
}

const STAT_ZH: Record<DeathCause, string> = {
  energy: '精力', composure: '心态', vision: '愿景', runway: '资金',
};
const STAT_EN: Record<DeathCause, string> = {
  energy: 'Energy', composure: 'Composure', vision: 'Vision', runway: 'Runway',
};

const CAUSE_ICON: Record<string, string> = {
  energy:    'z(>_<)z',
  composure: '(T_T)',
  runway:    '(X_X)',
  vision:    '(@_@)',
};

const CAUSE_STAT_ICON: Record<string, string> = {
  energy: iconEnergy, composure: iconComposure, runway: iconRunway, vision: iconVision,
};

const CAUSE_COLOR: Record<string, string> = {
  energy:    'var(--pt-energy)',
  composure: 'var(--pt-composure)',
  runway:    'var(--pt-runway)',
  vision:    'var(--pt-vision)',
};

const DeathScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function DeathScreen({ cause, deathContext, runway, onRestart }, ref) {
    const color = CAUSE_COLOR[cause];
    const displayVal = deathContext?.displayValue ?? 0;
    const runwayDisplay = cause === 'runway' ? `${(displayVal / 10).toFixed(1)}mo` : String(displayVal);
    return (
      <div className={`pt-death pt-death--${cause}`} ref={ref}>
        <img className="pt-death__bg" src={bgDark} alt="" draggable={false} />
        <NoiseCanvas opacity={0.22} />
        <div className="pt-death__overlay" />

        <div className="pt-death__inner">
          <div className="pt-death__icon" data-text={CAUSE_ICON[cause]}>{CAUSE_ICON[cause]}</div>

          <h2 className="pt-death__title">{t(`deathTitle_${cause}`)}</h2>

          <div className="pt-death__stat-cause">
            <img className="pt-death__stat-icon" src={CAUSE_STAT_ICON[cause]} alt="" draggable={false} />
            <span className="pt-death__stat-val" style={{ color }}>{runwayDisplay}</span>
          </div>

          {deathContext && (
            <p className="pt-death__ctx" style={{ color }}>
              {getText(
                `${deathContext.labelZh}，${STAT_ZH[cause]} ${deathContext.delta}`,
                `${deathContext.labelEn} — ${STAT_EN[cause]} ${deathContext.delta}`
              )}
            </p>
          )}

          <p className="pt-death__desc">{t(`deathDesc_${cause}`)}</p>
          <p className="pt-death__followers">
            {getText('最终资金', 'Final runway')}{' '}<strong>{(runway / 10).toFixed(1)}mo</strong>
          </p>
          <button className="pt-death__btn" onPointerDown={onRestart}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  })
);

DeathScreen.displayName = 'DeathScreen';
export default DeathScreen;
