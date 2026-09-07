# 🍂 하루 한 장 · 과거형 말하기 (워크시트 + 웹 앱 연계)

5학년 영어 **7단원 과거형** 학습용 웹앱입니다.
워드 학습지(`worksheets/past_tense_worksheet.docx`, 학습지 1~3 앞·뒷면)에 **손으로 쓰고**,
이 앱에서 같은 단어와 문장을 **듣고 마이크로 따라 말하는** 구조입니다. **타이핑은 전혀 없습니다.**

## 하루 한 장 흐름 (Day 1 ~ 6)

| Day | 워크시트 | 종류 | 단어 |
|-----|---------|------|------|
| 1 | 학습지 1 · 앞면 | ✅ 규칙 | join, watch, visit, learn, play, pick, bake, hug |
| 2 | 학습지 1 · 뒷면 | 🔀 불규칙 | have, come, get, run, sit, stand, go, do, make |
| 3 | 학습지 2 · 앞면 | ✅ 규칙 | walk, talk, help, wash, clean, cook, open, close |
| 4 | 학습지 2 · 뒷면 | 🔀 불규칙 | see, sleep, drink, eat, sing, give, take, say, read |
| 5 | 학습지 3 · 앞면 | ✅ 규칙 | look, listen, want, like, use, dance, study, stop |
| 6 | 학습지 3 · 뒷면 | 🔀 불규칙 | teach, grow, swim, buy, ride, write, draw, meet, put |

각 Day 는 **한 줄에 단어와 문장이 함께** 있습니다.

| 단어 | 그림 | 문장 |
|------|------|------|
| `join → joined` (누르면 발음) · 뜻 · 🔊 둘 다 듣기 | 학습지 그림 | `I joined the soccer club.` · 한글 뜻 · 🔊 듣기 · 🎙️ 말하기(정확도 %) |

모든 문장을 45% 이상으로 말하면 **🍁 완료 도장**(날짜)이 찍히고 다음 Day 를 안내합니다.
앱을 열면 아직 안 끝낸 첫 Day 가 "📌 오늘 할 장"으로 자동 선택됩니다.

## 📘 교과서 주요 표현 (반드시 포함)

`I played basketball.` · `I visited my grandmother.` · `I picked watermelons.` ·
`I made cookies.` · `I swam in the sea.` · `I went to a festival.`

- 상단 **📘 교과서** 탭에 6문장을 모아 두었고,
- 각 문장은 동사가 나오는 Day(1 · 2 · 6)의 문장 말하기에도 📘 배지와 함께 다시 나옵니다.

## 기타

- 그림: `img/` 폴더의 **그림 51장**(학습지 카툰 21장 + 추가 PNG 13장 + `img/supplementary/` WebP 17장)을 문장마다 사용. 그림을 못 불러오면 `img/과거형.png` 같은 이름의 파일을 자동으로 찾고, 그래도 없으면 생성 이미지 → `illustrations.js`의 SVG 로 대체
- **그림을 새로 올리거나 바꿨는데 화면에 안 보이면**: `worksheet.js`의 `ASSET_VERSION` 값을 바꾸고 `index.html`의 `?v=` 태그도 같은 값으로 맞추면 브라우저 캐시를 건너뛰고 새 그림이 나옵니다. (`node tools/check-images.js` 로 연결 상태 점검)
- 단어를 누르면 **뜻 풍선 + 발음** (과거형은 `go 의 과거형 (불규칙)` 처럼 설명)
- 말하기 속도 슬라이더, 질문(`What did you do this summer? / yesterday?`) 듣기
- 진행 기록은 브라우저(localStorage)에 저장. 마이크 채점은 **Chrome** 권장(지원 안 되는 브라우저는 듣기만으로 완료 처리)

## 사용 방법

`index.html`을 브라우저(크롬 권장)에서 열면 됩니다. 별도 설치가 필요 없습니다.

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 화면 뼈대 (헤더 · Day 선택 · 학습지 영역) |
| `style.css` | 가을 테마 디자인 |
| `worksheet.js` | Day 1~6 단어·문장 데이터, 교과서 표현, 단어 뜻 사전 |
| `img/*.png`, `img/supplementary/*.webp` | 문장 그림 51장 (파일 이름 = 과거형) |
| `tools/check-images.js` | img 폴더 그림과 `worksheet.js` 연결 상태 점검 |
| `illustrations.js` | 이미지를 못 불러올 때 쓰는 SVG 대체 그림 |
| `app.js` | 음성 출력·인식, 카드 렌더링, 진행 저장·도장 |
| `worksheets/past_tense_worksheet.docx` | 원본 워드 학습지 |
