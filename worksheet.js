/* =========================================================
 * 📝 하루 한 장 · 과거형 말하기 데이터
 * - 워드 학습지 "5학년 · 7단원 ENGLISH WORKSHEET" (학습지 1~3, 앞/뒷면) 를
 *   하루 한 면(Day 1 ~ Day 6) 으로 옮긴 것
 * - verbs : [뜻, 현재형, 과거형]           → 듣고 따라 말하기
 * - talk  : 그 동사로 만든 짧은 과거 문장    → 듣고 따라 말하기
 *           { en, ko, verb, art, textbook:true → 📘 교과서 표현 }
 * - 교과서 주요 표현 6개는 동사가 나오는 Day 에 넣고 📘 로 표시
 *   played basketball · visited my grandmother · picked watermelons ·
 *   made cookies · swam in the sea · went to a festival
 * ========================================================= */

const QUESTION = { en: "What did you do this summer?", en2: "What did you do yesterday?", ko: "여름방학에 / 어제 무엇을 했니?" };

/* 📘 교과서 주요 표현 (한눈에 보기 + 말하기) */
const TEXTBOOK = [
  { en: "I played basketball.",     ko: "나는 농구를 했어.",         verb: ["play", "played"],   regular: true,  art: "basketball",  day: 1 },
  { en: "I visited my grandmother.", ko: "나는 할머니를 찾아뵀어.",   verb: ["visit", "visited"], regular: true,  art: "grandmother", day: 1 },
  { en: "I picked watermelons.",    ko: "나는 수박을 땄어.",         verb: ["pick", "picked"],   regular: true,  art: "watermelon",  day: 1 },
  { en: "I made cookies.",          ko: "나는 쿠키를 만들었어.",     verb: ["make", "made"],     regular: false, art: "cookies",     day: 2 },
  { en: "I swam in the sea.",       ko: "나는 바다에서 수영했어.",   verb: ["swim", "swam"],     regular: false, art: "sea",         day: 6 },
  { en: "I went to a festival.",    ko: "나는 축제에 갔어.",         verb: ["go", "went"],       regular: false, art: "festival",    day: 2 },
];

const WORKSHEET_DAYS = [
  {
    day: 1, sheet: "학습지 1 · 앞면", kind: "regular",
    title: "규칙형: 현재 → 과거", subtitle: "지난 일을 말할 때, 동사의 끝부분을 규칙에 따라 바꾸어요.",
    rules: [
      { label: "대부분은 -ed", ex: ["play", "played"] },
      { label: "e로 끝나면 -d", ex: ["bake", "baked"] },
      { label: "hug는 g를 한 번 더!", ex: ["hug", "hugged"] },
    ],
    verbs: [
      ["참가하다", "join", "joined"],
      ["보다", "watch", "watched"],
      ["방문하다", "visit", "visited"],
      ["배우다", "learn", "learned"],
      ["놀다 / 경기하다", "play", "played"],
      ["따다 / 수확하다", "pick", "picked"],
      ["(빵·과자를) 굽다", "bake", "baked"],
      ["껴안다", "hug", "hugged"],
    ],
    talk: [
      { en: "I played basketball.",      ko: "나는 농구를 했어.",       verb: ["play", "played"],   art: "basketball",  textbook: true },
      { en: "I picked watermelons.",     ko: "나는 수박을 땄어.",       verb: ["pick", "picked"],   art: "watermelon",  textbook: true },
      { en: "I visited my grandmother.", ko: "나는 할머니를 찾아뵀어.", verb: ["visit", "visited"], art: "grandmother", textbook: true },
      { en: "I baked cookies.",          ko: "나는 쿠키를 구웠어.",     verb: ["bake", "baked"],    art: "cookies" },
      { en: "I hugged my grandma.",      ko: "나는 할머니를 껴안았어.", verb: ["hug", "hugged"],    art: "hug" },
      { en: "I joined a camp.",          ko: "나는 캠프에 참가했어.",   verb: ["join", "joined"],   art: "camping" },
      { en: "I watched a movie.",        ko: "나는 영화를 봤어.",       verb: ["watch", "watched"], art: "movies" },
      { en: "I learned taekwondo.",      ko: "나는 태권도를 배웠어.",   verb: ["learn", "learned"], art: "taekwondo" },
    ],
  },
  {
    day: 2, sheet: "학습지 1 · 뒷면", kind: "irregular",
    title: "불규칙형: 현재 → 과거", subtitle: "-ed만 붙여 만들 수 없어요. 현재형과 과거형을 한 쌍으로 익혀요.",
    note: "have → had, come → came처럼 모양이 많이 달라지는 동사도 있어요.",
    verbs: [
      ["가지다", "have", "had"],
      ["오다", "come", "came"],
      ["얻다 / 받다", "get", "got"],
      ["달리다", "run", "ran"],
      ["앉다", "sit", "sat"],
      ["서다", "stand", "stood"],
      ["가다", "go", "went"],
      ["하다", "do", "did"],
      ["만들다", "make", "made"],
    ],
    talk: [
      { en: "I made cookies.",        ko: "나는 쿠키를 만들었어.",   verb: ["make", "made"],   art: "cookies",  textbook: true },
      { en: "I went to a festival.",  ko: "나는 축제에 갔어.",       verb: ["go", "went"],     art: "festival", textbook: true },
      { en: "I came to school.",      ko: "나는 학교에 왔어.",       verb: ["come", "came"],   art: "school" },
      { en: "I sat on the chair.",    ko: "나는 의자에 앉았어.",     verb: ["sit", "sat"],     art: "chair" },
      { en: "I ran fast.",            ko: "나는 빨리 달렸어.",       verb: ["run", "ran"],     art: "runpark" },
      { en: "I had a sleepover.",     ko: "나는 친구 집에서 잤어.", verb: ["have", "had"],    art: "sleepover" },
      { en: "I got a present.",       ko: "나는 선물을 받았어.",     verb: ["get", "got"],     art: "present" },
      { en: "I did my homework.",     ko: "나는 숙제를 했어.",       verb: ["do", "did"],      art: "homework" },
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
    verbs: [
      ["걷다", "walk", "walked"],
      ["말하다", "talk", "talked"],
      ["돕다", "help", "helped"],
      ["씻다", "wash", "washed"],
      ["청소하다", "clean", "cleaned"],
      ["요리하다", "cook", "cooked"],
      ["열다", "open", "opened"],
      ["닫다", "close", "closed"],
    ],
    talk: [
      { en: "I walked in the park.",    ko: "나는 공원에서 걸었어.",   verb: ["walk", "walked"],   art: "runpark" },
      { en: "I talked with my friend.", ko: "나는 친구와 이야기했어.", verb: ["talk", "talked"],   art: "talk" },
      { en: "I washed my hands.",       ko: "나는 손을 씻었어.",       verb: ["wash", "washed"],   art: "wash" },
      { en: "I opened the door.",       ko: "나는 문을 열었어.",       verb: ["open", "opened"],   art: "door" },
      { en: "I helped my mom.",         ko: "나는 엄마를 도왔어.",     verb: ["help", "helped"],   art: "help" },
      { en: "I cleaned my room.",       ko: "나는 내 방을 청소했어.", verb: ["clean", "cleaned"], art: "clean" },
      { en: "I cooked ramyeon.",        ko: "나는 라면을 끓였어.",     verb: ["cook", "cooked"],   art: "ramyeon" },
      { en: "I closed the window.",     ko: "나는 창문을 닫았어.",     verb: ["close", "closed"],  art: "window" },
    ],
  },
  {
    day: 4, sheet: "학습지 2 · 뒷면", kind: "irregular",
    title: "불규칙형: 현재 → 과거", subtitle: "-ed만 붙여 만들 수 없어요. 현재형과 과거형을 한 쌍으로 익혀요.",
    note: "read → read: 철자는 같지만, 현재형과 과거형의 소리가 달라요. (현재 '리드', 과거 '레드')",
    verbs: [
      ["보다", "see", "saw"],
      ["자다", "sleep", "slept"],
      ["마시다", "drink", "drank"],
      ["먹다", "eat", "ate"],
      ["노래하다", "sing", "sang"],
      ["주다", "give", "gave"],
      ["가져가다", "take", "took"],
      ["말하다", "say", "said"],
      ["읽다", "read", "read"],
    ],
    talk: [
      { en: "I drank milk.",        ko: "나는 우유를 마셨어.",     verb: ["drink", "drank"], art: "milk" },
      { en: "I ate lunch.",         ko: "나는 점심을 먹었어.",     verb: ["eat", "ate"],     art: "lunch" },
      { en: "I read a book.",       ko: "나는 책을 읽었어.",       verb: ["read", "read"],   art: "books" },
      { en: "I saw fireworks.",     ko: "나는 불꽃놀이를 봤어.",   verb: ["see", "saw"],     art: "fireworks" },
      { en: "I sang a song.",       ko: "나는 노래를 불렀어.",     verb: ["sing", "sang"],   art: "singing" },
      { en: "I took a photo.",      ko: "나는 사진을 찍었어.",     verb: ["take", "took"],   art: "photobooth" },
      { en: "I slept well.",        ko: "나는 잘 잤어.",           verb: ["sleep", "slept"], art: "sleepover" },
      { en: "I said hello.",        ko: "나는 안녕이라고 말했어.", verb: ["say", "said"],    art: "talk" },
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
    verbs: [
      ["보다", "look", "looked"],
      ["듣다", "listen", "listened"],
      ["원하다", "want", "wanted"],
      ["좋아하다", "like", "liked"],
      ["사용하다", "use", "used"],
      ["춤추다", "dance", "danced"],
      ["공부하다", "study", "studied"],
      ["멈추다", "stop", "stopped"],
    ],
    talk: [
      { en: "I listened to music.",    ko: "나는 음악을 들었어.",       verb: ["listen", "listened"], art: "music" },
      { en: "I danced.",               ko: "나는 춤을 췄어.",           verb: ["dance", "danced"],    art: "kpop" },
      { en: "I studied English.",      ko: "나는 영어를 공부했어.",     verb: ["study", "studied"],   art: "study" },
      { en: "I stopped the bicycle.",  ko: "나는 자전거를 멈췄어.",     verb: ["stop", "stopped"],    art: "bike" },
      { en: "I looked at the stars.",  ko: "나는 별을 바라봤어.",       verb: ["look", "looked"],     art: "camping" },
      { en: "I liked the movie.",      ko: "나는 그 영화가 좋았어.",    verb: ["like", "liked"],      art: "movies" },
      { en: "I used a computer.",      ko: "나는 컴퓨터를 사용했어.",   verb: ["use", "used"],        art: "computer" },
    ],
  },
  {
    day: 6, sheet: "학습지 3 · 뒷면", kind: "irregular",
    title: "불규칙형: 현재 → 과거", subtitle: "-ed만 붙여 만들 수 없어요. 현재형과 과거형을 한 쌍으로 익혀요.",
    note: "put → put처럼 현재형과 과거형의 철자가 같은 동사도 있어요.",
    verbs: [
      ["가르치다", "teach", "taught"],
      ["기르다", "grow", "grew"],
      ["수영하다", "swim", "swam"],
      ["사다", "buy", "bought"],
      ["타다", "ride", "rode"],
      ["쓰다", "write", "wrote"],
      ["그리다", "draw", "drew"],
      ["만나다", "meet", "met"],
      ["놓다", "put", "put"],
    ],
    talk: [
      { en: "I swam in the sea.",      ko: "나는 바다에서 수영했어.",   verb: ["swim", "swam"],   art: "sea", textbook: true },
      { en: "I bought fruit.",         ko: "나는 과일을 샀어.",         verb: ["buy", "bought"],  art: "fruit" },
      { en: "I wrote a letter.",       ko: "나는 편지를 썼어.",         verb: ["write", "wrote"], art: "letter" },
      { en: "I rode a bike.",          ko: "나는 자전거를 탔어.",       verb: ["ride", "rode"],   art: "bike" },
      { en: "I grew tomatoes.",        ko: "나는 토마토를 길렀어.",     verb: ["grow", "grew"],   art: "tomatoes" },
      { en: "I drew a picture.",       ko: "나는 그림을 그렸어.",       verb: ["draw", "drew"],   art: "paint" },
      { en: "I met my friend.",        ko: "나는 친구를 만났어.",       verb: ["meet", "met"],    art: "talk" },
    ],
  },
];

/* ===== 단어 뜻 사전 (단어 풍선용) ===== */
function wordKey(w) {
  return w.toLowerCase().replace(/^[^a-z']+/, "").replace(/[^a-z']+$/, "");
}

const WORD_MEANINGS = {
  "i": "나는", "did": "do 의 과거형 (불규칙) — ~했다", "what": "무엇", "you": "너", "this": "이번", "summer": "여름", "yesterday": "어제",
  "a": "하나의", "an": "하나의", "the": "그", "to": "~에, ~으로", "in": "~안에, ~에서", "at": "~에, ~을", "on": "~위에", "with": "~와 함께", "my": "나의",
  /* Day 1 */
  "join": "참가하다", "joined": "join 의 과거형 (규칙 -ed) — 참가했다",
  "watch": "보다", "watched": "watch 의 과거형 (규칙 -ed) — 봤다",
  "visit": "방문하다, 찾아뵙다", "visited": "visit 의 과거형 (규칙 -ed) — 방문했다",
  "learn": "배우다", "learned": "learn 의 과거형 (규칙 -ed) — 배웠다",
  "play": "(운동·게임을) 하다, 놀다", "played": "play 의 과거형 (규칙 -ed) — 했다, 놀았다",
  "pick": "따다, 수확하다", "picked": "pick 의 과거형 (규칙 -ed) — 땄다",
  "bake": "(빵·과자를) 굽다", "baked": "bake 의 과거형 (규칙 -d) — 구웠다",
  "hug": "껴안다", "hugged": "hug 의 과거형 (규칙, g 한 번 더 + ed) — 껴안았다",
  "basketball": "농구", "watermelons": "수박 (여러 개)", "grandmother": "할머니", "grandma": "할머니", "cookies": "쿠키", "camp": "캠프", "movie": "영화", "taekwondo": "태권도",
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
  "festival": "축제", "school": "학교", "chair": "의자", "fast": "빨리", "sleepover": "친구 집에서 자고 노는 것", "present": "선물", "homework": "숙제",
  /* Day 3 */
  "walk": "걷다", "walked": "walk 의 과거형 (규칙 -ed) — 걸었다",
  "talk": "말하다, 이야기하다", "talked": "talk 의 과거형 (규칙 -ed) — 이야기했다",
  "help": "돕다", "helped": "help 의 과거형 (규칙 -ed) — 도왔다",
  "wash": "씻다", "washed": "wash 의 과거형 (규칙 -ed) — 씻었다",
  "clean": "청소하다", "cleaned": "clean 의 과거형 (규칙 -ed) — 청소했다",
  "cook": "요리하다, 끓이다", "cooked": "cook 의 과거형 (규칙 -ed) — 요리했다",
  "open": "열다", "opened": "open 의 과거형 (규칙 -ed) — 열었다",
  "close": "닫다", "closed": "close 의 과거형 (규칙 -d) — 닫았다",
  "park": "공원", "friend": "친구", "hands": "손 (두 손)", "door": "문", "mom": "엄마", "room": "방", "ramyeon": "라면", "window": "창문",
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
  "milk": "우유", "lunch": "점심", "book": "책", "fireworks": "불꽃놀이", "song": "노래", "photo": "사진", "well": "잘", "hello": "안녕",
  /* Day 5 */
  "look": "보다", "looked": "look 의 과거형 (규칙 -ed) — 봤다",
  "listen": "듣다", "listened": "listen 의 과거형 (규칙 -ed) — 들었다",
  "want": "원하다", "wanted": "want 의 과거형 (규칙 -ed) — 원했다",
  "like": "좋아하다", "liked": "like 의 과거형 (규칙 -d) — 좋아했다",
  "use": "사용하다", "used": "use 의 과거형 (규칙 -d) — 사용했다",
  "dance": "춤추다", "danced": "dance 의 과거형 (규칙 -d) — 춤췄다",
  "study": "공부하다", "studied": "study 의 과거형 (규칙, y → ied) — 공부했다",
  "stop": "멈추다", "stopped": "stop 의 과거형 (규칙, p 한 번 더 + ed) — 멈췄다",
  "music": "음악", "english": "영어", "bicycle": "자전거", "stars": "별들", "computer": "컴퓨터",
  /* Day 6 */
  "teach": "가르치다", "taught": "teach 의 과거형 (불규칙) — 가르쳤다",
  "grow": "기르다", "grew": "grow 의 과거형 (불규칙) — 길렀다",
  "swim": "수영하다", "swam": "swim 의 과거형 (불규칙) — 수영했다",
  "buy": "사다", "bought": "buy 의 과거형 (불규칙) — 샀다",
  "ride": "타다", "rode": "ride 의 과거형 (불규칙) — 탔다",
  "write": "쓰다", "wrote": "write 의 과거형 (불규칙) — 썼다",
  "draw": "그리다", "drew": "draw 의 과거형 (불규칙) — 그렸다",
  "meet": "만나다", "met": "meet 의 과거형 (불규칙) — 만났다",
  "put": "놓다 (과거형도 put)",
  "sea": "바다", "fruit": "과일", "letter": "편지", "bike": "자전거", "tomatoes": "토마토 (여러 개)", "picture": "그림",
};
