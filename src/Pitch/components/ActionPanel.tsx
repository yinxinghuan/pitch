import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n';
import type { GameAction } from '../types';
import iconEnergy from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision from '../img/icon_focus.png';
import iconRunway from '../img/icon_runway.png';
import iconMorale from '../img/icon_connection.png';
import './ActionPanel.less';

interface Props {
  phase: string;
  actions: GameAction[];
  onChoose: (action: GameAction) => void;
}

const ActionPanel = React.memo(
  forwardRef<HTMLDivElement, Props>(function ActionPanel({ phase, actions, onChoose }, ref) {
    const { getText } = useLocale();
    const [expanded, setExpanded] = useState(false);
    const [noScroll, setNoScroll] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setExpanded(false); }, [phase]);

    useEffect(() => {
      if (!expanded) return;
      const el = listRef.current;
      if (!el) return;
      const check = () => setNoScroll(el.scrollHeight <= el.clientHeight);
      check();
      const ro = new ResizeObserver(check);
      ro.observe(el);
      return () => ro.disconnect();
    }, [expanded]);

    const pitchAction = actions.find(a => a.isPitch);
    const regularActions = actions.filter(a => !a.isPitch);

    const handlePitch = () => {
      if (pitchAction) { setExpanded(false); onChoose(pitchAction); }
    };

    const handleChoose = (action: GameAction) => {
      setExpanded(false);
      onChoose(action);
    };

    return (
      <div className="pt-actions" ref={ref}>
        {expanded && (
          <div className={`pt-actions__list-wrap${noScroll ? ' pt-actions__list-wrap--no-scroll' : ''}`}>
            <div className="pt-actions__list" ref={listRef}>
              {regularActions.map(action => (
                <button key={action.id} className="pt-card" onPointerDown={() => handleChoose(action)}>
                  <span className="pt-card__name">
                    {getText(action.labelZh, action.labelEn)}
                  </span>
                  <div className="pt-card__fx">
                    {renderFx(action.effect)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-actions__btns">
          <button
            className={`pt-btn pt-btn--live ${!pitchAction ? 'pt-btn--live-off' : ''}`}
            onPointerDown={pitchAction ? handlePitch : undefined}
            disabled={!pitchAction}
          >
            <span className="pt-btn__dot" />
            PITCH
          </button>
          <button
            className={`pt-btn pt-btn--act ${expanded ? 'pt-btn--act-open' : ''}`}
            onPointerDown={() => setExpanded(e => !e)}
          >
            <span className="pt-btn__arrow">{expanded ? '▲' : '▼'}</span>
            {expanded ? 'CLOSE' : 'ACTIONS'}
          </button>
        </div>
      </div>
    );
  })
);

function renderFx(effect: GameAction['effect']): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  if (effect.energy)     out.push(<Chip key="e"  icon={iconEnergy}    v={effect.energy} />);
  if (effect.composure)  out.push(<Chip key="c"  icon={iconComposure} v={effect.composure} />);
  if (effect.vision)     out.push(<Chip key="v"  icon={iconVision}    v={effect.vision} />);
  if (effect.runway)     out.push(<Chip key="r"  icon={iconRunway}    v={effect.runway} />);
  if (effect.morale)     out.push(<Chip key="m"  icon={iconMorale}    v={effect.morale} />);
  return out;
}

function Chip({ icon, v }: { icon: string; v: number }) {
  const neg = v < 0;
  return (
    <span className={`pt-chip ${neg ? 'pt-chip--neg' : 'pt-chip--pos'}`}>
      <img className="pt-chip__icon" src={icon} alt="" draggable={false} />
      {v > 0 ? '+' : ''}{v}
    </span>
  );
}

ActionPanel.displayName = 'ActionPanel';
export default ActionPanel;
