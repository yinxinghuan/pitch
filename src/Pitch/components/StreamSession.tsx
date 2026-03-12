import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { StreamEvent, ResponseSpeed, VolatileType } from '../types';
import { getText } from '../i18n';
import bgStream from '../img/bg_stream.png';
import './StreamSession.less';


interface Props {
  event: StreamEvent;
  eventIndex: number;
  totalEvents: number;
  onChoose: (index: number, speed: ResponseSpeed) => void;
  lastFollowerEvent?: { delta: number; type: VolatileType; key: number } | null;
  pendingEnd?: boolean;
  onStreamEnd?: () => void;
}

// ── Video call participants ──────────────────────────────────────────────────
const PARTICIPANTS = [
  { name: 'David Chen', initials: 'DC', role: getText('红杉资本', 'Sequoia Capital'), color: '#6366f1' },
  { name: 'Sarah Kim', initials: 'SK', role: getText('合伙人', 'Partner'), color: '#ec4899' },
  { name: 'Mark Liu', initials: 'ML', role: getText('天使投资人', 'Angel Investor'), color: '#10b981' },
  { name: 'Jenny', initials: 'JY', role: getText('创始人 (你)', 'Founder (You)'), color: '#f59e0b', isYou: true },
] as const;

const TIMER_TOTAL = 8000;
const FAST_THRESHOLD  = 3000;
const SLOW_THRESHOLD  = 6000;

const VOLATILE_CONFIG: Record<VolatileType, {
  label: string; kaomoji: string; colorClass: string;
  descZh: string; descEn: string;
} | null> = {
  viral:       { label: 'BREAKTHROUGH', kaomoji: '(*≧▽≦)', colorClass: 'viral',
                 descZh: '投资人被打动了！资金大涨', descEn: 'Investor impressed! Huge funding boost' },
  boost:       { label: 'INTEREST',     kaomoji: '(＾▽＾)',  colorClass: 'boost',
                 descZh: '引起了兴趣，资金增加', descEn: 'Interest piqued! Funding boosted' },
  controversy: { label: 'RED FLAG',     kaomoji: '(╯°□°）╯', colorClass: 'controversy',
                 descZh: '投资人起了疑虑！资金大跌', descEn: 'Red flag raised! Funding dropped' },
  flop:        { label: 'SKEPTICISM',   kaomoji: '(´・ω・`)', colorClass: 'flop',
                 descZh: '反应平平，效果打折', descEn: 'Skeptical response. Reduced effect' },
  normal:      null,
};

const StreamSession = React.memo(
  forwardRef<HTMLDivElement, Props>(function StreamSession(
    { event, eventIndex, totalEvents, onChoose, lastFollowerEvent, pendingEnd, onStreamEnd }, ref
  ) {
    const [layoutOrder, setLayoutOrder] = useState([0, 1, 2, 3]);
    const [elapsed, setElapsed] = useState(0);
    const [timedOut, setTimedOut] = useState(false);
    const [flash, setFlash] = useState<{ delta: number; type: VolatileType; key: number } | null>(null);
    const [resultText, setResultText] = useState<string | null>(null);
    const [chosenIndex, setChosenIndex] = useState<number | null>(null);
    const startRef = useRef(Date.now());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const chosenRef = useRef(false);
    const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastResultRef = useRef<string | null>(null);

    useEffect(() => {
      if (!lastFollowerEvent || lastFollowerEvent.delta === 0) return;
      setFlash(lastFollowerEvent);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), 2600);
    }, [lastFollowerEvent?.key]);

    useEffect(() => {
      chosenRef.current = false;
      setElapsed(0);
      setTimedOut(false);
      setResultText(null);
      setChosenIndex(null);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      startRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const e = Date.now() - startRef.current;
        setElapsed(e);
        if (e >= TIMER_TOTAL && !chosenRef.current) {
          clearInterval(timerRef.current!);
          setTimedOut(true);
          setTimeout(() => {
            if (!chosenRef.current) {
              chosenRef.current = true;
              onChoose(Math.floor(Math.random() * event.choices.length), 'timeout');
            }
          }, 600);
        }
      }, 80);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      };
    }, [eventIndex]);

    // Shuffle layout order — continuously rotate who's in front/big
    useEffect(() => {
      const iv = setInterval(() => {
        setLayoutOrder(prev => {
          const next = [...prev];
          // Move a random one to the front
          const idx = Math.floor(Math.random() * 4);
          const item = next.splice(idx, 1)[0];
          next.push(item);
          return next;
        });
      }, 2000);
      return () => clearInterval(iv);
    }, []);

    const handleChoose = (index: number) => {
      if (chosenRef.current) return;
      chosenRef.current = true;
      setChosenIndex(index);
      if (timerRef.current) clearInterval(timerRef.current);
      const e = Date.now() - startRef.current;
      const speed: ResponseSpeed = e < FAST_THRESHOLD ? 'fast' : e < SLOW_THRESHOLD ? 'normal' : 'slow';
      const c = event.choices[index];
      const rText = getText(c.resultZh ?? '', c.resultEn ?? '');
      if (rText) {
        setResultText(rText);
        lastResultRef.current = rText;
        resultTimerRef.current = setTimeout(() => {
          setResultText(null);
          onChoose(index, speed);
        }, 2000);
      } else {
        onChoose(index, speed);
      }
    };

    const remaining = Math.max(0, TIMER_TOTAL - elapsed);
    const progress = remaining / TIMER_TOTAL;
    const timerColor = progress > 0.625 ? '#4ade80' : progress > 0.25 ? '#fbbf24' : '#f87171';
    const speedHint = elapsed < FAST_THRESHOLD
      ? getText('快速回应 ×1.5', 'Fast reply ×1.5')
      : elapsed < SLOW_THRESHOLD
        ? getText('回应中…', 'Responding…')
        : getText('投资人在失去耐心…', 'Investor losing patience…');

    const flashConfig = flash ? VOLATILE_CONFIG[flash.type] : null;

    return (
      <div className="pt-stream" ref={ref}>
        <img className="pt-stream__bg" src={bgStream} alt="" draggable={false} />
        <div className="pt-stream__overlay" />

        <div className="pt-stream__topbar">
          <span className="pt-stream__live-badge">MEETING</span>
          <span className="pt-stream__title">{getText('投资人会议', 'Investor Meeting')}</span>
          <span className="pt-stream__progress">{eventIndex + 1}/{totalEvents}</span>
        </div>

        <div className="pt-stream__video-area">
          {PARTICIPANTS.map((p, i) => {
            // slot = position in the visual stack (0=back/small, 3=front/big)
            const slot = layoutOrder.indexOf(i);
            const isYou = 'isYou' in p;
            const isFront = slot === 3;
            return (
              <div
                key={p.name}
                className={`pt-stream__vtile pt-stream__vtile--slot${slot}${
                  isYou ? ' pt-stream__vtile--you' : ''
                }`}
              >
                <div
                  className="pt-stream__vtile-avatar"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}66)` }}
                >
                  {p.initials}
                </div>
                <span className="pt-stream__vtile-name">{p.name}</span>
                {isFront && !isYou && (
                  <div className="pt-stream__vtile-bars">
                    <span /><span /><span /><span />
                  </div>
                )}
                {isYou && <span className="pt-stream__vtile-you">YOU</span>}
                {!isFront && !isYou && (
                  <span className="pt-stream__vtile-role">{p.role}</span>
                )}
              </div>
            );
          })}
        </div>

        {flash && flashConfig && (
          <div
            key={flash.key}
            className={`pt-stream__volatile pt-stream__volatile--${flashConfig.colorClass}`}
          >
            <div className="pt-stream__volatile-backdrop" />
            <span className="pt-stream__volatile-kaomoji">{flashConfig.kaomoji}</span>
            <span className="pt-stream__volatile-label">{flashConfig.label}</span>
            <span className="pt-stream__volatile-delta">
              {flash.delta > 0 ? '+' : ''}{flash.delta}
            </span>
            <span className="pt-stream__volatile-desc">
              {getText(flashConfig.descZh, flashConfig.descEn)}
            </span>
          </div>
        )}
        {flash && !flashConfig && (
          <div key={flash.key} className="pt-stream__volatile pt-stream__volatile--normal">
            <span className="pt-stream__volatile-delta">
              {flash.delta > 0 ? '+' : ''}{flash.delta}
            </span>
          </div>
        )}

        <div className={`pt-stream__card${event.tag ? ' pt-stream__card--special' : ''}`}>
          {event.tag ? (
            <div className="pt-stream__card-tag pt-stream__card-tag--special"
                 style={{ color: event.tag.color, borderColor: event.tag.color }}>
              {getText(event.tag.zh, event.tag.en)}
            </div>
          ) : (
            <div className="pt-stream__card-tag">
              💼 {getText('投资人提问', 'Investor Question')}
            </div>
          )}
          <p className="pt-stream__card-text">
            {resultText ?? (pendingEnd && lastResultRef.current) ?? getText(event.textZh, event.textEn)}
          </p>

          {!resultText && !pendingEnd && (
            <div className="pt-stream__timer-wrap">
              <div
                className="pt-stream__timer-bar"
                style={{ width: `${progress * 100}%`, background: timerColor }}
              />
              <span className="pt-stream__timer-hint" style={{ color: timerColor }}>
                {timedOut ? getText('超时…', 'Timed out…') : speedHint}
              </span>
            </div>
          )}

          <div className="pt-stream__choices">
            {event.choices.map((c, i) => (
              <button
                key={i}
                className={`pt-stream__choice${
                  chosenIndex === i ? ' pt-stream__choice--chosen' : ''
                }${chosenIndex !== null && chosenIndex !== i ? ' pt-stream__choice--dimmed' : ''}`}
                onPointerDown={() => handleChoose(i)}
                disabled={timedOut || chosenIndex !== null}
              >
                {getText(c.labelZh, c.labelEn)}
              </button>
            ))}
          </div>

          {pendingEnd && (
            <button className="pt-stream__end-btn" onPointerDown={onStreamEnd}>
              {getText('结束会议', 'End Meeting')}
            </button>
          )}
        </div>
      </div>
    );
  })
);

StreamSession.displayName = 'StreamSession';
export default StreamSession;
