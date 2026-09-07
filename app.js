/* =========================================================
 * 🍂 하루 한 장 · 과거형 말하기 (워크시트 + 웹 앱 연계)
 * - 타이핑 없음.
 * - 한 줄 = [단어 (누르면 발음)] [그림] [문장 · 🔊 듣기 · 🎙️ 말하기]
 * - Day 1 ~ 6 = 워드 학습지 1~3 앞·뒷면, 📘 = 교과서 주요 표현
 * - 그림: 지정 그림(img/) → img/과거형.* 자동 탐색 → 같은 스타일로 생성 → 실패하면 SVG
 *   (주소에 ASSET_VERSION 을 붙여 새로 올린 그림이 캐시에 가려지지 않게 함)
 * - 음성 출력: SpeechSynthesis / 채점: SpeechRecognition (Chrome 권장)
 * ========================================================= */

/* ---------- 음성 합성 (TTS) ---------- */
const synth = window.speechSynthesis;
let enVoice = null;
let speakRate = 0.85;

function pickVoice() {
  const voices = synth.getVoices();
  enVoice = voices.find(v => /en[-_]US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || null;
  const status = document.getElementById("voice-status");
  if (status) status.textContent = enVoice ? `음성: ${enVoice.name}` : "영어 음성을 찾는 중...";
}
pickVoice();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;

function makeUtter(text, rate) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = rate || speakRate; u.pitch = 1.05;
  if (enVoice) u.voice = enVoice;
  return u;
}
function speak(text, rate) {
  if (!synth) return;
  synth.cancel();
  synth.speak(makeUtter(text, rate));
}
function speakSequence(list, rate) {
  if (!synth) return;
  synth.cancel();
  let i = 0;
  const next = () => {
    if (i >= list.length) return;
    const u = makeUtter(list[i++], rate);
    u.onend = () => setTimeout(next, 300);
    synth.speak(u);
  };
  next();
}

/* ---------- 단어 뜻 풍선 ---------- */
const popup = document.createElement("div");
popup.className = "word-popup hidden";
popup.innerHTML = `<div class="wp-word"></div><div class="wp-meaning"></div><button class="wp-listen">단어 다시 듣기</button>`;
document.body.appendChild(popup);
popup.querySelector(".wp-listen").addEventListener("click", e => { e.stopPropagation(); if (popup.dataset.word) speak(popup.dataset.word, 0.8); });

function showWordPopup(wordEl, rawWord) {
  const key = wordKey(rawWord);
  popup.dataset.word = key || rawWord;
  popup.querySelector(".wp-word").textContent = rawWord.replace(/[.,!?]+$/, "");
  popup.querySelector(".wp-meaning").textContent = WORD_MEANINGS[key] || "(뜻 정보 없음)";
  popup.classList.remove("hidden");
  const r = wordEl.getBoundingClientRect();
  const pw = popup.offsetWidth;
  let left = r.left + r.width / 2 - pw / 2 + window.scrollX;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  popup.style.left = left + "px";
  popup.style.top = (r.bottom + 8 + window.scrollY) + "px";
  speak(key || rawWord, 0.8);
}
function hidePopup() { popup.classList.add("hidden"); }
document.addEventListener("click", e => { if (!popup.contains(e.target) && !e.target.classList.contains("word")) hidePopup(); });

/* 클릭 가능한 단어 (과거형 동사는 강조) */
function buildWords(sentence, hlForms) {
  const frag = document.createDocumentFragment();
  const hl = new Set((hlForms || []).map(v => v.toLowerCase()));
  sentence.split(/\s+/).forEach((w, i) => {
    if (i > 0) frag.appendChild(document.createTextNode(" "));
    const span = document.createElement("span");
    span.className = "word" + (hl.has(wordKey(w)) ? " verb-hl" : "");
    span.textContent = w;
    span.addEventListener("click", e => { e.stopPropagation(); showWordPopup(span, w); });
    frag.appendChild(span);
  });
  return frag;
}

/* ---------- 그림: 학습지 그림 → 생성 그림 → SVG ---------- */
function hashSeed(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; }
function genImageUrl(prompt) {
  const p = encodeURIComponent(`${IMAGE_STYLE}, ${prompt}`);
  return `https://image.pollinations.ai/prompt/${p}?width=440&height=360&nologo=true&seed=${hashSeed(prompt)}`;
}
/* 로컬 그림 주소에 버전을 붙여 브라우저가 옛 그림을 캐시에서 꺼내 쓰지 않게 함 */
function withVersion(src) {
  if (!src || /^(https?:)?\/\//i.test(src) || /^data:/i.test(src)) return src;
  const v = typeof ASSET_VERSION !== "undefined" ? ASSET_VERSION : "1";
  return src + (src.includes("?") ? "&" : "?") + "v=" + v;
}
/* 그림 후보를 순서대로: 지정된 img → img/과거형.* → img/현재형.* → supplementary → 생성 그림 */
function imageCandidates(r) {
  const list = [];
  const add = s => { if (s && !list.includes(s)) list.push(s); };
  add(r.img);
  [r.past, r.base].filter(Boolean).forEach(name => {
    ["png", "jpg", "jpeg", "webp", "gif"].forEach(ext => add(`img/${name}.${ext}`));
    ["webp", "png", "jpg"].forEach(ext => add(`img/supplementary/${name}.${ext}`));
  });
  if (r.prompt) add(genImageUrl(r.prompt));
  return list;
}
function makePicture(r) {
  const box = document.createElement("div");
  box.className = "pic";
  const showSvg = () => {
    const draw = r.art && window.ILLUSTRATIONS && window.ILLUSTRATIONS[r.art];
    box.innerHTML = draw ? draw() : `<div class="pic-emoji">📝</div>`;
    box.classList.add("svg");
  };
  const candidates = imageCandidates(r);
  if (!candidates.length) { showSvg(); return box; }
  const img = document.createElement("img");
  img.alt = r.en; img.loading = "lazy";
  let i = 0;
  const tryNext = () => {
    if (i >= candidates.length) { img.remove(); showSvg(); return; }
    img.src = withVersion(candidates[i++]);
  };
  img.addEventListener("error", tryNext);
  tryNext();
  box.appendChild(img);
  return box;
}

/* ---------- 음성 인식 (정확도) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const srSupported = !!SR;
const rec = srSupported ? new SR() : null;
if (rec) { rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5; }
let recBusy = false;

function normalize(s) { return s.toLowerCase().replace(/[^a-z\s']/g, "").replace(/\s+/g, " ").trim(); }
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function wordsClose(a, b) {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
  return Math.abs(a.length - b.length) <= 1 && levenshtein(a, b) <= 1;
}
const STOPWORDS = new Set(["a", "an", "the", "to", "of", "on", "in", "at", "for", "i"]);
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
function listenFor(target, cb) {
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

/* ---------- 진행 저장 ----------
 * progress[문장] = { best, attempts, listened }   doneDays[day] = "2026.09.07" */
let progress = {}, doneDays = {};
try { progress = JSON.parse(localStorage.getItem("pt_progress") || "{}") || {}; } catch (e) {}
try { doneDays = JSON.parse(localStorage.getItem("pt_done") || "{}") || {}; } catch (e) {}
function save() {
  try { localStorage.setItem("pt_progress", JSON.stringify(progress)); localStorage.setItem("pt_done", JSON.stringify(doneDays)); } catch (e) {}
}
function rec_(key) { return progress[key] || (progress[key] = { best: 0, attempts: 0, listened: false }); }
const PASS = 45;
/* 마이크 채점이 안 되는 브라우저에서는 '듣기'만 해도 완료로 인정 */
function isDone(key) { const r = progress[key]; return !!r && (r.best >= PASS || (!srSupported && r.listened)); }
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/* ---------- 한 줄: 단어 | 그림 | 문장 ---------- */
function makeRow(r, i, kind, onChange) {
  const key = r.en;
  const line = document.createElement("div");
  line.className = "line " + kind + (r.textbook ? " textbook" : "") + (isDone(key) ? " ok" : "");

  /* 단어: 누르면 발음 */
  const word = document.createElement("div");
  word.className = "w";
  const num = document.createElement("span"); num.className = "w-num"; num.textContent = i + 1;
  const forms = document.createElement("div");
  forms.className = "w-forms";
  const base = document.createElement("button"); base.className = "w-base"; base.textContent = r.base; base.title = "누르면 들려요";
  base.addEventListener("click", () => speak(r.base, 0.8));
  const arrow = document.createElement("span"); arrow.className = "w-arrow"; arrow.textContent = "→";
  const past = document.createElement("button"); past.className = "w-past"; past.textContent = r.past; past.title = "누르면 들려요";
  past.addEventListener("click", () => speak(r.past, 0.8));
  forms.append(base, arrow, past);
  const ko = document.createElement("div"); ko.className = "w-ko"; ko.textContent = r.ko;
  const both = document.createElement("button"); both.className = "w-both"; both.textContent = "🔊 둘 다 듣기";
  both.addEventListener("click", () => speakSequence([r.base, r.past], 0.8));
  word.append(num, forms, ko, both);

  /* 그림 */
  const pic = makePicture(r);

  /* 문장 */
  const s = document.createElement("div");
  s.className = "s";
  const top = document.createElement("div");
  top.className = "s-top";
  if (r.textbook) { const b = document.createElement("span"); b.className = "s-badge"; b.textContent = "📘 교과서 표현"; top.appendChild(b); }
  const done = document.createElement("span"); done.className = "s-done"; done.textContent = isDone(key) ? "✓" : "";
  top.appendChild(done);
  const en = document.createElement("div"); en.className = "s-en"; en.appendChild(buildWords(r.en, [r.past]));
  const koS = document.createElement("div"); koS.className = "s-ko"; koS.textContent = r.koS;
  const btns = document.createElement("div"); btns.className = "s-btns";
  const listen = document.createElement("button"); listen.className = "btn listen"; listen.textContent = "🔊 듣기";
  const mic = document.createElement("button"); mic.className = "btn mic"; mic.textContent = "🎙️ 말하기";
  const fb = document.createElement("div"); fb.className = "s-fb";
  const refresh = (notify) => {
    const rr = progress[key];
    line.classList.toggle("ok", isDone(key));
    done.textContent = isDone(key) ? "✓" : "";
    if (!rr || !rr.attempts) {
      fb.className = "s-fb";
      fb.textContent = srSupported ? "듣고 나서 🎙️ 를 누르고 따라 말해요" : "이 브라우저는 마이크 채점을 지원하지 않아요 (Chrome 권장) · 듣기만 해도 완료!";
    }
    if (notify) onChange && onChange();
  };
  listen.addEventListener("click", () => { rec_(key).listened = true; save(); speak(r.en); refresh(true); });
  if (!srSupported) { mic.disabled = true; mic.title = "Chrome 에서 마이크 채점을 쓸 수 있어요"; }
  mic.addEventListener("click", () => {
    if (recBusy || !srSupported) return;
    mic.classList.add("recording"); mic.textContent = "🔴 말해보세요...";
    fb.className = "s-fb"; fb.textContent = "또박또박 말해보세요!";
    listenFor(r.en, {
      onresult: (score, heard) => {
        const rr = rec_(key);
        rr.attempts++; rr.best = Math.max(rr.best, score); save();
        const msg = score >= 75 ? "⭐ 훌륭해요!" : score >= PASS ? "👍 좋아요!" : "🔁 다시 또박또박!";
        fb.className = "s-fb " + (score >= PASS ? "good" : "bad");
        fb.innerHTML = `${msg} <b>${score}%</b> · 최고 ${rr.best}% · ${rr.attempts}회<br><span class="heard">내가 한 말: ${heard || "(못 들었어요)"}</span>`;
        line.classList.toggle("ok", isDone(key)); done.textContent = isDone(key) ? "✓" : "";
        onChange && onChange();
      },
      onerror: err => { fb.className = "s-fb bad"; fb.textContent = err === "not-allowed" ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요."; },
      onend: () => { mic.classList.remove("recording"); mic.textContent = "🎙️ 말하기"; },
    });
  });
  btns.append(listen, mic);
  s.append(top, en, koS, btns, fb);
  const r0 = progress[key];
  if (r0 && r0.attempts) { fb.className = "s-fb" + (isDone(key) ? " good" : ""); fb.innerHTML = `최고 <b>${r0.best}%</b> · ${r0.attempts}회`; }
  else refresh(false);

  line.append(word, pic, s);
  return line;
}

/* ---------- Day / 교과서 고르기 ---------- */
let current = null; // "textbook" | 1..6
function nextDay() {
  const n = WORKSHEET_DAYS.find(s => !doneDays[s.day]);
  return n ? n.day : WORKSHEET_DAYS[WORKSHEET_DAYS.length - 1].day;
}
function dayStatus(sheet) {
  const d = sheet.rows.filter(r => isDone(r.en)).length;
  return { d, t: sheet.rows.length, complete: d === sheet.rows.length };
}

function renderStrip() {
  const strip = document.getElementById("day-strip");
  strip.innerHTML = "";
  const today = nextDay();
  const tb = document.createElement("button");
  tb.className = "day-chip textbook" + (current === "textbook" ? " on" : "");
  const tbDone = TEXTBOOK.filter(t => isDone(t.en)).length;
  tb.innerHTML = `<span class="dc-day">📘 교과서</span><span class="dc-title">주요 표현 6</span><span class="dc-stamp">${tbDone}/${TEXTBOOK.length} 말했어요</span>`;
  tb.addEventListener("click", () => { current = "textbook"; go(); });
  strip.appendChild(tb);
  WORKSHEET_DAYS.forEach(s => {
    const done = doneDays[s.day];
    const b = document.createElement("button");
    b.className = "day-chip " + s.kind + (done ? " done" : "") + (current === s.day ? " on" : "") + (today === s.day && !done ? " today" : "");
    b.innerHTML = `<span class="dc-day">Day ${s.day}</span><span class="dc-title">${s.kind === "regular" ? "✅ 규칙" : "🔀 불규칙"}</span>` +
      `<span class="dc-stamp">${done ? "🍁 " + done : (today === s.day ? "📌 오늘 할 장" : s.sheet)}</span>`;
    b.addEventListener("click", () => { current = s.day; go(); });
    strip.appendChild(b);
  });
}
function go() { synth.cancel(); hidePopup(); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }

/* ---------- 질문 배너 ---------- */
function renderQuestion() {
  const el = document.getElementById("question-banner");
  el.innerHTML = "";
  const q = document.createElement("div");
  q.className = "qb-q";
  q.innerHTML = `<b>${QUESTION.en}</b><span class="qb-or">또는</span><b>${QUESTION.en2}</b><span class="qb-ko">${QUESTION.ko}</span>`;
  const a = document.createElement("div");
  a.className = "qb-a";
  a.innerHTML = `답은 <b>I + 동사의 과거형</b> → <i>I played basketball.</i>`;
  const btn = document.createElement("button");
  btn.className = "btn listen small";
  btn.textContent = "🔊 질문 듣기";
  btn.addEventListener("click", () => speakSequence([QUESTION.en, QUESTION.en2]));
  el.append(q, a, btn);
}

/* ---------- 화면 ---------- */
function render() {
  renderStrip();
  const box = document.getElementById("sheet");
  box.innerHTML = "";
  if (current === "textbook") renderTextbook(box);
  else renderDay(box, WORKSHEET_DAYS.find(s => s.day === current));
}

function renderTextbook(box) {
  const head = document.createElement("div");
  head.className = "sheet-head textbook";
  head.innerHTML = `<div class="sh-num">📘</div><div class="sh-titles"><div class="sh-title">교과서 주요 표현</div><div class="sh-sub">7단원의 핵심 문장 6개예요. 단어를 누르면 발음이 나오고, 문장은 듣고 따라 말해요. (각 문장은 해당 Day 에도 다시 나와요)</div></div>`;
  box.appendChild(head);
  const list = document.createElement("div");
  list.className = "lines";
  TEXTBOOK.forEach((r, i) => list.appendChild(makeRow(r, i, r.kind, renderStrip)));
  box.appendChild(list);
}

function renderDay(box, sheet) {
  const head = document.createElement("div");
  head.className = "sheet-head " + sheet.kind;
  head.innerHTML = `<div class="sh-num">0${sheet.day}</div>
    <div class="sh-titles"><div class="sh-title">${sheet.title}</div><div class="sh-sub">${sheet.subtitle}</div></div>
    <div class="sh-meta">ENGLISH WORKSHEET · 5학년 7단원<br><b>${sheet.sheet}</b></div>`;
  box.appendChild(head);

  const guide = document.createElement("div");
  guide.className = "sheet-guide";
  guide.innerHTML = `📄 워크시트 <b>${sheet.sheet}</b>에 손으로 쓴 다음, 여기서 <b>단어를 눌러 듣고</b> 옆의 <b>문장을 듣고 따라 말해요</b>. 타이핑은 없어요!`;
  box.appendChild(guide);

  if (sheet.rules) {
    const r = document.createElement("div");
    r.className = "rules";
    sheet.rules.forEach(x => {
      const c = document.createElement("button");
      c.className = "rule";
      c.innerHTML = `<span class="rule-label">${x.label}</span><b>${x.ex[0]} → ${x.ex[1]}</b> 🔊`;
      c.addEventListener("click", () => speakSequence(x.ex, 0.8));
      r.appendChild(c);
    });
    box.appendChild(r);
  }
  if (sheet.note) {
    const n = document.createElement("div");
    n.className = "note";
    n.textContent = "💡 " + sheet.note;
    box.appendChild(n);
  }

  const st = dayStatus(sheet);
  const h = document.createElement("h2");
  h.className = "sec-title";
  h.innerHTML = `단어 → 문장 말하기 <small>단어는 눌러서 듣고, 문장은 🔊 듣고 🎙️ 따라 말해요 · 📘 는 교과서 표현</small><span class="prog" id="prog">${st.d} / ${st.t}</span>`;
  box.appendChild(h);

  const list = document.createElement("div");
  list.className = "lines";
  sheet.rows.forEach((r, i) => list.appendChild(makeRow(r, i, sheet.kind, refreshProgress)));
  box.appendChild(list);

  const stamp = document.createElement("div");
  stamp.id = "stamp";
  box.appendChild(stamp);

  function refreshProgress() {
    const s = dayStatus(sheet);
    const pe = document.getElementById("prog");
    if (pe) pe.textContent = `${s.d} / ${s.t}`;
    if (s.complete && !doneDays[sheet.day]) {
      doneDays[sheet.day] = todayStr(); save();
      speak("Great job! You finished today's worksheet.");
    }
    renderStamp();
    renderStrip();
  }
  function renderStamp() {
    const s = dayStatus(sheet);
    stamp.innerHTML = "";
    if (doneDays[sheet.day]) {
      stamp.className = "stamp done";
      const next = WORKSHEET_DAYS.find(x => !doneDays[x.day]);
      stamp.innerHTML = `<div class="stamp-mark">🍁 Day ${sheet.day} 완료!</div><div class="stamp-date">${doneDays[sheet.day]} 에 다 말했어요. ${next ? `내일은 <b>Day ${next.day}</b>!` : "여섯 장을 모두 끝냈어요! 🎉"}</div>`;
      const row = document.createElement("div");
      row.className = "s-btns";
      if (next) {
        const b = document.createElement("button");
        b.className = "btn listen"; b.textContent = `➡️ Day ${next.day} 로 가기`;
        b.addEventListener("click", () => { current = next.day; go(); });
        row.appendChild(b);
      }
      const reset = document.createElement("button");
      reset.className = "btn ghost"; reset.textContent = "🧹 이 장 다시 하기";
      reset.addEventListener("click", () => {
        if (!confirm(`Day ${sheet.day} 의 기록을 지우고 다시 할까요?`)) return;
        sheet.rows.forEach(r => delete progress[r.en]);
        delete doneDays[sheet.day]; save(); render();
      });
      row.appendChild(reset);
      stamp.appendChild(row);
    } else {
      stamp.className = "stamp";
      stamp.innerHTML = `문장 <b>${s.d}/${s.t}</b> — 모두 ${PASS}% 이상으로 말하면 오늘 도장을 찍어 줘요! 🍁`;
    }
  }
  if (st.complete && !doneDays[sheet.day]) { doneDays[sheet.day] = todayStr(); save(); renderStrip(); }
  renderStamp();
}

/* ---------- 시작 ---------- */
document.getElementById("rate").addEventListener("input", e => { speakRate = parseFloat(e.target.value); });
renderQuestion();
current = nextDay();
render();
