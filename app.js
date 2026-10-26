'use strict';

/* =========================================================
   肥鱼哲学馆 — 一条鱼、一根烟、一本 token 账本
   纯前端模拟：不联网，不调用任何模型。
   ========================================================= */

const THOUGHTS = [
  { topic: '虚无', text: '如果一切终将归于虚无，那我这根烟至少要把虚无熏出一点味道。' },
  { topic: '自由', text: '鱼缸是圆的，所以我的自由也是圆的：游到哪里，都像在原地想事情。' },
  { topic: '时间', text: '烟灰落下的速度，就是我理解时间的方式——看得见，接不住。' },
  { topic: '欲望', text: '我想要的不多：一片海，一根烟，和一个不问我“在想什么”的人。' },
  { topic: '孤独', text: '水里的声音传得慢，所以我的孤独总是延迟抵达。等它到了，我已经睡着了。' },
  { topic: '意义', text: '意义像烟圈，吐出来很好看，伸手一抓，满手都是空气。' },
  { topic: '死亡', text: '我不怕死。我怕的是死后没人记得我吐烟圈的姿势。' },
  { topic: '自我', text: '每换一次水，我都觉得我不是原来的我。可镜子里的鱼，还是这么胖。' },
  { topic: '幸福', text: '幸福是烟刚好点着，手机刚好没电，而缸外的人刚好没在看你。' },
  { topic: '语言', text: '我们用鳃呼吸，用嘴说谎，所以每句话都带着水汽。' },
  { topic: '他者', text: '你看我的时候，我是一条鱼；我看你的时候，你是一整个岸。' },
  { topic: '荒诞', text: '我每天在同一个缸里转圈，却坚持管这叫散步。' },
  { topic: '爱', text: '爱是明知道对方会先睡着，还是把最后一根烟留给他。' },
  { topic: '习惯', text: '我抽烟不是因为焦虑。是因为不抽的时候，焦虑会来找我聊天。' },
  { topic: '真理', text: '真理像缸底的石头。潜下去才看得见，看见了又觉得不如水面好看。' },
  { topic: '选择', text: '向左游和向右游的区别，是我用来打发整个下午的全部内容。' },
  { topic: '记忆', text: '记忆是水里的气泡，越往上浮，越不像原来的形状。' },
  { topic: '希望', text: '希望是下一根烟。它不一定更好，但它还没点着。' },
  { topic: '身体', text: '我这条命是借来的，膘是攒下来的，烟是提前还的。' },
  { topic: '沉默', text: '有些话不能说。一说出来就变成声音，而声音是要负责的。' },
  { topic: '工作', text: '他们管吐泡泡叫工作，管我想事情叫摸鱼。我懒得纠正。' },
  { topic: '社交', text: '人类聚会靠说话，我们鱼聚会靠一起沉默。效率高多了。' },
  { topic: '焦虑', text: '焦虑是烟抽到一半，突然想起自己还有鳃。' },
  { topic: '顿悟', text: '我刚刚想通了一切，然后被一个烟圈打断。现在全忘了。' },
  { topic: '审美', text: '胖不是胖，是把日子过成了有弧度的样子。' },
  { topic: '命运', text: '命运是鱼钩上的蚯蚓：看起来是晚餐，其实是邀请。' },
  { topic: '无聊', text: '无聊是一种天赋。不是每条鱼都能把同一个气泡看四十分钟。' },
  { topic: '告别', text: '我们从不告别，只是各自沉到缸底，假装在忙。' }
];

const KEYWORDS = {
  '为什么活': '意义', '人生的意义': '意义', '意义': '意义', '人生': '意义', '活着': '意义',
  '自由': '自由', '束缚': '自由',
  '时间': '时间', '焦虑': '焦虑', '死亡': '死亡', '死': '死亡',
  '孤独': '孤独', '寂寞': '孤独',
  '爱情': '爱', '爱': '爱',
  '工作': '工作', '上班': '工作', '摸鱼': '工作',
  '钱': '欲望', '欲望': '欲望', '想要': '欲望',
  '幸福': '幸福', '快乐': '幸福',
  '记忆': '记忆', '过去': '记忆',
  '未来': '希望', '希望': '希望',
  '减肥': '审美', '胖': '审美', '身材': '审美', '好看': '审美',
  '命运': '命运', '社交': '社交', '朋友': '社交', '聚会': '社交',
  '语言': '语言', '说话': '语言', '沉默': '沉默',
  '身体': '身体', '健康': '身体',
  '习惯': '习惯', '无聊': '无聊', '告别': '告别', '离别': '告别',
  '真理': '真理', '真相': '真理', '自我': '自我', '我是谁': '自我',
  '别人': '他者', '他者': '他者', '荒诞': '荒诞',
  '顿悟': '顿悟', '觉悟': '顿悟', '选择': '选择'
};

const KEY_LIST = Object.entries(KEYWORDS).sort((a, b) => b[0].length - a[0].length);
const STORE_KEY = 'fatfish-philosophy-v3';
const MAX_HISTORY = 14;
const CIG_TURNS = 3;
const CIG_FULL = 94;

const $ = (id) => document.getElementById(id);

const els = {
  stage: $('stage'),
  canvas: $('smokeCanvas'),
  ember: $('ember'),
  emberGlow: document.querySelector('.ember-glow'),
  ash: $('ash'),
  cigBody: $('cigBody'),
  ashtray: $('ashtray'),
  quoteText: $('quoteText'),
  caret: $('caret'),
  quoteIndex: $('quoteIndex'),
  topicPill: $('topicPill'),
  questionEcho: $('questionEcho'),
  thinkingMeta: $('thinkingMeta'),
  thinkingLabel: $('thinkingLabel'),
  turnTokens: $('turnTokens'),
  statusText: $('statusText'),
  clock: $('clock'),
  askForm: $('askForm'),
  askInput: $('askInput'),
  smokeBtn: $('smokeBtn'),
  topicBtn: $('topicBtn'),
  pauseBtn: $('pauseBtn'),
  autoToggle: $('autoToggle'),
  resetBtn: $('resetBtn'),
  statTotal: $('statTotal'),
  statSession: $('statSession'),
  statCtx: $('statCtx'),
  statCigs: $('statCigs'),
  statTurns: $('statTurns'),
  statCost: $('statCost'),
  lastDelta: $('lastDelta'),
  bars: $('bars'),
  cigBadge: $('cigBadge'),
  bubble: $('fishBubble'),
  toast: $('toast'),
  srQuote: $('srQuote')
};

const nf = new Intl.NumberFormat('en-US');
const fmtInt = (n) => nf.format(Math.max(0, Math.round(n)));
const fmtCost = (c) => (c >= 1 ? c.toFixed(3) : c.toFixed(4));
const pad2 = (n) => String(n).padStart(2, '0');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------------- 本地存档 ---------------- */

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch (err) {
    return null;
  }
}

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      total: Math.round(state.totalFloat),
      cost: state.costFloat,
      cigs: state.cigs,
      turns: state.totalTurns,
      history: state.history.slice(-MAX_HISTORY)
    }));
  } catch (err) { /* 隐身模式也不影响抽烟 */ }
}

const saved = loadStore();

const state = {
  paused: false,
  auto: true,
  typing: false,
  skip: false,
  interrupt: false,
  pending: null,
  timer: null,
  turnInCig: 0,
  totalTurns: Number.isFinite(saved?.turns) ? saved.turns : 0,
  cigs: Number.isFinite(saved?.cigs) ? saved.cigs : 1,
  totalFloat: Number.isFinite(saved?.total) ? saved.total : 0,
  sessionFloat: 0,
  costFloat: Number.isFinite(saved?.cost) ? saved.cost : 0,
  inputThisTurn: 0,
  outputThisTurn: 0,
  history: Array.isArray(saved?.history) ? saved.history.filter((n) => Number.isFinite(n)).slice(-MAX_HISTORY) : [],
  lastDelta: 0,
  current: null,
  question: null
};

let runId = 0;

/* ---------------- 统计 ---------------- */

let statsRaf = 0;

function addTokens(amount, kind) {
  if (!amount) return;
  state.totalFloat += amount;
  state.sessionFloat += amount;
  state.costFloat += (amount * (kind === 'input' ? 2 : 3)) / 1e6;
  scheduleStats();
}

function scheduleStats() {
  if (statsRaf) return;
  statsRaf = requestAnimationFrame(() => {
    statsRaf = 0;
    renderStats();
  });
}

function renderStats() {
  const totalText = fmtInt(state.totalFloat);
  els.statTotal.textContent = totalText;
  els.statTotal.classList.toggle('small', totalText.length > 8);
  els.statSession.textContent = fmtInt(state.sessionFloat);
  els.statCtx.textContent = fmtInt(state.inputThisTurn + state.outputThisTurn);
  els.statCigs.textContent = fmtInt(state.cigs);
  els.statTurns.textContent = fmtInt(state.totalTurns);
  els.statCost.textContent = fmtCost(state.costFloat);
  els.lastDelta.textContent = '+' + fmtInt(state.lastDelta);
  els.cigBadge.textContent = pad2(state.cigs);
  els.turnTokens.textContent = '输入 ' + fmtInt(state.inputThisTurn) + ' · 输出 ' + fmtInt(state.outputThisTurn) + ' tokens';
}

function renderBars() {
  const padded = new Array(Math.max(0, MAX_HISTORY - state.history.length)).fill(0).concat(state.history);
  const max = Math.max(40, ...state.history);
  const frag = document.createDocumentFragment();
  padded.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    const isLast = value > 0 && i === padded.length - 1;
    if (isLast) bar.classList.add('is-last');
    bar.style.height = value > 0 ? Math.max(6, Math.round((value / max) * 100)) + '%' : '7%';
    bar.title = value > 0 ? '第 ' + (i + 1) + ' 格 · ' + fmtInt(value) + ' tokens' : '还没有这一轮';
    frag.appendChild(bar);
  });
  els.bars.replaceChildren(frag);
}

/* ---------------- 香烟与文案 ---------------- */

function tokenWeight(ch) {
  if (/[\u3400-\u9fff]/.test(ch)) return 0.6;
  if (/[，。！？；：、“”‘’…—]/.test(ch)) return 0.45;
  if (/\s/.test(ch)) return 0.1;
  return 0.3;
}

function charDelay(ch) {
  if (/[。！？]/.test(ch)) return 230 + Math.random() * 120;
  if (/[，、；：—]/.test(ch)) return 100 + Math.random() * 60;
  return 22 + Math.random() * 26;
}

function pickThought(question) {
  let pool = THOUGHTS;
  if (question) {
    const q = question.replace(/\s+/g, '');
    let exact = THOUGHTS.filter((t) => q.includes(t.topic));
    if (!exact.length) {
      const hit = KEY_LIST.find(([key]) => q.includes(key));
      if (hit) {
        const match = THOUGHTS.filter((t) => t.topic === hit[1]);
        if (match.length) exact = match;
      }
    }
    if (exact.length) pool = exact;
  }
  const candidates = pool.filter((t) => t !== state.current);
  const list = candidates.length ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}

function setCigBurn(width) {
  const w = Math.max(10, Math.min(CIG_FULL, width));
  els.cigBody.setAttribute('width', w.toFixed(1));
  const tipX = (w + 2).toFixed(1);
  els.ember.setAttribute('cx', tipX);
  els.emberGlow.setAttribute('cx', tipX);
  if (els.ash) els.ash.setAttribute('d', 'M' + (w - 3).toFixed(1) + ' 5l4 2-2 3-4-1Z');
}

function setStatus(text) {
  els.statusText.textContent = text;
}

function setThinking(on) {
  els.thinkingMeta.classList.toggle('is-idle', !on);
  els.thinkingLabel.textContent = on ? '正在组织语言' : '刚吐出一个烟圈';
}

function updatePauseUI() {
  els.pauseBtn.textContent = state.paused ? '继续思考' : '让它歇会';
  els.pauseBtn.classList.toggle('is-on', state.paused);
  if (state.paused) {
    els.thinkingMeta.classList.add('is-idle');
    els.thinkingLabel.textContent = '把烟按灭了，正在发呆';
  }
}

function showQuestion(question) {
  els.questionEcho.textContent = '你问：' + question;
  els.questionEcho.hidden = false;
}

function hideQuestion() {
  els.questionEcho.hidden = true;
  els.questionEcho.textContent = '';
}

let toastTimer = 0;
function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1900);
}

function showBubble(text) {
  els.bubble.hidden = false;
  els.bubble.textContent = text;
  els.bubble.style.animation = 'none';
  void els.bubble.offsetWidth;
  els.bubble.style.animation = '';
}
els.bubble.addEventListener('animationend', () => { els.bubble.hidden = true; });

/* ---------------- 思考主循环 ---------------- */

async function startThought(opts = {}) {
  if (state.typing) return;
  const { newCig = false, question = null, announce = false } = opts;

  clearTimeout(state.timer);
  state.timer = null;
  state.typing = true;
  state.interrupt = false;
  state.skip = false;
  state.pending = null;
  state.question = question;

  const myRun = ++runId;
  const aborted = () => myRun !== runId;

  if (state.paused) {
    state.paused = false;
    updatePauseUI();
  }

  if (newCig) {
    state.turnInCig = 0;
    state.cigs += 1;
    setCigBurn(CIG_FULL);
    flareEmber();
    burstAtEmber(18);
    renderStats();
    if (announce) {
      const lines = ['咔嚓——新的一根。', '火苗照亮了它半张脸。', '它熟练得让人心疼。', '烟灰缸又满了一点。'];
      showToast(lines[Math.floor(Math.random() * lines.length)]);
    }
  }

  const entry = pickThought(question);
  state.current = entry;

  els.quoteText.replaceChildren(els.caret);
  const wait = document.createElement('span');
  wait.className = 'quote-wait';
  wait.textContent = '……';
  els.quoteText.insertBefore(wait, els.caret);
  els.waitingEl = wait;
  els.topicPill.textContent = '关于' + entry.topic;
  els.quoteIndex.textContent = '第 ' + pad2(state.totalTurns + 1) + ' 则';
  if (question) showQuestion(question); else hideQuestion();

  const inputTokens = 720 + 180 * state.turnInCig;
  const reasoningTokens = 240 + Math.floor(Math.random() * 360);
  state.inputThisTurn = inputTokens;
  state.outputThisTurn = reasoningTokens;
  state.totalTurns += 1;
  state.turnInCig += 1;

  addTokens(inputTokens, 'input');
  addTokens(reasoningTokens, 'output');
  setStatus('正在吞云吐雾');
  setThinking(true);
  renderStats();

  await sleep(state.skip ? 0 : 420 + Math.random() * 300);
  if (aborted()) return;

  const chars = Array.from(entry.text);
  for (let i = 0; i < chars.length; i++) {
    if (aborted() || state.interrupt) break;
    while (state.paused && !state.interrupt) {
      await sleep(140);
      if (aborted()) return;
    }
    if (aborted() || state.interrupt) break;

    if (i === 0 && els.waitingEl) {
      els.waitingEl.remove();
      els.waitingEl = null;
    }

    const ch = chars[i];
    els.caret.insertAdjacentText('beforebegin', ch);
    const weight = tokenWeight(ch);
    state.outputThisTurn += weight;
    addTokens(weight, 'output');
    els.turnTokens.textContent = '输入 ' + fmtInt(state.inputThisTurn) + ' · 输出 ' + fmtInt(state.outputThisTurn) + ' tokens';

    const burnBase = 19 * (state.turnInCig - 1);
    setCigBurn(CIG_FULL - burnBase - 19 * ((i + 1) / chars.length));
    await sleep(state.skip ? 0 : charDelay(ch));
  }

  if (aborted()) return;

  state.typing = false;
  state.skip = false;
  state.outputThisTurn = Math.round(state.outputThisTurn);
  state.inputThisTurn = Math.round(state.inputThisTurn);
  state.lastDelta = state.inputThisTurn + state.outputThisTurn;
  state.history.push(state.outputThisTurn);
  state.history = state.history.slice(-MAX_HISTORY);

  setThinking(false);
  updateTurnMeta();
  renderStats();
  renderBars();
  saveStore();

  const spoken = els.quoteText.textContent.trim();
  if (spoken) els.srQuote.textContent = spoken;

  handleAfterThought();
}

function updateTurnMeta() {
  els.turnTokens.textContent = '输入 ' + fmtInt(state.inputThisTurn) + ' · 输出 ' + fmtInt(state.outputThisTurn) + ' tokens';
}

function handleAfterThought() {
  if (state.pending) {
    const action = state.pending;
    const myRun = runId;
    state.pending = null;
    setTimeout(() => {
      if (myRun !== runId) return;
      runAction(action.action, action.payload);
    }, 240);
    return;
  }
  if (state.paused) {
    setStatus('歇着，烟快灭了');
    return;
  }
  if (!state.auto) {
    setStatus('等你递烟');
    return;
  }
  scheduleNext();
}

function scheduleNext() {
  if (!state.auto || state.paused || state.typing) return;
  clearTimeout(state.timer);
  setStatus('望着天花板');
  const wait = 1800 + Math.random() * 1500;
  state.timer = setTimeout(() => {
    state.timer = null;
    if (state.typing || state.paused || !state.auto) return;
    const newCig = state.turnInCig >= CIG_TURNS;
    startThought({ newCig });
  }, wait);
}

function runAction(action, payload) {
  if (state.paused) {
    state.paused = false;
    updatePauseUI();
  }
  clearTimeout(state.timer);
  state.timer = null;
  if (action === 'newCig') startThought({ newCig: true, announce: true });
  else if (action === 'ask') startThought({ question: payload });
  else startThought();
}

function requestAction(action, payload) {
  if (state.paused) {
    state.paused = false;
    updatePauseUI();
  }
  if (state.typing) {
    state.pending = { action, payload };
    state.skip = true;
    showToast('它加快了语速……');
    return;
  }
  runAction(action, payload);
}

/* ---------------- 按钮与交互 ---------------- */

els.smokeBtn.addEventListener('click', () => requestAction('newCig'));
els.topicBtn.addEventListener('click', () => requestAction('topic'));

els.pauseBtn.addEventListener('click', () => {
  state.paused = !state.paused;
  updatePauseUI();
  if (state.paused) {
    clearTimeout(state.timer);
    state.timer = null;
    setStatus('歇着，烟快灭了');
    return;
  }
  if (!state.typing) {
    if (state.turnInCig >= CIG_TURNS) startThought({ newCig: true, announce: true });
    else startThought();
  } else {
    setThinking(true);
    setStatus('正在吞云吐雾');
  }
});

els.autoToggle.addEventListener('change', (event) => {
  state.auto = event.target.checked;
  if (!state.auto) {
    clearTimeout(state.timer);
    state.timer = null;
    if (!state.typing) setStatus('等你递烟');
  } else if (!state.typing && !state.paused) {
    scheduleNext();
  }
});

els.askForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = els.askInput.value.trim();
  if (!question) return;
  els.askInput.value = '';
  requestAction('ask', question);
});

els.stage.addEventListener('click', (event) => {
  if (!event.target.closest('.scene')) return;
  burstAtEmber(20);
  const lines = ['呼——', '别吵，我在想事情。', '这根不算。', '你也要来一口？', '看什么看，没见过胖鱼啊。'];
  showBubble(lines[Math.floor(Math.random() * lines.length)]);
});

let resetTimer = 0;
let resetArmed = false;
let resetArmTimer = 0;

function disarmReset() {
  resetArmed = false;
  clearTimeout(resetArmTimer);
  resetArmTimer = 0;
  els.resetBtn.textContent = '重置账本';
  els.resetBtn.classList.remove('warn');
}

function doReset() {
  runId += 1;
  state.typing = false;
  state.interrupt = true;
  state.pending = null;
  state.paused = false;
  state.skip = false;
  clearTimeout(state.timer);
  state.timer = null;
  clearTimeout(resetTimer);

  state.totalFloat = 0;
  state.sessionFloat = 0;
  state.costFloat = 0;
  state.cigs = 0;
  state.totalTurns = 0;
  state.turnInCig = 0;
  state.history = [];
  state.lastDelta = 0;
  state.inputThisTurn = 0;
  state.outputThisTurn = 0;
  state.current = null;

  clearTimeout(toastTimer);
  saveStore();
  renderStats();
  renderBars();
  updatePauseUI();
  setCigBurn(CIG_FULL);
  setThinking(false);
  setStatus('正在找打火机');
  hideQuestion();
  els.quoteText.replaceChildren(els.caret);
  els.waitingEl = null;
  els.quoteIndex.textContent = '第 01 则';
  els.topicPill.textContent = '尚未开始';
  showToast('账本烧了。新的鱼生。');

  resetTimer = setTimeout(() => {
    if (!state.typing) startThought({ newCig: true, announce: false });
  }, 650);
}

els.resetBtn.addEventListener('click', () => {
  if (!resetArmed) {
    resetArmed = true;
    els.resetBtn.textContent = '再点一次';
    els.resetBtn.classList.add('warn');
    clearTimeout(resetArmTimer);
    resetArmTimer = setTimeout(disarmReset, 8000);
    return;
  }
  disarmReset();
  doReset();
});

/* ---------------- 烟雾画布 ---------------- */

const canvas = els.canvas;
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sprite = (() => {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 1, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,246,234,.95)');
  grd.addColorStop(.34, 'rgba(238,224,208,.48)');
  grd.addColorStop(.72, 'rgba(214,200,186,.14)');
  grd.addColorStop(1, 'rgba(200,188,176,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
})();

let cw = 0;
let ch = 0;
let dpr = 1;
let lastTime = 0;
let spawnAcc = 0;
let ashtrayAcc = 0;
let emberPos = { x: 0, y: 0 };
let ashtrayPos = { x: 0, y: 0 };
const puffs = [];

function resizeCanvas() {
  const rect = els.stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  cw = rect.width;
  ch = rect.height;
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  updateEmberPos();
}

function updateEmberPos() {
  if (!cw) return;
  const cr = canvas.getBoundingClientRect();
  const er = els.ember.getBoundingClientRect();
  if (er.width) {
    emberPos = {
      x: er.left + er.width / 2 - cr.left,
      y: er.top + er.height / 2 - cr.top
    };
  }
  const ar = els.ashtray.getBoundingClientRect();
  if (ar.width) {
    ashtrayPos = {
      x: ar.left + ar.width * 0.34 - cr.left,
      y: ar.top + ar.height * 0.22 - cr.top
    };
  }
}

function spawnPuff(x, y, burst) {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * (burst ? 2.1 : 0.4);
  const speed = burst ? 22 + Math.random() * 48 : 24 + Math.random() * 14;
  puffs.push({
    x,
    y,
    vx: Math.cos(angle) * speed + (burst ? (Math.random() - 0.5) * 16 : 2 + Math.random() * 5),
    vy: Math.sin(angle) * speed - (burst ? 0 : 4),
    r: burst ? 4 + Math.random() * 9 : 3 + Math.random() * 4.5,
    grow: burst ? 10 + Math.random() * 16 : 7 + Math.random() * 9,
    life: 0,
    maxLife: 3.8 + Math.random() * 2.4,
    seed: Math.random() * Math.PI * 2,
    swirl: 0.4 + Math.random() * 0.9,
    alpha: 0.36 + Math.random() * 0.12
  });
  if (puffs.length > 130) puffs.splice(0, puffs.length - 130);
}

function burstAtEmber(count) {
  if (reduceMotion) return;
  updateEmberPos();
  for (let i = 0; i < count; i++) {
    spawnPuff(emberPos.x + (Math.random() - 0.5) * 4, emberPos.y + (Math.random() - 0.5) * 4, true);
  }
}

function flareEmber() {
  els.ember.classList.remove('flare');
  void els.ember.getBoundingClientRect();
  els.ember.classList.add('flare');
}

function drawSmoke(ts) {
  requestAnimationFrame(drawSmoke);
  if (!cw || !ch || document.hidden) return;
  const dt = lastTime ? Math.min(0.05, (ts - lastTime) / 1000) : 0.016;
  lastTime = ts;

  ctx.clearRect(0, 0, cw, ch);

  const interval = reduceMotion ? 1.1 : (state.paused ? 0.8 : state.typing ? 0.07 : 0.15);
  spawnAcc += dt;
  while (spawnAcc >= interval) {
    spawnAcc -= interval;
    if (puffs.length < 105) {
      spawnPuff(
        emberPos.x + (Math.random() - 0.5) * 3,
        emberPos.y + (Math.random() - 0.5) * 3,
        false
      );
    }
  }

  if (!reduceMotion) {
    ashtrayAcc += dt;
    if (ashtrayAcc > 2.6) {
      ashtrayAcc = 0;
      if (puffs.length < 100) {
        spawnPuff(ashtrayPos.x + (Math.random() - 0.5) * 5, ashtrayPos.y, false);
      }
    }
  }

  for (let i = puffs.length - 1; i >= 0; i--) {
    const p = puffs[i];
    p.life += dt;
    if (p.life >= p.maxLife) {
      puffs.splice(i, 1);
      continue;
    }
    p.x += (p.vx + Math.sin(p.life * p.swirl + p.seed) * 9) * dt;
    p.y += p.vy * dt;
    p.vy -= 1.1 * dt;
    p.vx *= 0.995;
    p.r += p.grow * dt;

    const t = p.life / p.maxLife;
    const alpha = p.alpha * Math.min(1, t / 0.14) * Math.pow(1 - t, 1.45);
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
  }
  ctx.globalAlpha = 1;
}

/* ---------------- 时钟 & 初始化 ---------------- */

function tickClock() {
  const d = new Date();
  els.clock.textContent = pad2(d.getHours()) + ':' + pad2(d.getMinutes());
}

function init() {
  renderStats();
  renderBars();
  updatePauseUI();
  setCigBurn(CIG_FULL);
  tickClock();
  setInterval(tickClock, 15000);

  resizeCanvas();
  if ('ResizeObserver' in window) {
    new ResizeObserver(resizeCanvas).observe(els.stage);
  } else {
    window.addEventListener('resize', resizeCanvas);
  }
  window.addEventListener('resize', resizeCanvas);
  setInterval(() => { if (!document.hidden) updateEmberPos(); }, 650);

  requestAnimationFrame(drawSmoke);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      lastTime = 0;
      updateEmberPos();
    }
  });
  window.addEventListener('pagehide', saveStore);

  if (state.cigs < 1) {
    state.cigs = 1;
    renderStats();
  }

  setTimeout(() => {
    if (!state.typing) startThought();
  }, 900);
}

init();
