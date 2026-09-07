/* =========================================================
 * 🎨 활동 일러스트 (인라인 SVG)
 * - 외부 이미지 없이 항상 보이도록 직접 그린 단순한 그림
 * - ILLUSTRATIONS[key]() → SVG 문자열 (viewBox 400 x 260)
 * ========================================================= */
(function () {
  const W = 400, H = 260;

  /* ---------- 부품 ---------- */
  const sky = (top, bottom, id) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
     <rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  const ground = (color, y = 190, color2) =>
    `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${color}"/>` +
    (color2 ? `<ellipse cx="200" cy="${y + 8}" rx="260" ry="22" fill="${color2}"/>` : "");
  const sun = (x = 340, y = 55, r = 28, c = "#fbbf24") =>
    `<circle cx="${x}" cy="${y}" r="${r + 12}" fill="${c}" opacity="0.25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const moon = (x = 330, y = 55) =>
    `<circle cx="${x}" cy="${y}" r="26" fill="#fde68a"/><circle cx="${x + 10}" cy="${y - 6}" r="22" fill="#1e293b"/>`;
  const cloud = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="0.9"><ellipse cx="0" cy="0" rx="34" ry="14"/><circle cx="-12" cy="-8" r="14"/><circle cx="10" cy="-10" r="17"/></g>`;
  const stars = () => {
    let s = "";
    [[30, 30], [80, 60], [140, 25], [210, 50], [260, 20], [370, 90], [320, 30], [180, 80]].forEach(([x, y]) =>
      s += `<circle cx="${x}" cy="${y}" r="2.2" fill="#fef9c3"/>`);
    return s;
  };
  const tree = (x, y, s = 1, leaf = "#ea580c") =>
    `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="0" width="12" height="40" rx="4" fill="#78350f"/><circle cx="0" cy="-14" r="30" fill="${leaf}"/><circle cx="-20" cy="0" r="20" fill="${leaf}" opacity="0.9"/><circle cx="20" cy="0" r="20" fill="${leaf}" opacity="0.9"/></g>`;
  const leaf = (x, y, c = "#dc2626", r = 0) =>
    `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 -10 C 8 -6 10 4 0 12 C -10 4 -8 -6 0 -10 Z" fill="${c}"/>`;
  /* 아이: pose = stand | arms-up | sit | run */
  const kid = (x, y, shirt = "#3b82f6", pose = "stand", skin = "#fcd9b6", hair = "#3f2a1d", s = 1) => {
    const arms = {
      stand: `<line x1="-14" y1="52" x2="-24" y2="74"/><line x1="14" y1="52" x2="24" y2="74"/>`,
      "arms-up": `<line x1="-14" y1="50" x2="-30" y2="28"/><line x1="14" y1="50" x2="30" y2="28"/>`,
      sit: `<line x1="-14" y1="52" x2="-26" y2="66"/><line x1="14" y1="52" x2="26" y2="66"/>`,
      run: `<line x1="-14" y1="52" x2="-30" y2="40"/><line x1="14" y1="52" x2="30" y2="62"/>`,
      wave: `<line x1="-14" y1="52" x2="-24" y2="74"/><line x1="14" y1="50" x2="30" y2="26"/>`,
    }[pose] || "";
    const legs = pose === "sit"
      ? `<line x1="-8" y1="86" x2="-8" y2="100"/><line x1="8" y1="86" x2="8" y2="100"/>`
      : pose === "run"
        ? `<line x1="-8" y1="86" x2="-24" y2="106"/><line x1="8" y1="86" x2="20" y2="108"/>`
        : `<line x1="-8" y1="86" x2="-10" y2="110"/><line x1="8" y1="86" x2="10" y2="110"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <g stroke="${skin}" stroke-width="9" stroke-linecap="round">${arms}</g>
      <g stroke="#1e3a8a" stroke-width="10" stroke-linecap="round">${legs}</g>
      <rect x="-18" y="44" width="36" height="46" rx="12" fill="${shirt}"/>
      <circle cx="0" cy="24" r="20" fill="${skin}"/>
      <path d="M-20 20 Q 0 -6 20 20 Q 10 8 0 10 Q -10 8 -20 20Z" fill="${hair}"/>
      <circle cx="-7" cy="26" r="2.4" fill="#1f2937"/><circle cx="7" cy="26" r="2.4" fill="#1f2937"/>
      <path d="M-6 33 Q 0 38 6 33" stroke="#b45309" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`;
  };
  const grandma = (x, y, dress = "#a855f7") =>
    `<g transform="translate(${x} ${y})">
      <path d="M-24 46 L 24 46 L 30 110 L -30 110 Z" fill="${dress}"/>
      <g stroke="#f5d0b5" stroke-width="9" stroke-linecap="round"><line x1="-18" y1="54" x2="-30" y2="80"/><line x1="18" y1="54" x2="30" y2="80"/></g>
      <circle cx="0" cy="22" r="22" fill="#f5d0b5"/>
      <path d="M-24 20 Q 0 -10 24 20 Q 14 6 0 8 Q -14 6 -24 20Z" fill="#e5e7eb"/>
      <circle cx="-22" cy="22" r="8" fill="#e5e7eb"/><circle cx="22" cy="22" r="8" fill="#e5e7eb"/>
      <circle cx="-7" cy="24" r="2.4" fill="#1f2937"/><circle cx="7" cy="24" r="2.4" fill="#1f2937"/>
      <path d="M-7 32 Q 0 38 7 32" stroke="#b45309" stroke-width="2" fill="none"/>
      <circle cx="-7" cy="24" r="6" fill="none" stroke="#6b7280" stroke-width="1.5"/><circle cx="7" cy="24" r="6" fill="none" stroke="#6b7280" stroke-width="1.5"/>
    </g>`;
  const table = (x, y, w = 200, c = "#c2825b") =>
    `<rect x="${x}" y="${y}" width="${w}" height="14" rx="5" fill="${c}"/><rect x="${x + 14}" y="${y + 12}" width="12" height="50" fill="#a0613f"/><rect x="${x + w - 26}" y="${y + 12}" width="12" height="50" fill="#a0613f"/>`;
  const note = (x, y, c = "#fff") => `<g transform="translate(${x} ${y})" fill="${c}"><ellipse cx="0" cy="8" rx="7" ry="5"/><rect x="5" y="-16" width="3" height="24"/><path d="M8 -16 q 12 4 6 14 q 2 -8 -6 -8z"/></g>`;
  const wrap = (inner) => `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;

  /* ---------- 장면 ---------- */
  const S = {};

  S.watermelon = () => wrap(
    sky("#bae6fd", "#e0f2fe", "g1") + sun() + cloud(90, 50) + ground("#86efac", 170, "#4ade80") +
    [[70, 205], [150, 215], [310, 210], [350, 195]].map(([x, y]) =>
      `<ellipse cx="${x}" cy="${y}" rx="34" ry="24" fill="#15803d"/><path d="M${x - 24} ${y - 14} q 8 14 0 28 M${x - 8} ${y - 22} q 8 22 0 44 M${x + 10} ${y - 20} q 8 20 0 40" stroke="#166534" stroke-width="3" fill="none"/>`).join("") +
    kid(230, 90, "#f97316", "arms-up") +
    `<ellipse cx="230" cy="112" rx="26" ry="18" fill="#15803d"/><path d="M212 104 q 18 -12 36 0" stroke="#166534" stroke-width="3" fill="none"/>`
  );

  S.cookies = () => wrap(
    sky("#fff7ed", "#fed7aa", "g2") + `<rect x="0" y="0" width="${W}" height="130" fill="#fde68a" opacity="0.5"/>` +
    table(60, 170, 280) + `<rect x="100" y="140" width="200" height="34" rx="8" fill="#9ca3af"/>` +
    [[125, 157], [165, 157], [205, 157], [245, 157], [285, 157]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="15" fill="#d97706"/><circle cx="${x - 5}" cy="${y - 4}" r="2.5" fill="#451a03"/><circle cx="${x + 5}" cy="${y + 3}" r="2.5" fill="#451a03"/><circle cx="${x + 2}" cy="${y - 6}" r="2" fill="#451a03"/>`).join("") +
    kid(200, 30, "#ec4899", "stand", undefined, undefined, 0.95) +
    `<path d="M170 85 Q 200 60 230 85 L 232 110 L 168 110 Z" fill="#fff"/>`
  );

  S.tomatoes = () => wrap(
    sky("#bae6fd", "#e0f2fe", "g3") + sun(60, 50) + ground("#a3e635", 180, "#84cc16") +
    [90, 170, 250].map(x =>
      `<rect x="${x - 2}" y="110" width="4" height="80" fill="#4d7c0f"/><rect x="${x - 3}" y="100" width="6" height="90" fill="#65a30d" opacity="0.5"/>
       <ellipse cx="${x - 16}" cy="130" rx="14" ry="8" fill="#22c55e" transform="rotate(-25 ${x - 16} 130)"/><ellipse cx="${x + 16}" cy="150" rx="14" ry="8" fill="#22c55e" transform="rotate(25 ${x + 16} 150)"/>
       <circle cx="${x + 12}" cy="128" r="11" fill="#ef4444"/><circle cx="${x - 12}" cy="160" r="11" fill="#ef4444"/><circle cx="${x + 8}" cy="176" r="10" fill="#f97316"/>`).join("") +
    kid(330, 80, "#22c55e", "stand") +
    `<path d="M292 128 h 30 v 22 h -30 z M322 134 l 14 -8 v 8 l -14 6z" fill="#0ea5e9"/><path d="M336 128 l 6 -14" stroke="#0ea5e9" stroke-width="4"/>`
  );

  S.bread = () => wrap(
    sky("#fef3c7", "#fde68a", "g4") + `<rect x="240" y="40" width="130" height="140" rx="10" fill="#6b7280"/><rect x="255" y="60" width="100" height="70" rx="6" fill="#111827"/><rect x="262" y="100" width="86" height="22" fill="#f59e0b"/><circle cx="270" cy="150" r="8" fill="#e5e7eb"/><circle cx="300" cy="150" r="8" fill="#e5e7eb"/>` +
    table(20, 180, 220) +
    `<path d="M50 178 q 0 -30 30 -30 h 60 q 30 0 30 30z" fill="#d97706"/><path d="M70 160 q 10 -8 20 0 M100 160 q 10 -8 20 0" stroke="#fef3c7" stroke-width="3" fill="none"/>
     <path d="M160 178 q 0 -24 24 -24 h 30 q 24 0 24 24z" fill="#b45309"/>` +
    grandma(80, 40, "#a855f7") + kid(180, 60, "#3b82f6", "stand", undefined, undefined, 0.85)
  );

  S.webtoon = () => wrap(
    sky("#f5f3ff", "#ddd6fe", "g5") +
    `<rect x="60" y="40" width="200" height="150" rx="14" fill="#1f2937"/><rect x="72" y="52" width="176" height="126" rx="6" fill="#fff"/>
     <rect x="80" y="60" width="80" height="52" rx="4" fill="#fde68a"/><rect x="168" y="60" width="72" height="52" rx="4" fill="#bfdbfe"/><rect x="80" y="120" width="160" height="50" rx="4" fill="#fecaca"/>
     <circle cx="120" cy="86" r="14" fill="#f97316"/><circle cx="204" cy="86" r="14" fill="#3b82f6"/>
     <path d="M100 150 h 60 M100 160 h 40" stroke="#9ca3af" stroke-width="4"/>
     <path d="M220 130 l 14 20 l -10 4 z" fill="#facc15"/>` +
    kid(320, 70, "#8b5cf6", "stand") +
    `<rect x="280" y="128" width="30" height="6" rx="3" fill="#f97316" transform="rotate(-30 280 128)"/>`
  );

  S.youtube = () => wrap(
    sky("#fee2e2", "#fecaca", "g6") + ground("#fca5a5", 200) +
    `<rect x="60" y="80" width="70" height="46" rx="8" fill="#374151"/><circle cx="95" cy="103" r="14" fill="#111827"/><circle cx="95" cy="103" r="8" fill="#60a5fa"/><rect x="125" y="92" width="18" height="20" fill="#374151"/>
     <rect x="92" y="126" width="6" height="70" fill="#6b7280"/><path d="M95 196 l -26 30 M95 196 l 26 30" stroke="#6b7280" stroke-width="6"/>
     <rect x="300" y="40" width="70" height="50" rx="12" fill="#ef4444"/><path d="M327 52 l 24 13 l -24 13z" fill="#fff"/>` +
    kid(230, 70, "#facc15", "wave") +
    `<circle cx="185" cy="90" r="6" fill="#ef4444"/><text x="150" y="96" font-size="14" font-weight="700" fill="#ef4444" font-family="sans-serif">REC</text>`
  );

  S.paint = () => wrap(
    sky("#fff7ed", "#ffedd5", "g7") + ground("#fdba74", 205) +
    `<path d="M120 60 L 120 230 M200 60 L 200 230 M160 40 L 160 230" stroke="#a16207" stroke-width="6"/>
     <rect x="90" y="60" width="140" height="110" rx="4" fill="#fff" stroke="#d6d3d1" stroke-width="3"/>` +
    leaf(130, 100, "#dc2626", -20) + leaf(165, 90, "#f59e0b", 10) + leaf(195, 110, "#ea580c", 40) + leaf(145, 140, "#ca8a04", 70) + leaf(185, 145, "#dc2626", -50) +
    kid(310, 70, "#06b6d4", "stand") +
    `<rect x="262" y="120" width="34" height="6" rx="3" fill="#a16207" transform="rotate(-40 262 120)"/><circle cx="256" cy="116" r="5" fill="#dc2626"/>
     <ellipse cx="330" cy="160" rx="22" ry="14" fill="#f5f5f4"/><circle cx="322" cy="158" r="4" fill="#dc2626"/><circle cx="332" cy="154" r="4" fill="#facc15"/><circle cx="338" cy="163" r="4" fill="#3b82f6"/>`
  );

  S.ramyeon = () => wrap(
    sky("#fef9c3", "#fde68a", "g8") +
    `<rect x="60" y="180" width="280" height="30" rx="6" fill="#6b7280"/><circle cx="200" cy="180" r="70" fill="#374151"/>
     <ellipse cx="200" cy="120" rx="80" ry="24" fill="#9ca3af"/><ellipse cx="200" cy="118" rx="66" ry="16" fill="#f97316"/>
     <path d="M150 116 q 20 -10 40 0 t 40 0 M160 122 q 20 8 40 0 t 40 0" stroke="#fde68a" stroke-width="5" fill="none"/>
     <ellipse cx="180" cy="112" rx="9" ry="6" fill="#fff"/><ellipse cx="180" cy="112" rx="5" ry="3.5" fill="#facc15"/><ellipse cx="222" cy="110" rx="9" ry="6" fill="#22c55e"/>
     <rect x="112" y="112" width="28" height="8" rx="4" fill="#374151"/><rect x="262" y="112" width="28" height="8" rx="4" fill="#374151"/>
     <path d="M170 90 q -10 -20 0 -40 M200 84 q 10 -20 0 -40 M230 90 q -10 -20 0 -40" stroke="#e5e7eb" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8"/>`
  );

  S.basketball = () => wrap(
    sky("#bae6fd", "#e0f2fe", "g9") + sun(60, 50) + ground("#fb923c", 200, "#f97316") +
    `<rect x="330" y="40" width="8" height="170" fill="#6b7280"/><rect x="290" y="40" width="80" height="60" rx="4" fill="#fff" stroke="#374151" stroke-width="3"/>
     <rect x="312" y="66" width="36" height="28" fill="none" stroke="#ef4444" stroke-width="3"/><ellipse cx="330" cy="96" rx="20" ry="6" fill="none" stroke="#ef4444" stroke-width="4"/>
     <path d="M312 98 l 4 26 M320 98 l 2 28 M330 100 v 28 M340 98 l -2 28 M348 98 l -4 26" stroke="#e5e7eb" stroke-width="2"/>` +
    kid(170, 70, "#ef4444", "arms-up") +
    `<circle cx="215" cy="70" r="22" fill="#f97316"/><path d="M193 70 h 44 M215 48 v 44 M199 55 q 16 15 32 0 M199 85 q 16 -15 32 0" stroke="#7c2d12" stroke-width="2.5" fill="none"/>`
  );

  S.sea = () => wrap(
    sky("#7dd3fc", "#bae6fd", "g10") + sun(320, 50) + cloud(80, 60) +
    `<rect x="0" y="130" width="${W}" height="130" fill="#0ea5e9"/>
     <path d="M0 140 q 25 -12 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 v 20 h -400z" fill="#38bdf8"/>
     <path d="M0 190 q 25 -12 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 v 20 h -400z" fill="#0284c7" opacity="0.6"/>` +
    `<g transform="translate(200 150)"><g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="-20" y1="20" x2="-45" y2="0"/><line x1="20" y1="20" x2="45" y2="0"/></g>
     <circle cx="0" cy="8" r="20" fill="#fcd9b6"/><path d="M-20 4 Q 0 -22 20 4 Q 10 -8 0 -6 Q -10 -8 -20 4Z" fill="#3f2a1d"/>
     <circle cx="-7" cy="10" r="2.4" fill="#1f2937"/><circle cx="7" cy="10" r="2.4" fill="#1f2937"/><path d="M-6 17 Q 0 22 6 17" stroke="#b45309" stroke-width="2" fill="none"/>
     <ellipse cx="0" cy="36" rx="40" ry="10" fill="#7dd3fc"/></g>` +
    `<path d="M40 230 l 10 -8 l 10 8 M300 240 l 10 -8 l 10 8" stroke="#fff" stroke-width="3" fill="none" opacity="0.7"/>`
  );

  S.taekwondo = () => wrap(
    sky("#eff6ff", "#dbeafe", "g11") + `<rect x="0" y="170" width="${W}" height="90" fill="#93c5fd"/><rect x="0" y="170" width="${W}" height="8" fill="#60a5fa"/>` +
    `<g transform="translate(150 60)">
      <g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="-14" y1="52" x2="-36" y2="42"/><line x1="14" y1="52" x2="34" y2="70"/></g>
      <g stroke="#fff" stroke-width="12" stroke-linecap="round"><line x1="-8" y1="86" x2="-12" y2="112"/><line x1="8" y1="86" x2="60" y2="70"/></g>
      <rect x="-20" y="44" width="40" height="46" rx="10" fill="#fff"/><rect x="-20" y="80" width="40" height="7" fill="#facc15"/><path d="M-20 44 L 0 66 L 20 44" fill="none" stroke="#e5e7eb" stroke-width="2"/>
      <circle cx="0" cy="24" r="20" fill="#fcd9b6"/><path d="M-20 20 Q 0 -6 20 20 Q 10 8 0 10 Q -10 8 -20 20Z" fill="#3f2a1d"/>
      <circle cx="-7" cy="26" r="2.4" fill="#1f2937"/><circle cx="7" cy="26" r="2.4" fill="#1f2937"/><path d="M-6 33 Q 0 38 6 33" stroke="#b45309" stroke-width="2" fill="none"/>
    </g>` +
    `<rect x="260" y="60" width="26" height="110" rx="10" fill="#ef4444"/><rect x="264" y="90" width="18" height="6" fill="#fff"/><path d="M234 118 l 24 -6 M234 122 l 24 6" stroke="#facc15" stroke-width="4"/>
     <text x="300" y="120" font-size="20" font-weight="900" fill="#1d4ed8" font-family="sans-serif">Hi-yah!</text>`
  );

  S.bike = () => wrap(
    sky("#fde68a", "#fed7aa", "g12") + sun(60, 50, 26, "#fb923c") + tree(60, 130, 0.9, "#dc2626") + tree(330, 120, 1.1, "#f59e0b") + tree(380, 150, 0.7, "#ea580c") + ground("#a3a3a3", 200, "#737373") +
    `<circle cx="140" cy="200" r="30" fill="none" stroke="#1f2937" stroke-width="6"/><circle cx="260" cy="200" r="30" fill="none" stroke="#1f2937" stroke-width="6"/>
     <path d="M140 200 L 190 150 L 260 200 M190 150 L 230 150 L 260 200 M190 150 L 170 200 M175 145 h 30" stroke="#ef4444" stroke-width="6" fill="none" stroke-linecap="round"/>
     <path d="M225 140 l 10 -14 h 16" stroke="#1f2937" stroke-width="5" fill="none"/><rect x="160" y="140" width="24" height="8" rx="4" fill="#1f2937"/>` +
    `<g transform="translate(200 40)"><g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="10" y1="52" x2="36" y2="86"/></g>
     <g stroke="#1e3a8a" stroke-width="10" stroke-linecap="round"><line x1="-8" y1="86" x2="-6" y2="118"/><line x1="8" y1="86" x2="14" y2="118"/></g>
     <rect x="-18" y="44" width="36" height="46" rx="12" fill="#22c55e"/><circle cx="0" cy="24" r="20" fill="#fcd9b6"/><path d="M-22 18 Q 0 -10 22 18 L 20 22 Q 0 8 -20 22 Z" fill="#ef4444"/>
     <circle cx="-7" cy="26" r="2.4" fill="#1f2937"/><circle cx="7" cy="26" r="2.4" fill="#1f2937"/><path d="M-6 33 Q 0 38 6 33" stroke="#b45309" stroke-width="2" fill="none"/></g>` +
    leaf(100, 215, "#dc2626", 20) + leaf(310, 220, "#f59e0b", -30)
  );

  S.soccer = () => wrap(
    sky("#bae6fd", "#e0f2fe", "g13") + sun() + cloud(100, 50) + ground("#4ade80", 160, "#22c55e") +
    `<rect x="250" y="90" width="120" height="90" fill="none" stroke="#fff" stroke-width="6"/>
     <path d="M250 90 v 90 M270 90 v 90 M290 90 v 90 M310 90 v 90 M330 90 v 90 M350 90 v 90 M250 110 h 120 M250 130 h 120 M250 150 h 120" stroke="#fff" stroke-width="1.5" opacity="0.8"/>` +
    kid(120, 60, "#2563eb", "run") +
    `<circle cx="190" cy="185" r="20" fill="#fff"/><path d="M190 170 l 12 9 l -5 14 h -14 l -5 -14z" fill="#1f2937"/><circle cx="176" cy="178" r="3" fill="#1f2937"/><circle cx="204" cy="178" r="3" fill="#1f2937"/>
     <path d="M215 180 l 20 -6 M215 190 l 20 0" stroke="#fff" stroke-width="3"/>`
  );

  S.kpop = () => wrap(
    sky("#312e81", "#6d28d9", "g14") +
    `<rect x="0" y="180" width="${W}" height="80" fill="#1e1b4b"/><rect x="0" y="180" width="${W}" height="6" fill="#a78bfa"/>
     <path d="M60 0 L 120 180 L 0 180z" fill="#f0abfc" opacity="0.25"/><path d="M340 0 L 400 180 L 280 180z" fill="#67e8f9" opacity="0.25"/><path d="M200 0 L 260 180 L 140 180z" fill="#fde047" opacity="0.2"/>` +
    kid(120, 70, "#f472b6", "arms-up") + kid(200, 70, "#facc15", "run") + kid(280, 70, "#22d3ee", "arms-up") +
    note(60, 60, "#fde047") + note(340, 50, "#f0abfc") + note(200, 30, "#67e8f9") +
    `<circle cx="40" cy="30" r="3" fill="#fff"/><circle cx="370" cy="100" r="3" fill="#fff"/><circle cx="160" cy="20" r="2" fill="#fff"/>`
  );

  S.runpark = () => wrap(
    sky("#fde68a", "#fff7ed", "g15") + sun(340, 50, 26, "#fb923c") + tree(50, 120, 1, "#dc2626") + tree(120, 140, 0.7, "#f59e0b") + tree(330, 130, 0.9, "#ea580c") + ground("#bef264", 190, "#a3e635") +
    `<path d="M0 240 Q 200 200 400 240" stroke="#d6d3d1" stroke-width="22" fill="none"/>` +
    kid(210, 70, "#ef4444", "run") +
    `<path d="M150 120 h 30 M140 135 h 40 M150 150 h 30" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>` +
    leaf(80, 210, "#dc2626", 30) + leaf(300, 205, "#f59e0b", -20) + leaf(260, 60, "#ea580c", 60)
  );

  S.rollerblade = () => wrap(
    sky("#e0f2fe", "#f0f9ff", "g16") + sun(60, 50) + cloud(300, 60) + ground("#9ca3af", 200, "#6b7280") +
    `<g transform="translate(200 60)">
      <g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="-14" y1="52" x2="-40" y2="40"/><line x1="14" y1="52" x2="36" y2="34"/></g>
      <g stroke="#1e3a8a" stroke-width="10" stroke-linecap="round"><line x1="-8" y1="86" x2="-30" y2="112"/><line x1="8" y1="86" x2="24" y2="116"/></g>
      <rect x="-18" y="44" width="36" height="46" rx="12" fill="#a855f7"/>
      <circle cx="0" cy="24" r="20" fill="#fcd9b6"/><path d="M-22 22 Q 0 -12 22 22 L 22 16 Q 0 0 -22 16Z" fill="#facc15"/>
      <circle cx="-7" cy="26" r="2.4" fill="#1f2937"/><circle cx="7" cy="26" r="2.4" fill="#1f2937"/><path d="M-6 33 Q 0 38 6 33" stroke="#b45309" stroke-width="2" fill="none"/>
      <rect x="-44" y="110" width="30" height="12" rx="4" fill="#ef4444"/><rect x="12" y="114" width="30" height="12" rx="4" fill="#ef4444"/>
      <circle cx="-38" cy="126" r="4" fill="#1f2937"/><circle cx="-20" cy="126" r="4" fill="#1f2937"/><circle cx="18" cy="130" r="4" fill="#1f2937"/><circle cx="36" cy="130" r="4" fill="#1f2937"/>
    </g>` +
    `<path d="M80 215 h 40 M60 230 h 30 M300 220 h 40" stroke="#fff" stroke-width="3" opacity="0.7"/>`
  );

  S.grandmother = () => wrap(
    sky("#fef3c7", "#fde68a", "g17") + sun(60, 50, 24, "#fb923c") + ground("#bef264", 190, "#a3e635") +
    `<rect x="270" y="110" width="110" height="80" fill="#fde68a" stroke="#d97706" stroke-width="3"/><path d="M260 112 L 325 60 L 390 112z" fill="#b45309"/><rect x="310" y="145" width="30" height="45" fill="#92400e"/><rect x="282" y="125" width="20" height="18" fill="#bae6fd"/>` +
    grandma(110, 60, "#a855f7") + kid(190, 90, "#f97316", "wave", undefined, undefined, 0.85) +
    `<path d="M150 60 q 10 -14 20 0 q -10 14 -20 0z" fill="#ef4444"/><path d="M160 60 q 10 -14 20 0 q -10 14 -20 0z" fill="#ef4444"/><path d="M150 60 q 20 -30 40 0 L 165 90z" fill="#ef4444"/>`
  );

  S.festival = () => wrap(
    sky("#4c1d95", "#7c3aed", "g18") + stars() +
    `<path d="M0 40 Q 200 90 400 40" stroke="#fde047" stroke-width="2" fill="none"/>` +
    [40, 110, 180, 250, 320, 380].map((x, i) => `<line x1="${x}" y1="${44 + Math.abs(200 - x) / 12}" x2="${x}" y2="${60 + Math.abs(200 - x) / 12}" stroke="#fde047" stroke-width="2"/><ellipse cx="${x}" cy="${76 + Math.abs(200 - x) / 12}" rx="12" ry="16" fill="${["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#ef4444"][i]}"/>`).join("") +
    `<rect x="0" y="190" width="${W}" height="70" fill="#3b0764"/>
     <path d="M40 190 L 90 120 L 140 190z" fill="#ef4444"/><path d="M40 190 L 90 120 L 90 190z" fill="#fca5a5"/><rect x="80" y="160" width="20" height="30" fill="#7f1d1d"/>
     <path d="M260 190 L 310 120 L 360 190z" fill="#3b82f6"/><path d="M260 190 L 310 120 L 310 190z" fill="#93c5fd"/><rect x="300" y="160" width="20" height="30" fill="#1e3a8a"/>
     <circle cx="170" cy="100" r="18" fill="#fde047"/><circle cx="170" cy="100" r="12" fill="#f59e0b"/><line x1="170" y1="118" x2="170" y2="150" stroke="#fff" stroke-width="2"/>` +
    kid(200, 100, "#facc15", "arms-up", undefined, undefined, 0.85)
  );

  S.beach = () => wrap(
    sky("#7dd3fc", "#bae6fd", "g19") + sun(330, 50) + cloud(80, 50) +
    `<rect x="0" y="130" width="${W}" height="60" fill="#0ea5e9"/><path d="M0 140 q 25 -10 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 v 20 h -400z" fill="#38bdf8"/>
     <path d="M0 185 Q 200 170 400 185 V 260 H 0z" fill="#fde68a"/>
     <path d="M110 120 a 50 50 0 0 1 100 0z" fill="#ef4444"/><path d="M110 120 a 50 50 0 0 1 100 0" fill="none" stroke="#fff" stroke-width="3"/><path d="M135 120 a 25 50 0 0 1 50 0z" fill="#fff"/><rect x="158" y="120" width="4" height="90" fill="#78350f"/>
     <rect x="130" y="200" width="70" height="14" rx="6" fill="#f472b6"/>` +
    kid(290, 90, "#22d3ee", "arms-up", undefined, undefined, 0.9) +
    `<path d="M60 230 q 6 -12 12 0z" fill="#f9a8d4"/><path d="M340 235 q 6 -12 12 0z" fill="#fff"/><circle cx="80" cy="225" r="4" fill="#fb923c"/>`
  );

  S.camping = () => wrap(
    sky("#0f172a", "#1e3a8a", "g20") + stars() + moon(340, 50) +
    `<path d="M0 170 L 80 110 L 160 170z" fill="#1e293b"/><path d="M220 170 L 330 90 L 400 170z" fill="#1e293b"/>` +
    ground("#14532d", 170, "#166534") +
    `<path d="M120 200 L 190 110 L 260 200z" fill="#f97316"/><path d="M190 110 L 260 200 L 230 200 L 190 140z" fill="#c2410c"/><path d="M172 200 L 190 140 L 208 200z" fill="#7c2d12"/>
     <line x1="60" y1="215" x2="100" y2="205" stroke="#78350f" stroke-width="6"/><line x1="60" y1="205" x2="100" y2="215" stroke="#78350f" stroke-width="6"/>
     <path d="M80 205 q -22 -20 -6 -46 q 4 16 12 12 q 0 -20 12 -30 q 4 26 14 30 q 8 10 -6 34z" fill="#f59e0b"/><path d="M80 205 q -12 -14 -2 -30 q 6 10 10 4 q 4 14 -8 26z" fill="#fde047"/>` +
    kid(320, 110, "#a855f7", "sit", undefined, undefined, 0.8)
  );

  S.jeju = () => wrap(
    sky("#7dd3fc", "#bae6fd", "g21") + sun(60, 50) + cloud(150, 40, 0.8) +
    `<rect x="0" y="150" width="${W}" height="110" fill="#0ea5e9"/>
     <path d="M100 200 Q 200 80 320 200z" fill="#4d7c0f"/><path d="M180 140 Q 205 100 232 140z" fill="#a3a3a3"/><path d="M190 128 Q 205 106 220 128z" fill="#fff"/>
     <path d="M110 200 Q 200 160 310 200z" fill="#bef264"/>
     <g transform="translate(300 70) rotate(-15)"><path d="M-40 0 h 70 q 20 0 20 10 q 0 6 -10 6 h -80z" fill="#fff"/><path d="M-10 0 l -10 -20 h 12 l 14 20z" fill="#fff"/><path d="M-32 16 l -8 12 h 12 l 6 -12z" fill="#fff"/><circle cx="10" cy="7" r="3" fill="#0ea5e9"/><circle cx="22" cy="7" r="3" fill="#0ea5e9"/><circle cx="34" cy="7" r="3" fill="#0ea5e9"/></g>
     <path d="M130 205 q 20 -30 30 0 M240 210 q 16 -26 26 0" stroke="#78350f" stroke-width="4" fill="none"/>
     <circle cx="145" cy="176" r="12" fill="#22c55e"/><circle cx="253" cy="182" r="12" fill="#22c55e"/><circle cx="340" cy="185" r="8" fill="#f97316"/><circle cx="360" cy="190" r="8" fill="#f97316"/>`
  );

  S.waterpark = () => wrap(
    sky("#bae6fd", "#e0f2fe", "g22") + sun(60, 50) +
    `<rect x="0" y="190" width="${W}" height="70" fill="#38bdf8"/><path d="M0 195 q 25 -8 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 v 12 h -400z" fill="#7dd3fc"/>
     <rect x="300" y="60" width="14" height="140" fill="#6b7280"/><rect x="330" y="60" width="14" height="140" fill="#6b7280"/><rect x="290" y="50" width="64" height="16" rx="6" fill="#facc15"/>
     <path d="M300 66 C 200 80 240 150 140 190" stroke="#facc15" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M300 66 C 200 80 240 150 140 190" stroke="#fde68a" stroke-width="12" fill="none" stroke-linecap="round"/>
     <path d="M310 66 C 260 100 260 150 170 200" stroke="#ef4444" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.9"/>` +
    kid(215, 60, "#ec4899", "arms-up", undefined, undefined, 0.7) +
    `<path d="M120 200 q 6 -14 12 0 M150 205 q 6 -14 12 0" stroke="#fff" stroke-width="3" fill="none"/>`
  );

  S.photobooth = () => wrap(
    sky("#fdf2f8", "#fbcfe8", "g23") +
    `<rect x="40" y="30" width="180" height="200" rx="10" fill="#1f2937"/><rect x="50" y="40" width="160" height="110" rx="6" fill="#0f172a"/><circle cx="130" cy="95" r="26" fill="#111827" stroke="#facc15" stroke-width="4"/><circle cx="130" cy="95" r="12" fill="#60a5fa"/><rect x="60" y="160" width="140" height="60" fill="#ec4899"/><text x="80" y="198" font-size="24" font-weight="900" fill="#fff" font-family="sans-serif">PHOTO</text>
     <rect x="260" y="20" width="70" height="220" rx="4" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>` +
    [30, 82, 134, 186].map((y, i) => `<rect x="266" y="${y}" width="58" height="46" fill="${["#fde68a", "#bfdbfe", "#bbf7d0", "#fecaca"][i]}"/><circle cx="285" cy="${y + 26}" r="9" fill="#fcd9b6"/><circle cx="306" cy="${y + 26}" r="9" fill="#fcd9b6"/><path d="M278 ${y + 20} q 7 -10 14 0 M299 ${y + 20} q 7 -10 14 0" fill="#3f2a1d"/>`).join("") +
    `<text x="345" y="140" font-size="26" fill="#ec4899">✿</text>`
  );

  S.fireworks = () => wrap(
    sky("#0f172a", "#312e81", "g24") + stars() +
    [[110, 70, "#f472b6"], [260, 60, "#fde047"], [330, 120, "#22d3ee"], [180, 120, "#fb923c"]].map(([x, y, c]) => {
      let g = `<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`;
      for (let a = 0; a < 360; a += 30) {
        const r = (a * Math.PI) / 180, l = 34;
        g += `<line x1="${x + Math.cos(r) * 8}" y1="${y + Math.sin(r) * 8}" x2="${x + Math.cos(r) * l}" y2="${y + Math.sin(r) * l}" stroke="${c}" stroke-width="3" stroke-linecap="round"/><circle cx="${x + Math.cos(r) * (l + 6)}" cy="${y + Math.sin(r) * (l + 6)}" r="3" fill="${c}"/>`;
      }
      return g;
    }).join("") +
    `<rect x="0" y="190" width="${W}" height="70" fill="#1e3a8a"/><path d="M0 200 q 25 -6 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" stroke="#60a5fa" stroke-width="2" fill="none"/>
     <rect x="100" y="200" width="20" height="40" fill="#f472b6" opacity="0.5"/><rect x="250" y="200" width="20" height="40" fill="#fde047" opacity="0.5"/>` +
    kid(60, 100, "#facc15", "arms-up", undefined, undefined, 0.7)
  );

  S.books = () => wrap(
    sky("#fef3c7", "#fde68a", "g25") +
    `<rect x="20" y="30" width="110" height="200" fill="#92400e"/>` +
    [40, 80, 120, 160].map((y, i) => `<rect x="24" y="${y}" width="102" height="6" fill="#78350f"/>` + [0, 1, 2, 3, 4].map(j => `<rect x="${28 + j * 20}" y="${y - 30}" width="14" height="30" fill="${["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"][(i + j) % 5]}"/>`).join("")).join("") +
    `<rect x="160" y="210" width="220" height="14" rx="4" fill="#c2825b"/>` +
    kid(270, 70, "#22c55e", "sit") +
    `<path d="M228 120 L 270 130 L 312 120 L 312 160 L 270 170 L 228 160z" fill="#fff" stroke="#9ca3af" stroke-width="2"/><line x1="270" y1="130" x2="270" y2="170" stroke="#9ca3af" stroke-width="2"/><path d="M236 132 h 26 M236 140 h 26 M236 148 h 20 M278 132 h 26 M278 140 h 26 M278 148 h 20" stroke="#d1d5db" stroke-width="2"/>
     <rect x="180" y="180" width="40" height="10" fill="#ef4444"/><rect x="184" y="170" width="40" height="10" fill="#3b82f6"/><rect x="178" y="160" width="40" height="10" fill="#f59e0b"/>`
  );

  S.movies = () => wrap(
    sky("#1e1b4b", "#312e81", "g26") +
    `<rect x="50" y="30" width="300" height="140" rx="6" fill="#0f172a" stroke="#475569" stroke-width="4"/><rect x="60" y="40" width="280" height="120" fill="#38bdf8"/><path d="M60 160 L 140 100 L 200 130 L 260 80 L 340 160z" fill="#22c55e"/><circle cx="300" cy="70" r="16" fill="#fde047"/>
     <rect x="0" y="200" width="${W}" height="60" fill="#111827"/>` +
    `<g transform="translate(200 215)"><path d="M-30 -30 h 60 l -8 60 h -44z" fill="#ef4444"/><path d="M-22 -30 h 10 l -6 60 h -10z M0 -30 h 10 l -4 60 h -10z M20 -30 h 10 l -8 60 h -8z" fill="#fff"/>
     <circle cx="-16" cy="-34" r="9" fill="#fef3c7"/><circle cx="0" cy="-40" r="10" fill="#fde68a"/><circle cx="16" cy="-34" r="9" fill="#fef3c7"/><circle cx="8" cy="-28" r="8" fill="#fef3c7"/><circle cx="-8" cy="-28" r="8" fill="#fde68a"/></g>` +
    `<circle cx="90" cy="230" r="16" fill="#3f2a1d"/><circle cx="310" cy="230" r="16" fill="#3f2a1d"/><circle cx="130" cy="236" r="14" fill="#facc15"/>`
  );

  S.computer = () => wrap(
    sky("#e0e7ff", "#c7d2fe", "g27") +
    table(40, 190, 320) +
    `<rect x="100" y="50" width="200" height="130" rx="8" fill="#1f2937"/><rect x="110" y="60" width="180" height="110" fill="#111827"/>
     <rect x="120" y="70" width="160" height="90" fill="#3b82f6" opacity="0.5"/><rect x="130" y="130" width="40" height="30" fill="#22c55e"/><rect x="230" y="120" width="40" height="40" fill="#ef4444"/><circle cx="200" cy="100" r="14" fill="#fde047"/><path d="M186 90 l 28 0 l -14 -20z" fill="#f97316"/>
     <rect x="180" y="180" width="40" height="10" fill="#374151"/>
     <rect x="60" y="192" width="120" height="6" rx="3" fill="#6b7280"/>` +
    kid(330, 90, "#ef4444", "sit", undefined, undefined, 0.75) +
    `<rect x="300" y="150" width="30" height="14" rx="6" fill="#374151"/>`
  );

  S.tteokbokki = () => wrap(
    sky("#fff7ed", "#fed7aa", "g28") +
    `<ellipse cx="200" cy="200" rx="150" ry="30" fill="#e5e7eb"/><ellipse cx="200" cy="150" rx="140" ry="46" fill="#f3f4f6"/><ellipse cx="200" cy="146" rx="120" ry="34" fill="#dc2626"/>` +
    [[130, 140], [170, 130], [210, 148], [250, 135], [190, 160], [240, 158], [150, 158]].map(([x, y]) =>
      `<rect x="${x - 22}" y="${y - 8}" width="44" height="16" rx="8" fill="#fecaca" transform="rotate(${(x % 3) * 15 - 15} ${x} ${y})"/>`).join("") +
    `<ellipse cx="160" cy="146" rx="18" ry="8" fill="#fde68a" opacity="0.9"/><rect x="220" y="122" width="34" height="10" rx="3" fill="#f59e0b"/>
     <path d="M110 128 q 4 -14 12 -22 M270 130 q -4 -14 -12 -22" stroke="#22c55e" stroke-width="3" fill="none"/>
     <line x1="290" y1="40" x2="240" y2="140" stroke="#78350f" stroke-width="6" stroke-linecap="round"/><line x1="310" y1="50" x2="252" y2="142" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
     <path d="M150 90 q -6 -16 0 -30 M200 84 q 6 -16 0 -30 M250 90 q -6 -16 0 -30" stroke="#e5e7eb" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.9"/>`
  );

  S.singing = () => wrap(
    sky("#4c1d95", "#0f172a", "g29") + stars() +
    `<circle cx="200" cy="50" r="26" fill="#e5e7eb"/><path d="M180 36 h 40 M176 50 h 48 M180 64 h 40 M190 26 v 48 M210 26 v 48" stroke="#9ca3af" stroke-width="2"/>
     <path d="M200 76 l -60 100 M200 76 l 60 100 M200 76 l 0 100" stroke="#fde047" stroke-width="3" opacity="0.4"/>
     <rect x="0" y="190" width="${W}" height="70" fill="#1e1b4b"/>` +
    kid(140, 90, "#ec4899", "arms-up", undefined, undefined, 0.85) + kid(250, 90, "#22d3ee", "wave", undefined, undefined, 0.85) +
    `<rect x="286" y="130" width="8" height="30" rx="4" fill="#374151"/><circle cx="290" cy="126" r="10" fill="#9ca3af"/>` +
    note(60, 100, "#fde047") + note(330, 80, "#f0abfc") + note(200, 120, "#67e8f9") + note(90, 60, "#fff")
  );

  S.bingsu = () => wrap(
    sky("#ecfeff", "#cffafe", "g30") +
    `<path d="M120 150 h 160 l -20 80 h -120z" fill="#bfdbfe"/><path d="M120 150 h 160 l -6 24 h -148z" fill="#93c5fd"/>
     <path d="M125 150 Q 200 40 275 150z" fill="#fff"/><path d="M140 150 Q 200 70 260 150z" fill="#f0f9ff"/>
     <circle cx="200" cy="80" r="14" fill="#ef4444"/><circle cx="180" cy="110" r="9" fill="#ef4444"/><circle cx="222" cy="106" r="9" fill="#ef4444"/><rect x="160" y="126" width="24" height="12" rx="4" fill="#fde047"/><rect x="215" y="126" width="24" height="12" rx="4" fill="#4ade80"/>
     <path d="M175 100 q 25 30 50 0" stroke="#a16207" stroke-width="4" fill="none" opacity="0.6"/>
     <path d="M270 100 l 30 -20 M300 80 h 14" stroke="#9ca3af" stroke-width="4" stroke-linecap="round"/><ellipse cx="316" cy="80" rx="10" ry="6" fill="#d1d5db"/>
     <path d="M60 60 l 6 6 M70 50 l 6 6 M330 40 l 6 6 M340 30 l 6 6" stroke="#67e8f9" stroke-width="3"/>
     <text x="40" y="120" font-size="22" fill="#22d3ee">❄</text><text x="330" y="150" font-size="22" fill="#22d3ee">❄</text>`
  );

  S.youtubewatch = () => wrap(
    sky("#fef3c7", "#fde68a", "g31") +
    `<rect x="40" y="150" width="320" height="70" rx="20" fill="#a855f7"/><rect x="30" y="120" width="40" height="100" rx="14" fill="#9333ea"/><rect x="330" y="120" width="40" height="100" rx="14" fill="#9333ea"/><rect x="60" y="140" width="280" height="30" rx="10" fill="#c084fc"/>` +
    kid(200, 60, "#f97316", "sit") +
    `<rect x="150" y="120" width="100" height="70" rx="8" fill="#1f2937"/><rect x="157" y="127" width="86" height="56" fill="#fff"/><rect x="185" y="140" width="30" height="24" rx="6" fill="#ef4444"/><path d="M196 146 l 12 6 l -12 6z" fill="#fff"/>` +
    `<circle cx="90" cy="180" r="14" fill="#fde047"/><circle cx="310" cy="180" r="14" fill="#fde047"/>`
  );

  S.sleepover = () => wrap(
    sky("#1e1b4b", "#312e81", "g32") + stars() + moon(340, 50) +
    `<rect x="0" y="200" width="${W}" height="60" fill="#0f172a"/>
     <rect x="40" y="150" width="150" height="60" rx="10" fill="#f472b6"/><rect x="40" y="130" width="150" height="30" rx="8" fill="#fbcfe8"/><rect x="30" y="120" width="12" height="90" fill="#92400e"/><rect x="188" y="120" width="12" height="90" fill="#92400e"/>
     <rect x="210" y="150" width="150" height="60" rx="10" fill="#60a5fa"/><rect x="210" y="130" width="150" height="30" rx="8" fill="#bfdbfe"/><rect x="200" y="120" width="12" height="90" fill="#92400e"/><rect x="358" y="120" width="12" height="90" fill="#92400e"/>
     <circle cx="80" cy="130" r="18" fill="#fcd9b6"/><path d="M62 126 Q 80 104 98 126 Q 90 116 80 118 Q 70 116 62 126Z" fill="#3f2a1d"/><path d="M72 132 q 4 3 8 0 M84 132 q 4 3 8 0" stroke="#1f2937" stroke-width="2" fill="none"/>
     <circle cx="250" cy="130" r="18" fill="#fcd9b6"/><path d="M232 126 Q 250 104 268 126 Q 260 116 250 118 Q 240 116 232 126Z" fill="#7c2d12"/><circle cx="243" cy="132" r="2.4" fill="#1f2937"/><circle cx="257" cy="132" r="2.4" fill="#1f2937"/><path d="M244 139 q 6 5 12 0" stroke="#b45309" stroke-width="2" fill="none"/>
     <rect x="110" y="120" width="60" height="26" rx="10" fill="#fff"/><rect x="290" y="120" width="60" height="26" rx="10" fill="#fff"/>
     <text x="110" y="90" font-size="18" font-weight="900" fill="#c7d2fe" font-family="sans-serif">z z Z</text>`
  );


  /* ---------- 학습지용 추가 장면 ---------- */
  S.hug = () => wrap(
    sky("#fef3c7", "#fde68a", "h1") + sun(60, 50, 24, "#fb923c") + ground("#bef264", 190, "#a3e635") +
    grandma(170, 60, "#a855f7") +
    `<g transform="translate(232 90)"><g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="-14" y1="50" x2="-46" y2="30"/><line x1="-10" y1="60" x2="-44" y2="56"/></g>
     <g stroke="#1e3a8a" stroke-width="10" stroke-linecap="round"><line x1="-8" y1="86" x2="-10" y2="106"/><line x1="8" y1="86" x2="10" y2="106"/></g>
     <rect x="-18" y="44" width="36" height="46" rx="12" fill="#f97316"/><circle cx="0" cy="24" r="20" fill="#fcd9b6"/><path d="M-20 20 Q 0 -6 20 20 Q 10 8 0 10 Q -10 8 -20 20Z" fill="#3f2a1d"/>
     <circle cx="-7" cy="26" r="2.4" fill="#1f2937"/><circle cx="7" cy="26" r="2.4" fill="#1f2937"/><path d="M-7 33 Q 0 40 7 33" stroke="#b45309" stroke-width="2" fill="none"/></g>` +
    `<path d="M300 70 q 10 -14 20 0 q -10 14 -20 0z M310 70 q 10 -14 20 0 q -10 14 -20 0z M300 70 q 20 -30 40 0 L 315 100z" fill="#ef4444"/>
     <path d="M70 120 q 8 -12 16 0 q -8 12 -16 0z M78 120 q 8 -12 16 0 q -8 12 -16 0z M70 120 q 16 -24 32 0 L 82 144z" fill="#f472b6"/>`
  );

  S.school = () => wrap(
    sky("#bae6fd", "#e0f2fe", "h2") + sun(60, 50) + cloud(320, 50, 0.8) + ground("#bef264", 190, "#a3e635") +
    `<rect x="140" y="80" width="220" height="110" fill="#fde68a" stroke="#d97706" stroke-width="3"/><rect x="220" y="50" width="60" height="30" fill="#fde68a" stroke="#d97706" stroke-width="3"/><path d="M215 50 L 250 24 L 285 50z" fill="#ef4444"/>
     <rect x="236" y="140" width="28" height="50" fill="#92400e"/><rect x="160" y="100" width="24" height="22" fill="#bae6fd"/><rect x="200" y="100" width="24" height="22" fill="#bae6fd"/><rect x="276" y="100" width="24" height="22" fill="#bae6fd"/><rect x="316" y="100" width="24" height="22" fill="#bae6fd"/>
     <circle cx="250" cy="66" r="9" fill="#fff" stroke="#374151" stroke-width="2"/><path d="M250 60 v 6 h 5" stroke="#374151" stroke-width="2" fill="none"/>
     <line x1="120" y1="80" x2="120" y2="190" stroke="#6b7280" stroke-width="4"/><path d="M120 80 h 40 v 24 h -40z" fill="#ef4444"/>` +
    kid(70, 80, "#3b82f6", "run") + `<rect x="46" y="128" width="22" height="28" rx="5" fill="#facc15"/>`
  );

  S.chair = () => wrap(
    sky("#fef9c3", "#fde68a", "h3") + `<rect x="0" y="200" width="${W}" height="60" fill="#d6a679"/>` +
    `<rect x="150" y="60" width="16" height="140" fill="#92400e"/><rect x="150" y="60" width="90" height="16" rx="4" fill="#92400e"/><rect x="150" y="130" width="100" height="14" rx="4" fill="#b45309"/><rect x="236" y="140" width="14" height="60" fill="#92400e"/><rect x="156" y="144" width="12" height="56" fill="#92400e"/>` +
    kid(200, 50, "#22c55e", "sit")
  );

  S.present = () => wrap(
    sky("#fdf2f8", "#fbcfe8", "h4") +
    `<rect x="80" y="110" width="140" height="110" rx="8" fill="#ef4444"/><rect x="70" y="90" width="160" height="30" rx="6" fill="#dc2626"/><rect x="140" y="90" width="20" height="130" fill="#fde047"/><rect x="70" y="98" width="160" height="14" fill="#fde047"/>
     <path d="M150 90 q -30 -40 -10 -50 q 14 -4 10 50 q 30 -40 10 -50 q -14 -4 -10 50z" fill="#fde047"/>` +
    kid(300, 70, "#a855f7", "arms-up") +
    `<text x="240" y="60" font-size="28" fill="#f472b6">✦</text><text x="40" y="80" font-size="22" fill="#fde047">✦</text>`
  );

  S.homework = () => wrap(
    sky("#eef2ff", "#e0e7ff", "h5") + table(40, 180, 320) +
    `<rect x="110" y="120" width="130" height="62" rx="4" fill="#fff" stroke="#9ca3af" stroke-width="2" transform="rotate(-4 175 150)"/><path d="M125 140 h 90 M125 152 h 70 M125 164 h 80" stroke="#93c5fd" stroke-width="3"/>
     <rect x="250" y="100" width="8" height="70" rx="3" fill="#fde047" transform="rotate(25 254 135)"/><path d="M262 172 l 8 14 l -14 -4z" fill="#fcd9b6" transform="rotate(25 254 135)"/>` +
    kid(320, 60, "#f97316", "sit", undefined, undefined, 0.9) +
    `<text x="60" y="110" font-size="30" font-weight="900" fill="#6366f1" font-family="sans-serif">A+</text>`
  );

  S.talk = () => wrap(
    sky("#fef3c7", "#fde68a", "h6") + ground("#bef264", 195, "#a3e635") +
    kid(140, 80, "#3b82f6", "wave") +
    `<g transform="translate(260 80) scale(-1 1)"><g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="-14" y1="52" x2="-24" y2="74"/><line x1="14" y1="50" x2="30" y2="26"/></g>
     <g stroke="#1e3a8a" stroke-width="10" stroke-linecap="round"><line x1="-8" y1="86" x2="-10" y2="110"/><line x1="8" y1="86" x2="10" y2="110"/></g>
     <rect x="-18" y="44" width="36" height="46" rx="12" fill="#ec4899"/><circle cx="0" cy="24" r="20" fill="#fcd9b6"/><path d="M-20 20 Q 0 -6 20 20 Q 10 8 0 10 Q -10 8 -20 20Z" fill="#7c2d12"/>
     <circle cx="-7" cy="26" r="2.4" fill="#1f2937"/><circle cx="7" cy="26" r="2.4" fill="#1f2937"/><path d="M-6 33 Q 0 38 6 33" stroke="#b45309" stroke-width="2" fill="none"/></g>` +
    `<path d="M60 40 h 90 a 12 12 0 0 1 12 12 v 26 a 12 12 0 0 1 -12 12 h -50 l -14 14 v -14 h -26 a 12 12 0 0 1 -12 -12 v -26 a 12 12 0 0 1 12 -12z" fill="#fff" stroke="#3b82f6" stroke-width="3"/><text x="78" y="72" font-size="18" font-weight="800" fill="#1d4ed8" font-family="sans-serif">Hi!</text>
     <path d="M250 40 h 90 a 12 12 0 0 1 12 12 v 26 a 12 12 0 0 1 -12 12 h -26 v 14 l -14 -14 h -50 a 12 12 0 0 1 -12 -12 v -26 a 12 12 0 0 1 12 -12z" fill="#fff" stroke="#ec4899" stroke-width="3"/><text x="262" y="72" font-size="18" font-weight="800" fill="#be185d" font-family="sans-serif">Hello!</text>`
  );

  S.wash = () => wrap(
    sky("#ecfeff", "#cffafe", "h7") + `<rect x="0" y="0" width="${W}" height="${H}" fill="#e0f2fe" opacity="0.4"/>` +
    `<rect x="90" y="140" width="220" height="70" rx="20" fill="#e5e7eb"/><ellipse cx="200" cy="150" rx="90" ry="20" fill="#f3f4f6"/><ellipse cx="200" cy="150" rx="70" ry="12" fill="#bae6fd"/>
     <path d="M200 60 v 40 q 0 20 -20 24" stroke="#9ca3af" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="185" y="46" width="30" height="16" rx="6" fill="#6b7280"/>
     <path d="M180 124 q 4 14 0 26" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
     <ellipse cx="160" cy="140" rx="16" ry="12" fill="#fcd9b6"/><ellipse cx="200" cy="142" rx="16" ry="12" fill="#fcd9b6"/>
     <circle cx="140" cy="110" r="8" fill="#fff" opacity="0.9"/><circle cx="230" cy="100" r="6" fill="#fff" opacity="0.9"/><circle cx="215" cy="120" r="5" fill="#fff" opacity="0.9"/><circle cx="150" cy="90" r="5" fill="#fff" opacity="0.9"/>
     <rect x="300" y="120" width="40" height="18" rx="6" fill="#f472b6"/>`
  );

  S.door = () => wrap(
    sky("#fef3c7", "#fde68a", "h8") + `<rect x="0" y="200" width="${W}" height="60" fill="#d6a679"/>` +
    `<rect x="230" y="40" width="120" height="160" rx="4" fill="#92400e"/><rect x="238" y="40" width="80" height="160" fill="#b45309" transform="skewY(-8) translate(0 20)"/><rect x="250" y="60" width="40" height="40" fill="#fde68a" opacity="0.5" transform="skewY(-8) translate(0 20)"/><circle cx="306" cy="130" r="6" fill="#fde047" transform="skewY(-8) translate(0 20)"/>
     <rect x="318" y="44" width="30" height="152" fill="#fef9c3"/>` +
    kid(150, 80, "#22c55e", "wave")
  );

  S.help = () => wrap(
    sky("#fff7ed", "#ffedd5", "h9") + table(30, 180, 200) +
    `<rect x="60" y="140" width="60" height="40" rx="6" fill="#9ca3af"/><rect x="66" y="132" width="48" height="10" rx="3" fill="#6b7280"/>
     <circle cx="150" cy="170" r="12" fill="#fff" stroke="#9ca3af" stroke-width="2"/><circle cx="180" cy="170" r="12" fill="#fff" stroke="#9ca3af" stroke-width="2"/>` +
    `<g transform="translate(300 40)"><path d="M-24 46 L 24 46 L 30 110 L -30 110 Z" fill="#ec4899"/><g stroke="#fcd9b6" stroke-width="9" stroke-linecap="round"><line x1="-18" y1="54" x2="-30" y2="80"/><line x1="18" y1="54" x2="30" y2="80"/></g>
     <circle cx="0" cy="22" r="22" fill="#fcd9b6"/><path d="M-24 20 Q 0 -10 24 20 Q 14 6 0 8 Q -14 6 -24 20Z" fill="#3f2a1d"/><circle cx="-7" cy="24" r="2.4" fill="#1f2937"/><circle cx="7" cy="24" r="2.4" fill="#1f2937"/><path d="M-7 32 Q 0 38 7 32" stroke="#b45309" stroke-width="2" fill="none"/></g>` +
    kid(230, 80, "#3b82f6", "stand", undefined, undefined, 0.85) + `<rect x="200" y="140" width="34" height="8" rx="3" fill="#f472b6"/>` +
    `<path d="M150 60 q 8 -12 16 0 q -8 12 -16 0z M158 60 q 8 -12 16 0 q -8 12 -16 0z M150 60 q 16 -24 32 0 L 162 84z" fill="#ef4444"/>`
  );

  S.clean = () => wrap(
    sky("#f5f3ff", "#ede9fe", "h10") + `<rect x="0" y="200" width="${W}" height="60" fill="#d6a679"/>` +
    `<rect x="40" y="100" width="90" height="100" rx="8" fill="#60a5fa"/><rect x="40" y="90" width="90" height="26" rx="8" fill="#bfdbfe"/>` +
    kid(230, 70, "#22c55e", "stand") +
    `<line x1="192" y1="130" x2="150" y2="215" stroke="#a16207" stroke-width="6" stroke-linecap="round"/><path d="M130 205 h 40 l 10 20 h -60z" fill="#fde047"/>
     <circle cx="330" cy="150" r="6" fill="#fff" opacity="0.9"/><circle cx="350" cy="130" r="5" fill="#fff" opacity="0.9"/><path d="M300 60 l 6 6 M320 40 l 6 6 M340 70 l 6 6" stroke="#c4b5fd" stroke-width="3"/>`
  );

  S.window = () => wrap(
    sky("#fde68a", "#fff7ed", "h11") + `<rect x="0" y="0" width="${W}" height="${H}" fill="#fef3c7"/>` +
    `<rect x="110" y="40" width="180" height="150" rx="6" fill="#92400e"/><rect x="120" y="50" width="160" height="130" fill="#7dd3fc"/><rect x="197" y="50" width="6" height="130" fill="#92400e"/><rect x="120" y="112" width="160" height="6" fill="#92400e"/>
     <circle cx="160" cy="80" r="14" fill="#fde047"/><path d="M130 170 L 160 140 L 190 170z M210 170 L 245 130 L 280 170z" fill="#4ade80"/>
     <rect x="90" y="36" width="20" height="160" fill="#f472b6"/><rect x="290" y="36" width="20" height="160" fill="#f472b6"/>` +
    kid(340, 70, "#3b82f6", "wave", undefined, undefined, 0.85)
  );

  S.milk = () => wrap(
    sky("#eff6ff", "#dbeafe", "h12") + table(40, 190, 320) +
    `<path d="M150 190 v -90 l 20 -30 h 60 l 20 30 v 90z" fill="#fff" stroke="#93c5fd" stroke-width="3"/><path d="M170 70 h 60 l 20 30 h -100z" fill="#bfdbfe"/><rect x="165" y="120" width="70" height="40" rx="6" fill="#3b82f6"/><text x="178" y="147" font-size="18" font-weight="900" fill="#fff" font-family="sans-serif">MILK</text>
     <rect x="270" y="130" width="40" height="60" rx="6" fill="#fff" stroke="#93c5fd" stroke-width="3"/><rect x="274" y="145" width="32" height="42" fill="#f8fafc"/>` +
    kid(90, 80, "#f97316", "stand", undefined, undefined, 0.85)
  );

  S.lunch = () => wrap(
    sky("#fff7ed", "#fed7aa", "h13") + table(40, 200, 320) +
    `<ellipse cx="200" cy="170" rx="120" ry="34" fill="#f3f4f6"/><ellipse cx="200" cy="166" rx="105" ry="26" fill="#fff"/>
     <ellipse cx="150" cy="164" rx="34" ry="16" fill="#fef9c3"/><ellipse cx="150" cy="160" rx="26" ry="10" fill="#fff"/>
     <circle cx="215" cy="160" r="16" fill="#dc2626"/><circle cx="238" cy="166" r="12" fill="#22c55e"/><rect x="255" y="150" width="30" height="14" rx="4" fill="#f59e0b"/><circle cx="196" cy="172" r="7" fill="#fde047"/>
     <line x1="70" y1="120" x2="110" y2="180" stroke="#78350f" stroke-width="5" stroke-linecap="round"/><line x1="84" y1="116" x2="120" y2="176" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
     <path d="M150 110 q -6 -16 0 -30 M200 104 q 6 -16 0 -30 M250 110 q -6 -16 0 -30" stroke="#e5e7eb" stroke-width="5" stroke-linecap="round" fill="none"/>` +
    kid(330, 50, "#a855f7", "sit", undefined, undefined, 0.8)
  );

  S.music = () => wrap(
    sky("#ede9fe", "#ddd6fe", "h14") +
    kid(200, 60, "#ec4899", "sit") +
    `<path d="M170 76 q 30 -44 60 0" stroke="#1f2937" stroke-width="8" fill="none"/><rect x="164" y="72" width="16" height="26" rx="6" fill="#1f2937"/><rect x="220" y="72" width="16" height="26" rx="6" fill="#1f2937"/>` +
    note(90, 80, "#8b5cf6") + note(310, 70, "#ec4899") + note(120, 150, "#6366f1") + note(300, 150, "#f59e0b") + note(60, 130, "#22d3ee") +
    `<rect x="150" y="190" width="100" height="14" rx="6" fill="#c4b5fd"/>`
  );

  S.study = () => wrap(
    sky("#eef2ff", "#e0e7ff", "h15") + table(40, 180, 320) +
    `<path d="M110 176 L 160 166 L 210 176 L 210 128 L 160 118 L 110 128z" fill="#fff" stroke="#9ca3af" stroke-width="2"/><line x1="160" y1="118" x2="160" y2="166" stroke="#9ca3af" stroke-width="2"/>
     <text x="120" y="150" font-size="14" font-weight="800" fill="#6366f1" font-family="sans-serif">ABC</text><text x="170" y="150" font-size="14" font-weight="800" fill="#ec4899" font-family="sans-serif">abc</text>
     <rect x="240" y="120" width="60" height="50" rx="6" fill="#fde047"/><text x="250" y="152" font-size="16" font-weight="900" fill="#1f2937" font-family="sans-serif">Eng</text>` +
    kid(330, 60, "#22c55e", "sit", undefined, undefined, 0.9) +
    `<rect x="60" y="40" width="120" height="60" rx="6" fill="#065f46"/><text x="72" y="78" font-size="18" fill="#fff" font-family="sans-serif">English</text>`
  );

  S.fruit = () => wrap(
    sky("#fef3c7", "#fde68a", "h16") +
    `<rect x="60" y="120" width="280" height="90" rx="10" fill="#c2825b"/><rect x="60" y="110" width="280" height="20" rx="6" fill="#a0613f"/>
     <path d="M40 60 h 320 l 20 50 h -360z" fill="#ef4444"/><path d="M80 60 h 40 l 10 50 h -40z M160 60 h 40 l 10 50 h -40z M240 60 h 40 l 10 50 h -40z" fill="#fff"/>` +
    [[100, 150, "#ef4444"], [130, 150, "#ef4444"], [115, 130, "#ef4444"], [190, 150, "#f59e0b"], [220, 150, "#f59e0b"], [205, 130, "#f59e0b"], [280, 150, "#22c55e"], [310, 150, "#22c55e"], [295, 130, "#22c55e"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="15" fill="${c}"/>`).join("") +
    `<path d="M115 116 l 2 -10 M205 116 l 2 -10" stroke="#78350f" stroke-width="3"/>` +
    kid(360, 130, "#3b82f6", "stand", undefined, undefined, 0.7)
  );

  S.letter = () => wrap(
    sky("#fdf2f8", "#fce7f3", "h17") + table(40, 190, 320) +
    `<rect x="90" y="90" width="180" height="110" rx="6" fill="#fff" stroke="#f9a8d4" stroke-width="3" transform="rotate(-6 180 145)"/><path d="M110 120 h 130 M110 138 h 100 M110 156 h 120 M110 174 h 80" stroke="#f9a8d4" stroke-width="3" transform="rotate(-6 180 145)"/>
     <path d="M250 110 l 40 -60" stroke="#fde047" stroke-width="9" stroke-linecap="round"/><path d="M250 110 l -6 12 l 12 -4z" fill="#1f2937"/>
     <rect x="290" y="140" width="70" height="50" rx="4" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M290 140 l 35 28 l 35 -28" stroke="#d97706" stroke-width="2" fill="none"/>
     <path d="M330 60 q 8 -12 16 0 q -8 12 -16 0z M338 60 q 8 -12 16 0 q -8 12 -16 0z M330 60 q 16 -24 32 0 L 342 84z" fill="#ef4444"/>`
  );

  window.ILLUSTRATIONS = S;
})();
