/* =========================================================
 * 🍂 English Time Machine · 과거 · 현재 · 미래 듣고 따라 말하기 웹 앱
 * - 시제 전환: 과거(기본) / 현재 / 미래 — 모든 문장이 시제에 맞게 바뀜
 * - 규칙 / 불규칙 동사 구분 (배지 · 필터 · 변화표)
 * - 그림: illustrations.js 의 인라인 SVG (외부 이미지 요청 없음)
 * - 음성 출력: Web Speech API (SpeechSynthesis)
 * - 단어 클릭: 단어 발음 + 뜻 풍선(popup)
 * - 문장 만들기: 활동 + 때/장소/누구와 조합 → 검사 + 번역 + 듣기
 * - 따라 말하기 채점: Web Speech API (SpeechRecognition)
 * ========================================================= */

/* ---------- 시제 상태 ---------- */
let tense = "past"; // 기본값: 과거

/* {a|b} / {a|b|c} 템플릿에서 idx 번째 항목 고르기 */
function fillTemplate(tpl, idx) {
  return tpl.replace(/\{([^}]*)\}/g, (_, g) => {
    const parts = g.split("|");
    return parts[Math.min(idx, parts.length - 1)];
  });
}
/* 영어 문장: 과거 → "I + 과거형", 현재 → "I + 원형", 미래 → "I'll + 원형" */
function enSentence(tpl, t) {
  t = t || tense;
  const body = fillTemplate(tpl, t === "past" ? 1 : 0);
  return (t === "future" ? "I'll " : "I ") + body + ".";
}
/* 한글 문장: {과거|현재|미래} */
function koSentence(tpl, t) {
  t = t || tense;
  return fillTemplate(tpl, TENSE_ORDER.indexOf(t));
}
/* 난이도별 템플릿 키 */
const LEVEL_KEYS = {
  beginner:     { en: "base", ko: "ko" },
  intermediate: { en: "mid",  ko: "koMid" },
  advanced:     { en: "adv",  ko: "koAdv" },
};
/* 활동 → 카드용 문장 객체 */
function activityItem(act, level, t) {
  const k = LEVEL_KEYS[level];
  return {
    en: enSentence(act[k.en], t),
    ko: koSentence(act[k.ko], t),
    emoji: act.emoji,
    art: act.art,
    verb: act.verb,
    regular: act.regular,
    rule: act.rule,
    tense: t || tense,
  };
}

/* ---------- 음성 합성 (TTS) ---------- */
const synth = window.speechSynthesis;
let enVoice = null;
let speakRate = 0.85;

function pickVoice() {
  const voices = synth.getVoices();
  enVoice =
    voices.find(v => /en[-_]US/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null;
  const status = document.querySelector(".toolbar #voice-status");
  if (status) {
    status.textContent = enVoice ? `음성: ${enVoice.name}` : "영어 음성을 찾는 중...";
  }
}
pickVoice();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;

function speak(text, rate, onStart, onEnd) {
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate || speakRate;
  u.pitch = 1.05;
  if (enVoice) u.voice = enVoice;
  if (onStart) u.onstart = onStart;
  if (onEnd) u.onend = onEnd;
  synth.speak(u);
}

/* 여러 문장을 차례로 (원형 → 과거형) */
function speakSequence(list, rate, onEnd) {
  if (!synth) return;
  synth.cancel();
  let i = 0;
  const next = () => {
    if (i >= list.length) { onEnd && onEnd(); return; }
    const u = new SpeechSynthesisUtterance(list[i++]);
    u.lang = "en-US"; u.rate = rate || speakRate; u.pitch = 1.05;
    if (enVoice) u.voice = enVoice;
    u.onend = () => setTimeout(next, 250);
    u.onerror = () => { onEnd && onEnd(); };
    synth.speak(u);
  };
  next();
}

/* ---------- 단어 뜻 풍선(popup) ---------- */
const popup = document.createElement("div");
popup.className = "word-popup hidden";
popup.innerHTML = `
  <div class="wp-word"></div>
  <div class="wp-meaning"></div>
  <button class="wp-listen">단어 다시 듣기</button>`;
document.body.appendChild(popup);

popup.querySelector(".wp-listen").addEventListener("click", e => {
  e.stopPropagation();
  if (popup.dataset.word) speak(popup.dataset.word, 0.8);
});

function showWordPopup(wordEl, rawWord) {
  const key = wordKey(rawWord);
  const meaning = WORD_MEANINGS[key] || "(뜻 정보 없음)";
  popup.dataset.word = key || rawWord;
  popup.querySelector(".wp-word").textContent = rawWord.replace(/[.,!?]+$/, "");
  popup.querySelector(".wp-meaning").textContent = meaning;

  popup.classList.remove("hidden");
  const r = wordEl.getBoundingClientRect();
  const pw = popup.offsetWidth;
  let left = r.left + r.width / 2 - pw / 2 + window.scrollX;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  let top = r.bottom + 8 + window.scrollY;
  popup.style.left = left + "px";
  popup.style.top = top + "px";

  speak(key || rawWord, 0.8);
}

function hidePopup() { popup.classList.add("hidden"); }
document.addEventListener("click", e => {
  if (!popup.contains(e.target) && !e.target.classList.contains("word")) hidePopup();
});

/* ---------- 클릭 가능한 단어로 문장 만들기 ----------
 * verbForms: 강조할 동사(과거형 등)가 있으면 .verb-hl 클래스를 붙여요 */
function buildWords(sentence, verbForms) {
  const frag = document.createDocumentFragment();
  const hl = new Set((verbForms || []).map(v => v.toLowerCase()));
  sentence.split(/\s+/).forEach((w, i) => {
    if (i > 0) frag.appendChild(document.createTextNode(" "));
    const span = document.createElement("span");
    span.className = "word";
    if (hl.has(wordKey(w))) span.classList.add("verb-hl");
    span.textContent = w;
    span.addEventListener("click", e => {
      e.stopPropagation();
      showWordPopup(span, w);
    });
    frag.appendChild(span);
  });
  return frag;
}

/* ---------- 일러스트 (인라인 SVG, 외부 이미지 없음) ---------- */
function makeVisual(item) {
  const draw = item.art && window.ILLUSTRATIONS && window.ILLUSTRATIONS[item.art];
  if (draw) {
    const box = document.createElement("div");
    box.className = "illus";
    box.innerHTML = draw();
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", item.en);
    return box;
  }
  const em = document.createElement("div");
  em.className = "emoji";
  em.textContent = item.emoji;
  return em;
}

/* ---------- 동사 배지 (규칙/불규칙, 시제별 모양) ---------- */
function makeVerbBadge(item) {
  if (!item.verb) return null;
  const [base, past] = item.verb;
  const b = document.createElement("div");
  const t = item.tense || tense;
  if (t === "past") {
    b.className = "verb-badge " + (item.regular ? "reg" : "irr");
    const ruleTxt = item.regular ? `규칙 (${(RULES[item.rule] || RULES.ed).short})` : "불규칙";
    b.innerHTML = `<span class="vb-form">${base} → <b>${past}</b></span><span class="vb-kind">${item.regular ? "✅" : "🔀"} ${ruleTxt}</span>`;
  } else if (t === "present") {
    b.className = "verb-badge now";
    b.innerHTML = `<span class="vb-form">동사 원형 <b>${base}</b></span><span class="vb-kind">⏺ 현재</span>`;
  } else {
    b.className = "verb-badge fut";
    b.innerHTML = `<span class="vb-form">will + <b>${base}</b></span><span class="vb-kind">⏩ 미래</span>`;
  }
  return b;
}

/* 시제 태그 (연습 카드 등) */
function tenseTag(t) {
  const info = TENSES[t] || TENSES.past;
  return `${info.icon} ${info.label}`;
}

/* ---------- 카드 만들기 ---------- */
function makeCard(item, opts) {
  opts = opts || {};
  const div = document.createElement("div");
  div.className = "card" + (opts.tone != null ? " tone-" + opts.tone : "");

  function speakSentence() {
    speak(item.en, null,
      () => div.classList.add("speaking"),
      () => div.classList.remove("speaking"));
  }

  // 윗줄: 태그 + 듣기
  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  if (opts.index != null) tag.textContent = "CARD " + opts.index;
  const listenAll = document.createElement("button");
  listenAll.className = "listen-all";
  listenAll.textContent = "듣기 ▶";
  listenAll.addEventListener("click", e => { e.stopPropagation(); speakSentence(); });
  top.append(tag, listenAll);

  const visual = makeVisual(item);

  // 안쪽 문장 박스: 문장 + 한글 + 스피커
  const box = document.createElement("div");
  box.className = "sentence-box";
  const txt = document.createElement("div");
  txt.className = "sentence-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en, item.verb && (item.tense || tense) === "past" ? [item.verb[1]] : null));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.setAttribute("aria-label", "문장 듣기");
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", e => { e.stopPropagation(); speakSentence(); });
  box.append(txt, speakBtn);

  div.append(top, visual, box);

  const badge = makeVerbBadge(item);
  if (badge) div.append(badge);

  // ⭐ 연습 목록 담기 버튼
  if (opts.selectable) {
    const sel = document.createElement("button");
    sel.className = "select-btn";
    const on = isSelected(item.en);
    sel.classList.toggle("on", on);
    sel.textContent = on ? "✓ 연습 목록에 있음" : "⭐ 연습 목록에 추가";
    sel.addEventListener("click", e => {
      e.stopPropagation();
      toggleSelect(item, opts.selectType || "suggest");
    });
    div.append(sel);
  }
  return div;
}

function renderGrid(id, list, opts) {
  opts = opts || {};
  const grid = document.getElementById(id);
  grid.innerHTML = "";
  list.forEach((item, i) => {
    const cardOpts = {};
    if (opts.tones) { cardOpts.tone = i % 6; if (!opts.noIndex) cardOpts.index = i + 1; }
    if (opts.selectable) { cardOpts.selectable = true; cardOpts.selectType = opts.selectType; }
    grid.appendChild(makeCard(item, cardOpts));
  });
}

/* ---------- 난이도 + 활동 종류 + 규칙/불규칙 ---------- */
let currentLevel = "beginner";
let currentCategory = "all";
let currentReg = "all"; // all | regular | irregular (과거 시제에서만)

function renderSuggestions() {
  const view = [];
  ACTIVITIES.forEach(act => {
    if (currentCategory !== "all" && act.cat !== currentCategory) return;
    if (tense === "past" && currentReg === "regular" && !act.regular) return;
    if (tense === "past" && currentReg === "irregular" && act.regular) return;
    view.push(activityItem(act, currentLevel, tense));
  });
  renderGrid("suggestion-grid", view, { tones: true, selectable: true });
  document.getElementById("suggest-count").textContent = `${view.length}개`;
}

document.querySelectorAll(".level-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLevel = btn.dataset.level;
    synth.cancel();
    hidePopup();
    renderSuggestions();
  });
});

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    synth.cancel();
    hidePopup();
    renderSuggestions();
  });
});

document.querySelectorAll(".reg-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".reg-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentReg = btn.dataset.reg;
    synth.cancel();
    hidePopup();
    renderSuggestions();
  });
});

/* ===========================================================
 * 🔤 동사 변화표 (규칙 / 불규칙)
 * =========================================================== */
function collectVerbs() {
  const seen = new Map();
  ACTIVITIES.forEach(a => {
    const key = a.verb[0];
    if (!seen.has(key)) seen.set(key, { verb: a.verb, regular: a.regular, rule: a.rule, meaning: VERB_MEANINGS[key] || "" });
  });
  BONUS_VERBS.forEach(v => { if (!seen.has(v.verb[0])) seen.set(v.verb[0], v); });
  return [...seen.values()];
}

function makeVerbCard(v) {
  const [base, past] = v.verb;
  const c = document.createElement("button");
  c.className = "verb-card " + (v.regular ? "reg" : "irr");
  const forms = document.createElement("div");
  forms.className = "vc-forms";
  forms.innerHTML = `<span class="vc-base">${base}</span><span class="vc-arrow">→</span><span class="vc-past">${past}</span>`;
  const meta = document.createElement("div");
  meta.className = "vc-meta";
  const ruleTxt = v.regular ? (RULES[v.rule] || RULES.ed).short : "불규칙 · 외우기";
  meta.innerHTML = `<span class="vc-mean">${v.meaning || ""}</span><span class="vc-rule">${ruleTxt}</span>`;
  const play = document.createElement("div");
  play.className = "vc-play";
  play.textContent = "🔊 원형 → 과거형";
  c.append(forms, meta, play);
  c.addEventListener("click", () => {
    hidePopup();
    document.querySelectorAll(".verb-card.speaking").forEach(x => x.classList.remove("speaking"));
    c.classList.add("speaking");
    speakSequence([base, past], 0.8, () => c.classList.remove("speaking"));
  });
  return c;
}

function renderVerbTable() {
  const verbs = collectVerbs();
  const reg = verbs.filter(v => v.regular);
  const irr = verbs.filter(v => !v.regular);
  const rg = document.getElementById("regular-grid");
  const ig = document.getElementById("irregular-grid");
  rg.innerHTML = ""; ig.innerHTML = "";
  reg.forEach(v => rg.appendChild(makeVerbCard(v)));
  irr.forEach(v => ig.appendChild(makeVerbCard(v)));
  document.getElementById("verb-count").textContent = `${verbs.length}개`;

  const tips = document.getElementById("rule-tips");
  tips.innerHTML = "";
  Object.keys(RULES).forEach(k => {
    const ex = reg.find(v => (v.rule || "ed") === k);
    const tip = document.createElement("div");
    tip.className = "rule-tip";
    tip.innerHTML = `<b>${RULES[k].short}</b> ${RULES[k].desc}` + (ex ? ` <span class="rt-ex">(${ex.verb[0]} → ${ex.verb[1]})</span>` : "");
    tips.appendChild(tip);
  });
}

/* ===========================================================
 * 🧩 문장 만들기 (활동 + 때/장소/누구와 조합)
 * =========================================================== */
let buildActivity = null;
let buildModifier = null; // { en, ko, type: "when" | "where" | "with" }
let lastBuilt = "";       // 마지막으로 들려준 문장 (별표 토글 때 중복 재생 방지)

function makeChip(text, cls, isOn, onClick) {
  const c = document.createElement("button");
  c.className = "chip " + cls + (isOn ? " on" : "");
  c.textContent = text;
  c.addEventListener("click", onClick);
  return c;
}

/* 활동 칩에 보여줄 짧은 구 (시제에 맞게) */
function activityPhrase(act, t) { return fillTemplate(act.base, (t || tense) === "past" ? 1 : 0); }

function renderBuilder() {
  const actWrap = document.getElementById("build-activities");
  const whenRow = document.getElementById("build-when");
  const whereRow = document.getElementById("build-where");
  const withRow = document.getElementById("build-with");
  actWrap.innerHTML = ""; whenRow.innerHTML = ""; whereRow.innerHTML = ""; withRow.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const items = ACTIVITIES.filter(a => a.cat === cat.key);
    if (!items.length) return;
    const title = document.createElement("div");
    title.className = "chip-group-title";
    title.textContent = cat.label;
    const row = document.createElement("div");
    row.className = "chip-row";
    items.forEach(a => {
      const chip = makeChip(`${a.emoji} ${activityPhrase(a)}`, "act", buildActivity === a, () => {
        buildActivity = a; renderBuilder(); updateBuildResult();
      });
      if (tense === "past") chip.classList.add(a.regular ? "chip-reg" : "chip-irr");
      row.appendChild(chip);
    });
    actWrap.append(title, row);
  });
  BUILD_WHEN[tense].forEach(m => {
    const on = buildModifier && buildModifier.type === "when" && buildModifier.en === m.en;
    whenRow.appendChild(makeChip(m.en, "when", on, () => {
      buildModifier = Object.assign({}, m, { type: "when" }); renderBuilder(); updateBuildResult();
    }));
  });
  BUILD_WHERE.forEach(m => {
    const on = buildModifier && buildModifier.type === "where" && buildModifier.en === m.en;
    whereRow.appendChild(makeChip(m.en, "where", on, () => {
      buildModifier = Object.assign({}, m, { type: "where" }); renderBuilder(); updateBuildResult();
    }));
  });
  BUILD_WITH.forEach(m => {
    const on = buildModifier && buildModifier.type === "with" && buildModifier.en === m.en;
    withRow.appendChild(makeChip(m.en, "with", on, () => {
      buildModifier = Object.assign({}, m, { type: "with" }); renderBuilder(); updateBuildResult();
    }));
  });
}

function updateBuildResult() {
  const box = document.getElementById("build-result");

  if (!buildActivity || !buildModifier) {
    box.className = "build-result empty";
    box.textContent = "활동과 때·장소를 골라보세요! 👆";
    lastBuilt = "";
    return;
  }

  // 장소가 이미 들어 있는 활동(go to the beach 등)에 또 장소를 붙이면 어색함
  const clash = buildModifier.type === "where" && buildActivity.place;
  if (clash) {
    box.className = "build-result bad";
    box.innerHTML = "";
    const badge = document.createElement("div");
    badge.className = "br-badge";
    badge.textContent = "🤔 이 조합은 어색해요";
    const note = document.createElement("div");
    note.className = "br-note";
    note.innerHTML = `"<b>${activityPhrase(buildActivity)}</b>" 에는 이미 <b>장소</b>가 들어 있어요.<br>📅 <b>때(When)</b> 나 👫 <b>누구와(With)</b> 표현과 함께 만들어 보세요!`;
    box.append(badge, note);
    lastBuilt = "";
    return;
  }

  // 올바른 문장:  I + (played basketball) + (yesterday).
  const en = enSentence(buildActivity.base).replace(/\.$/, "") + " " + buildModifier.en + ".";
  const ko = koSentence(buildActivity.ko).replace(/^나는 /, `나는 ${buildModifier.ko} `);

  box.className = "build-result ok";
  box.innerHTML = "";

  const badge = document.createElement("div");
  badge.className = "br-badge";
  badge.textContent = "✅ 멋진 문장이에요!";

  const enEl = document.createElement("div");
  enEl.className = "br-sentence";
  enEl.appendChild(buildWords(en, tense === "past" ? [buildActivity.verb[1]] : null));

  const koEl = document.createElement("div");
  koEl.className = "br-ko";
  koEl.textContent = ko;

  const vb = makeVerbBadge({ verb: buildActivity.verb, regular: buildActivity.regular, rule: buildActivity.rule, tense });
  vb.classList.add("br-verb");

  const actions = document.createElement("div");
  actions.className = "br-actions";
  const listenBtn = document.createElement("button");
  listenBtn.className = "btn primary";
  listenBtn.textContent = "🔊 듣기";
  listenBtn.addEventListener("click", () => speak(en));

  const item = { en, ko, emoji: buildActivity.emoji, art: buildActivity.art, verb: buildActivity.verb,
    regular: buildActivity.regular, rule: buildActivity.rule, tense, type: "combo" };
  const starBtn = document.createElement("button");
  starBtn.className = "btn";
  const on = isSelected(en);
  starBtn.textContent = on ? "✓ 연습 목록에 있음" : "⭐ 연습 목록에 추가";
  starBtn.addEventListener("click", () => { toggleSelect(item, "combo"); updateBuildResult(); });

  actions.append(listenBtn, starBtn);
  box.append(badge, enEl, koEl, vb, actions);

  // 새로운 문장이 완성되면 한 번만 들려주기 (별표 토글로 다시 부르면 재생 안 함)
  if (en !== lastBuilt) { lastBuilt = en; speak(en); }
}

document.getElementById("build-random").addEventListener("click", () => {
  buildActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
  // 때·누구와는 항상, 장소는 활동에 장소가 없을 때만
  let pool = BUILD_WHEN[tense].map(m => Object.assign({}, m, { type: "when" }))
    .concat(BUILD_WITH.map(m => Object.assign({}, m, { type: "with" })));
  if (!buildActivity.place) {
    pool = pool.concat(BUILD_WHERE.map(m => Object.assign({}, m, { type: "where" })));
  }
  buildModifier = pool[Math.floor(Math.random() * pool.length)];
  renderBuilder();
  updateBuildResult();
});

document.getElementById("build-clear").addEventListener("click", () => {
  buildActivity = null; buildModifier = null;
  synth.cancel();
  renderBuilder();
  updateBuildResult();
});

/* ===========================================================
 * 내 문장 연습 (선택 → 말하기/녹음 → 정확도 → 연습 횟수)
 * =========================================================== */
let selected = new Map();
let stats = {};
try { (JSON.parse(localStorage.getItem("tense_selected") || "[]") || []).forEach(it => selected.set(it.en, it)); } catch (e) {}
try { stats = JSON.parse(localStorage.getItem("tense_stats") || "{}") || {}; } catch (e) {}

function persist() {
  try {
    localStorage.setItem("tense_selected", JSON.stringify([...selected.values()]));
    localStorage.setItem("tense_stats", JSON.stringify(stats));
  } catch (e) {}
}
function isSelected(en) { return selected.has(en); }
function toggleSelect(item, type) {
  if (selected.has(item.en)) selected.delete(item.en);
  else selected.set(item.en, {
    en: item.en, ko: item.ko, emoji: item.emoji, art: item.art,
    verb: item.verb, regular: item.regular, rule: item.rule,
    tense: item.tense || tense, type: type || "suggest",
  });
  persist();
  updatePracticeBadge();
  renderSuggestions();
  if (document.getElementById("tab-practice").classList.contains("active")) renderPractice();
}
function updatePracticeBadge() {
  const c = document.getElementById("practice-count");
  if (c) c.textContent = selected.size;
}

/* ---- 음성 인식 (정확도 측정) ---- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const srSupported = !!SR;
let rec = srSupported ? new SR() : null;
if (rec) { rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5; }
let recBusy = false;

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z\s']/g, "").replace(/\s+/g, " ").trim();
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function wordsClose(a, b) {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
  return Math.abs(a.length - b.length) <= 1 && levenshtein(a, b) <= 1;
}
const STOPWORDS = new Set(["a", "an", "the", "to", "of", "on", "in", "at", "for", "but", "i", "i'm", "i'll"]);
function scoreMatch(target, heard) {
  const t = normalize(target).split(" ").filter(Boolean);
  const h = normalize(heard).split(" ").filter(Boolean);
  let content = t.filter(w => !STOPWORDS.has(w));
  if (!content.length) content = t;
  let hit = 0;
  content.forEach(w => { if (h.some(x => wordsClose(x, w))) hit++; });
  let score = hit / content.length;
  if (score >= 0.5) score = Math.min(1, score + 0.12);
  return score;
}
function practiceAttempt(target, cb) {
  if (!rec || recBusy) { cb.onend && cb.onend(); return; }
  recBusy = true;
  let score = 0, heard = "", errCode = null;
  rec.onresult = e => {
    const alts = e.results[0];
    for (let i = 0; i < alts.length; i++) {
      const s = scoreMatch(target, alts[i].transcript);
      if (s > score) { score = s; heard = alts[i].transcript; }
    }
  };
  rec.onerror = ev => { errCode = ev.error; };
  rec.onend = () => {
    recBusy = false;
    if (errCode && score === 0) cb.onerror && cb.onerror(errCode);
    else cb.onresult && cb.onresult(Math.round(score * 100), heard);
    cb.onend && cb.onend();
  };
  try { rec.start(); } catch (e) { recBusy = false; cb.onend && cb.onend(); }
}

/* ---- 연습 카드 ---- */
function makePracticeCard(item) {
  const div = document.createElement("div");
  div.className = "card pcard";

  const top = document.createElement("div");
  top.className = "card-top";
  const tags = document.createElement("span");
  tags.className = "tag-row";
  const tTag = document.createElement("span");
  tTag.className = "card-tag tag-tense tag-" + (item.tense || "past");
  tTag.textContent = tenseTag(item.tense || "past");
  const tag = document.createElement("span");
  tag.className = "card-tag " + (item.type === "combo" ? "tag-combo" : "tag-suggest");
  tag.textContent = item.type === "combo" ? "🧩 내 문장" : "🙋 한 일";
  tags.append(tTag, tag);
  const remove = document.createElement("button");
  remove.className = "premove";
  remove.setAttribute("aria-label", "목록에서 빼기");
  remove.textContent = "✕";
  remove.addEventListener("click", () => {
    selected.delete(item.en);
    persist();
    updatePracticeBadge();
    renderPractice();
    renderSuggestions();
  });
  top.append(tags, remove);

  const visual = makeVisual(item);

  const box = document.createElement("div");
  box.className = "sentence-box";
  const txt = document.createElement("div");
  txt.className = "sentence-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en, item.verb && item.tense === "past" ? [item.verb[1]] : null));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", () => speak(item.en));
  box.append(txt, speakBtn);

  const micArea = document.createElement("div");
  micArea.className = "mic-area";
  const mic = document.createElement("button");
  mic.className = "mic-btn";
  mic.setAttribute("aria-label", "말하기");
  mic.innerHTML = '<span class="mic-ico">🎙️</span>';
  const micLabel = document.createElement("div");
  micLabel.className = "mic-label";
  micLabel.textContent = "마이크를 누르고 말해보세요";
  micArea.append(mic, micLabel);

  const statsEl = document.createElement("div");
  statsEl.className = "pstats";
  const fb = document.createElement("div");
  fb.className = "mic-feedback";

  function renderStats(last) {
    const s = stats[item.en] || { attempts: 0, best: 0 };
    statsEl.innerHTML =
      `정확도 <b class="acc">${last != null ? last + "%" : "--"}</b>` +
      ` · 최고 <b class="best">${s.best ? s.best + "%" : "--"}</b>` +
      ` · 연습 <b>${s.attempts}</b>회`;
  }
  renderStats(null);

  if (!srSupported) { mic.disabled = true; mic.title = "이 브라우저는 음성 인식을 지원하지 않아요 (Chrome 권장)"; }

  mic.addEventListener("click", () => {
    if (recBusy || !srSupported) return;
    mic.classList.add("recording");
    micLabel.textContent = "🔴 녹음 중... 말해보세요";
    fb.textContent = "또박또박 말해보세요!";
    fb.className = "mic-feedback";
    practiceAttempt(item.en, {
      onresult: (score, heard) => {
        const s = stats[item.en] || { attempts: 0, best: 0 };
        s.attempts++;
        s.best = Math.max(s.best, score);
        stats[item.en] = s;
        persist();
        renderStats(score);
        if (score >= 75) { fb.className = "mic-feedback good"; fb.innerHTML = `⭐ 훌륭해요! (${score}%)<br><span class="heard">내가 한 발음: ${heard}</span>`; }
        else if (score >= 45) { fb.className = "mic-feedback good"; fb.innerHTML = `👍 좋아요! 한 번 더! (${score}%)<br><span class="heard">내가 한 발음: ${heard}</span>`; }
        else { fb.className = "mic-feedback bad"; fb.innerHTML = `🔁 다시 또박또박! (${score}%)<br><span class="heard">내가 한 발음: ${heard || "(못 들었어요)"}</span>`; }
      },
      onerror: err => {
        fb.className = "mic-feedback bad";
        fb.textContent = err === "not-allowed" ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요.";
      },
      onend: () => {
        mic.classList.remove("recording");
        micLabel.textContent = "마이크를 누르고 말해보세요";
      }
    });
  });

  div.append(top, visual, box, micArea, statsEl, fb);
  return div;
}

function renderPractice() {
  const items = [...selected.values()];
  const empty = document.getElementById("practice-empty");
  const list = document.getElementById("practice-list");
  if (!items.length) { empty.style.display = "block"; list.innerHTML = ""; updatePracticeBadge(); return; }
  empty.style.display = "none";
  // 한 일 문장 먼저, 내가 만든 문장 다음으로 정렬
  items.sort((a, b) => (a.type === "combo" ? 1 : 0) - (b.type === "combo" ? 1 : 0));
  list.innerHTML = "";
  items.forEach(it => list.appendChild(makePracticeCard(it)));
  updatePracticeBadge();
}

/* ===========================================================
 * ⏪⏺⏩ 시제에 따라 바뀌는 글 (제목 · 안내문 · 때 표현)
 * =========================================================== */
const TENSE_TEXT = {
  past: {
    suggestTitle: "여름방학에 한 일",
    hint: "난이도와 활동 종류를 고르면 문장이 나와요. <b>과거</b>를 말할 때는 동사가 <b>과거형</b>으로 바뀌어요! 카드 아래의 <b>✅ 규칙 / 🔀 불규칙</b> 배지를 보고, 위의 <b>동사 종류</b> 버튼으로 골라 볼 수도 있어요. 마음에 드는 문장은 <b>⭐</b>로 연습 목록에 담아보세요.",
    words: "💡 <b>What did you do this summer?</b> 의 답(<b>I + 과거형</b>)에 아래 표현을 <b>덧붙여</b> 문장을 더 풍부하게 만들어요. 과거는 <b>언제 했는지</b>(yesterday, last weekend…)를 함께 말하면 좋아요.",
    when: "언제 했는지 더해요. (예: I played basketball <b>yesterday</b>.)",
    where: "어디서 했는지 더해요. (예: I played soccer <b>at the park</b>.)",
    with: "누구와 했는지 더해요. (예: I went to a festival <b>with my family</b>.)",
    build: "① <b>활동</b>과 ② <b>때·장소·누구와</b>를 골라 <b>과거</b> 문장을 만들어 보세요! 활동 칩의 색으로 <b>✅ 규칙(초록) / 🔀 불규칙(주황)</b> 동사를 알 수 있어요.",
  },
  present: {
    suggestTitle: "평소에 하는 일",
    hint: "난이도와 활동 종류를 고르면 문장이 나와요. <b>현재</b>는 <b>늘 하는 일·습관</b>을 말할 때 써요. 주어가 <b>I</b> 이니까 동사는 <b>원형 그대로</b>! 마음에 드는 문장은 <b>⭐</b>로 연습 목록에 담아보세요.",
    words: "💡 <b>What do you do on weekends?</b> 의 답(<b>I + 동사 원형</b>)에 아래 표현을 <b>덧붙여</b> 문장을 더 풍부하게 만들어요. 현재는 <b>얼마나 자주</b>(every day, on Sundays…) 하는지 말하면 좋아요.",
    when: "얼마나 자주 하는지 더해요. (예: I play basketball <b>every day</b>.)",
    where: "어디서 하는지 더해요. (예: I read books <b>at the library</b>.)",
    with: "누구와 하는지 더해요. (예: I play soccer <b>with my friends</b>.)",
    build: "① <b>활동</b>과 ② <b>때·장소·누구와</b>를 골라 <b>현재</b>(늘 하는 일) 문장을 만들어 보세요!",
  },
  future: {
    suggestTitle: "앞으로 할 일",
    hint: "난이도와 활동 종류를 고르면 문장이 나와요. <b>미래</b>는 <b>will</b>을 써서 <b>I'll + 동사 원형</b>으로 말해요. 마음에 드는 문장은 <b>⭐</b>로 연습 목록에 담아보세요.",
    words: "💡 <b>What will you do this fall?</b> 의 답(<b>I'll + 동사 원형</b>)에 아래 표현을 <b>덧붙여</b> 문장을 더 풍부하게 만들어요. 미래는 <b>언제 할 건지</b>(tomorrow, this weekend…) 말하면 좋아요.",
    when: "언제 할 건지 더해요. (예: I'll play basketball <b>tomorrow</b>.)",
    where: "어디서 할 건지 더해요. (예: I'll read books <b>at the library</b>.)",
    with: "누구와 할 건지 더해요. (예: I'll go camping <b>with my family</b>.)",
    build: "① <b>활동</b>과 ② <b>때·장소·누구와</b>를 골라 <b>미래</b> 문장을 만들어 보세요!",
  },
};

function renderTenseBanner() {
  const info = TENSES[tense];
  const el = document.getElementById("tense-banner");
  el.className = "tense-banner tb-" + tense;
  el.innerHTML = "";
  const q = document.createElement("div");
  q.className = "tb-q";
  q.innerHTML = `<span class="tb-icon">${info.icon}</span><b>${info.question}</b>` +
    (info.question2 ? `<span class="tb-or">또는</span><b>${info.question2}</b>` : "") +
    `<span class="tb-ko">${info.questionKo}</span>`;
  const a = document.createElement("div");
  a.className = "tb-a";
  a.innerHTML = `답: <b>${info.answerForm}</b> <span class="tb-ex">→ ${info.example}</span>`;
  const btn = document.createElement("button");
  btn.className = "tb-listen";
  btn.textContent = "🔊 질문 듣기";
  btn.addEventListener("click", () => info.question2 ? speakSequence([info.question, info.question2]) : speak(info.question));
  el.append(q, a, btn);
}

function applyTense() {
  const t = TENSE_TEXT[tense];
  document.body.dataset.tense = tense;
  document.getElementById("subtitle").textContent = `${TENSES[tense].question} · ${TENSES[tense].subtitle}`;
  document.getElementById("suggest-title").textContent = t.suggestTitle;
  document.getElementById("suggest-hint").innerHTML = t.hint;
  document.getElementById("words-hint").innerHTML = t.words;
  document.getElementById("when-hint").innerHTML = t.when;
  document.getElementById("where-hint").innerHTML = t.where;
  document.getElementById("with-hint").innerHTML = t.with;
  document.getElementById("build-hint").innerHTML = t.build;

  // 규칙/불규칙 필터는 과거에서만
  const regSwitch = document.getElementById("reg-switch");
  regSwitch.style.display = tense === "past" ? "" : "none";
  if (tense !== "past") {
    currentReg = "all";
    document.querySelectorAll(".reg-btn").forEach(b => b.classList.toggle("active", b.dataset.reg === "all"));
  }

  document.querySelectorAll(".tense-btn").forEach(b => b.classList.toggle("active", b.dataset.tense === tense));

  renderTenseBanner();
  renderSuggestions();
  renderGrid("day-grid", TIME_EXPRESSIONS[tense], { tones: true, noIndex: true });
  // 문장 만들기: 때 표현이 시제마다 다르므로 초기화
  if (buildModifier && buildModifier.type === "when") buildModifier = null;
  lastBuilt = "";
  renderBuilder();
  updateBuildResult();
}

document.querySelectorAll(".tense-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.tense === tense) return;
    tense = btn.dataset.tense;
    synth.cancel();
    hidePopup();
    applyTense();
    if (document.getElementById("tab-practice").classList.contains("active")) renderPractice();
  });
});

/* ---------- 초기 렌더 ---------- */
renderGrid("place-grid", PLACE_EXPRESSIONS, { tones: true, noIndex: true });
renderGrid("with-grid", WITH_EXPRESSIONS, { tones: true, noIndex: true });
renderVerbTable();
applyTense();
updatePracticeBadge();

/* ---------- 탭 전환 ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    synth.cancel();
    hidePopup();
    if (btn.dataset.tab === "practice") renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ---------- 속도 조절 ---------- */
document.getElementById("rate").addEventListener("input", e => {
  speakRate = parseFloat(e.target.value);
});
