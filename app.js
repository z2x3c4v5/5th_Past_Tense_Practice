/* =========================================================
 * 🍂 하루 한 장 · 과거형 말하기 (워크시트 + 웹 앱 연계)
 * - 타이핑 없음. 듣고 → 마이크로 따라 말하기만!
 * - Day 1 ~ 6 = 워드 학습지 1~3 앞·뒷면
 *     ① 단어 말하기 : 현재형 → 과거형 (듣기 · 말하기)
 *     ② 문장 말하기 : 그 동사로 만든 짧은 과거 문장 (📘 교과서 표현 포함)
 * - 📘 교과서 표현 6개는 따로 모아서도 연습
 * - 그림: illustrations.js 인라인 SVG
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
function speak(text, rate, onStart, onEnd) {
  if (!synth) return;
  synth.cancel();
  const u = makeUtter(text, rate);
  if (onStart) u.onstart = onStart;
  if (onEnd) u.onend = onEnd;
  synth.speak(u);
}
/* 여러 개를 차례로 (현재형 → 과거형) */
function speakSequence(list, rate, onEnd) {
  if (!synth) return;
  synth.cancel();
  let i = 0;
  const next = () => {
    if (i >= list.length) { onEnd && onEnd(); return; }
    const u = makeUtter(list[i++], rate);
    u.onend = () => setTimeout(next, 300);
    u.onerror = () => { onEnd && onEnd(); };
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

/* ---------- 일러스트 ---------- */
function makeVisual(art, label) {
  const draw = art && window.ILLUSTRATIONS && window.ILLUSTRATIONS[art];
  const box = document.createElement("div");
  box.className = "illus";
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", label || "");
  box.innerHTML = draw ? draw() : "";
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
 * progress[key] = { best, attempts, listened }   key: "w:played" / "s:I played basketball."
 * doneDays[day] = "2026.09.07"                   */
let progress = {}, doneDays = {};
try { progress = JSON.parse(localStorage.getItem("pt_progress") || "{}") || {}; } catch (e) {}
try { doneDays = JSON.parse(localStorage.getItem("pt_done") || "{}") || {}; } catch (e) {}
function save() {
  try { localStorage.setItem("pt_progress", JSON.stringify(progress)); localStorage.setItem("pt_done", JSON.stringify(doneDays)); } catch (e) {}
}
function rec_(key) { return progress[key] || (progress[key] = { best: 0, attempts: 0, listened: false }); }
const PASS = 45;
/* 마이크가 없는 브라우저에서는 '듣기'만 해도 완료로 인정 */
function isDone(key) { const r = progress[key]; return !!r && (r.best >= PASS || (!srSupported && r.listened)); }
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/* ---------- 말하기 공통 위젯 (듣기 · 마이크 · 결과) ---------- */
function makeSpeakBox(target, key, listenText, onChange) {
  const box = document.createElement("div");
  box.className = "speak-box";
  const listen = document.createElement("button");
  listen.className = "btn listen";
  listen.textContent = "🔊 듣기";
  listen.addEventListener("click", () => {
    rec_(key).listened = true; save();
    const list = Array.isArray(listenText) ? listenText : [listenText];
    speakSequence(list, null, null);
    onChange && onChange();
  });
  const mic = document.createElement("button");
  mic.className = "btn mic";
  mic.innerHTML = "🎙️ 말하기";
  const fb = document.createElement("div");
  fb.className = "speak-fb";
  const r0 = progress[key];
  const renderFb = (last, heard) => {
    const r = rec_(key);
    if (last == null) {
      fb.className = "speak-fb" + (isDone(key) ? " good" : "");
      fb.innerHTML = r.attempts ? `최고 <b>${r.best}%</b> · ${r.attempts}회` : (srSupported ? "마이크를 누르고 말해 보세요" : "이 브라우저는 마이크 채점을 지원하지 않아요 (Chrome 권장) · 듣기만 해도 완료!");
      return;
    }
    const msg = last >= 75 ? "⭐ 훌륭해요!" : last >= PASS ? "👍 좋아요!" : "🔁 다시 또박또박!";
    fb.className = "speak-fb " + (last >= PASS ? "good" : "bad");
    fb.innerHTML = `${msg} <b>${last}%</b> · 최고 ${r.best}% · ${r.attempts}회<br><span class="heard">내가 한 말: ${heard || "(못 들었어요)"}</span>`;
  };
  renderFb(null);
  if (!srSupported) { mic.disabled = true; mic.title = "Chrome 에서 마이크 채점을 쓸 수 있어요"; }
  mic.addEventListener("click", () => {
    if (recBusy || !srSupported) return;
    mic.classList.add("recording"); mic.textContent = "🔴 말해보세요...";
    fb.className = "speak-fb"; fb.textContent = "또박또박 말해보세요!";
    listenFor(target, {
      onresult: (score, heard) => {
        const r = rec_(key);
        r.attempts++; r.best = Math.max(r.best, score); save();
        renderFb(score, heard);
        onChange && onChange();
      },
      onerror: err => { fb.className = "speak-fb bad"; fb.textContent = err === "not-allowed" ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요."; },
      onend: () => { mic.classList.remove("recording"); mic.innerHTML = "🎙️ 말하기"; },
    });
  });
  const row = document.createElement("div");
  row.className = "speak-row";
  row.append(listen, mic);
  box.append(row, fb);
  return box;
}

/* ---------- Day / 교과서 고르기 ---------- */
let current = null; // "textbook" | 1..6
function nextDay() {
  const n = WORKSHEET_DAYS.find(s => !doneDays[s.day]);
  return n ? n.day : WORKSHEET_DAYS[WORKSHEET_DAYS.length - 1].day;
}
function dayStatus(sheet) {
  const w = sheet.verbs.filter(v => isDone("w:" + v[2])).length;
  const s = sheet.talk.filter(t => isDone("s:" + t.en)).length;
  return { w, s, wT: sheet.verbs.length, sT: sheet.talk.length, complete: w === sheet.verbs.length && s === sheet.talk.length };
}

function renderStrip() {
  const strip = document.getElementById("day-strip");
  strip.innerHTML = "";
  const today = nextDay();
  const tb = document.createElement("button");
  tb.className = "day-chip textbook" + (current === "textbook" ? " on" : "");
  const tbDone = TEXTBOOK.filter(t => isDone("s:" + t.en)).length;
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

function sentenceCard(t, i, refresh) {
  const card = document.createElement("div");
  card.className = "scard" + (t.textbook ? " textbook" : "");
  const key = "s:" + t.en;
  const top = document.createElement("div");
  top.className = "sc-top";
  top.innerHTML = `<span class="sc-num">${i + 1}</span>` + (t.textbook ? `<span class="sc-badge">📘 교과서 표현</span>` : "") +
    `<span class="sc-verb">${t.verb[0]} → <b>${t.verb[1]}</b></span><span class="sc-done">${isDone(key) ? "✓" : ""}</span>`;
  card.appendChild(top);
  card.appendChild(makeVisual(t.art, t.en));
  const en = document.createElement("div");
  en.className = "sc-en";
  en.appendChild(buildWords(t.en, [t.verb[1]]));
  const ko = document.createElement("div");
  ko.className = "sc-ko";
  ko.textContent = t.ko;
  card.append(en, ko);
  card.appendChild(makeSpeakBox(t.en, key, t.en, () => {
    top.querySelector(".sc-done").textContent = isDone(key) ? "✓" : "";
    card.classList.toggle("ok", isDone(key));
    refresh && refresh();
  }));
  card.classList.toggle("ok", isDone(key));
  return card;
}

function renderTextbook(box) {
  const head = document.createElement("div");
  head.className = "sheet-head textbook";
  head.innerHTML = `<div class="sh-num">📘</div><div class="sh-titles"><div class="sh-title">교과서 주요 표현</div><div class="sh-sub">7단원의 핵심 문장 6개예요. 듣고 따라 말해 보세요. 각 문장은 해당 Day 에서도 다시 나와요.</div></div>`;
  box.appendChild(head);
  const grid = document.createElement("div");
  grid.className = "scard-grid";
  TEXTBOOK.forEach((t, i) => grid.appendChild(sentenceCard(Object.assign({ textbook: true }, t), i, renderStrip)));
  box.appendChild(grid);
}

function renderDay(box, sheet) {
  const st = dayStatus(sheet);
  if (st.complete && !doneDays[sheet.day]) { doneDays[sheet.day] = todayStr(); save(); renderStrip(); }
  const head = document.createElement("div");
  head.className = "sheet-head " + sheet.kind;
  head.innerHTML = `<div class="sh-num">0${sheet.day}</div>
    <div class="sh-titles"><div class="sh-title">${sheet.title}</div><div class="sh-sub">${sheet.subtitle}</div></div>
    <div class="sh-meta">ENGLISH WORKSHEET · 5학년 7단원<br><b>${sheet.sheet}</b></div>`;
  box.appendChild(head);

  const guide = document.createElement("div");
  guide.className = "sheet-guide";
  guide.innerHTML = `📄 워크시트 <b>${sheet.sheet}</b>에 손으로 쓴 다음, 여기서 <b>① 단어</b>를 말하고 <b>② 문장</b>을 말해요. 타이핑은 없어요!`;
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

  /* ① 단어 말하기 */
  const sec1 = document.createElement("section");
  sec1.className = "sec";
  const h1 = document.createElement("h2");
  h1.innerHTML = `<span class="step">1</span> 단어 말하기 <small>현재형 → 과거형을 듣고 따라 말해요</small><span class="prog" id="prog-w">${st.w} / ${st.wT}</span>`;
  sec1.appendChild(h1);
  const wgrid = document.createElement("div");
  wgrid.className = "wcard-grid";
  sheet.verbs.forEach(([ko, base, past]) => {
    const key = "w:" + past;
    const c = document.createElement("div");
    c.className = "wcard " + sheet.kind + (isDone(key) ? " ok" : "");
    const forms = document.createElement("div");
    forms.className = "wc-forms";
    forms.innerHTML = `<span class="wc-base">${base}</span><span class="wc-arrow">→</span><span class="wc-past">${past}</span>`;
    const meaning = document.createElement("div");
    meaning.className = "wc-ko";
    meaning.textContent = ko;
    const doneMark = document.createElement("span");
    doneMark.className = "wc-done";
    doneMark.textContent = isDone(key) ? "✓" : "";
    c.append(doneMark, forms, meaning);
    c.appendChild(makeSpeakBox(`${base} ${past}`, key, [base, past], () => {
      c.classList.toggle("ok", isDone(key));
      doneMark.textContent = isDone(key) ? "✓" : "";
      refreshProgress();
    }));
    wgrid.appendChild(c);
  });
  sec1.appendChild(wgrid);
  box.appendChild(sec1);

  /* ② 문장 말하기 */
  const sec2 = document.createElement("section");
  sec2.className = "sec";
  const h2 = document.createElement("h2");
  h2.innerHTML = `<span class="step">2</span> 문장 말하기 <small>그 단어로 만든 짧은 과거 문장 · 📘 는 교과서 표현</small><span class="prog" id="prog-s">${st.s} / ${st.sT}</span>`;
  sec2.appendChild(h2);
  const sgrid = document.createElement("div");
  sgrid.className = "scard-grid";
  sheet.talk.forEach((t, i) => sgrid.appendChild(sentenceCard(t, i, refreshProgress)));
  sec2.appendChild(sgrid);
  box.appendChild(sec2);

  /* 도장 */
  const stamp = document.createElement("div");
  stamp.id = "stamp";
  box.appendChild(stamp);

  function refreshProgress() {
    const s = dayStatus(sheet);
    document.getElementById("prog-w").textContent = `${s.w} / ${s.wT}`;
    document.getElementById("prog-s").textContent = `${s.s} / ${s.sT}`;
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
      row.className = "speak-row";
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
        sheet.verbs.forEach(v => delete progress["w:" + v[2]]);
        sheet.talk.forEach(t => delete progress["s:" + t.en]);
        delete doneDays[sheet.day]; save(); render();
      });
      row.appendChild(reset);
      stamp.appendChild(row);
    } else {
      stamp.className = "stamp";
      stamp.innerHTML = `단어 <b>${s.w}/${s.wT}</b> · 문장 <b>${s.s}/${s.sT}</b> — 모두 ${PASS}% 이상으로 말하면 오늘 도장을 찍어 줘요! 🍁`;
    }
  }
  renderStamp();
}

/* ---------- 시작 ---------- */
document.getElementById("rate").addEventListener("input", e => { speakRate = parseFloat(e.target.value); });
renderQuestion();
current = nextDay();
render();
