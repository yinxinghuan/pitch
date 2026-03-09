import React, { forwardRef } from 'react';
import type { StoryEvent } from '../types';
import { getText } from '../i18n';
import './EventOverlay.less';

interface Props {
  event: StoryEvent;
  onChoice: (index: number) => void;
  onDismiss: () => void;
}

const EventOverlay = React.memo(
  forwardRef<HTMLDivElement, Props>(function EventOverlay({ event, onChoice, onDismiss }, ref) {
    return (
      <div className="bs-event" ref={ref}>
        {/* Visitor character sprite — left side */}
        {event.visitorImg && (
          <img
            className="bs-event__visitor"
            src={event.visitorImg}
            alt={event.visitorName ?? ''}
            draggable={false}
          />
        )}

        <div className="bs-event__card">
          {event.visitorName && (
            <div className="bs-event__visitor-name">{event.visitorName}</div>
          )}
          <p className="bs-event__text">{getText(event.textZh, event.textEn)}</p>
          {event.choices && event.choices.length > 0 ? (
            <div className="bs-event__choices">
              {event.choices.map((c, i) => (
                <button
                  key={i}
                  className="bs-event__choice"
                  onPointerDown={() => onChoice(i)}
                >
                  {getText(c.labelZh, c.labelEn)}
                </button>
              ))}
            </div>
          ) : (
            <button className="bs-event__dismiss" onPointerDown={onDismiss}>
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
