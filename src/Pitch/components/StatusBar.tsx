import React, { forwardRef, useEffect, useRef, useState } from 'react';
import iconEnergy from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision from '../img/icon_focus.png';
import iconRunway from '../img/icon_followers.png';
import { playCountTick } from '../utils/sounds';
import './StatusBar.less';

interface Props {
  energy: number;
  composure: number;
  vision: number;
  runway: number;
  day: number;
  phase: string;
  pitchedToday: boolean;
  onHelpOpen: () => void;
  statAnimFrom?: { energy: number; composure: number; vision: number; runway: number };
  onStatAnimEnd?: () => void;
}

const DAY_PHASES = ['morning', 'build', 'pitch', 'night'] as const;
type DayPhase = typeof DAY_PHASES[number];

const PHASE_LABEL: Record<DayPhase, string> = {
  morning: 'AM', build: 'BUILD', pitch: 'PITCH', night: 'NIGHT',
};

const PHASE_FILL: Record<string, number> = {
  morning: 0, build: 33, pitch: 66, night: 100, stream: 66,
};

const STAT_DUR_MS = 650;

const StatusBar = React.memo(
  forwardRef<HTMLDivElement, Props>(function StatusBar(
    { energy, composure, vision, runway, day, phase, pitchedToday, onHelpOpen,
      statAnimFrom, onStatAnimEnd }, ref
  ) {
    const activePhase: DayPhase | null =
      (DAY_PHASES as readonly string[]).includes(phase) ? phase as DayPhase
      : phase === 'stream' ? 'pitch' : null;
    const activeIdx = activePhase ? DAY_PHASES.indexOf(activePhase) : -1;
    const fillPct = PHASE_FILL[phase] ?? 0;

    const [anim, setAnim] = useState({ energy, composure, vision, runway });
    const onStatAnimEndRef = useRef(onStatAnimEnd);
    onStatAnimEndRef.current = onStatAnimEnd;

    useEffect(() => {
      if (!statAnimFrom) {
        setAnim({ energy, composure, vision, runway });
      }
    }, [energy, composure, vision, runway, statAnimFrom]);

    useEffect(() => {
      if (!statAnimFrom) return;

      type StatKey = 'energy' | 'composure' | 'vision' | 'runway';
      const ALL_STATS: StatKey[] = ['energy', 'composure', 'vision', 'runway'];
      const targets: Record<StatKey, number> = { energy, composure, vision, runway };

      const changed = ALL_STATS.filter(k => statAnimFrom[k] !== targets[k]);
      if (changed.length === 0) {
        onStatAnimEndRef.current?.();
        return;
      }

      setAnim({ ...statAnimFrom });

      let statIdx = 0;
      let elapsed = 0;
      let lastTime = performance.now();
      let rafId: number;
      let prevDisplayVal = statAnimFrom[changed[0]];

      function step(now: number) {
        const dt = now - lastTime;
        lastTime = now;
        elapsed += dt;

        const key = changed[statIdx];
        const from = statAnimFrom![key];
        const to = targets[key];
        const t = Math.min(elapsed / STAT_DUR_MS, 1);
        const val = Math.round(from + (to - from) * t);

        if (val !== prevDisplayVal) {
          playCountTick(to > from);
          prevDisplayVal = val;
        }

        setAnim(prev => ({ ...prev, [key]: val }));

        if (t >= 1) {
          elapsed = 0;
          statIdx++;
          if (statIdx >= changed.length) {
            onStatAnimEndRef.current?.();
            return;
          }
          prevDisplayVal = statAnimFrom![changed[statIdx]];
        }
        rafId = requestAnimationFrame(step);
      }

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statAnimFrom]);

    // Display runway as months (runway / 10)
    const runwayMonths = (anim.runway / 10).toFixed(1);

    return (
      <div className="pt-status" ref={ref} onPointerDown={onHelpOpen}>

        {/* Row 1: DAY + runway */}
        <div className="pt-status__top">
          <div className="pt-status__day">
            <span className="pt-status__day-label">DAY</span>
            <span className="pt-status__day-num">{day}</span>
            <span className="pt-status__day-slash">/ 13</span>
          </div>
          <div className="pt-status__right">
            <div className="pt-status__flw">
              <img className="pt-status__flw-icon" src={iconRunway} alt="" draggable={false} />
              <span className={`pt-status__flw-num${statAnimFrom && anim.runway !== runway ? ' pt-status__flw-num--counting' : ''}`}>
                {runwayMonths}mo
              </span>
            </div>
            <span className="pt-status__help-hint">?</span>
          </div>
        </div>

        {/* Row 2: 3 stats */}
        <div className="pt-status__stats">
          <Stat icon={iconEnergy}    value={anim.energy}    color="var(--pt-energy)" />
          <Stat icon={iconComposure} value={anim.composure} color="var(--pt-composure)" />
          <Stat icon={iconVision}    value={anim.vision}    color="var(--pt-vision)" />
        </div>

        {/* Row 3: Day timeline */}
        <div className="pt-timeline">
          <div className="pt-timeline__track">
          <div className="pt-timeline__bar">
            <div className="pt-timeline__fill" style={{ width: `${fillPct}%` }} />
            <div className="pt-timeline__live-zone" />
            <div className="pt-timeline__tick" style={{ left: '33%' }} />
            <div className="pt-timeline__tick pt-timeline__tick--live" style={{ left: '66%' }} />
            {activeIdx >= 0 && (
              <div className="pt-timeline__cursor"
                   style={{ left: `${[0, 33, 66, 100][activeIdx]}%` }} />
            )}
          </div>
          <div className="pt-timeline__labels">
            {DAY_PHASES.map((p, i) => {
              const pct  = [0, 33, 66, 100][i];
              const isActive = i === activeIdx;
              const isPast   = i < activeIdx;
              const isPitch  = p === 'pitch';
              const isDone   = isPitch && pitchedToday;
              return (
                <div key={p} className="pt-timeline__lbl-item" style={{ left: `${pct}%` }}>
                  <span className={[
                    'pt-timeline__lbl',
                    isActive ? 'pt-timeline__lbl--active' : '',
                    isPast   ? 'pt-timeline__lbl--past'   : '',
                  ].join(' ')}>
                    {PHASE_LABEL[p]}
                  </span>
                  {isPitch && (
                    <span className={[
                      'pt-timeline__live-tag',
                      isActive && !isDone ? 'pt-timeline__live-tag--on' : '',
                      isDone ? 'pt-timeline__live-tag--done' : '',
                    ].join(' ')}>
                      {isDone ? '✓' : 'MEET'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>

      </div>
    );
  })
);

function Stat({ icon, value, color }: { icon: string; value: number; color: string }) {
  const danger = value <= 20;
  return (
    <div className="pt-stat">
      <img className="pt-stat__icon" src={icon} alt="" draggable={false} />
      <span className={`pt-stat__num ${danger ? 'pt-stat__num--danger' : ''}`}
            style={danger ? undefined : { color }}>
        {Math.round(value)}
      </span>
    </div>
  );
}

StatusBar.displayName = 'StatusBar';
export default StatusBar;
