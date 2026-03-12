import React, { forwardRef, useRef, useState } from 'react';
import type { StatEffect, StoryEvent } from '../types';
import { getText } from '../i18n';
import iconEnergy    from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision    from '../img/icon_focus.png';
import iconRunway    from '../img/icon_runway.png';
import './EventOverlay.less';

interface Props {
  event: StoryEvent;
  onChoice: (index: number) => void;
  onDismiss: () => void;
}

const STAT_ICONS: { key: keyof StatEffect; icon: string }[] = [
  { key: 'energy',    icon: iconEnergy    },
  { key: 'composure', icon: iconComposure },
  { key: 'vision',    icon: iconVision    },
  { key: 'runway',    icon: iconRunway    },
];

const EventOverlay = React.memo(
  forwardRef<HTMLDivElement, Props>(function EventOverlay({ event, onChoice, onDismiss }, ref) {
    const [feedback, setFeedback] = useState<{ effect: StatEffect; index: number; resultZh?: string; resultEn?: string } | null>(null);
    const chosenRef = useRef(false);

    const handleChoice = (index: number) => {
      if (chosenRef.current) return;
      chosenRef.current = true;
      const c = event.choices![index];
      setFeedback({ effect: c.effect, index, resultZh: c.resultZh, resultEn: c.resultEn });
    };

    const handleFeedbackDismiss = () => {
      if (feedback) onChoice(feedback.index);
    };

    return (
      <div className="pt-event" ref={ref} onPointerDown={feedback ? handleFeedbackDismiss : undefined}>
        <div className="pt-event__card">
          {event.visitorImg && (
            <div className="pt-event__visitor-header">
              <div className="pt-event__visitor-avatar">
                <img
                  src={event.visitorImg}
                  alt={event.visitorName ?? ''}
                  draggable={false}
                />
              </div>
              {event.visitorName && (
                <span className="pt-event__visitor-name">{event.visitorName}</span>
              )}
            </div>
          )}
          <p className="pt-event__text">
            {feedback && (feedback.resultZh || feedback.resultEn)
              ? getText(feedback.resultZh ?? '', feedback.resultEn ?? '')
              : getText(event.textZh, event.textEn)}
          </p>

          {feedback ? (
            <div className="pt-event__feedback">
              <div className="pt-event__feedback-pills">
                {STAT_ICONS.map(({ key, icon }) => {
                  const v = feedback.effect[key] as number | undefined;
                  if (!v) return null;
                  return (
                    <div key={key} className={`pt-event__feedback-pill pt-event__feedback-pill--${v > 0 ? 'pos' : 'neg'}`}>
                      <img className="pt-event__feedback-icon" src={icon} alt={key} draggable={false} />
                      <span>{v > 0 ? '+' : ''}{v}</span>
                    </div>
                  );
                })}
              </div>
              <div className="pt-event__feedback-hint">{getText('点击继续', 'Tap to continue')}</div>
            </div>
          ) : event.choices && event.choices.length > 0 ? (
            <div className="pt-event__choices" onPointerDown={e => e.stopPropagation()}>
              {event.choices.map((c, i) => (
                <button
                  key={i}
                  className="pt-event__choice"
                  onPointerDown={() => handleChoice(i)}
                >
                  {getText(c.labelZh, c.labelEn)}
                </button>
              ))}
            </div>
          ) : (
            <button className="pt-event__dismiss" onPointerDown={onDismiss}>
              {getText('继续', 'Continue')}
            </button>
          )}
        </div>
      </div>
    );
  })
);

EventOverlay.displayName = 'EventOverlay';
export default EventOverlay;
