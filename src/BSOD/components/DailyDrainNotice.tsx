import React, { forwardRef } from 'react';
import iconEnergy    from '../img/icon_energy.png';
import iconMood      from '../img/icon_mood.png';
import iconFocus     from '../img/icon_focus.png';
import iconFollowers from '../img/icon_followers.png';
import { useLocale } from '../i18n';
import './DailyDrainNotice.less';

interface Props {
  onDismiss: () => void;
}

const DRAIN_ITEMS = [
  { icon: iconEnergy,    color: 'var(--bs-energy)',    value: -12 },
  { icon: iconMood,      color: 'var(--bs-mood)',      value: -15 },
  { icon: iconFocus,     color: 'var(--bs-focus)',     value: -5  },
  { icon: iconFollowers, color: 'var(--bs-followers)', value: -40 },
];

const DailyDrainNotice = React.memo(
  forwardRef<HTMLDivElement, Props>(function DailyDrainNotice({ onDismiss }, ref) {
    const { getText } = useLocale();

    return (
      <div className="bs-drain-notice" ref={ref} onPointerDown={onDismiss}>
        <div className="bs-drain-notice__card" onPointerDown={e => e.stopPropagation()}>
          <p className="bs-drain-notice__label">
            {getText('每日消耗', 'DAILY DRAIN')}
          </p>
          <div className="bs-drain-notice__rows">
            {DRAIN_ITEMS.map(({ icon, color, value }, i) => (
              <div
                key={i}
                className="bs-drain-notice__row"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <img
                  className="bs-drain-notice__icon"
                  src={icon}
                  alt=""
                  draggable={false}
                  style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                />
                <span className="bs-drain-notice__val" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
          <button className="bs-drain-notice__btn" onPointerDown={onDismiss}>
            {getText('继续', 'OK')}
          </button>
        </div>
      </div>
    );
  })
);

DailyDrainNotice.displayName = 'DailyDrainNotice';
export default DailyDrainNotice;
