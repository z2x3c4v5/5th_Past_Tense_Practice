/* =========================================================
 * 📝 하루 한 장 · 과거형 말하기 데이터
 * - 워드 학습지 "5학년 · 7단원 ENGLISH WORKSHEET" (학습지 1~3, 앞/뒷면)
 *   → 하루 한 면 (Day 1 ~ Day 6)
 * - 한 줄 = 단어 한 개 :  [뜻, 현재형, 과거형, 문장, 문장 뜻, 옵션]
 *     옵션.img      : 학습지에 들어 있던 그림 (img/*.png)
 *     옵션.prompt   : 학습지 그림이 없는 문장 → 같은 카툰 스타일로 그림 생성
 *     옵션.art      : 그림을 못 불러올 때 대신 보여줄 SVG (illustrations.js)
 *     옵션.textbook : 📘 교과서 주요 표현
 * - 교과서 주요 표현 6개는 모두 포함:
 *   played basketball · visited my grandmother · picked watermelons ·
 *   made cookies · swam in the sea · went to a festival
 * ========================================================= */

const QUESTION = { en: "What did you do this summer?", en2: "What did you do yesterday?", ko: "여름방학에 / 어제 무엇을 했니?" };

/* 학습지 그림이 없는 문장은 이 스타일로 그림을 만들어요 */
const IMAGE_STYLE = "cute children's book cartoon illustration, flat pastel colors, soft outlines, happy Korean elementary school kid, simple background, no text";

function row(ko, base, past, en, koS, opt) {
  return Object.assign({ ko, base, past, en, koS }, opt || {});
}

const WORKSHEET_DAYS = [
  {
    day: 1, sheet: "학습지 1 · 앞면", kind: "regular",
    title: "규칙형: 현재 → 과거", subtitle: "지난 일을 말할 때, 동사의 끝부분을 규칙에 따라 바꾸어요.",
    rules: [
      { label: "대부분은 -ed", ex: ["play", "played"] },
      { label: "e로 끝나면 -d", ex: ["bake", "baked"] },
      { label: "hug는 g를 한 번 더!", ex: ["hug", "hugged"] },
    ],
    rows: [
      row("참가하다", "join", "joined", "I joined the soccer club.", "나는 축구 클럽에 가입했어.", { prompt: "a boy joining a soccer club, kids in soccer uniforms waving", art: "soccer" }),
      row("보다", "watch", "watched", "I watched a movie.", "나는 영화를 봤어.", { prompt: "a kid watching a movie with popcorn on a sofa", art: "movies" }),
      row("방문하다", "visit", "visited", "I visited my grandmother.", "나는 할머니를 찾아뵀어.", { prompt: "a kid visiting grandmother at her house, grandmother smiling at the door", art: "grandmother", textbook: true }),
      row("배우다", "learn", "learned", "I learned taekwondo.", "나는 태권도를 배웠어.", { prompt: "a kid in white taekwondo uniform kicking", art: "taekwondo" }),
      row("놀다 / 경기하다", "play", "played", "I played basketball.", "나는 농구를 했어.", { img: "img/played.png", art: "basketball", textbook: true }),
      row("따다 / 수확하다", "pick", "picked", "I picked watermelons.", "나는 수박을 땄어.", { img: "img/picked.png", art: "watermelon", textbook: true }),
      row("(빵·과자를) 굽다", "bake", "baked", "I baked cookies.", "나는 쿠키를 구웠어.", { img: "img/baked.png", art: "cookies" }),
      row("껴안다", "hug", "hugged", "I hugged my grandma.", "나는 할머니를 껴안았어.", { img: "img/hugged.png", art: "hug" }),
    ],
  },
  {
    day: 2, sheet: "학습지 1 · 뒷면", kind: "irregular",
    title: "불규칙형: 현재 → 과거", subtitle: "-ed만 붙여 만들 수 없어요. 현재형과 과거형을 한 쌍으로 익혀요.",
    note: "have → had, come → came처럼 모양이 많이 달라지는 동사도 있어요.",
    rows: [
      row("가지다", "have", "had", "I had a sleepover.", "나는 친구 집에서 자고 놀았어.", { prompt: "two kids having a sleepover with pillows and blankets at night", art: "sleepover" }),
      row("오다", "come", "came", "I came to school.", "나는 학교에 왔어.", { img: "img/came.png", art: "school" }),
      row("얻다 / 받다", "get", "got", "I got a present.", "나는 선물을 받았어.", { prompt: "a happy kid holding a wrapped gift box with a ribbon", art: "present" }),
      row("달리다", "run", "ran", "I ran fast.", "나는 빨리 달렸어.", { img: "img/ran.png", art: "runpark" }),
      row("앉다", "sit", "sat", "I sat on the chair.", "나는 의자에 앉았어.", { img: "img/sat.png", art: "chair" }),
      row("서다", "stand", "stood", "I stood in line.", "나는 줄을 섰어.", { prompt: "kids standing in a line at school waiting", art: "school" }),
      row("가다", "go", "went", "I went to a festival.", "나는 축제에 갔어.", { prompt: "a kid at a colorful festival with lanterns and balloons", art: "festival", textbook: true }),
      row("하다", "do", "did", "I did my homework.", "나는 숙제를 했어.", { prompt: "a kid doing homework at a desk with a pencil", art: "homework" }),
      row("만들다", "make", "made", "I made cookies.", "나는 쿠키를 만들었어.", { prompt: "a kid making cookies in a kitchen with dough and a tray", art: "cookies", textbook: true }),
    ],
  },
  {
    day: 3, sheet: "학습지 2 · 앞면", kind: "regular",
    title: "규칙형: 현재 → 과거", subtitle: "지난 일을 말할 때, 동사의 끝부분을 규칙에 따라 바꾸어요.",
    rules: [
      { label: "대부분은 -ed", ex: ["walk", "walked"] },
      { label: "e로 끝나면 -d", ex: ["close", "closed"] },
      { label: "stop은 p를 한 번 더!", ex: ["stop", "stopped"] },
    ],
    rows: [
      row("걷다", "walk", "walked", "I walked in the park.", "나는 공원에서 걸었어.", { img: "img/walked.png", art: "runpark" }),
      row("말하다", "talk", "talked", "I talked with my friend.", "나는 친구와 이야기했어.", { img: "img/talked.png", art: "talk" }),
      row("돕다", "help", "helped", "I helped my mom.", "나는 엄마를 도왔어.", { prompt: "a kid helping mom wash dishes in the kitchen", art: "help" }),
      row("씻다", "wash", "washed", "I washed my hands.", "나는 손을 씻었어.", { img: "img/washed.png", art: "wash" }),
      row("청소하다", "clean", "cleaned", "I cleaned my room.", "나는 내 방을 청소했어.", { prompt: "a kid cleaning a bedroom with a broom", art: "clean" }),
      row("요리하다", "cook", "cooked", "I cooked ramyeon.", "나는 라면을 끓였어.", { prompt: "a kid cooking ramyeon noodles in a pot on the stove", art: "ramyeon" }),
      row("열다", "open", "opened", "I opened the door.", "나는 문을 열었어.", { img: "img/opened.png", art: "door" }),
      row("닫다", "close", "closed", "I closed the window.", "나는 창문을 닫았어.", { prompt: "a kid closing a window in a bedroom", art: "window" }),
    ],
  },
  {
    day: 4, sheet: "학습지 2 · 뒷면", kind: "irregular",
    title: "불규칙형: 현재 → 과거", subtitle: "-ed만 붙여 만들 수 없어요. 현재형과 과거형을 한 쌍으로 익혀요.",
    note: "read → read: 철자는 같지만, 현재형과 과거형의 소리가 달라요. (현재 '리드', 과거 '레드')",
    rows: [
      row("보다", "see", "saw", "I saw fireworks.", "나는 불꽃놀이를 봤어.", { prompt: "a kid watching colorful fireworks in the night sky", art: "fireworks" }),
      row("자다", "sleep", "slept", "I slept well.", "나는 잘 잤어.", { prompt: "a kid sleeping peacefully in bed with a teddy bear, moon outside", art: "sleepover" }),
      row("마시다", "drink", "drank", "I drank milk.", "나는 우유를 마셨어.", { img: "img/drank.png", art: "milk" }),
      row("먹다", "eat", "ate", "I ate lunch.", "나는 점심을 먹었어.", { img: "img/ate.png", art: "lunch" }),
      row("노래하다", "sing", "sang", "I sang a song.", "나는 노래를 불렀어.", { prompt: "a kid singing with a microphone, music notes around", art: "singing" }),
      row("주다", "give", "gave", "I gave a gift to my friend.", "나는 친구에게 선물을 줬어.", { prompt: "a kid giving a gift box to a friend", art: "present" }),
      row("가져가다", "take", "took", "I took a photo.", "나는 사진을 찍었어.", { prompt: "a kid taking a photo with a camera", art: "photobooth" }),
      row("말하다", "say", "said", "I said hello.", "나는 안녕이라고 말했어.", { prompt: "a kid waving and saying hello with a speech bubble", art: "talk" }),
      row("읽다", "read", "read", "I read a book.", "나는 책을 읽었어.", { img: "img/read.png", art: "books" }),
    ],
  },
  {
    day: 5, sheet: "학습지 3 · 앞면", kind: "regular",
    title: "규칙형: 현재 → 과거", subtitle: "지난 일을 말할 때, 동사의 끝부분을 규칙에 따라 바꾸어요.",
    rules: [
      { label: "대부분은 -ed", ex: ["look", "looked"] },
      { label: "자음 + y: y를 i로 바꾸고 -ed", ex: ["study", "studied"] },
      { label: "stop은 p를 한 번 더!", ex: ["stop", "stopped"] },
    ],
    rows: [
      row("보다", "look", "looked", "I looked at the stars.", "나는 별을 바라봤어.", { prompt: "a kid looking up at a starry night sky", art: "camping" }),
      row("듣다", "listen", "listened", "I listened to music.", "나는 음악을 들었어.", { img: "img/listened.png", art: "music" }),
      row("원하다", "want", "wanted", "I wanted ice cream.", "나는 아이스크림을 원했어.", { prompt: "a kid looking at an ice cream cone with sparkling eyes", art: "bingsu" }),
      row("좋아하다", "like", "liked", "I liked the movie.", "나는 그 영화가 좋았어.", { prompt: "a kid smiling with a thumbs up in front of a movie screen", art: "movies" }),
      row("사용하다", "use", "used", "I used a computer.", "나는 컴퓨터를 사용했어.", { prompt: "a kid using a computer at a desk", art: "computer" }),
      row("춤추다", "dance", "danced", "I danced.", "나는 춤을 췄어.", { img: "img/danced.png", art: "kpop" }),
      row("공부하다", "study", "studied", "I studied English.", "나는 영어를 공부했어.", { img: "img/studied.png", art: "study" }),
      row("멈추다", "stop", "stopped", "I stopped the bicycle.", "나는 자전거를 멈췄어.", { img: "img/stopped.png", art: "bike" }),
    ],
  },
  {
    day: 6, sheet: "학습지 3 · 뒷면", kind: "irregular",
    title: "불규칙형: 현재 → 과거", subtitle: "-ed만 붙여 만들 수 없어요. 현재형과 과거형을 한 쌍으로 익혀요.",
    note: "put → put처럼 현재형과 과거형의 철자가 같은 동사도 있어요.",
    rows: [
      row("가르치다", "teach", "taught", "I taught my dog a trick.", "나는 강아지에게 재주를 가르쳤어.", { prompt: "a kid teaching a puppy to sit, holding a treat", art: "help" }),
      row("기르다", "grow", "grew", "I grew tomatoes.", "나는 토마토를 길렀어.", { prompt: "a kid watering tomato plants in a garden", art: "tomatoes" }),
      row("수영하다", "swim", "swam", "I swam in the sea.", "나는 바다에서 수영했어.", { img: "img/swam.png", art: "sea", textbook: true }),
      row("사다", "buy", "bought", "I bought fruit.", "나는 과일을 샀어.", { img: "img/bought.png", art: "fruit" }),
      row("타다", "ride", "rode", "I rode a bike.", "나는 자전거를 탔어.", { prompt: "a kid riding a bicycle on a park road in autumn", art: "bike" }),
      row("쓰다", "write", "wrote", "I wrote a letter.", "나는 편지를 썼어.", { img: "img/wrote.png", art: "letter" }),
      row("그리다", "draw", "drew", "I drew a picture.", "나는 그림을 그렸어.", { prompt: "a kid drawing a picture with crayons on paper", art: "paint" }),
      row("만나다", "meet", "met", "I met my friend.", "나는 친구를 만났어.", { prompt: "two kids meeting and waving at each other in a park", art: "talk" }),
      row("놓다", "put", "put", "I put on my hat.", "나는 모자를 썼어.", { prompt: "a kid putting on a cap", art: "door" }),
    ],
  },
];

/* 📘 교과서 주요 표현 6개 (해당 Day 의 줄을 그대로 모음) */
const TEXTBOOK = WORKSHEET_DAYS.flatMap(s => s.rows.filter(r => r.textbook).map(r => Object.assign({ day: s.day, kind: s.kind }, r)));

/* ===== 단어 뜻 사전 (단어 풍선용) ===== */
function wordKey(w) {
  return w.toLowerCase().replace(/^[^a-z']+/, "").replace(/[^a-z']+$/, "");
}

const WORD_MEANINGS = {
  "i": "나는", "did": "do 의 과거형 (불규칙) — ~했다", "what": "무엇", "you": "너", "this": "이번", "summer": "여름", "yesterday": "어제",
  "a": "하나의", "an": "하나의", "the": "그", "to": "~에, ~으로", "in": "~안에, ~에서", "at": "~에, ~을", "on": "~위에", "with": "~와 함께", "my": "나의",
  /* Day 1 */
  "join": "참가하다, 가입하다", "joined": "join 의 과거형 (규칙 -ed) — 가입했다",
  "watch": "보다", "watched": "watch 의 과거형 (규칙 -ed) — 봤다",
  "visit": "방문하다, 찾아뵙다", "visited": "visit 의 과거형 (규칙 -ed) — 방문했다",
  "learn": "배우다", "learned": "learn 의 과거형 (규칙 -ed) — 배웠다",
  "play": "(운동·게임을) 하다, 놀다", "played": "play 의 과거형 (규칙 -ed) — 했다, 놀았다",
  "pick": "따다, 수확하다", "picked": "pick 의 과거형 (규칙 -ed) — 땄다",
  "bake": "(빵·과자를) 굽다", "baked": "bake 의 과거형 (규칙 -d) — 구웠다",
  "hug": "껴안다", "hugged": "hug 의 과거형 (규칙, g 한 번 더 + ed) — 껴안았다",
  "soccer": "축구", "club": "클럽, 동아리", "movie": "영화", "grandmother": "할머니", "grandma": "할머니", "taekwondo": "태권도", "basketball": "농구", "watermelons": "수박 (여러 개)", "cookies": "쿠키",
  /* Day 2 */
  "have": "가지다", "had": "have 의 과거형 (불규칙) — 가졌다",
  "come": "오다", "came": "come 의 과거형 (불규칙) — 왔다",
  "get": "얻다, 받다", "got": "get 의 과거형 (불규칙) — 받았다",
  "run": "달리다", "ran": "run 의 과거형 (불규칙) — 달렸다",
  "sit": "앉다", "sat": "sit 의 과거형 (불규칙) — 앉았다",
  "stand": "서다", "stood": "stand 의 과거형 (불규칙) — 섰다",
  "go": "가다", "went": "go 의 과거형 (불규칙) — 갔다",
  "do": "하다",
  "make": "만들다", "made": "make 의 과거형 (불규칙) — 만들었다",
  "sleepover": "친구 집에서 자고 노는 것", "school": "학교", "present": "선물", "fast": "빨리", "chair": "의자", "line": "줄", "festival": "축제", "homework": "숙제",
  /* Day 3 */
  "walk": "걷다", "walked": "walk 의 과거형 (규칙 -ed) — 걸었다",
  "talk": "말하다, 이야기하다", "talked": "talk 의 과거형 (규칙 -ed) — 이야기했다",
  "help": "돕다", "helped": "help 의 과거형 (규칙 -ed) — 도왔다",
  "wash": "씻다", "washed": "wash 의 과거형 (규칙 -ed) — 씻었다",
  "clean": "청소하다", "cleaned": "clean 의 과거형 (규칙 -ed) — 청소했다",
  "cook": "요리하다, 끓이다", "cooked": "cook 의 과거형 (규칙 -ed) — 요리했다",
  "open": "열다", "opened": "open 의 과거형 (규칙 -ed) — 열었다",
  "close": "닫다", "closed": "close 의 과거형 (규칙 -d) — 닫았다",
  "park": "공원", "friend": "친구", "mom": "엄마", "hands": "손 (두 손)", "room": "방", "ramyeon": "라면", "door": "문", "window": "창문",
  /* Day 4 */
  "see": "보다", "saw": "see 의 과거형 (불규칙) — 봤다",
  "sleep": "자다", "slept": "sleep 의 과거형 (불규칙) — 잤다",
  "drink": "마시다", "drank": "drink 의 과거형 (불규칙) — 마셨다",
  "eat": "먹다", "ate": "eat 의 과거형 (불규칙) — 먹었다",
  "sing": "노래하다", "sang": "sing 의 과거형 (불규칙) — 노래했다",
  "give": "주다", "gave": "give 의 과거형 (불규칙) — 줬다",
  "take": "가져가다, (사진을) 찍다", "took": "take 의 과거형 (불규칙) — 찍었다, 가져갔다",
  "say": "말하다", "said": "say 의 과거형 (불규칙) — 말했다",
  "read": "읽다 (과거형도 read — 소리는 '레드')",
  "fireworks": "불꽃놀이", "well": "잘", "milk": "우유", "lunch": "점심", "song": "노래", "gift": "선물", "photo": "사진", "hello": "안녕", "book": "책",
  /* Day 5 */
  "look": "보다", "looked": "look 의 과거형 (규칙 -ed) — 봤다",
  "listen": "듣다", "listened": "listen 의 과거형 (규칙 -ed) — 들었다",
  "want": "원하다", "wanted": "want 의 과거형 (규칙 -ed) — 원했다",
  "like": "좋아하다", "liked": "like 의 과거형 (규칙 -d) — 좋아했다",
  "use": "사용하다", "used": "use 의 과거형 (규칙 -d) — 사용했다",
  "dance": "춤추다", "danced": "dance 의 과거형 (규칙 -d) — 춤췄다",
  "study": "공부하다", "studied": "study 의 과거형 (규칙, y → ied) — 공부했다",
  "stop": "멈추다", "stopped": "stop 의 과거형 (규칙, p 한 번 더 + ed) — 멈췄다",
  "stars": "별들", "music": "음악", "ice": "얼음 (ice cream: 아이스크림)", "cream": "크림 (ice cream: 아이스크림)", "computer": "컴퓨터", "english": "영어", "bicycle": "자전거",
  /* Day 6 */
  "teach": "가르치다", "taught": "teach 의 과거형 (불규칙) — 가르쳤다",
  "grow": "기르다", "grew": "grow 의 과거형 (불규칙) — 길렀다",
  "swim": "수영하다", "swam": "swim 의 과거형 (불규칙) — 수영했다",
  "buy": "사다", "bought": "buy 의 과거형 (불규칙) — 샀다",
  "ride": "타다", "rode": "ride 의 과거형 (불규칙) — 탔다",
  "write": "쓰다", "wrote": "write 의 과거형 (불규칙) — 썼다",
  "draw": "그리다", "drew": "draw 의 과거형 (불규칙) — 그렸다",
  "meet": "만나다", "met": "meet 의 과거형 (불규칙) — 만났다",
  "put": "놓다, (put on) 입다·쓰다 (과거형도 put)",
  "dog": "강아지", "trick": "재주, 묘기", "tomatoes": "토마토 (여러 개)", "sea": "바다", "fruit": "과일", "bike": "자전거", "letter": "편지", "picture": "그림", "hat": "모자",
};
