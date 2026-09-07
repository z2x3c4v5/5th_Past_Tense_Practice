#!/usr/bin/env node
/* img 폴더의 모든 그림이 worksheet.js 에 연결되어 있고, 연결된 그림 파일이 실제로 있는지 점검합니다.
 * 사용: node tools/check-images.js  (문제가 있으면 종료 코드 1) */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(root, "worksheet.js"), "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src + "\n;globalThis.__out = { WORKSHEET_DAYS, ASSET_VERSION };", ctx);
const { WORKSHEET_DAYS, ASSET_VERSION } = ctx.__out;

const IMG_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : IMG_EXT.test(e.name) ? [path.relative(root, p).split(path.sep).join("/")] : [];
  });
}
const files = new Set(walk(path.join(root, "img")));
const rows = WORKSHEET_DAYS.flatMap(d => d.rows);
const problems = [];

// 1) 연결된 그림 파일이 존재하는가 (없으면 app.js 가 img/과거형.* 을 자동으로 찾지만, 여기서는 명시적으로 알림)
const referenced = new Set();
for (const r of rows) {
  if (!r.img) { problems.push(`img 없음: ${r.past} ("${r.en}")`); continue; }
  if (!files.has(r.img)) problems.push(`파일 없음: ${r.img} (${r.past})`);
  referenced.add(r.img);
}
// 2) img 폴더의 모든 파일이 어떤 줄에 연결되어 있는가
//    (worksheet.js 의 img 로 직접 연결되었거나, 파일 이름이 과거형/현재형과 같아 자동으로 연결되는 경우)
const autoNames = new Set(rows.flatMap(r => [r.past, r.base]));
const unconnected = [...files].filter(f => !referenced.has(f) && !autoNames.has(path.basename(f).replace(IMG_EXT, "")));
for (const f of unconnected) problems.push(`연결 안 됨: ${f} — worksheet.js 의 줄에 img 로 지정하거나 파일 이름을 과거형(예: went.png)으로 바꿔 주세요`);

// 3) index.html 의 캐시 버전 태그가 ASSET_VERSION 과 같은가
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const asset of ["style.css", "worksheet.js", "illustrations.js", "app.js"]) {
  const m = html.match(new RegExp(asset.replace(".", "\\.") + "\\?v=([^\"']+)"));
  if (!m) problems.push(`index.html: ${asset} 에 ?v= 버전 태그가 없습니다`);
  else if (m[1] !== ASSET_VERSION) problems.push(`index.html: ${asset}?v=${m[1]} 이(가) ASSET_VERSION(${ASSET_VERSION}) 과 다릅니다`);
}

console.log(`그림 파일 ${files.size}장 · 문장 ${rows.length}줄 · 직접 연결 ${referenced.size}장 · ASSET_VERSION=${ASSET_VERSION}`);
if (problems.length) { console.error("\n문제:\n- " + problems.join("\n- ")); process.exit(1); }
console.log("✅ img 폴더의 모든 그림이 연결되어 있고, 연결된 그림이 모두 존재합니다.");
