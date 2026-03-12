const translations = {
  zh: {
    title: 'PITCH',
    subtitle: '融资倒计时',
    startBtn: 'Launch',
    day: '第 {n} 天',
    of13: '/ 13',
    phase_morning: '早晨',
    phase_build: '开发',
    phase_pitch: '会议',
    phase_night: '深夜',
    stat_energy: '精力',
    stat_composure: '心态',
    stat_vision: '愿景',
    stat_runway: '资金',
    hidden_morale: '（士气）',
    chooseAction: '选择接下来做什么',
    dayEndTitle: '今天结束了',
    dayEndContinue: '继续',
    streamTitle: '投资人会议中',
    streamEnd: '结束会议',
    streamGained: '+{n} 资金',
    continueBtn: '继续',
    replayBtn: '重新开始',
    deathTitle_energy: '过劳倒下',
    deathTitle_composure: '精神崩溃',
    deathTitle_runway: '资金耗尽',
    deathTitle_vision: '迷失方向',
    deathDesc_energy: '你已经不记得上一次好好睡觉是什么时候了。每天醒来就是会议、代码、融资——身体终于撑不住了。\n\n你在键盘前倒下时，屏幕上还开着 pitch deck。',
    deathDesc_composure: '不是某一件大事把你击垮的。是很多小事——投资人的冷脸、团队的焦虑、凌晨三点的自我怀疑。\n\n你关上了电脑。然后就再也没有打开过。',
    deathDesc_runway: '数字一直在减。你知道的，但你告诉自己还有办法。\n\n最后一个月的工资发不出去了。团队的消息你没回。\n\n公司就这样消失了，像它从来没存在过一样。',
    deathDesc_vision: '你不是不想做，是真的不知道要做什么了。\n\n产品方向、用户需求、为什么开始——全都模糊了。你坐在电脑前，代码编辑器空白一片。你没有敲下一行字。',
    'ending.unicorn.title': '独角兽',
    'ending.unicorn.sub': '有人被你的理想打动了。',
    'ending.unicorn.text': '有投资人被"真实表达"的理念打动，按你的条件投了钱——不加信息流，不加广告。这条路很难，但你证明了它走得通。',
    'ending.corporate.title': '上岸',
    'ending.corporate.sub': '钱到了。你变了。',
    'ending.corporate.text': '你妥协了，加了算法推荐和广告位。融到了钱，DAU 暴涨。但当你打开自己的产品时，觉得有些陌生了。',
    'ending.bootstrap.title': '独立之路',
    'ending.bootstrap.sub': '没人投钱。但产品还在。',
    'ending.bootstrap.text': '没人投钱，你决定用最后的积蓄继续做。小而美，养活团队就好。产品依然纯粹。',
    'ending.sold_out.title': '卖掉了',
    'ending.sold_out.sub': '大公司来了。',
    'ending.sold_out.text': '大公司收购了团队。你的产品变成了巨头生态的一个功能模块。银行账户数字很好看，但那已经不是你的东西了。',
    'ending.burnout.title': '燃尽',
    'ending.burnout.sub': '你赢了。你也空了。',
    'ending.burnout.text': '钱到手了，理想也在，但你已经透支了自己。盯着屏幕，发不出一行代码。掌声来的时候，你只是很累。',
    'ending.indie.title': '小众经典',
    'ending.indie.sub': '不多。但真的。',
    'ending.indie.text': '没融到资，但一小群用户在社区里写长文说"这是唯一让我觉得被看见的地方"。你的银行账户快见底了，但每天都有人给你发消息说谢谢。',
    'ending.shutdown.title': '关停',
    'ending.shutdown.sub': '域名到期了。',
    'ending.shutdown.text': '资金耗尽。你发出最后一封邮件："感谢你们曾经相信我们。" 域名到期那天，没有人注意到。',
    errorCode: '错误代码：0x0000JENNY',
    goodMorning: '早上好。',
    runwayUnit: '个月',
  },
  en: {
    title: 'PITCH',
    subtitle: 'Series A or Bust',
    startBtn: 'Launch',
    day: 'Day {n}',
    of13: '/ 13',
    phase_morning: 'Morning',
    phase_build: 'Build',
    phase_pitch: 'Pitch',
    phase_night: 'Night',
    stat_energy: 'Energy',
    stat_composure: 'Composure',
    stat_vision: 'Vision',
    stat_runway: 'Runway',
    hidden_morale: '(morale)',
    chooseAction: 'What will you do?',
    dayEndTitle: 'Day Done',
    dayEndContinue: 'Continue',
    streamTitle: 'Investor Meeting',
    streamEnd: 'End Meeting',
    streamGained: '+{n} runway',
    continueBtn: 'Continue',
    replayBtn: 'Restart',
    deathTitle_energy: 'Burned Out',
    deathTitle_composure: 'Mental Breakdown',
    deathTitle_runway: 'Bankrupt',
    deathTitle_vision: 'Lost Direction',
    deathDesc_energy: 'You can\'t remember the last time you slept properly. Every morning it\'s meetings, code, fundraising — your body finally gave out.\n\nYou collapsed at the keyboard. The pitch deck was still open.',
    deathDesc_composure: 'It wasn\'t one big thing. It was the accumulation — cold investors, anxious teammates, 3 AM self-doubt.\n\nYou closed the laptop. And never opened it again.',
    deathDesc_runway: 'The numbers kept dropping. You knew. You told yourself there\'d be a way.\n\nThe last month\'s salaries couldn\'t be paid. You stopped answering the team\'s messages.\n\nThe company disappeared like it never existed.',
    deathDesc_vision: 'It wasn\'t that you didn\'t want to build. You just didn\'t know what to build anymore.\n\nProduct direction, user needs, why you started — all of it blurred. You sat at the computer, editor blank. You didn\'t type a single line.',
    'ending.unicorn.title': 'Unicorn',
    'ending.unicorn.sub': 'Someone believed in your vision.',
    'ending.unicorn.text': 'An investor was moved by your "authentic expression" vision and funded you on your terms — no feeds, no ads. It was the hardest path, but you proved it works.',
    'ending.corporate.title': 'Gone Corporate',
    'ending.corporate.sub': 'The money came. You changed.',
    'ending.corporate.text': 'You compromised. Added algorithmic feeds and ad placements. Raised the round, DAU skyrocketed. But when you opened your own product, it felt like someone else\'s.',
    'ending.bootstrap.title': 'Bootstrapped',
    'ending.bootstrap.sub': 'No funding. Product lives on.',
    'ending.bootstrap.text': 'No one invested. You decided to keep going with your last savings. Small and beautiful, enough to keep the team alive. The product stayed pure.',
    'ending.sold_out.title': 'Acquired',
    'ending.sold_out.sub': 'Big tech came knocking.',
    'ending.sold_out.text': 'A big company acquired the team. Your product became a feature module in their ecosystem. The bank account looks great, but it\'s not yours anymore.',
    'ending.burnout.title': 'Burned Out',
    'ending.burnout.sub': 'You won. And emptied yourself doing it.',
    'ending.burnout.text': 'Money secured, vision intact, but you\'re spent. Staring at the screen, unable to write a single line of code. The applause came — and all you felt was tired.',
    'ending.indie.title': 'Cult Classic',
    'ending.indie.sub': 'Not many. But real.',
    'ending.indie.text': 'No funding came through, but a small group of users wrote essays saying "this is the only place where I feel truly seen." Your bank account is nearly empty, but every day someone messages you to say thanks.',
    'ending.shutdown.title': 'Shutdown',
    'ending.shutdown.sub': 'The domain expired.',
    'ending.shutdown.text': 'Funds depleted. You sent one last email: "Thank you for believing in us." The day the domain expired, no one noticed.',
    errorCode: 'Error: 0x0000JENNY',
    goodMorning: 'Good morning.',
    runwayUnit: '',
  },
} as const;

type Locale = keyof typeof translations;

function detectLocale(): Locale {
  const override = typeof localStorage !== 'undefined' ? localStorage.getItem('pitch_locale') : null;
  if (override === 'en' || override === 'zh') return override;
  const lang = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
}

const locale = detectLocale();

export function t(key: string, vars?: { n?: number | string }): string {
  const dict = translations[locale] as Record<string, string>;
  let str = dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  if (vars?.n !== undefined) str = str.replace('{n}', String(vars.n));
  return str;
}

export function getText(zh: string, en: string): string {
  return locale === 'zh' ? zh : en;
}

export function useLocale() {
  return { t, locale, getText };
}
