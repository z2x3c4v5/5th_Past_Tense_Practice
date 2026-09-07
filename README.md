# 🍂 English Time Machine · 과거 · 현재 · 미래

5학년 영어 **과거형 단원**(What did you do this summer? / What did you do yesterday?) 학습용 웹앱입니다.
6단원(미래형 *What will you do this summer?*) 페이지를 바탕으로, **과거형을 기본**으로 하고
**현재 · 미래 표현도 버튼 하나로 바꿔 볼 수 있게** 만들었습니다. (🍁 가을 테마 디자인)

## 기능

- ⏪⏺⏩ **시제 스위치** — 헤더의 `과거(did) / 현재(do) / 미래(will)` 버튼으로 전체 페이지의 문장·질문·때 표현이 한 번에 바뀝니다. **기본값은 과거**.
  - 과거 `I played basketball.` · 현재 `I play basketball.` · 미래 `I'll play basketball.`
- 🗣️ **한 일 말하기** — 초급·중급·고급 난이도 × 4가지 활동 종류 (🍪 만들기·체험 / 🏀 운동·배우기 / 🎡 나들이·여행 / 🎮 놀이·취미), **32가지 활동 × 3단계 = 96문장**
  - 교과서 주요 표현 6개 모두 포함: `I played basketball.` · `I visited my grandmother.` · `I picked watermelons.` · `I made cookies.` · `I swam in the sea.` · `I went to a festival.`
  - 과거 시제에서는 카드마다 **✅ 규칙(-ed) / 🔀 불규칙** 배지(`play → played`, `go → went`)가 붙고, 문장 속 과거형 동사가 강조되며, **동사 종류 필터**로 규칙/불규칙만 골라 볼 수 있음
- 🔤 **동사 변화표** — 규칙 동사(-ed / -d / y→ied / 자음+ed 규칙 설명)와 불규칙 동사를 나눠 보여주고, 카드를 누르면 **원형 → 과거형** 순서로 들려줌
- 📅 **때·장소·누구와** — 때(When)는 시제마다 다름 (과거: yesterday, last weekend, on Chuseok… / 현재: every day, on Sundays… / 미래: tomorrow, this fall…)
- 🧩 **나만의 문장 만들기** — `활동` + `때·장소·누구와`를 골라 현재 시제에 맞는 문장을 조합
  - 어색한 조합(장소 중복)은 **맞는지 검사**해 알려주고, 올바른 문장은 **전체 문장 + 한글 번역 + 동사 배지 + 듣기(TTS)** 제공
  - 🎲 무작위 조합 버튼, ⭐로 연습 목록에 담기
- 🎤 **내 문장 연습** — ⭐로 담은 문장(시제 태그 표시)을 마이크로 말하면 **발음 정확도** 측정 (Chrome 권장)
- 📝 **하루 한 장 학습지** — 워드 학습지(`worksheets/past_tense_worksheet.docx`, 학습지 1~3 앞·뒷면)를 **Day 1~6**으로 옮김
  - ① 동사 8~9개를 현재형·과거형 **세 번씩 입력**(자동 채점, 초록 표시) ② 그림 보고 **과거형으로 문장 완성**(힌트·오답 안내) ③ 완성한 문장 **듣기 · 🎙️ 마이크 따라 말하기 · ⭐ 연습 목록 담기**
  - 다 채우면 **완료 도장**(날짜)이 찍히고 다음 Day 를 안내, 진행 상황은 브라우저에 저장. 원본 워드 파일 내려받기 링크 제공
- 활동 그림은 `illustrations.js`의 **직접 그린 SVG 일러스트 32장** — 외부 이미지 요청이 없어 오프라인에서도 항상 보임
- 페이지는 **전체 화면 스크롤** 하나로 내려가며(섹션별 내부 스크롤 없음), 탭 메뉴는 위에 고정
- 단어 클릭 시 **뜻 풍선 + 발음** (과거형 단어는 `go 의 과거형 (불규칙)` 처럼 설명), 말하기 **속도 조절** 슬라이더

브라우저 내장 **Web Speech API**(음성 합성·음성 인식)를 사용합니다.
선택한 문장과 연습 기록은 브라우저(localStorage)에 저장됩니다.

## 사용 방법

`index.html`을 브라우저(크롬 권장)에서 열면 됩니다. 별도 설치가 필요 없습니다.

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 화면 구조(시제 스위치·탭·섹션) |
| `style.css`  | 디자인·가을 테마 |
| `worksheet.js` | 하루 한 장 학습지 데이터 (Day 1~6 동사·문장) |
| `worksheets/past_tense_worksheet.docx` | 원본 워드 학습지 |
| `illustrations.js` | 활동별 SVG 일러스트 (인라인, 외부 이미지 없음) |
| `data.js`    | 활동 32개(`{원형\|과거형}` 템플릿, 규칙/불규칙 정보)·때/장소/누구와·단어 뜻 데이터 |
| `app.js`     | 시제 전환·문장 생성·동사 변화표·음성·문장 만들기·연습 채점 로직 |

## 데이터 형식 (data.js)

```js
{ cat: "active", emoji: "🏀", verb: ["play", "played"], regular: true, rule: "ed", place: false,
  base: "{play|played} basketball",            ko:    "나는 농구를 {했어|해|할 거야}.",
  mid:  "{play|played} basketball with my friends", koMid: "...",
  adv:  "{play|played} basketball and {win|won} the game", koAdv: "..." }
```

- 영어 템플릿 `{원형|과거형}` → 과거는 `I + 과거형`, 현재는 `I + 원형`, 미래는 `I'll + 원형`
- 한글 템플릿 `{과거|현재|미래}`
