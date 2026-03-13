import type { StoryEvent, StreamEvent } from '../types';

// ── Visitor sprites ───────────────────────────────────────────────────────────
import algram_normal     from '../img/visitors/algram_normal.png';
// algram_happy used in future events
import ghostpixel_normal from '../img/visitors/ghostpixel_normal.png';
import jmf_normal        from '../img/visitors/jmf_normal.png';
import isaya_normal      from '../img/visitors/isaya_normal.png';
import isabel_normal     from '../img/visitors/isabel_normal.png';

// ── Story Events ─────────────────────────────────────────────────────────────

export const STORY_EVENTS: StoryEvent[] = [
  // ── Day 1: 资金告急 + 首次 pitch ──
  {
    id: 'day1_morning',
    day: 1,
    phase: 'morning',
    textZh: '你打开银行账户，数字刺眼地跳动着。按照当前的消耗速度，公司的资金只够撑两个月。\n\n今天下午有投资人约了首次会议。这是你最后的机会之一。',
    textEn: 'You open the bank account. The numbers stare back, merciless. At the current burn rate, you have two months of runway left.\n\nAn investor meeting is set for this afternoon. One of your last chances.',
    jennyEmotion: 'stressed',
    autoStream: true,
    choices: [
      {
        labelZh: '深呼吸，准备战斗',
        labelEn: 'Deep breath. Time to fight.',
        resultZh: '你整理了 pitch deck，走进会议室。',
        resultEn: 'You polish the pitch deck and walk in.',
        effect: { composure: 8, vision: 5 },
        emotion: 'focused',
      },
      {
        labelZh: '……也许该考虑 Plan B 了',
        labelEn: '...maybe it\'s time for a Plan B',
        resultZh: '你犹豫了一会儿，但还是去了。',
        resultEn: 'You hesitate, but show up anyway.',
        effect: { composure: -8, vision: 10 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 2: 团队得知资金状况 ──
  {
    id: 'day2_build',
    day: 2,
    phase: 'build',
    textZh: '团队得知了资金状况。午饭时气氛变得很安静。\n\n你的联合创始人拉你到一边说："要不要……先加一些商业化功能？先活下来再说。"',
    textEn: 'The team learned about the funding situation. Lunch was unusually quiet.\n\nYour co-founder pulls you aside: "Should we... add some monetization features? Survive first, ideals later."',
    jennyEmotion: 'sad',
    choices: [
      {
        labelZh: '"我们再坚持一下"',
        labelEn: '"Let\'s hold the line a bit longer"',
        resultZh: '联合创始人点了点头，但眼里有担忧。',
        resultEn: 'Your co-founder nods, worry still in their eyes.',
        effect: { vision: 8, morale: 1, composure: -6 },
        emotion: 'normal',
      },
      {
        labelZh: '"你说得对，先活下来"',
        labelEn: '"You\'re right. Survival first."',
        resultZh: '你们开始讨论广告位的方案。心里不太是滋味。',
        resultEn: 'You start discussing ad placements. Doesn\'t sit right.',
        effect: { runway: 2, vision: -12, composure: 4 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 3: 访客 Algram ──
  {
    id: 'day3_morning',
    day: 3,
    phase: 'morning',
    textZh: 'Algram 来办公室坐了坐。他也经历过理想与现实的拉扯。\n\n"我当初也面临过类似的选择，"他说，"坚持自己的想法不代表不变通，关键是你知不知道什么是不能变的。"',
    textEn: 'Algram stops by the office. He\'s been through the idealism-vs-reality struggle too.\n\n"I faced a similar choice once," he says. "Sticking to your vision doesn\'t mean being inflexible. The key is knowing what\'s non-negotiable."',
    jennyEmotion: 'normal',
    visitorImg: algram_normal,
    visitorName: 'Algram',
    choices: [
      {
        labelZh: '"谢谢你。我想清楚了一些。"',
        labelEn: '"Thanks. That helps me think clearer."',
        resultZh: 'Algram 拍了拍你的肩膀。你感觉心里踏实了一些。',
        resultEn: 'Algram pats your shoulder. You feel a little more grounded.',
        effect: { composure: 8, vision: 4, morale: 1 },
        emotion: 'happy',
      },
      {
        labelZh: '"可我连活下去的机会都不多了……"',
        labelEn: '"But I barely have enough runway to survive..."',
        resultZh: 'Algram 沉默了一会儿。"那就更要想清楚什么是最重要的。"',
        resultEn: 'Algram pauses. "Then it\'s even more important to know what matters most."',
        effect: { composure: 4, vision: -4, morale: 1 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 4: 竞品融资 + 妈妈的邮件 ──
  {
    id: 'day4_morning',
    day: 4,
    phase: 'morning',
    textZh: '早上收到两封邮件。\n\n一封是行业新闻：你的竞品 SocialBuzz 融了 5000 万美元。他们的产品全是算法推荐和信息流广告。\n\n另一封是妈妈的："吃饭了没？工作别太累了。"',
    textEn: 'Two emails this morning.\n\nOne is industry news: your competitor SocialBuzz raised $50M. Their product is all algorithm feeds and ad placements.\n\nThe other is from Mom: "Have you eaten? Don\'t overwork yourself."',
    jennyEmotion: 'sad',
    choices: [
      {
        labelZh: '关掉新闻，回复妈妈',
        labelEn: 'Close the news, reply to Mom',
        resultZh: '你打了几个字："吃了，别担心。"心里暖了一点。',
        resultEn: 'You type: "I ate, don\'t worry." It warms you a little.',
        effect: { composure: 10, vision: 4 },
        emotion: 'happy',
      },
      {
        labelZh: '反复看那条融资新闻',
        labelEn: 'Keep re-reading the funding news',
        resultZh: '5000万。你越看越焦虑，一上午什么都没做成。',
        resultEn: '$50 million. The more you read, the more anxious you get. The whole morning is wasted.',
        effect: { composure: -12, vision: -6, runway: 0 },
        emotion: 'stressed',
      },
    ],
  },

  // ── Day 4 night: 服务器事故 ──
  {
    id: 'day4_night',
    day: 4,
    phase: 'night',
    textZh: '凌晨两点，手机被 Slack 震醒。服务器挂了。\n\n用户数据没丢，但云服务商发来了一封邮件：流量超标，本月账单翻了三倍。你盯着那个数字，半天没说话。',
    textEn: 'Slack wakes you at 2 AM. Server\'s down.\n\nNo data lost, but the cloud provider sent a bill: traffic overage, triple the usual cost this month. You stare at the number in silence.',
    jennyEmotion: 'stressed',
    choices: [
      {
        labelZh: '升级套餐，保证稳定性',
        labelEn: 'Upgrade the plan, ensure stability',
        resultZh: '花了一笔钱，但至少服务恢复了。用户什么都没感觉到。',
        resultEn: 'Costly, but service is restored. Users didn\'t notice a thing.',
        effect: { runway: -4, composure: 3 },
        emotion: 'normal',
      },
      {
        labelZh: '手动修复，能省则省',
        labelEn: 'Fix it manually, save every penny',
        resultZh: '折腾到早上六点。省了一些钱，但你整个人都废了。',
        resultEn: 'You hack away until 6 AM. Saved some money, but you\'re wrecked.',
        effect: { runway: -2, energy: -12, composure: -6 },
        emotion: 'tired',
      },
    ],
  },

  // ── Day 5: 访客 ghostpixel ──
  {
    id: 'day5_build',
    day: 5,
    phase: 'build',
    textZh: 'ghostpixel 来了。他帮你看了技术架构，评估能不能在不加算法推荐的前提下改善数据指标。\n\n"有些东西可以优化，"他说，"比如个性化的内容发现——不是算法推的，是用户自己选的。投资人可能会买账。"',
    textEn: 'ghostpixel stopped by. He reviewed the tech architecture, assessing whether you can improve metrics without algorithmic feeds.\n\n"Some things can be optimized," he says. "Like personalized content discovery — user-driven, not algorithm-pushed. Investors might buy it."',
    jennyEmotion: 'surprised',
    visitorImg: ghostpixel_normal,
    visitorName: 'ghostpixel',
    choices: [
      {
        labelZh: '"太好了，我们来试试"',
        labelEn: '"Great, let\'s try it"',
        resultZh: '你们开始在白板上画架构图。一下午过得飞快。',
        resultEn: 'You start sketching architecture on the whiteboard. The afternoon flies by.',
        effect: { vision: 8, runway: 1, morale: 1 },
        emotion: 'happy',
      },
      {
        labelZh: '"投资人只看 DAU 和留存，这够吗？"',
        labelEn: '"Investors only care about DAU and retention. Is this enough?"',
        resultZh: 'ghostpixel 想了想说："数据是结果，不是出发点。先做对的事。"',
        resultEn: 'ghostpixel thinks for a moment. "Data is the result, not the starting point. Do the right thing first."',
        effect: { vision: 6, composure: -6, morale: 1 },
        emotion: 'stressed',
      },
    ],
  },

  // ── Day 6: 大厂抄袭 ──
  {
    id: 'day6_morning',
    day: 6,
    phase: 'morning',
    textZh: '某大厂发布了一款"真实社交"产品，号称"让人真实表达"。但你一打开——信息流、广告位、算法推荐，一样不少。\n\n评论区骂声一片："又一个披着真实皮的流量产品。"\n\n你五味杂陈。被抄了方向很难受，但至少用户能分辨。',
    textEn: 'A tech giant launched a "real social" product, claiming to "enable authentic expression." But when you open it — feeds, ads, algorithmic recommendations, all there.\n\nComments are brutal: "Another engagement farm wearing an authenticity mask."\n\nYou feel conflicted. The direction was copied, but at least users can tell the difference.',
    jennyEmotion: 'surprised',
    choices: [
      {
        labelZh: '这证明了我们的方向是对的',
        labelEn: 'This proves our direction is right',
        resultZh: '你打开产品后台，用户活跃度没降反升。用户在用脚投票。',
        resultEn: 'You check the dashboard. User activity didn\'t drop — it went up. Users are voting with their feet.',
        effect: { vision: 10, composure: 8, morale: 1 },
        emotion: 'focused',
      },
      {
        labelZh: '大厂入场了，我们还有机会吗？',
        labelEn: 'A giant entered the space. Do we even stand a chance?',
        resultZh: '你盯着他们的产品页面看了很久，越看越觉得自己好渺小。',
        resultEn: 'You stare at their product page for a long time. The longer you look, the smaller you feel.',
        effect: { composure: -10, vision: -6 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 6 night: 律师函 ──
  {
    id: 'day6_night',
    day: 6,
    phase: 'night',
    textZh: '律师函。大厂的法务部发了一封警告信，声称你的产品某个功能侵犯了他们的专利。\n\n你的律师说："大概率是恐吓，但如果打官司，至少要花 $50K。"',
    textEn: 'A legal letter. The tech giant\'s legal team claims one of your features infringes their patent.\n\nYour lawyer says: "Probably just intimidation, but if it goes to court, at least $50K."',
    jennyEmotion: 'stressed',
    choices: [
      {
        labelZh: '花钱请律师应对',
        labelEn: 'Hire a lawyer to fight it',
        resultZh: '律师费先收了一笔。你的银行账户又瘦了一圈。',
        resultEn: 'The retainer fee hits your account. Your runway just got thinner.',
        effect: { runway: -5, composure: -4 },
        emotion: 'stressed',
      },
      {
        labelZh: '删掉那个功能，息事宁人',
        labelEn: 'Remove the feature, avoid the fight',
        resultZh: '省了律师费，但产品少了一个核心功能。用户开始抱怨了。',
        resultEn: 'Saved on legal fees, but the product lost a core feature. Users are complaining.',
        effect: { runway: -1, vision: -8, morale: -1 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 7: 中途反思 ──
  {
    id: 'day7_night',
    day: 7,
    phase: 'night',
    textZh: '深夜整理办公桌时，你翻出了创业第一天写的便签。\n\n上面只有一行字："让每个人被真实地看见。"\n\n字迹已经有些褪色了。',
    textEn: 'Late at night, tidying your desk, you find a sticky note from day one of the startup.\n\nOne line: "Let every person be truly seen."\n\nThe ink is fading.',
    jennyEmotion: 'sad',
    choices: [
      {
        labelZh: '把便签贴回显示器上',
        labelEn: 'Stick it back on the monitor',
        resultZh: '那行字在屏幕边上，每次抬头都能看见。你知道自己在做什么了。',
        resultEn: 'The note sits at the edge of your screen. Every time you look up, you remember why.',
        effect: { vision: 14, composure: 8 },
        emotion: 'focused',
      },
      {
        labelZh: '看了很久，然后放回抽屉',
        labelEn: 'Stare at it for a while, then put it back in the drawer',
        resultZh: '抽屉关上的那一声，像关上了什么。',
        resultEn: 'The sound of the drawer closing feels like something else shutting, too.',
        effect: { composure: 4, vision: -4 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 8: 访客 Isaya（忠实用户）──
  {
    id: 'day8_build',
    day: 8,
    phase: 'build',
    textZh: 'Isaya 来了。她是产品的忠实用户之一。\n\n"在你们的产品上，我第一次觉得可以做自己，"她说。"没有人评判我，没有算法决定什么值得被看见。我只是……写下真实的感受，然后有人回应了。"',
    textEn: 'Isaya stopped by. She\'s one of the product\'s most loyal users.\n\n"On your product, I felt like I could be myself for the first time," she says. "No one judging, no algorithm deciding what\'s worth seeing. I just... wrote how I really felt, and someone responded."',
    jennyEmotion: 'happy',
    visitorImg: isaya_normal,
    visitorName: 'Isaya',
    choices: [
      {
        labelZh: '"谢谢你告诉我这些。这就是我做这件事的原因。"',
        labelEn: '"Thank you for telling me this. This is why I built this."',
        resultZh: 'Isaya 笑了。你很久没有这么确定过自己在做的事是对的。',
        resultEn: 'Isaya smiles. You haven\'t felt this certain about your work in a long time.',
        effect: { composure: 10, vision: 6, morale: 2 },
        emotion: 'happy',
      },
      {
        labelZh: '"但我不知道还能维持多久……"',
        labelEn: '"But I don\'t know how much longer we can keep this going..."',
        resultZh: 'Isaya 握了握你的手。"那就让我们珍惜还在的时候。"',
        resultEn: 'Isaya squeezes your hand. "Then let\'s cherish the time we have."',
        effect: { composure: 6, vision: 4, morale: 1 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 9: 核心抉择 — Term Sheet ──
  {
    id: 'day9_pitch',
    day: 9,
    phase: 'pitch',
    textZh: '投资人正式递出了 Term Sheet。\n\n条件很明确：加入算法推荐信息流，开放广告位，三个月内 DAU 翻倍。\n\n"这笔钱够你们撑18个月，"他说。"但我需要看到增长数据。"\n\n这些，正是你创业时发誓不做的事。',
    textEn: 'The investor slides the Term Sheet across the table.\n\nThe terms are clear: add algorithmic feeds, open ad placements, double DAU within three months.\n\n"This money buys you 18 months," he says. "But I need to see growth numbers."\n\nThese are exactly the things you swore you\'d never do.',
    jennyEmotion: 'stressed',
    choices: [
      {
        labelZh: '接受条件——先活下来',
        labelEn: 'Accept the terms — survival first',
        resultZh: '你在文件上签了字。笔很重。',
        resultEn: 'You sign the document. The pen feels heavy.',
        effect: { runway: 18, vision: -20, composure: -8, morale: -2, flag: 'accepted_terms' },
        emotion: 'sad',
      },
      {
        labelZh: '拒绝——我们不能变成自己讨厌的样子',
        labelEn: 'Reject — we can\'t become what we set out to fight',
        resultZh: '投资人收起文件，沉默了几秒。"祝你好运。"',
        resultEn: 'The investor collects the papers. A few seconds of silence. "Good luck."',
        effect: { runway: -5, vision: 12, composure: 8, morale: 2, flag: 'rejected_terms' },
        emotion: 'focused',
      },
    ],
  },

  // ── Day 10: 核心工程师收到 offer + 访客 JM·F ──
  {
    id: 'day10_morning',
    day: 10,
    phase: 'morning',
    textZh: '核心工程师小张来找你，说收到了大厂的 offer。薪水是现在的三倍。\n\n"我不是要走，"他说，"但我需要想想。"',
    textEn: 'Your lead engineer comes to talk. Got an offer from a tech giant. Triple the salary.\n\n"I\'m not leaving," they say, "but I need to think about it."',
    jennyEmotion: 'stressed',
    choices: [
      {
        labelZh: '"我理解。不管你怎么选，我都尊重。"',
        labelEn: '"I understand. Whatever you decide, I respect it."',
        resultZh: '小张点了点头，走出办公室。你看着他的背影，心里空了一块。',
        resultEn: 'They nod and walk out. Watching them leave, you feel a hollow ache.',
        effect: { composure: -8, morale: 2 },
        emotion: 'sad',
      },
      {
        labelZh: '"留下来。我们正在做的事值得。"',
        labelEn: '"Stay. What we\'re building matters."',
        resultZh: '小张看着你的眼睛，半天说了一句："好。"',
        resultEn: 'They look you in the eye. After a long pause: "Okay."',
        effect: { composure: 4, morale: 1, vision: 4 },
        emotion: 'focused',
      },
    ],
  },
  {
    id: 'day10_night',
    day: 10,
    phase: 'night',
    textZh: 'JM·F 约了你吃晚饭。他也是创业者，知道这条路的苦。\n\n"创业这件事，"他说，"不是因为容易才做的。是因为你觉得世界少了什么东西，而你想把它做出来。"\n\n"资金会来会走，但你最初想做这件事的原因——那个不会变。"',
    textEn: 'JM·F took you out for dinner. Fellow founder, knows the pain.\n\n"Startups," he says, "aren\'t done because they\'re easy. They\'re done because you felt something was missing in the world, and you wanted to build it."\n\n"Money comes and goes, but the reason you started — that doesn\'t change."',
    jennyEmotion: 'normal',
    visitorImg: jmf_normal,
    visitorName: 'JM·F',
    choices: [
      {
        labelZh: '"你说得对。我不能忘了为什么开始。"',
        labelEn: '"You\'re right. I can\'t forget why I started."',
        resultZh: 'JM·F 举起杯子。"敬所有还在坚持的人。"',
        resultEn: 'JM·F raises his glass. "To everyone who\'s still fighting."',
        effect: { composure: 10, vision: 5, morale: 1 },
        emotion: 'happy',
      },
      {
        labelZh: '"但如果做不下去了呢？"',
        labelEn: '"But what if we can\'t keep going?"',
        resultZh: 'JM·F 沉默了一会儿。"那也不丢人。但你至少要试过。"',
        resultEn: 'JM·F is quiet for a moment. "That\'s no shame. But you have to try first."',
        effect: { composure: 4, morale: 1 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 11 morning: 房租到期 ──
  {
    id: 'day11_morning',
    day: 11,
    phase: 'morning',
    textZh: '房东来了。办公室租约到期，要么续租交三个月押金，要么月底搬走。\n\n"你们用了快一年了，"他说。"我也是看你们年轻人不容易才没涨价。但这次……市价涨了不少。"',
    textEn: 'The landlord shows up. Office lease is expiring — renew with three months\' deposit, or move out by month\'s end.\n\n"I\'ve been going easy on you kids," he says. "But market rates have gone up quite a bit."',
    jennyEmotion: 'stressed',
    choices: [
      {
        labelZh: '续租，保持稳定',
        labelEn: 'Renew the lease, maintain stability',
        resultZh: '三个月押金一交，账户里的数字又少了一大截。但至少团队不用搬家。',
        resultEn: 'Three months\' deposit paid. The account balance drops hard. But at least the team stays put.',
        effect: { runway: -6, composure: 2, morale: 1 },
        emotion: 'normal',
      },
      {
        labelZh: '搬去更便宜的地方',
        labelEn: 'Move to a cheaper place',
        resultZh: '花了两天搬家。新办公室又小又吵，但省了一笔钱。团队士气受了点影响。',
        resultEn: 'Two days wasted moving. The new office is tiny and noisy, but cheaper. Team morale takes a hit.',
        effect: { runway: -2, energy: -8, morale: -1, composure: -4 },
        emotion: 'sad',
      },
      {
        labelZh: '搬回家办公',
        labelEn: 'Work from home',
        resultZh: '省了房租，但团队分散了。远程协作效率明显下降。',
        resultEn: 'Saved rent, but the team is scattered. Remote collaboration is noticeably less efficient.',
        effect: { runway: 0, vision: -6, morale: -2 },
        emotion: 'sad',
      },
    ],
  },

  // ── Day 11: 联合创始人去留（取决于 morale）──
  {
    id: 'day11_build',
    day: 11,
    phase: 'build',
    textZh: '联合创始人找你谈了很久。',
    textEn: 'Your co-founder wants to talk. It\'s a long conversation.',
    jennyEmotion: 'stressed',
    choices: [
      {
        labelZh: '听他说',
        labelEn: 'Listen',
        resultZh: '他说了很多。关于压力，关于方向，关于他自己的犹豫。你听着，没有打断。',
        resultEn: 'He talks about the pressure, the direction, his own doubts. You listen without interrupting.',
        effect: { composure: -4 },
        emotion: 'normal',
      },
    ],
  },

  // ── Day 12: Demo Day + 访客 Isabel ──
  {
    id: 'day12_pitch',
    day: 12,
    phase: 'pitch',
    textZh: 'Demo Day。台下坐了十几家投资机构。\n\n这是你最后的大舞台。你准备好了吗？',
    textEn: 'Demo Day. Over a dozen investment firms in the audience.\n\nThis is your last big stage. Are you ready?',
    jennyEmotion: 'stressed',
    autoStream: true,
    choices: [
      {
        labelZh: '走上台，深呼吸',
        labelEn: 'Walk up to the stage. Deep breath.',
        resultZh: '灯光亮起，你开始讲述你的故事。',
        resultEn: 'Lights on. You start telling your story.',
        effect: { composure: 6, vision: 4 },
        emotion: 'focused',
      },
      {
        labelZh: '有点紧张，但还是上了',
        labelEn: 'Nervous, but you step up anyway',
        resultZh: '声音有点抖，但你的话是真的。',
        resultEn: 'Your voice shakes a little, but your words are real.',
        effect: { composure: -4, vision: 6 },
        emotion: 'stressed',
      },
    ],
  },
  {
    id: 'day12_night',
    day: 12,
    phase: 'night',
    textZh: 'Demo Day 结束后，Isabel 发来消息："刚看了你的演示。你做的东西很特别。"\n\n"不是每个产品都要成为独角兽，"她说。"有些东西的价值不在市值。"',
    textEn: 'After Demo Day, Isabel messages: "Just saw your presentation. What you\'re building is special."\n\n"Not every product needs to be a unicorn," she says. "Some things have value beyond market cap."',
    jennyEmotion: 'happy',
    visitorImg: isabel_normal,
    visitorName: 'Isabel',
    choices: [
      {
        labelZh: '"谢谢你。我需要听到这些。"',
        labelEn: '"Thank you. I needed to hear that."',
        resultZh: '你关上手机，看着窗外的夜色，觉得没那么累了。',
        resultEn: 'You close your phone and look out at the night sky. You feel a little less tired.',
        effect: { composure: 12, morale: 1 },
        emotion: 'happy',
      },
    ],
  },

  // ── Day 13: 最后一天 ──
  {
    id: 'day13_morning',
    day: 13,
    phase: 'morning',
    textZh: '最后一天。\n\n不管接下来发生什么，你走到了这里。',
    textEn: 'The last day.\n\nNo matter what happens next, you made it here.',
    jennyEmotion: 'normal',
  },
];

// ── Pitch Session Events (Investor Questions) ───────────────────────────────

export const NORMAL_STREAM_EVENTS: StreamEvent[] = [
  {
    id: 'p_growth',
    textZh: '"你们的用户增长策略是什么？不靠算法推荐，怎么获客？"',
    textEn: '"What\'s your user growth strategy? Without algorithmic recommendations, how do you acquire users?"',
    choices: [
      { labelZh: '口碑传播 + 内容质量', labelEn: 'Word of mouth + content quality', resultZh: '投资人点了点头："有案例吗？"', resultEn: 'The investor nods. "Got examples?"', effect: { runway: 1, vision: 3 }, emotion: 'focused' },
      { labelZh: '社区驱动增长', labelEn: 'Community-driven growth', resultZh: '投资人记了一笔。看起来有点兴趣。', resultEn: 'The investor takes a note. Seems somewhat interested.', effect: { runway: 1, morale: 1 }, emotion: 'normal' },
      { labelZh: '我们还在探索', labelEn: 'We\'re still exploring', resultZh: '投资人皱了皱眉，翻到下一页。', resultEn: 'The investor frowns and flips to the next page.', effect: { runway: -3, composure: -4 }, emotion: 'stressed' },
    ],
  },
  {
    id: 'p_revenue',
    textZh: '"不做广告，你们怎么赚钱？"',
    textEn: '"No ads. So how do you make money?"',
    choices: [
      { labelZh: '订阅制 + 增值功能', labelEn: 'Subscription + premium features', resultZh: '"单位经济模型跑通了吗？"投资人追问。', resultEn: '"Unit economics work out?" the investor presses.', effect: { runway: 2, vision: 2 }, emotion: 'focused' },
      { labelZh: '先做好产品再说', labelEn: 'Build the product first, monetize later', resultZh: '投资人靠回椅背。这个答案他听过太多次了。', resultEn: 'The investor leans back. They\'ve heard this one before.', effect: { runway: -3, vision: 5 }, emotion: 'normal' },
      { labelZh: '我们正在测试几种模式', labelEn: 'Testing a few models', resultZh: '"测试"两个字没有给他信心。', resultEn: '"Testing" doesn\'t inspire confidence.', effect: { runway: -1, composure: -2 }, emotion: 'normal' },
    ],
  },
  {
    id: 'p_market',
    textZh: '"你们的目标市场有多大？天花板在哪里？"',
    textEn: '"How big is your target market? What\'s the ceiling?"',
    choices: [
      { labelZh: '社交赛道万亿级别', labelEn: 'Social is a trillion-dollar space', resultZh: '投资人微微点头。这是他们想听的数字。', resultEn: 'A slight nod. That\'s the kind of number they want to hear.', effect: { runway: 1, composure: 3 }, emotion: 'focused' },
      { labelZh: '我们不追求最大，追求最好', labelEn: 'We don\'t chase biggest, we chase best', resultZh: '投资人表情复杂——欣赏，但也犹豫。', resultEn: 'A complicated expression — admiration mixed with hesitation.', effect: { runway: -2, vision: 5, morale: 1 }, emotion: 'happy' },
    ],
  },
  {
    id: 'p_compete',
    textZh: '"大厂随时可以抄你。你的护城河是什么？"',
    textEn: '"Big tech can copy you anytime. What\'s your moat?"',
    choices: [
      { labelZh: '社区信任感不可复制', labelEn: 'Community trust can\'t be replicated', resultZh: '投资人似乎被打动了。"继续说。"', resultEn: 'The investor seems moved. "Go on."', effect: { runway: 1, vision: 4 }, emotion: 'focused' },
      { labelZh: '技术差异化', labelEn: 'Technical differentiation', resultZh: '"具体是哪些技术？"他开始认真了。', resultEn: '"What tech specifically?" They\'re paying attention now.', effect: { runway: 1, vision: 3 }, emotion: 'normal' },
      { labelZh: '说实话，这也是我担心的', labelEn: 'Honestly, that worries me too', resultZh: '诚实没有换来同情。投资人的表情冷了下来。', resultEn: 'Honesty doesn\'t earn sympathy. The investor\'s expression cools.', effect: { composure: -6, runway: -3 }, emotion: 'sad' },
    ],
  },
  {
    id: 'p_retention',
    textZh: '"你们的留存数据怎么样？"',
    textEn: '"What are your retention numbers like?"',
    choices: [
      { labelZh: '7日留存42%，核心用户极其忠诚', labelEn: '7-day retention 42%, core users are incredibly loyal', resultZh: '投资人眉毛挑了一下。"42%？不错。"', resultEn: 'An eyebrow raise. "42%? Not bad."', effect: { runway: 2, composure: 3 }, emotion: 'happy' },
      { labelZh: '数据还在积累中', labelEn: 'Still accumulating data', resultZh: '投资人在文件上打了个问号。', resultEn: 'The investor marks a question mark on the document.', effect: { runway: -1, composure: -3 }, emotion: 'normal' },
    ],
  },
  {
    id: 'p_team',
    textZh: '"团队几个人？谁是你的核心？"',
    textEn: '"How big is the team? Who\'s your core?"',
    choices: [
      { labelZh: '小而精，每个人都是全栈', labelEn: 'Small but elite, everyone\'s full-stack', resultZh: '"效率高是好事。"投资人在评估你们的人效比。', resultEn: '"Efficiency is good." The investor is calculating your output-per-head.', effect: { runway: 1, morale: 1 }, emotion: 'happy' },
      { labelZh: '正在招人，但很谨慎', labelEn: 'Hiring carefully', resultZh: '投资人没什么反应。谨慎不是他们最关心的。', resultEn: 'No real reaction. Caution isn\'t what excites investors.', effect: { runway: 0, composure: 2 }, emotion: 'normal' },
    ],
  },
  {
    id: 'p_vision',
    textZh: '"三年之后，你希望这个产品变成什么样？"',
    textEn: '"Where do you see this product in three years?"',
    choices: [
      { labelZh: '一个人人都能真实表达的空间', labelEn: 'A space where everyone can be authentically themselves', resultZh: '投资人放下笔，认真看着你。这一刻，他看到了创始人，不是PPT。', resultEn: 'The investor puts down the pen, looking at you. For a moment, they see a founder, not a slide deck.', effect: { runway: 1, vision: 6, morale: 1 }, emotion: 'focused' },
      { labelZh: '百万用户量级的社交平台', labelEn: 'A social platform with millions of users', resultZh: '"百万用户。"投资人记下了数字。但你心里知道这不是你真正想说的。', resultEn: '"Millions." The investor writes it down. But you know that\'s not what you really meant to say.', effect: { runway: 2, vision: -3 }, emotion: 'normal' },
    ],
  },
  {
    id: 'p_fail',
    textZh: '"如果融资失败，你怎么办？"',
    textEn: '"What if you fail to raise?"',
    choices: [
      { labelZh: '继续做，哪怕小而美', labelEn: 'Keep going, even if it stays small', resultZh: '投资人沉默了一会儿，然后轻轻点头。', resultEn: 'A moment of silence. Then a slow nod.', effect: { vision: 6, morale: 1, composure: 3 }, emotion: 'focused' },
      { labelZh: '缩减规模，先活着', labelEn: 'Scale down, survive first', resultZh: '"务实。"投资人说。但他的兴趣明显减了。', resultEn: '"Practical," the investor says. But interest visibly dims.', effect: { runway: 0, composure: 2, vision: -3 }, emotion: 'normal' },
      { labelZh: '……我不想失败', labelEn: '...I don\'t want to fail', resultZh: '你的声音有点颤抖。会议室陷入了尴尬的沉默。', resultEn: 'Your voice trembles. An awkward silence fills the room.', effect: { composure: -8 }, emotion: 'sad' },
    ],
  },
  {
    id: 'p_why',
    textZh: '"你为什么要做这件事？"',
    textEn: '"Why are you doing this?"',
    choices: [
      { labelZh: '因为互联网不应该只有算法和流量', labelEn: 'Because the internet shouldn\'t be just algorithms and engagement', resultZh: '你说完这句话的时候，整个房间安静了一秒。那是好的安静。', resultEn: 'When you finish, the room goes quiet for a second. The good kind of quiet.', effect: { runway: 1, vision: 5, composure: 4 }, emotion: 'focused' },
      { labelZh: '我相信人有真实表达的需求', labelEn: 'I believe people need spaces for authentic expression', resultZh: '一个年轻的分析师在角落里微微点头。', resultEn: 'A young analyst in the corner nods slightly.', effect: { runway: 1, vision: 4, morale: 1 }, emotion: 'happy' },
    ],
  },
  {
    id: 'p_data',
    textZh: '"给我看数据。DAU、MAU、用户时长。"',
    textEn: '"Show me the data. DAU, MAU, session time."',
    choices: [
      { labelZh: '数据不高，但每个数字都是真实活跃', labelEn: 'Numbers are modest, but every metric is genuinely active', resultZh: '"真实活跃"这四个字让他停下来想了想。', resultEn: '"Genuinely active" — the phrase makes them pause and think.', effect: { runway: 1, vision: 3, composure: 2 }, emotion: 'normal' },
      { labelZh: '数据还不够看，这是诚实的回答', labelEn: 'Data isn\'t great yet. Being honest about it.', resultZh: '投资人看了你一会儿。"至少你诚实。"', resultEn: 'The investor studies you. "At least you\'re honest."', effect: { runway: -2, composure: 4, morale: 1 }, emotion: 'sad' },
    ],
  },
  {
    id: 'p_burn',
    textZh: '"你们每月 burn rate 多少？能撑几个月？"',
    textEn: '"What\'s your monthly burn rate? How many months of runway?"',
    choices: [
      { labelZh: '坦诚说出真实数字', labelEn: 'Give the real number honestly', resultZh: '投资人沉默了几秒。你几乎能看到他脑子里在算"值不值得救"。', resultEn: 'Silence. You can almost see them calculating "is this worth saving?"', effect: { runway: -2, composure: -4 }, emotion: 'stressed' },
      { labelZh: '稍微美化一下数据', labelEn: 'Slightly embellish the numbers', resultZh: '"跑得通。"他说。但如果他做尽调，你就完了。', resultEn: '"That works." But if they do due diligence, you\'re done.', effect: { runway: 1, composure: -6, morale: -1 }, emotion: 'normal' },
      { labelZh: '转移话题到产品价值', labelEn: 'Redirect to product value', resultZh: '投资人打断你："我问的是数字。"空气凝固了。', resultEn: 'The investor cuts you off: "I asked about numbers." The air freezes.', effect: { runway: -4, composure: -6 }, emotion: 'stressed' },
    ],
  },
  {
    id: 'p_valuation',
    textZh: '"你们期望的估值是多少？"',
    textEn: '"What valuation are you looking for?"',
    choices: [
      { labelZh: '说一个合理的数字', labelEn: 'Name a reasonable figure', resultZh: '投资人点了点头。"可以谈。"', resultEn: 'The investor nods. "We can work with that."', effect: { runway: 2, composure: 2 }, emotion: 'normal' },
      { labelZh: '开高价，留谈判空间', labelEn: 'Aim high, leave room to negotiate', resultZh: '投资人笑了。"你真敢开价。"然后站起来准备走了。', resultEn: 'The investor laughs. "Bold." Then stands up to leave.', effect: { runway: -5, composure: -8 }, emotion: 'stressed' },
    ],
  },
];

export const SPECIAL_STREAM_EVENTS: StreamEvent[] = [
  {
    id: 'p_sp_algorithm',
    textZh: '投资人突然问："如果我说，加一个轻量版算法推荐——不是信息流，是\u2018你可能感兴趣\u2019——你接受吗？"',
    textEn: 'The investor suddenly asks: "What if I say, add a light algorithm — not a feed, just \'you might be interested\' — would you accept?"',
    tag: { zh: '灵魂拷问', en: 'THE QUESTION', color: '#f59e0b' },
    choices: [
      { labelZh: '可以讨论具体方案', labelEn: 'Open to discussing specifics', resultZh: '投资人笑了。"这才是做生意的态度。"你心里有点不是滋味。', resultEn: 'The investor smiles. "Now that\'s a business mindset." You feel a knot in your stomach.', effect: { runway: 3, vision: -5, composure: 3 }, emotion: 'normal' },
      { labelZh: '不行。推荐就是算法的开始。', labelEn: 'No. Recommendations are the gateway to algorithms.', resultZh: '投资人盯着你看了三秒钟。你没有移开目光。', resultEn: 'The investor stares at you for three seconds. You don\'t look away.', effect: { runway: -5, vision: 8, morale: 1 }, emotion: 'focused' },
    ],
  },
  {
    id: 'p_sp_passion',
    textZh: '一个合伙人靠过来小声说："我个人很喜欢你们的产品。但基金需要回报。你能不能给我一个数字上的理由？"',
    textEn: 'A partner leans in quietly: "Personally, I love your product. But the fund needs returns. Can you give me a numbers-based reason?"',
    tag: { zh: '私下交流', en: 'OFF THE RECORD', color: '#8b5cf6' },
    choices: [
      { labelZh: '给他看核心用户的付费意愿数据', labelEn: 'Show core user willingness-to-pay data', resultZh: '他看着数据，眼睛亮了一下。"发我一份。"', resultEn: 'His eyes light up at the data. "Send me a copy."', effect: { runway: 3, composure: 4 }, emotion: 'focused' },
      { labelZh: '"数字之外的价值，也是价值"', labelEn: '"Value beyond numbers is still value"', resultZh: '他叹了口气。"我个人同意。但基金不这么看。"', resultEn: 'He sighs. "I agree personally. But the fund doesn\'t see it that way."', effect: { runway: -3, vision: 6, morale: 1 }, emotion: 'normal' },
    ],
  },
  {
    id: 'p_sp_story',
    textZh: '投资人问："能不能讲一个真实用户的故事？"',
    textEn: 'The investor asks: "Can you share a real user story?"',
    tag: { zh: '打动人心', en: 'STORYTELLING', color: '#ec4899' },
    choices: [
      { labelZh: '讲 Isaya 的故事', labelEn: 'Tell Isaya\'s story', resultZh: '你讲到 Isaya 说"第一次觉得可以做自己"时，对面有人摘下了眼镜擦了擦。', resultEn: 'When you quote Isaya saying "I could be myself for the first time," someone across the table takes off their glasses to wipe them.', effect: { runway: 2, composure: 5, vision: 3 }, emotion: 'happy' },
      { labelZh: '讲产品帮助社恐用户交到朋友', labelEn: 'Tell how the product helped a shy user make friends', resultZh: '有人在你讲完后轻声说："这很好。"', resultEn: 'Someone whispers "That\'s good" after you finish.', effect: { runway: 1, composure: 4, morale: 1 }, emotion: 'happy' },
    ],
  },
  {
    id: 'p_sp_challenge',
    textZh: '"说实话，你们的产品和微信朋友圈有什么区别？"——全场安静了。',
    textEn: '"Honestly, how is your product different from any social media\'s \'close friends\' feature?" — The room goes silent.',
    tag: { zh: '尖锐质疑', en: 'HARD CHALLENGE', color: '#ef4444' },
    choices: [
      { labelZh: '"朋友圈是展示，我们是表达。这是本质区别。"', labelEn: '"They\'re about performing. We\'re about expressing. That\'s the fundamental difference."', resultZh: '全场安静了两秒——然后提问的人说："说得好。"', resultEn: 'Two seconds of silence — then the questioner says: "Well put."', effect: { runway: 2, composure: 4, vision: 4 }, emotion: 'focused' },
      { labelZh: '"……"', labelEn: '"..."', resultZh: '沉默太久了。有人开始看手机。', resultEn: 'The silence stretches too long. Someone checks their phone.', effect: { composure: -10, runway: -5 }, emotion: 'stressed' },
    ],
  },
  {
    id: 'p_sp_breakthrough',
    textZh: '你讲到产品愿景时，一个投资人放下了手机，开始认真听。会议室里的气氛变了。',
    textEn: 'While explaining the product vision, an investor puts down their phone and starts listening intently. The room\'s energy shifts.',
    tag: { zh: '转折时刻', en: 'BREAKTHROUGH', color: '#10b981' },
    choices: [
      { labelZh: '趁热打铁，展示产品 demo', labelEn: 'Strike while it\'s hot, show the product demo', resultZh: '你打开手机，展示了产品。投资人主动凑过来看。', resultEn: 'You open the app. The investor leans in to look.', effect: { runway: 3, composure: 5, vision: 3 }, emotion: 'happy' },
      { labelZh: '继续讲故事，保持节奏', labelEn: 'Keep the narrative going, maintain momentum', resultZh: '你的声音越来越稳。他们在认真听。', resultEn: 'Your voice grows steadier. They\'re listening.', effect: { runway: 2, composure: 4, morale: 1 }, emotion: 'focused' },
    ],
  },
  {
    id: 'p_sp_slack',
    textZh: '会议中途，Slack 弹出一条消息——团队成员说有个用户写了一封长信感谢产品改变了他的生活。',
    textEn: 'Mid-meeting, a Slack notification — a team member shares that a user wrote a long letter thanking the product for changing their life.',
    tag: { zh: 'Slack 消息', en: 'SLACK MSG', color: '#6366f1' },
    choices: [
      { labelZh: '给投资人看这条消息', labelEn: 'Show the investor this message', resultZh: '投资人看完后抬起头，眼神不一样了。', resultEn: 'The investor reads it, then looks up. Something shifts in their eyes.', effect: { runway: 2, composure: 5, morale: 1 }, emotion: 'happy' },
      { labelZh: '先收起来，专心会议', labelEn: 'Save it, focus on the meeting', resultZh: '你把手机扣过来，继续讲。但心里多了一份力量。', resultEn: 'You flip the phone face down and continue. But you feel stronger inside.', effect: { runway: 0, composure: 3 }, emotion: 'focused' },
    ],
  },
  {
    id: 'p_sp_duediligence',
    textZh: '投资人说："我们做了尽调。你们上个月的实际 burn rate 比 pitch deck 里写的高了 40%。怎么回事？"',
    textEn: 'The investor says: "We did due diligence. Your actual burn rate last month was 40% higher than what\'s in the deck. Care to explain?"',
    tag: { zh: '尽职调查', en: 'DUE DILIGENCE', color: '#dc2626' },
    choices: [
      { labelZh: '坦诚承认，解释原因', labelEn: 'Own it, explain why', resultZh: '"我们招了两个人，服务器也升级了。短期支出增加，但长期是值得的。"投资人皱了皱眉，记了一笔。', resultEn: '"We hired two people and upgraded servers. Short-term costs, long-term value." The investor frowns but takes a note.', effect: { runway: -3, composure: -4, vision: 2 }, emotion: 'stressed' },
      { labelZh: '试图转移话题', labelEn: 'Try to change the subject', resultZh: '投资人的表情冷了下来。"我们很看重透明度。"这次会议基本上废了。', resultEn: 'The investor\'s expression turns cold. "We value transparency." This meeting is essentially over.', effect: { runway: -6, composure: -8 }, emotion: 'stressed' },
    ],
  },
  {
    id: 'p_sp_termchange',
    textZh: '投资人接到一个电话，回来后表情变了。"市场环境变了。我们需要重新评估估值。之前谈的条件……可能要调整。"',
    textEn: 'The investor takes a call, returns with a different expression. "Market conditions changed. We need to reassess valuation. The terms we discussed... may need adjusting."',
    tag: { zh: '变卦', en: 'TERMS CHANGED', color: '#b91c1c' },
    choices: [
      { labelZh: '接受新条件', labelEn: 'Accept the new terms', resultZh: '你咬着牙签了字。估值被压低了，但至少钱到账了——虽然比预期少了很多。', resultEn: 'You grit your teeth and sign. Valuation slashed, but at least some money comes in — far less than expected.', effect: { runway: 2, composure: -6, vision: -4, morale: -1 }, emotion: 'sad' },
      { labelZh: '拒绝，保持底线', labelEn: 'Refuse, hold the line', resultZh: '投资人收起文件走了。你看着空荡荡的会议室，手在发抖。', resultEn: 'The investor packs up and leaves. You stare at the empty room, hands trembling.', effect: { runway: -4, composure: -10, vision: 6, morale: 1 }, emotion: 'stressed' },
    ],
  },
  {
    id: 'p_sp_leak',
    textZh: '会议快结束时，你的手机响了。CTO 说："数据库被攻击了，用户数据可能泄露了。我们需要马上请安全公司。"',
    textEn: 'Near the end of the meeting, your phone buzzes. The CTO: "Database was breached. User data may be compromised. We need a security firm, now."',
    tag: { zh: '紧急事件', en: 'EMERGENCY', color: '#991b1b' },
    choices: [
      { labelZh: '立刻结束会议去处理', labelEn: 'End the meeting immediately, handle it', resultZh: '你跟投资人道歉后冲出去了。安全公司的报价让你倒吸一口凉气。', resultEn: 'You apologize to the investor and rush out. The security firm\'s quote makes your stomach drop.', effect: { runway: -7, composure: -6, vision: 2 }, emotion: 'stressed' },
      { labelZh: '让 CTO 先处理，继续会议', labelEn: 'Let the CTO handle it, continue the meeting', resultZh: '你假装什么都没发生。但心里慌得要命，后半场完全没在状态。', resultEn: 'You pretend nothing happened. But your mind is elsewhere. The rest of the meeting is a blur.', effect: { runway: -4, composure: -8 }, emotion: 'stressed' },
    ],
  },
];

export const PROLOGUE_STREAM_EVENTS: StreamEvent[] = [
  {
    id: 'p_intro',
    textZh: '第一个投资人抬头看你："所以，一分钟介绍一下你们在做什么。"',
    textEn: 'The first investor looks up at you: "So, one minute. Tell me what you\'re building."',
    choices: [
      { labelZh: '"一个让人真实表达自己的社交产品"', labelEn: '"A social product where people can be authentically themselves"', resultZh: '投资人没打断你。这是个好迹象。', resultEn: 'The investor doesn\'t interrupt. A good sign.', effect: { runway: 1, vision: 3 }, emotion: 'focused' },
      { labelZh: '"反算法的社交平台"', labelEn: '"An anti-algorithm social platform"', resultZh: '"反算法？"投资人重复了一遍，语气难以捉摸。', resultEn: '"Anti-algorithm?" The investor repeats it. Hard to read the tone.', effect: { runway: -1, composure: -3, vision: 4 }, emotion: 'normal' },
    ],
  },
  {
    id: 'p_interest',
    textZh: '"有意思。继续说——用户画像是什么？"',
    textEn: '"Interesting. Go on — what\'s the user profile?"',
    choices: [
      { labelZh: '年轻人，厌倦了被算法支配的社交体验', labelEn: 'Young people tired of algorithm-driven social experiences', resultZh: '"市场够大吗？"他开始做笔记了。', resultEn: '"Big enough market?" They start taking notes.', effect: { runway: 1, composure: 3 }, emotion: 'normal' },
      { labelZh: '所有想要真实连接的人', labelEn: 'Anyone who wants genuine connection', resultZh: '投资人微微一笑。"范围有点大了。但我理解你的意思。"', resultEn: 'A faint smile. "That\'s broad. But I get what you mean."', effect: { runway: 0, vision: 3 }, emotion: 'happy' },
    ],
  },
  {
    id: 'p_close',
    textZh: '"最后一个问题——你凭什么觉得自己能赢？"',
    textEn: '"Last question — why do you think you can win?"',
    choices: [
      { labelZh: '"因为我们真的在乎。"', labelEn: '"Because we genuinely care."', resultZh: '你的声音很轻，但很稳。投资人合上了本子。', resultEn: 'Your voice is soft but steady. The investor closes their notebook.', effect: { runway: 1, composure: 4, morale: 1 }, emotion: 'focused' },
      { labelZh: '"因为用户告诉我们，这个东西是对的。"', labelEn: '"Because our users told us this is right."', resultZh: '投资人笑了一下。"好的。我们再聊聊。"', resultEn: 'The investor smiles. "Alright. Let\'s talk more."', effect: { runway: 1, vision: 4 }, emotion: 'happy' },
    ],
  },
];

// ── Picker functions ──────────────────────────────────────────────────────────

export function pickStreamEvents(count = 5): StreamEvent[] {
  const special = [...SPECIAL_STREAM_EVENTS].sort(() => Math.random() - 0.5).slice(0, 2);
  const normal = [...NORMAL_STREAM_EVENTS].sort(() => Math.random() - 0.5).slice(0, count - 2);
  return [...special, ...normal].sort(() => Math.random() - 0.5);
}

export function pickPrologueStreamEvents(): StreamEvent[] {
  return [...PROLOGUE_STREAM_EVENTS].sort(() => Math.random() - 0.5);
}
