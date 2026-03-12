import React, { forwardRef } from 'react';
import iconEnergy    from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision    from '../img/icon_focus.png';
import iconRunway    from '../img/icon_runway.png';
import { useLocale } from '../i18n';
import './HelpPanel.less';

interface Props {
  onClose: () => void;
}

const HelpPanel = React.memo(
  forwardRef<HTMLDivElement, Props>(function HelpPanel({ onClose }, ref) {
    const { getText } = useLocale();

    return (
      <div className="pt-help" ref={ref} onPointerDown={e => e.stopPropagation()}>
        <div className="pt-help__backdrop" onPointerDown={onClose} />

        <div className="pt-help__panel">
          <div className="pt-help__header">
            <span className="pt-help__title">HOW TO PLAY</span>
            <button className="pt-help__close" onPointerDown={onClose}>✕</button>
          </div>

          <div className="pt-help__section-label">
            {getText('状态指标', 'STATUS')}
          </div>
          <div className="pt-help__stats">
            <HelpStat
              icon={iconEnergy} color="var(--pt-energy)"
              name={getText('精力', 'Energy')}
              desc={getText('归零则过劳倒下', 'Hits zero = burnout')}
            />
            <HelpStat
              icon={iconComposure} color="var(--pt-composure)"
              name={getText('心态', 'Composure')}
              desc={getText('影响会议表现与决策质量', 'Affects pitch performance & decisions')}
            />
            <HelpStat
              icon={iconVision} color="var(--pt-vision)"
              name={getText('愿景', 'Vision')}
              desc={getText('产品方向清晰度，归零则迷失', 'Product clarity; zero = lost direction')}
            />
            <HelpStat
              icon={iconRunway} color="var(--pt-runway)"
              name={getText('资金', 'Runway')}
              desc={getText('剩余月数，归零则破产', 'Months remaining; zero = bankrupt')}
            />
          </div>

          <div className="pt-help__section-label">
            {getText('每日时间轴', 'DAILY TIMELINE')}
          </div>
          <div className="pt-help__timeline-desc">
            <TimeSegment label="AM"    color="#7aaa60" desc={getText('早晨 — 精力充沛，适合调整状态', 'Morning — peak energy, good for recovery')} />
            <TimeSegment label="BUILD" color="#7aaa60" desc={getText('开发 — 写代码、设计、带团队', 'Build — code, design, lead the team')} />
            <TimeSegment label="PITCH" color="#ef4444" desc={getText('会议 — 投资人会议时段，错过则失去融资机会', 'Pitch — investor meeting window. Miss it and lose funding chance')} />
            <TimeSegment label="NIGHT" color="#7aaa60" desc={getText('深夜 — 恢复或加班', 'Night — recover or work overtime')} />
          </div>

          <div className="pt-help__section-label">
            {getText('每日消耗（每天早晨扣除）', 'DAILY BURN (deducted each morning)')}
          </div>
          <div className="pt-help__drain">
            <DrainRow icon={iconEnergy}    color="var(--pt-energy)"    value={-10} />
            <DrainRow icon={iconComposure} color="var(--pt-composure)" value={-12} />
            <DrainRow icon={iconVision}    color="var(--pt-vision)"    value={-4} />
            <DrainRow icon={iconRunway}    color="var(--pt-runway)"    value={-4} />
          </div>

          <p className="pt-help__tip">
            {getText(
              '坚持 13 天。在理想与生存之间找到你的答案。',
              'Survive 13 days. Find your answer between ideals and survival.'
            )}
          </p>
        </div>
      </div>
    );
  })
);

function HelpStat({ icon, color, name, desc }: {
  icon: string; color: string; name: string; desc: string;
}) {
  return (
    <div className="pt-help__stat">
      <img className="pt-help__stat-icon" src={icon} alt="" draggable={false}
           style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <div className="pt-help__stat-text">
        <span className="pt-help__stat-name" style={{ color }}>{name}</span>
        <span className="pt-help__stat-desc">{desc}</span>
      </div>
    </div>
  );
}

function DrainRow({ icon, color, value }: { icon: string; color: string; value: number }) {
  return (
    <div className="pt-help__drain-row">
      <img className="pt-help__stat-icon" src={icon} alt="" draggable={false}
           style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <span className="pt-help__drain-val" style={{ color }}>{value}</span>
    </div>
  );
}

function TimeSegment({ label, color, desc }: { label: string; color: string; desc: string }) {
  const isPitch = label === 'PITCH';
  return (
    <div className="pt-help__seg">
      <span className="pt-help__seg-label" style={{ color: isPitch ? '#ef4444' : color }}>
        {label}{isPitch && <span className="pt-help__seg-live"> MEET</span>}
      </span>
      <span className="pt-help__seg-desc">{desc}</span>
    </div>
  );
}

HelpPanel.displayName = 'HelpPanel';
export default HelpPanel;
