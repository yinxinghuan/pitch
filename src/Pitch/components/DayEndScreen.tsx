import React, { forwardRef } from 'react';
import { useLocale } from '../i18n';
import type { GameState } from '../types';
import iconEnergy from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision from '../img/icon_focus.png';
import iconRunway from '../img/icon_runway.png';
import './DayEndScreen.less';

interface Props {
  state: GameState;
  onContinue: () => void;
}

const DAY_LINES_ZH: Record<number, string> = {
  1: '第一天，你走进了那间会议室。',
  2: '团队群里还在讨论，消息不停地弹。',
  3: '电脑屏幕上还开着竞品的网站。',
  4: '妈妈的邮件你还没回。',
  5: '有人在用你做的产品真实地表达自己。',
  6: '你发现白板上的便签已经贴满了整面墙。',
  7: '七天了。你还在。',
  8: '有用户说，你的产品改变了他的生活。',
  9: '那份 Term Sheet 还在抽屉里。',
  10: '团队有人在考虑离开。你理解。',
  11: '联合创始人和你聊了很久。',
  12: 'Demo Day 结束了。该来的都来了。',
  13: '最后一天。',
};
const DAY_LINES_EN: Record<number, string> = {
  1: 'Day one. You walked into that meeting room.',
  2: 'The team Slack is still buzzing. Messages won\'t stop.',
  3: 'The competitor\'s website is still open on your screen.',
  4: 'You haven\'t replied to Mom\'s email.',
  5: 'Someone is using your product to express themselves authentically.',
  6: 'The whiteboard sticky notes have filled an entire wall.',
  7: 'Seven days. You\'re still here.',
  8: 'A user said your product changed their life.',
  9: 'That Term Sheet is still in the drawer.',
  10: 'Someone on the team is thinking about leaving. You understand.',
  11: 'Your co-founder had a long talk with you.',
  12: 'Demo Day is over. Everyone who mattered showed up.',
  13: 'Last day.',
};

const DayEndScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function DayEndScreen({ state, onContinue }, ref) {
    const { getText } = useLocale();
    const { day, energy, composure, vision, runway, dayLogStart, pitchedToday } = state;

    const deltas = {
      energy: Math.round(energy - dayLogStart.energy),
      composure: Math.round(composure - dayLogStart.composure),
      vision: Math.round(vision - dayLogStart.vision),
      runway: runway - dayLogStart.runway,
    };

    const line = getText(DAY_LINES_ZH[day] ?? '', DAY_LINES_EN[day] ?? '');
    const runwayDeltaDisplay = deltas.runway !== 0
      ? `${deltas.runway > 0 ? '+' : ''}${(deltas.runway / 10).toFixed(1)}mo`
      : '0';

    return (
      <div className="pt-dayend" ref={ref}>
        <div className="pt-dayend__inner">
          <div className="pt-dayend__header">
            <span className="pt-dayend__label">DAY {day} / 13</span>
            <span className="pt-dayend__tag">{getText('结束', 'END')}</span>
          </div>

          <p className="pt-dayend__line">{line}</p>

          {pitchedToday && (
            <p className="pt-dayend__streamed">{getText('今天开了投资人会议。', 'You had an investor meeting today.')}</p>
          )}

          <div className="pt-dayend__deltas">
            <StatDelta icon={iconEnergy}    val={deltas.energy}    color="var(--pt-energy)" />
            <StatDelta icon={iconComposure} val={deltas.composure} color="var(--pt-composure)" />
            <StatDelta icon={iconVision}    val={deltas.vision}    color="var(--pt-vision)" />
          </div>
          <div className="pt-dayend__followers">
            <img className="pt-dayend__flw-icon" src={iconRunway} alt="" draggable={false} />
            <span className={`pt-dayend__flw-val${deltas.runway < 0 ? ' pt-dayend__flw-val--neg' : ''}`}
                  style={{ color: 'var(--pt-runway)' }}>
              {runwayDeltaDisplay}
            </span>
          </div>

          <button className="pt-dayend__continue" onPointerDown={onContinue}>
            {day >= 13
              ? getText('查看结局', 'See ending')
              : getText(`继续 → 第 ${day + 1} 天`, `Continue → Day ${day + 1}`)}
          </button>
        </div>
      </div>
    );
  })
);

function StatDelta({ icon, val, color }: { icon: string; val: number; color: string }) {
  const sign = val > 0 ? '+' : '';
  return (
    <div className="pt-dayend__stat">
      <img className="pt-dayend__stat-icon" src={icon} alt="" draggable={false} />
      <span className={`pt-dayend__stat-val${val < 0 ? ' pt-dayend__stat-val--neg' : ''}`}
            style={{ color }}>
        {sign}{val}
      </span>
    </div>
  );
}

DayEndScreen.displayName = 'DayEndScreen';
export default DayEndScreen;
