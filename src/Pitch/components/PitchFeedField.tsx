import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocale } from '../i18n';
import './PitchFeedField.less';

type Tone = 'pass' | 'positive' | 'urgent' | 'casual' | 'metric';
type Tag = 'INV' | 'SLK' | 'EML' | 'PRS' | 'SMS' | 'STAT';

interface FeedItem { tag: Tag; sender: string; text: string; tone: Tone }

const FEED_EN: FeedItem[] = [
  { tag: 'INV',  sender: 'a16z',         text: 'passing on this round',           tone: 'pass' },
  { tag: 'INV',  sender: 'sequoia',      text: 'not a fit right now',             tone: 'pass' },
  { tag: 'INV',  sender: 'lightspeed',   text: 'we\'d love a follow-up',          tone: 'positive' },
  { tag: 'INV',  sender: 'index',        text: 'send the deck',                   tone: 'positive' },
  { tag: 'INV',  sender: 'angellist',    text: 'too early-stage for us',          tone: 'pass' },
  { tag: 'EML',  sender: 'cofounder',    text: 'add monetization?',               tone: 'urgent' },
  { tag: 'SLK',  sender: '@team',        text: 'server is down',                  tone: 'urgent' },
  { tag: 'STAT', sender: 'metrics',      text: 'burn: $48K / mo',                 tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: 'runway: 56 days',                 tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: 'DAU: 12,847',                     tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: 'churn: 4.1%',                     tone: 'metric' },
  { tag: 'PRS',  sender: 'TechCrunch',   text: 'SocialBuzz raised $50M',          tone: 'pass' },
  { tag: 'PRS',  sender: 'The Verge',    text: 'is the social bubble back?',      tone: 'casual' },
  { tag: 'SMS',  sender: 'mom',          text: 'have you eaten?',                 tone: 'casual' },
  { tag: 'SMS',  sender: 'mom',          text: 'don\'t overwork',                 tone: 'casual' },
  { tag: 'EML',  sender: 'AWS billing',  text: 'overage: 3× expected',            tone: 'urgent' },
  { tag: 'EML',  sender: 'lawyer',       text: 're: term sheet draft',            tone: 'positive' },
  { tag: 'INV',  sender: 'first round',  text: 'add me to the next iteration',    tone: 'positive' },
  { tag: 'SLK',  sender: 'designer',     text: 'logo v17 attached',               tone: 'casual' },
  { tag: 'SLK',  sender: 'eng-lead',     text: 'we ship in 6h',                   tone: 'urgent' },
  { tag: 'INV',  sender: 'YC partner',   text: 'be ready for office hours',       tone: 'positive' },
  { tag: 'STAT', sender: 'metrics',      text: 'NPS: 41',                         tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: 'D7 retention: 38%',               tone: 'metric' },
  { tag: 'EML',  sender: 'investor',     text: 'too crowded a space',             tone: 'pass' },
  { tag: 'EML',  sender: 'investor',     text: 'love the team — let\'s talk',     tone: 'positive' },
  { tag: 'PRS',  sender: 'Information',  text: 'a competitor folded',             tone: 'casual' },
  { tag: 'SMS',  sender: 'cofounder',    text: 'we good?',                        tone: 'urgent' },
  { tag: 'SLK',  sender: '@channel',     text: 'all-hands at 4',                  tone: 'casual' },
  { tag: 'INV',  sender: 'GV',           text: 'send numbers',                    tone: 'positive' },
  { tag: 'STAT', sender: 'metrics',      text: 'CAC: $14.20',                     tone: 'metric' },
];

const FEED_ZH: FeedItem[] = [
  { tag: 'INV',  sender: '红杉',          text: '这一轮暂时不参与',                 tone: 'pass' },
  { tag: 'INV',  sender: 'IDG',          text: '可以再聊一次',                     tone: 'positive' },
  { tag: 'INV',  sender: '高瓴',          text: '不太适合',                         tone: 'pass' },
  { tag: 'INV',  sender: '经纬',          text: 'BP 发我',                          tone: 'positive' },
  { tag: 'INV',  sender: '险峰',          text: '阶段太早了',                       tone: 'pass' },
  { tag: 'EML',  sender: '联合创始人',    text: '要不要加商业化',                   tone: 'urgent' },
  { tag: 'SLK',  sender: '@team',        text: '服务器挂了',                       tone: 'urgent' },
  { tag: 'STAT', sender: 'metrics',      text: '月烧 ¥35万',                       tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: '现金跑道 56 天',                   tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: 'DAU 12,847',                       tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: '次留 38%',                         tone: 'metric' },
  { tag: 'PRS',  sender: '36氪',          text: 'SocialBuzz 融了 5000 万美元',     tone: 'pass' },
  { tag: 'PRS',  sender: '虎嗅',          text: '社交赛道还有得做吗',               tone: 'casual' },
  { tag: 'SMS',  sender: '妈',            text: '吃饭了没',                         tone: 'casual' },
  { tag: 'SMS',  sender: '妈',            text: '别太累了',                         tone: 'casual' },
  { tag: 'EML',  sender: '云服务',        text: '流量超标 3 倍',                    tone: 'urgent' },
  { tag: 'EML',  sender: '律师',          text: 're: term sheet 修订稿',            tone: 'positive' },
  { tag: 'INV',  sender: '真格',          text: '下一轮再加我',                     tone: 'positive' },
  { tag: 'SLK',  sender: '设计师',        text: 'logo v17',                         tone: 'casual' },
  { tag: 'SLK',  sender: '研发负责人',    text: '6 小时后上线',                     tone: 'urgent' },
  { tag: 'INV',  sender: '徐小平',        text: '认真看了 BP',                      tone: 'positive' },
  { tag: 'STAT', sender: 'metrics',      text: 'NPS 41',                           tone: 'metric' },
  { tag: 'STAT', sender: 'metrics',      text: 'GMV ¥2.4M',                        tone: 'metric' },
  { tag: 'EML',  sender: '投资人',        text: '赛道太挤',                         tone: 'pass' },
  { tag: 'EML',  sender: '投资人',        text: '团队不错，先聊一次',               tone: 'positive' },
  { tag: 'PRS',  sender: 'PingWest',     text: '一家友商关停',                     tone: 'casual' },
  { tag: 'SMS',  sender: '联合创始人',    text: '还行吗',                           tone: 'urgent' },
  { tag: 'SLK',  sender: '@全员',         text: '4 点全员会',                       tone: 'casual' },
  { tag: 'INV',  sender: '蓝驰',          text: '把数据发我',                       tone: 'positive' },
  { tag: 'STAT', sender: 'metrics',      text: 'CAC ¥98',                          tone: 'metric' },
];

interface FieldItem {
  item: FeedItem;
  laneX: number;
  x: number; y: number;
  vx: number; vy: number;
  baseVy: number;
  el: HTMLDivElement;
}

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PitchFeedField() {
  const { locale } = useLocale();
  const fieldRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordsRef = useRef<FieldItem[]>([]);

  const initial = useMemo(() => {
    const pool = locale === 'zh' ? FEED_ZH : FEED_EN;
    const rng = mulberry32(13);
    const list: FeedItem[] = [];
    const N = 40;
    for (let i = 0; i < N; i++) list.push(pool[Math.floor(rng() * pool.length)]);
    return list;
  }, [locale]);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const fr = field.getBoundingClientRect();
    const lanes = new Map<number, number>();
    const lrng = mulberry32(53);

    const rawHomes = elsRef.current.map(el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { hx: r.left + r.width / 2 - fr.left, hy: r.top + r.height / 2 - fr.top };
    });
    const ys = rawHomes.filter(h => h !== null).map(h => h!.hy);
    const minY = Math.min.apply(null, ys);
    const maxY = Math.max.apply(null, ys);
    const yRange = Math.max(maxY - minY, 1);
    const padTop = 18, padBottom = 18;
    const targetTop = padTop, targetBottom = fr.height - padBottom;

    const words: FieldItem[] = [];
    elsRef.current.forEach((el, i) => {
      if (!el) return;
      const raw = rawHomes[i];
      if (!raw) return;
      const hx = raw.hx;
      const hy = targetTop + ((raw.hy - minY) / yRange) * (targetBottom - targetTop);
      const colKey = Math.round(hx / 140);
      let baseVy = lanes.get(colKey);
      if (baseVy === undefined) {
        const speed = 0.32 + lrng() * 0.45;        // 19–46 px/sec — calmer than BSOD
        baseVy = -speed;
        lanes.set(colKey, baseVy);
      }
      words.push({ item: initial[i], laneX: hx, x: hx, y: hy, vx: 0, vy: baseVy, baseVy, el });
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.transform = `translate3d(${hx.toFixed(2)}px,${hy.toFixed(2)}px,0) translate(-50%,-50%)`;
    });
    wordsRef.current = words;
  }, [initial]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const SPRING_X = 0.04, X_DAMP = 0.9, Y_EASE = 0.06;
    const WAVE_AMP_X = 0.04, WRAP_PAD = 80;

    const tick = (now: number) => {
      const dtSec = Math.min((now - last) / 1000, 0.05);
      last = now;
      const dt = Math.min(dtSec * 60, 3);

      const field = fieldRef.current;
      if (!field) { raf = requestAnimationFrame(tick); return; }
      const fr = field.getBoundingClientRect();
      const fieldH = fr.height;

      const words = wordsRef.current;
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        w.vx += Math.sin(now * 0.0002 + w.laneX * 0.05) * WAVE_AMP_X;
        w.vy += (w.baseVy - w.vy) * Y_EASE;
        w.vx += (w.laneX - w.x) * SPRING_X;
        w.vx *= X_DAMP;
        w.x += w.vx * dt;
        w.y += w.vy * dt;
        if (w.y < -WRAP_PAD)              w.y += fieldH + 2 * WRAP_PAD;
        else if (w.y > fieldH + WRAP_PAD) w.y -= fieldH + 2 * WRAP_PAD;
        w.el.style.transform = `translate3d(${w.x.toFixed(2)}px,${w.y.toFixed(2)}px,0) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pt-feed-field" ref={fieldRef} aria-hidden>
      {initial.map((it, i) => (
        <div
          key={i}
          ref={el => { elsRef.current[i] = el; }}
          className={`pt-feed-card pt-feed-card--${it.tone}`}
        >
          <span className={`pt-feed-card__tag pt-feed-card__tag--${it.tag.toLowerCase()}`}>{it.tag}</span>
          <span className="pt-feed-card__sender">{it.sender}</span>
          <span className="pt-feed-card__text">{it.text}</span>
        </div>
      ))}
    </div>
  );
}
