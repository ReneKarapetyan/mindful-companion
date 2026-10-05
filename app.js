(() => {
  'use strict';

  const QUOTES = window.MC_QUOTES;
  const C = window.MC_CONTENT;
  const MQ = window.MC_MOOD_QUOTES;
  const J = window.MC_JOURNAL;
  const EM = window.MC_EMOTIONS;
  const R = window.MC_REFLECT;
  const W = window.MC_WORK;
  Object.keys(R.ui).forEach((l) => Object.assign(C.ui[l], R.ui[l], W.ui[l]));
  // Պրոֆիլներ. նույն սարքում մի քանի օգտատեր, ամեն մեկի տվյալները՝ առանձին բանալիով։
  const PROFILES_KEY = 'mindful-companion.profiles';
  const LEGACY_KEY = 'mindful-companion.v1';
  const LEGACY_DRAFT_KEY = 'mindful-companion.draft';
  const dataKey = (id) => `mindful-companion.p.${id}`;
  const draftKey = (id) => `mindful-companion.p.${id}.draft`;
  const NAME_MAX = 30;
  const LOCALES = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };
  const EVENING_HOUR = 18;
  const HEAVY_EMOTIONS = ['emptiness', 'burnout', 'shame', 'loneliness'];
  const FORCE_EVENING = new URLSearchParams(location.search).has('evening'); // թեստի համար

  // Mood Meter-ի հերթականություն. հաճելի (բարձր → ցածր էներգիա), հետո տհաճ (բարձր → ցածր)
  const MOOD_ORDER = ['great', 'calm', 'stressed', 'angry', 'sad', 'tired', 'unmotivated'];
  C.moods.sort((a, b) => MOOD_ORDER.indexOf(a.id) - MOOD_ORDER.indexOf(b.id));

  const app = document.getElementById('app');

  // ---------- State ----------
  //
  // Պահվող տվյալների կառուցվածքը (version 3)՝ հարմար դաշբորդի համար.
  // days: {
  //   "YYYY-MM-DD": {
  //     quoteId: 3,                       — օրվա քվոթի ID-ն
  //     mood: "stressed",                 — ընտանիք (C.moods), վերջին ընտրությունը
  //     emotion: "anxiety",               — կոնկրետ էմոցիա (EM.list) կամ null
  //     tags: ["work", "sleep"],          — կոնտեքստի պիտակներ
  //     moodLog: [{ mood, emotion, at }], — բոլոր ընտրությունները՝ ժամով
  //     journal: [{ id, at, mood, emotion, kind, promptId, question, text }]
  //       kind: "guide" | "clarify" | "free" | "evening"
  //     done: { stressed: 2 },            — ավարտված սեսիաներ. տրամադրություն → ուղղորդող հարցի №
  // resetFeedback: { sigh: { y, b, n } } — «Օգնե՞ց» պատասխանները ըստ պրակտիկայի
  // tipFeedback: { "calm.1": 1 | -1 }    — ամփոփման առաջարկի գնահատականը
  // breakEvery: 0 | 45 | 60 | 90         — ընդմիջման հիշեցում (րոպե), 0 = անջատված
  //   }
  // }
  // saved: [{ key, at }] — պահված քվոթեր. key = "d:<id>" (օրվա) կամ "m:<mood>:<index>"
  // reminderTime: "20:00"

  const pad = (n) => String(n).padStart(2, '0');
  const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => dateKey(new Date());
  const parseKey = (k) => {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  function readStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode — app still works for this session */
    }
  }

  function migrate(s) {
    if (!s) return null;
    if (!s.version) {
      s.days = {};
      for (const [date, mood] of Object.entries(s.checkins || {})) {
        s.days[date] = { quoteId: null, mood, moodLog: [{ mood, at: null }], journal: [] };
      }
      delete s.checkins;
      s.moodQuotePos = {};
      s.version = 2;
    }
    if (s.version === 2) {
      for (const d of Object.values(s.days)) {
        d.emotion = d.emotion ?? null;
        d.tags = d.tags ?? [];
      }
      s.saved = [];
      s.reminderTime = '20:00';
      s.version = 3;
    }
    return s;
  }

  const freshState = (lang) => ({
    version: 3, lang, quoteIndex: 0, dayCount: 1, lastDate: null,
    days: {}, moodQuotePos: {}, saved: [], reminderTime: '20:00'
  });

  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // profiles: { active: "<id>" | null, list: [{ id, name, createdAt }] }
  let profiles = readStorage(PROFILES_KEY);
  if (!profiles) {
    profiles = { active: null, list: [] };
    const legacy = readStorage(LEGACY_KEY);
    if (legacy?.lang) {
      // Մինչ պրոֆիլները պահված տվյալները դառնում են առաջին պրոֆիլը (անունը կհարցնենք)
      const id = newId();
      profiles.list.push({ id, name: '', createdAt: new Date().toISOString() });
      profiles.active = id;
      writeStorage(dataKey(id), legacy);
      const legacyDraft = readStorage(LEGACY_DRAFT_KEY);
      if (legacyDraft) writeStorage(draftKey(id), legacyDraft);
      try {
        localStorage.removeItem(LEGACY_KEY);
        localStorage.removeItem(LEGACY_DRAFT_KEY);
      } catch { /* ignore */ }
    }
    writeStorage(PROFILES_KEY, profiles);
  }
  const saveProfiles = () => writeStorage(PROFILES_KEY, profiles);
  const activeProfile = () => profiles.list.find((p) => p.id === profiles.active) || null;

  let state = null;
  const save = () => { if (profiles.active && state) writeStorage(dataKey(profiles.active), state); };

  // UI-ի ժամանակավոր վիճակը (չի պահվում, բացի սևագրերից)
  const ui = {
    view: 'today',
    langMenuOpen: false,
    profileMenuOpen: false,
    onboarding: null, // { step: 'lang' | 'name', lang, rename: bool }
    jMood: null,      // որ տրամադրության հարցերն են ցուցադրվում
    guideIdx: 0,      // ուղղորդող հարցի ինդեքսը
    followIdx: null,  // ճշգրտող հարցի ինդեքսը (null = ցուցադրվում է ուղղորդողը)
    draft: '',
    eveningDraft: '',
    calMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    selectedDate: null,
    quiz: null,       // { step, answers: [] } թեստի ընթացքում
    lastBreak: Date.now(),
    installPrompt: null
  };
  const saveDrafts = () => {
    if (profiles.active) writeStorage(draftKey(profiles.active), { journal: ui.draft, evening: ui.eveningDraft });
  };

  function loadProfile(id) {
    profiles.active = id;
    saveProfiles();
    state = migrate(readStorage(dataKey(id)));
    const drafts = readStorage(draftKey(id)) || {};
    Object.assign(ui, {
      view: 'today', langMenuOpen: false, profileMenuOpen: false, onboarding: null,
      jMood: null, guideIdx: 0, followIdx: null,
      draft: typeof drafts === 'string' ? drafts : drafts.journal || '',
      eveningDraft: drafts.evening || '',
      calMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      selectedDate: todayKey()
    });
    if (state?.lang) syncDay();
    // Անանուն պրոֆիլ (հին տվյալներից) → հարցնել անունը
    if (state?.lang && !activeProfile()?.name) ui.onboarding = { step: 'name', lang: state.lang, rename: true };
  }

  function createProfile(name, lang) {
    const id = newId();
    profiles.list.push({ id, name, createdAt: new Date().toISOString() });
    writeStorage(dataKey(id), freshState(lang));
    loadProfile(id);
  }

  function deleteProfile(id) {
    try {
      localStorage.removeItem(dataKey(id));
      localStorage.removeItem(draftKey(id));
    } catch { /* ignore */ }
    profiles.list = profiles.list.filter((p) => p.id !== id);
    if (profiles.active === id) {
      profiles.active = null;
      state = null;
      if (profiles.list.length) loadProfile(profiles.list[0].id);
    }
    saveProfiles();
  }

  function dayRec(key = todayKey()) {
    if (!state.days[key]) state.days[key] = { quoteId: null, mood: null, emotion: null, tags: [], moodLog: [], journal: [] };
    return state.days[key];
  }
  const today = () => dayRec();

  // Յուրաքանչյուր նոր օր (երբ հավելվածը բացվում է)՝ հաջորդ քվոթը (ID + 1)։
  // Նույն օրը քանի անգամ էլ բացվի, քվոթը չի փոխվում։ Բաց թողած օրերը քվոթ չեն «այրում»։
  function syncDay() {
    const key = todayKey();
    if (!state.lastDate) {
      state.lastDate = key;
      state.quoteIndex = 0;
      state.dayCount = 1;
    } else if (state.lastDate !== key) {
      state.quoteIndex = (state.quoteIndex + 1) % QUOTES.length;
      state.dayCount += 1;
      state.lastDate = key;
      ui.jMood = null;
      ui.selectedDate = key;
    }
    today().quoteId = QUOTES[state.quoteIndex].id;
    save();
  }

  const curLang = () => state?.lang || ui.onboarding?.lang || 'hy';
  const t = (key, vars = {}) =>
    C.ui[curLang()][key].replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  const initial = (name) => (Array.from(name.trim())[0] || '•').toUpperCase();

  function greeting() {
    const name = activeProfile()?.name;
    if (!name) return '';
    const h = new Date().getHours();
    return t(h < 12 ? 'greetMorning' : h < EVENING_HOUR ? 'greetDay' : 'greetEvening', { name });
  }

  // Sky of the current hour: the one illustration the app is built around.
  function skyPhase(h = new Date().getHours()) {
    if (h >= 5 && h < 9) return 'dawn';
    if (h >= 9 && h < 17) return 'day';
    if (h >= 17 && h < 20) return 'dusk';
    return 'night';
  }

  const SUN = { dawn: [96, 112, 15], day: [306, 40, 13], dusk: [324, 104, 21], night: [86, 42, 10] };
  let sceneId = 0;

  function sceneSvg(phase = skyPhase()) {
    const id = `sky${(sceneId += 1)}`;
    const [cx, cy, r] = SUN[phase];
    const night = phase === 'night';
    const stars = night
      ? [[40, 22], [150, 30], [210, 16], [262, 44], [330, 24], [372, 52], [120, 60]]
          .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.9 : 1.3}" class="sc-star"/>`).join('')
      : '';
    const moonCut = night ? `<circle cx="${cx + 5}" cy="${cy - 3}" r="${r}" class="sc-cut"/>` : '';
    return `
      <svg class="scene-svg" viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" class="sc-top"/><stop offset="1" class="sc-bottom"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#${id})"/>
        ${stars}
        <circle cx="${cx}" cy="${cy}" r="${r * 2.6}" class="sc-halo"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" class="sc-sun"/>
        ${moonCut}
        <path class="sc-far" d="M0 128 L58 112 L118 118 L186 94 L246 50 L262 58 L284 74 L304 84 L322 68 L344 88 L400 102 V160 H0Z"/>
        <path class="sc-snow" d="M232 62 L246 50 L262 58 L270 64 L258 62 L248 68 L240 62Z"/>
        <path class="sc-mid" d="M0 140 C40 128 82 122 132 128 S212 142 262 128 S340 116 400 126 V160 H0Z"/>
        <path class="sc-near" d="M0 152 C62 140 122 146 182 151 S300 140 400 147 V160 H0Z"/>
      </svg>`;
  }

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const moodById = (id) => C.moods.find((m) => m.id === id);
  const emotionById = (mood, id) => (EM.list[mood] || []).find((e) => e.id === id);
  const tagById = (id) => C.tags.find((x) => x.id === id);

  // ---------- Dates ----------
  // Շատ բրաուզերներ Intl-ում hy լոկալ չունեն և անցնում են այլ լեզվի, ուստի հայերենը ձևավորում ենք ձեռքով։
  const HY_WEEKDAYS = ['Կիրակի', 'Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբթի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ'];
  const HY_MONTHS_GEN = ['հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'];
  const HY_MONTHS = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
  const SHORT_WEEK = {
    hy: ['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'],
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  function formatDate(d, lang) {
    if (lang === 'hy') return `${HY_WEEKDAYS[d.getDay()]}, ${d.getDate()} ${HY_MONTHS_GEN[d.getMonth()]}`;
    return new Intl.DateTimeFormat(LOCALES[lang], { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  }

  function formatMonth(d, lang) {
    if (lang === 'hy') return `${HY_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    const s = new Intl.DateTimeFormat(LOCALES[lang], { month: 'long', year: 'numeric' }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const formatTime = (iso) => {
    const d = new Date(iso);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const mondayOf = (d) => {
    const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
    return m;
  };

  // ---------- Quotes (օրվա + տրամադրության) ----------

  function moodQuoteIndex(mood) {
    const n = MQ.quotes[mood].length;
    return (((state.moodQuotePos[mood] || 0) % n) + n) % n;
  }

  function resolveQuote(key) {
    const lang = state.lang;
    const [type, a, b] = key.split(':');
    if (type === 'd') {
      const q = QUOTES.find((x) => x.id === Number(a));
      return q && { text: q.text[lang], author: q.author, source: q.book[lang] };
    }
    const q = MQ.quotes[a]?.[Number(b)];
    return q && { text: q[lang], author: MQ.authors[q.a][lang], source: q.s ? MQ.sources[q.s][lang] : '' };
  }

  const isSaved = (key) => state.saved.some((s) => s.key === key);

  function toggleSaved(key) {
    if (isSaved(key)) state.saved = state.saved.filter((s) => s.key !== key);
    else state.saved.unshift({ key, at: new Date().toISOString() });
    save();
  }

  const quoteActions = (key) => `
    <div class="q-actions">
      <button class="icon-btn fav" data-action="fav" data-key="${esc(key)}" aria-pressed="${isSaved(key)}"
        aria-label="${esc(t(isSaved(key) ? 'unsaveQuote' : 'saveQuote'))}">${isSaved(key) ? '♥' : '♡'}</button>
      <button class="icon-btn" data-action="share" data-key="${esc(key)}" aria-label="${esc(t('share'))}">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>`;

  function moodQuoteInner(mood) {
    const idx = moodQuoteIndex(mood);
    const q = resolveQuote(`m:${mood}:${idx}`);
    const source = q.source ? `<span class="dot" aria-hidden="true">·</span><cite>${esc(q.source)}</cite>` : '';
    return `
      <blockquote class="mq-text">${esc(q.text)}</blockquote>
      <div class="mq-foot">
        <p class="mq-source">${esc(q.author)}${source}</p>
        ${quoteActions(`m:${mood}:${idx}`)}
      </div>`;
  }

  function stepMoodQuote(mood, dir) {
    state.moodQuotePos[mood] = (state.moodQuotePos[mood] || 0) + dir;
    save();
    const body = app.querySelector('.mq-body');
    if (!body) return;
    body.innerHTML = moodQuoteInner(mood);
    body.classList.remove('slide-next', 'slide-prev');
    void body.offsetWidth;
    body.classList.add(dir > 0 ? 'slide-next' : 'slide-prev');
  }

  // ---------- Share as image ----------

  function wrapLines(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  async function shareQuote(key) {
    const q = resolveQuote(key);
    if (!q) return;
    const W = 1080, H = 1350, PAD = 120;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const color = (v) => css.getPropertyValue(v).trim();
    try { await document.fonts.ready; } catch { /* ignore */ }

    ctx.fillStyle = color('--bg');
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color('--accent');
    ctx.beginPath();
    ctx.arc(PAD + 22, PAD + 22, 22, 0, Math.PI * 2);
    ctx.fill();

    const size = q.text.length > 180 ? 46 : q.text.length > 100 ? 56 : 68;
    ctx.font = `${size}px Literata, "Noto Serif Armenian", Georgia, serif`;
    ctx.fillStyle = color('--ink');
    ctx.textBaseline = 'top';
    const lines = wrapLines(ctx, q.text, W - PAD * 2);
    const lh = size * 1.42;
    const blockH = lines.length * lh + 40 + 34;
    let y = Math.max(PAD + 100, (H - blockH) / 2);
    lines.forEach((l) => { ctx.fillText(l, PAD, y); y += lh; });

    ctx.font = `32px "Google Sans", "Noto Sans Armenian", system-ui, sans-serif`;
    ctx.fillStyle = color('--muted');
    ctx.fillText(q.source ? `${q.author} · ${q.source}` : q.author, PAD, y + 40);
    ctx.font = `600 26px "Google Sans", "Noto Sans Armenian", system-ui, sans-serif`;
    ctx.fillText('MINDFUL COMPANION', PAD, H - PAD);

    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    const file = new File([blob], 'mindful-quote.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }
    download('mindful-quote.png', blob);
  }

  // ---------- Journal ----------

  const answeredIds = () => new Set(today().journal.map((e) => e.promptId));

  function firstUnanswered(mood, from = 0) {
    const list = J.moods[mood];
    const answered = answeredIds();
    for (let k = 0; k < list.length; k++) {
      const i = (from + k) % list.length;
      if (!answered.has(`${mood}.${i + 1}`)) return i;
    }
    return list.length; // բոլորին պատասխանել է → ազատ գրառում
  }

  // Մեկ սեսիա = 1 ուղղորդող հարց + մինչև 2 ճշգրտող (ընդամենը ≤ 3)։ Հետո՝ ամփոփում։
  // Տրամադրությունը փոխելիս կարելի է նոր սեսիա սկսել այդ տրամադրության համար։
  const doneGuide = (mood) => today().done?.[mood] || null;

  function completeSession(mood) {
    const d = today();
    d.done = { ...(d.done || {}), [mood]: ui.guideIdx + 1 };
    ui.followIdx = null;
    save();
  }

  function currentQuestion(mood) {
    if (ui.jMood !== mood) {
      ui.jMood = mood;
      ui.guideIdx = firstUnanswered(mood);
      ui.followIdx = null;
    }
    const list = J.moods[mood];
    if (doneGuide(mood) || ui.guideIdx >= list.length) return { kind: 'done' };
    const g = list[ui.guideIdx];
    if (ui.followIdx !== null) {
      return { id: `${mood}.${ui.guideIdx + 1}.${ui.followIdx + 1}`, kind: 'clarify', q: g.f[ui.followIdx] };
    }
    return { id: `${mood}.${ui.guideIdx + 1}`, kind: 'guide', q: g.q };
  }

  function nextFollowUp(mood) {
    const followUps = J.moods[mood][ui.guideIdx].f;
    if (ui.followIdx + 1 < followUps.length) ui.followIdx += 1;
    else completeSession(mood);
  }

  function addEntry(kind, promptId, question, text) {
    const d = today();
    d.journal.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      at: new Date().toISOString(),
      mood: d.mood,
      emotion: d.emotion,
      kind,
      promptId,
      question,
      text
    });
  }

  function saveJournal() {
    const mood = today().mood;
    const text = ui.draft.trim();
    if (!text) return app.querySelector('#journal-input')?.focus();
    const q = currentQuestion(mood);
    addEntry(q.kind, q.id, q.q[state.lang], text);
    ui.draft = '';
    saveDrafts();

    if (q.kind === 'guide') ui.followIdx = 0;
    else if (q.kind === 'clarify') nextFollowUp(mood);
    save();
    render();
    app.querySelector('#journal-input')?.focus({ preventScroll: true });
  }

  // Երկ–ուրբ՝ «Աշխատանքային օրվա փակում» (անջատվել աշխատանքից), շաբ–կիր՝ սովորական երեկոյան ամփոփում։
  const isWorkday = () => { const w = new Date().getDay(); return w >= 1 && w <= 5; };
  const eveningSet = () => (isWorkday() ? W.eveningWork : J.evening);

  function eveningIndex() {
    const answered = answeredIds();
    const i = eveningSet().findIndex((_, k) => !answered.has(`evening.${k + 1}`));
    return i === -1 ? null : i;
  }

  function saveEvening() {
    const text = ui.eveningDraft.trim();
    if (!text) return app.querySelector('#evening-input')?.focus();
    const i = eveningIndex();
    if (i === null) return;
    addEntry('evening', `evening.${i + 1}`, eveningSet()[i][state.lang], text);
    ui.eveningDraft = '';
    saveDrafts();
    save();
    render();
    app.querySelector('#evening-input')?.focus({ preventScroll: true });
  }

  function deleteEntry(date, id) {
    if (!confirm(t('confirmDelete'))) return;
    const d = dayRec(date);
    d.journal = d.journal.filter((e) => e.id !== id);
    save();
    render();
  }

  // Վերջին 3 check-in-ները (այսօրվա հետ միասին) ծանր են → մեղմ աջակցության նշում
  function needsSupport() {
    const heavy = (d) => d.mood === 'sad' || HEAVY_EMOTIONS.includes(d.emotion);
    if (!heavy(today())) return false;
    const recent = Object.keys(state.days).sort().reverse()
      .map((k) => state.days[k]).filter((d) => d.mood).slice(0, 3);
    return recent.length === 3 && recent.every(heavy);
  }

  // ---------- Export & reminder ----------

  function download(name, data, type) {
    const blob = data instanceof Blob ? data : new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportJson() {
    const data = {
      app: 'mindful-companion', version: state.version, exportedAt: new Date().toISOString(),
      lang: state.lang, days: state.days, saved: state.saved
    };
    download(`mindful-companion-${todayKey()}.json`, JSON.stringify(data, null, 2), 'application/json');
  }

  // Excel-ում բացելիս «=», «+», «-», «@»-ով սկսվող տեքստը կարող է բանաձև դառնալ, ուստի դրանք չեզոքացնում ենք։
  const csvCell = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  function exportCsv() {
    const rows = [['date', 'day_quote_id', 'mood', 'quadrant', 'emotion', 'tags', 'mood_changes',
      'entry_time', 'entry_mood', 'entry_emotion', 'entry_kind', 'prompt_id', 'question', 'text']];
    for (const date of Object.keys(state.days).sort()) {
      const d = state.days[date];
      const base = [date, d.quoteId ?? '', d.mood ?? '', EM.quadrant[d.mood] ?? '', d.emotion ?? '',
        (d.tags || []).join('|'), d.moodLog.length];
      if (!d.journal.length) rows.push([...base, '', '', '', '', '', '', '']);
      else d.journal.forEach((e) => rows.push([...base, e.at, e.mood ?? '', e.emotion ?? '', e.kind, e.promptId, e.question, e.text]));
    }
    const csv = '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
    download(`mindful-companion-${todayKey()}.csv`, csv, 'text/csv;charset=utf-8');
  }

  // Օրական հիշեցում՝ .ics ֆայլով (օրացույցի կրկնվող իրադարձություն). աշխատում է առանց սերվերի բոլոր սարքերում։
  function downloadReminder() {
    const [hh, mm] = (state.reminderTime || '20:00').split(':');
    const d = new Date();
    const icsText = (s) => s.replace(/([,;\\])/g, '\\$1');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mindful Companion//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:mindful-companion-daily-${stamp}@local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${hh}${mm}00`,
      'DURATION:PT5M',
      'RRULE:FREQ=DAILY',
      `SUMMARY:${icsText(`Mindful Companion · ${t('howFeel')}`)}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(t('howFeel'))}`, 'TRIGGER:PT0M', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    download('mindful-reminder.ics', ics, 'text/calendar;charset=utf-8');
  }

  // ---------- Views: shared ----------

  function headerHtml() {
    const lang = state.lang;
    const me = activeProfile();
    return `
      <header class="topbar">
        <div>
          ${me?.name ? `<p class="greeting">${esc(greeting())}</p>` : ''}
          <p class="date">${esc(formatDate(new Date(), lang))}</p>
        </div>
        <div class="topbar-actions">
          <button class="pause-btn" data-action="pause" aria-label="${esc(t('pauseTitle'))}" title="${esc(t('pause'))} (P)">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6v12M15 6v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>${esc(t('pause'))}</span>
          </button>
          <button class="lang-toggle" data-action="lang-toggle" aria-expanded="${ui.langMenuOpen}" aria-label="${esc(t('language'))}">${lang.toUpperCase()}</button>
          <button class="avatar" data-action="profile-toggle" aria-expanded="${ui.profileMenuOpen}" aria-label="${esc(t('profiles'))}">${esc(initial(me?.name || ''))}</button>
        </div>
      </header>
      ${ui.profileMenuOpen ? `
        <div class="profile-menu" role="group" aria-label="${esc(t('profiles'))}">
          ${profiles.list.map((p) => `
            <button data-action="switch-profile" data-id="${p.id}" aria-pressed="${p.id === profiles.active}">
              <span class="avatar avatar--sm" aria-hidden="true">${esc(initial(p.name))}</span>${esc(p.name || '—')}
            </button>`).join('')}
          <button data-action="add-profile" class="profile-add">+ ${esc(t('addProfile'))}</button>
        </div>` : ''}
      ${ui.langMenuOpen ? `
        <div class="lang-menu" role="group" aria-label="${esc(t('language'))}">
          ${C.languages.map((l) => `<button data-action="set-lang" data-lang="${l.id}" lang="${l.id}" aria-pressed="${l.id === lang}">${esc(l.label)}</button>`).join('')}
        </div>` : ''}
      <nav class="tabs" aria-label="Sections">
        <button data-action="set-view" data-view="today" aria-pressed="${ui.view === 'today'}">${esc(t('tabToday'))}</button>
        <button data-action="set-view" data-view="days" aria-pressed="${ui.view === 'days'}">${esc(t('tabDays'))}</button>
      </nav>`;
  }

  const noteHtml = (e, date) => `
    <li class="note mood--${e.mood || 'none'}">
      <div class="note-meta">
        <span class="mood-dot" aria-hidden="true"></span>
        <time datetime="${esc(e.at)}">${formatTime(e.at)}</time>
        <button class="note-del" data-action="j-del" data-date="${date}" data-id="${esc(e.id)}" aria-label="${esc(t('deleteNote'))}">×</button>
      </div>
      <p class="note-q">${esc(e.question)}</p>
      <p class="note-text">${esc(e.text)}</p>
    </li>`;

  // ---------- Views: onboarding ----------

  function renderOnboarding() {
    const ob = ui.onboarding || { step: 'lang' };
    const canCancel = !!state?.lang && !ob.rename;
    if (ob.step === 'name') {
      document.documentElement.lang = ob.lang;
      app.innerHTML = `
        <section class="onboarding">
          <div class="mark scene" data-sky="${skyPhase()}" aria-hidden="true">${sceneSvg()}</div>
          <form class="name-form" data-form="name">
            <label for="name-input" class="onboarding-title">${esc(t('nameQ'))}</label>
            <input id="name-input" name="name" maxlength="${NAME_MAX}" autocomplete="nickname"
              placeholder="${esc(t('namePh'))}" value="${esc(ob.rename ? activeProfile()?.name || '' : '')}" required>
            <div class="journal-actions">
              <button type="submit" class="btn-primary">${esc(t('continue'))}</button>
              ${ob.rename ? '' : `<button type="button" class="btn-ghost" data-action="ob-back">${esc(t('back'))}</button>`}
            </div>
          </form>
        </section>`;
      app.querySelector('#name-input').focus();
      return;
    }
    document.documentElement.lang = 'hy';
    app.innerHTML = `
      <section class="onboarding">
        <div class="mark scene" data-sky="${skyPhase()}" aria-hidden="true">${sceneSvg()}</div>
        <h1 class="onboarding-title">
          <span lang="hy">${esc(C.ui.hy.chooseLanguage)}</span>
          <span lang="ru">${esc(C.ui.ru.chooseLanguage)}</span>
          <span lang="en">${esc(C.ui.en.chooseLanguage)}</span>
        </h1>
        <div class="lang-list">
          ${C.languages.map((l) => `<button class="lang-option" data-action="onboard-lang" data-lang="${l.id}" lang="${l.id}">${esc(l.label)}</button>`).join('')}
        </div>
        ${canCancel ? `<button class="btn-ghost" data-action="ob-cancel">${esc(t('back'))}</button>` : ''}
      </section>`;
  }

  // ---------- Views: today ----------

  function checkinHtml(d) {
    const lang = state.lang;
    const mood = moodById(d.mood);
    const emotions = mood ? EM.list[mood.id] : [];
    const emotion = mood ? emotionById(mood.id, d.emotion) : null;

    return `
      <section class="checkin" aria-labelledby="checkin-q">
        <h2 id="checkin-q" class="checkin-q">${esc(t('howFeel'))}</h2>
        <div class="chips">
          ${C.moods.map((m) => `
            <button class="mood mood--${m.id}" data-action="mood" data-mood="${m.id}" aria-pressed="${mood?.id === m.id}">
              <span class="mood-dot" aria-hidden="true"></span>${esc(m.label[lang])}
            </button>`).join('')}
        </div>

        ${mood ? `
          <div class="step mood--${mood.id}">
            <p class="step-q">${esc(t('precise'))} <span class="optional">${esc(t('optional'))}</span></p>
            <div class="chips chips--small">
              ${emotions.map((e) => `<button class="chip" data-action="emotion" data-emotion="${e.id}" aria-pressed="${d.emotion === e.id}">${esc(e.label[lang])}</button>`).join('')}
            </div>
            ${emotion ? `
              <dl class="emotion-info">
                <dt>${esc(t('aboutLabel'))}</dt><dd>${esc(emotion.about[lang])}</dd>
                <dt>${esc(t('signalLabel'))}</dt><dd>${esc(emotion.signal[lang])}</dd>
              </dl>` : ''}
          </div>

          <div class="step mood--${mood.id}">
            <p class="step-q">${esc(t('tagsQ'))} <span class="optional">${esc(t('optional'))}</span></p>
            ${['work', 'life'].map((g) => `
              <p class="tag-group">${esc(t(g === 'work' ? 'groupWork' : 'groupLife'))}</p>
              <div class="chips chips--small">
                ${C.tags.filter((x) => x.group === g).map((x) => `<button class="chip" data-action="tag" data-tag="${x.id}" aria-pressed="${d.tags.includes(x.id)}">${esc(x.label[lang])}</button>`).join('')}
              </div>`).join('')}
          </div>

          <div class="response mood--${mood.id}" role="status">
            <p>${esc(mood.response[lang])}</p>
            <p class="try-k">${esc(t('tryNow'))}</p>
            <div class="try-row">
              ${rankedResets(mood.id).map(({ r, helped }) => `
                <button class="try-btn" data-action="practice" data-id="${r.id}">
                  <span>${esc(r.name[lang])}</span>
                  <small>${esc(helped ? t('helpedBefore') : t('seconds', { n: resetSeconds(r) }))}</small>
                </button>`).join('')}
            </div>
          </div>

          ${needsSupport() ? `<p class="support-note" role="note">${esc(t('supportNote'))}</p>` : ''}` : ''}
      </section>`;
  }

  // Ամփոփում. միայն պատասխանները (պիտակ + պատասխան), հետո եզրահանգում և «եթե-ապա» առաջարկ։
  function summaryHtml(mood) {
    const lang = state.lang;
    const base = `${mood}.${doneGuide(mood)}`;
    const sum = R.summary[base];
    const sep = lang === 'hy' ? '՝ ' : ': ';
    const rows = [base, `${base}.1`, `${base}.2`].map((id, i) => {
      const answers = today().journal.filter((e) => e.promptId === id);
      if (!answers.length || !sum) return '';
      return `<li><span class="sum-label">${esc(sum.n[i][lang])}${sep}</span>${esc(answers.map((e) => e.text).join(' / '))}</li>`;
    }).join('');
    return `
      <div class="card summary">
        <h3 class="summary-h">${esc(t('summaryTitle'))}</h3>
        ${rows ? `<ul class="sum-list">${rows}</ul>` : ''}
        ${sum ? `
          <p class="sum-k">${esc(t('summaryWe'))}</p>
          <p class="sum-p">${esc(sum.insight[lang])}</p>
          <p class="sum-k">${esc(t('summaryTry'))}</p>
          <p class="sum-p sum-tip">${esc(sum.tip[lang])}</p>
          <div class="fb-row" role="group" aria-label="${esc(t('helped'))}">
            <button class="fb-btn" data-action="tip-fb" data-key="${base}" data-v="1" aria-pressed="${state.tipFeedback?.[base] === 1}">${esc(t('tipHelpful'))}</button>
            <button class="fb-btn" data-action="tip-fb" data-key="${base}" data-v="-1" aria-pressed="${state.tipFeedback?.[base] === -1}">${esc(t('tipNot'))}</button>
          </div>` : ''}
        <p class="journal-hint">${esc(t('summaryNext'))}</p>
      </div>`;
  }

  function journalHtml(mood) {
    const q = currentQuestion(mood);
    const entries = today().journal.filter((e) => e.kind !== 'evening' && e.mood === mood);

    if (q.kind === 'done') {
      return `
        <section class="journal mood--${mood}" aria-labelledby="journal-h">
          <h2 id="journal-h" class="section-h">${esc(t('journalTitle'))}</h2>
          ${summaryHtml(mood)}
        </section>`;
    }

    const isFollowUp = q.kind === 'clarify';
    const total = 1 + J.moods[mood][ui.guideIdx].f.length;
    const step = isFollowUp ? ui.followIdx + 2 : 1;

    return `
      <section class="journal mood--${mood}" aria-labelledby="journal-h">
        <h2 id="journal-h" class="section-h">${esc(t('journalTitle'))}</h2>
        <div class="card">
          <p class="journal-tag">${esc(t('progress', { i: step, n: total }))}${isFollowUp ? ` · ${esc(t('followUp'))}` : ''}</p>
          <label for="journal-input" class="journal-q">${esc(q.q[state.lang])}</label>
          <textarea id="journal-input" data-draft="journal" rows="4" placeholder="${esc(t('placeholder'))}">${esc(ui.draft)}</textarea>
          <div class="journal-actions">
            <button class="btn-primary" data-action="j-save">${esc(t('save'))}</button>
            ${isFollowUp
              ? `<button class="btn-ghost" data-action="j-skip">${esc(t('skip'))}</button>
                 <button class="btn-text" data-action="j-finish">${esc(t('finish'))}</button>`
              : `<button class="btn-ghost" data-action="j-other">${esc(t('otherQuestion'))} ↻</button>`}
          </div>
          <p class="journal-hint">${esc(t('journalHint'))}</p>
        </div>
        ${entries.length ? `
          <h3 class="notes-h">${esc(t('todayNotes'))}</h3>
          <ol class="notes">${entries.map((e) => noteHtml(e, todayKey())).join('')}</ol>` : ''}
      </section>`;
  }

  function eveningHtml() {
    const i = eveningIndex();
    const set = eveningSet();
    const work = isWorkday();
    const entries = today().journal.filter((e) => e.kind === 'evening');
    return `
      <section class="journal evening" aria-labelledby="evening-h">
        <h2 id="evening-h" class="section-h">☾ ${esc(t(work ? 'workClose' : 'eveningTitle'))}</h2>
        <div class="card">
          ${i === null
            ? `<p class="evening-done">${esc(t(work ? 'workClosed' : 'eveningDone'))}</p>`
            : `
              <label for="evening-input" class="journal-q">${esc(set[i][state.lang])}</label>
              <textarea id="evening-input" data-draft="evening" rows="3" placeholder="${esc(t('placeholder'))}">${esc(ui.eveningDraft)}</textarea>
              <div class="journal-actions">
                <button class="btn-primary" data-action="e-save">${esc(t('save'))}</button>
                <span class="evening-step">${i + 1} / ${set.length}</span>
              </div>`}
        </div>
        ${entries.length ? `<ol class="notes">${entries.map((e) => noteHtml(e, todayKey())).join('')}</ol>` : ''}
      </section>`;
  }

  function renderToday() {
    const lang = state.lang;
    const d = today();
    const quote = QUOTES[state.quoteIndex];
    const mood = moodById(d.mood);
    const isEvening = FORCE_EVENING || new Date().getHours() >= EVENING_HOUR;

    app.innerHTML = `
      ${headerHtml()}

      <div class="today-grid">
      <div class="col-a">
      <article class="quote">
        <div class="scene" data-sky="${skyPhase()}">
          ${sceneSvg()}
          <p class="quote-day">${esc(t('day', { n: state.dayCount }))}</p>
        </div>
        <blockquote class="quote-text">${esc(quote.text[lang])}</blockquote>
        <div class="quote-foot">
          <p class="quote-source">${esc(quote.author)}<span class="dot" aria-hidden="true">·</span><cite>${esc(quote.book[lang])}</cite></p>
          ${quoteActions(`d:${quote.id}`)}
        </div>
      </article>

      </div>
      <div class="col-b">
      ${checkinHtml(d)}

      ${mood ? journalHtml(mood.id) : ''}

      ${isEvening ? eveningHtml() : ''}
      </div>
      <div class="col-a">
      ${mood ? `
        <section class="mq mood--${mood.id}" aria-labelledby="mq-h">
          <h2 id="mq-h" class="section-h">${esc(t('moodQuotes'))}</h2>
          <div class="mq-card">
            <div class="mq-body" aria-live="polite">${moodQuoteInner(mood.id)}</div>
            <div class="mq-nav">
              <button class="mq-btn" data-action="mq-step" data-step="-1" aria-label="${esc(t('prev'))}">←</button>
              <button class="mq-btn mq-next" data-action="mq-step" data-step="1">${esc(t('next'))} →</button>
            </div>
          </div>
        </section>` : ''}
      </div>
      </div>

      <footer class="footnote"><p>${esc(t('tomorrow'))}</p><p class="kbd-hint">${esc(t('shortcuts'))}</p></footer>`;
  }

  // ---------- Views: my days (dashboard) ----------

  function streakHtml() {
    const lang = state.lang;
    const monday = mondayOf(new Date());
    const tKey = todayKey();
    let n = 0;
    const dots = SHORT_WEEK[lang].map((label, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const k = dateKey(day);
      const rec = state.days[k];
      if (rec?.mood) n += 1;
      return `<li class="wd ${rec?.mood ? `mood--${rec.mood} has` : ''} ${k === tKey ? 'is-today' : ''}">
        <span class="wd-dot" aria-hidden="true"></span><span class="wd-l">${esc(label)}</span></li>`;
    }).join('');
    const total = Object.values(state.days).filter((d) => d.mood).length;
    return `
      <section class="card streak">
        <div class="streak-head">
          <p class="streak-n">${esc(t('weekStreak', { n }))}</p>
          <p class="streak-total">${esc(t('totalDays', { n: total }))}</p>
        </div>
        <ol class="week">${dots}</ol>
        <p class="streak-note">${esc(t('streakNote'))}</p>
      </section>`;
  }

  function calendarHtml() {
    const lang = state.lang;
    const first = ui.calMonth;
    const year = first.getFullYear(), month = first.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const tKey = todayKey();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<span class="cal-cell is-empty" aria-hidden="true"></span>');
    for (let day = 1; day <= daysInMonth; day++) {
      const k = dateKey(new Date(year, month, day));
      const rec = state.days[k];
      const future = k > tKey;
      const label = rec?.mood ? `${day}, ${moodById(rec.mood).label[lang]}` : String(day);
      cells.push(`<button class="cal-cell ${rec?.mood ? `mood--${rec.mood} has` : ''} ${k === tKey ? 'is-today' : ''} ${k === ui.selectedDate ? 'is-sel' : ''}"
        data-action="cal-day" data-date="${k}" ${future ? 'disabled' : ''} aria-label="${esc(label)}">${day}</button>`);
    }
    return `
      <section class="card cal">
        <div class="cal-head">
          <button class="mq-btn" data-action="cal-step" data-step="-1" aria-label="${esc(t('prevMonth'))}">←</button>
          <h2 class="cal-title">${esc(formatMonth(first, lang))}</h2>
          <button class="mq-btn" data-action="cal-step" data-step="1" aria-label="${esc(t('nextMonth'))}">→</button>
        </div>
        <div class="cal-grid cal-week">${SHORT_WEEK[lang].map((w) => `<span>${esc(w)}</span>`).join('')}</div>
        <div class="cal-grid">${cells.join('')}</div>
      </section>`;
  }

  function dayDetailHtml() {
    const lang = state.lang;
    const k = ui.selectedDate;
    const rec = state.days[k];
    const title = formatDate(parseKey(k), lang);
    if (!rec || (!rec.mood && !rec.journal.length)) {
      return `<section class="day-detail"><h3 class="notes-h">${esc(title)}</h3><p class="muted">${esc(t('noData'))}</p></section>`;
    }
    const mood = moodById(rec.mood);
    const emotion = mood ? emotionById(mood.id, rec.emotion) : null;
    const tags = (rec.tags || []).map((id) => tagById(id)?.label[lang]).filter(Boolean);
    return `
      <section class="day-detail">
        <h3 class="notes-h">${esc(title)}</h3>
        ${mood ? `
          <p class="day-mood mood--${mood.id}">
            <span class="mood-dot" aria-hidden="true"></span>${esc(mood.label[lang])}${emotion ? ` · ${esc(emotion.label[lang])}` : ''}
          </p>` : ''}
        ${tags.length ? `<p class="day-tags">${tags.map((x) => `<span class="chip chip--static">${esc(x)}</span>`).join('')}</p>` : ''}
        ${rec.journal.length ? `<ol class="notes">${rec.journal.map((e) => noteHtml(e, k)).join('')}</ol>` : ''}
      </section>`;
  }

  function distributionHtml() {
    const lang = state.lang;
    const y = ui.calMonth.getFullYear(), m = ui.calMonth.getMonth();
    const prefix = `${y}-${pad(m + 1)}-`;
    const counts = {};
    let total = 0;
    for (const [k, d] of Object.entries(state.days)) {
      if (k.startsWith(prefix) && d.mood) {
        counts[d.mood] = (counts[d.mood] || 0) + 1;
        total += 1;
      }
    }
    if (!total) return '';
    const rows = C.moods.filter((x) => counts[x.id]).map((x) => {
      const p = Math.round((counts[x.id] / total) * 100);
      return `
        <li class="bar-row mood--${x.id}">
          <span class="bar-label">${esc(x.label[lang])}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${p}%"></span></span>
          <span class="bar-val">${counts[x.id]}</span>
        </li>`;
    }).join('');
    return `
      <section class="card">
        <h2 class="section-h">${esc(t('moodsMonth'))}</h2>
        <ul class="bars">${rows}</ul>
      </section>`;
  }

  function insightsHtml() {
    const lang = state.lang;
    const byMood = {};
    for (const d of Object.values(state.days)) {
      if (!d.mood) continue;
      (byMood[d.mood] ||= []).push(d);
    }
    const lines = [];
    for (const [mood, days] of Object.entries(byMood)) {
      if (days.length < 3) continue;
      const freq = {};
      days.forEach((d) => (d.tags || []).forEach((x) => (freq[x] = (freq[x] || 0) + 1)));
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      if (!top || top[1] < 2) continue;
      const p = Math.round((top[1] / days.length) * 100);
      if (p < 40) continue;
      lines.push({ p, mood, html: esc(t('insightLine', { mood: moodById(mood).label[lang], p, tag: tagById(top[0]).label[lang] })) });
    }
    lines.sort((a, b) => b.p - a.p);
    return `
      <section class="card">
        <h2 class="section-h">${esc(t('insights'))}</h2>
        ${lines.length
          ? `<ul class="insights">${lines.slice(0, 4).map((l) => `<li class="mood--${l.mood}"><span class="mood-dot" aria-hidden="true"></span>${l.html}</li>`).join('')}</ul>`
          : `<p class="muted">${esc(t('insightsEmpty'))}</p>`}
      </section>`;
  }

  function savedHtml() {
    const items = state.saved.map((s) => ({ key: s.key, q: resolveQuote(s.key) })).filter((x) => x.q);
    return `
      <section class="card">
        <h2 class="section-h">${esc(t('savedQuotes'))}</h2>
        ${items.length ? `
          <ul class="saved">
            ${items.map(({ key, q }) => `
              <li>
                <blockquote>${esc(q.text)}</blockquote>
                <div class="mq-foot">
                  <p class="mq-source">${esc(q.author)}${q.source ? `<span class="dot" aria-hidden="true">·</span><cite>${esc(q.source)}</cite>` : ''}</p>
                  ${quoteActions(key)}
                </div>
              </li>`).join('')}
          </ul>` : `<p class="muted">${esc(t('savedEmpty'))}</p>`}
      </section>`;
  }

  function settingsHtml() {
    const me = activeProfile();
    return `
      <section class="card">
        <h2 class="section-h">${esc(t('profile'))}</h2>
        <form class="reminder-row" data-form="rename">
          <input name="name" maxlength="${NAME_MAX}" value="${esc(me?.name || '')}" aria-label="${esc(t('nameLabel'))}" placeholder="${esc(t('namePh'))}" required>
          <button type="submit" class="btn-ghost">${esc(t('save'))}</button>
        </form>
        <p class="journal-hint">${esc(t('profilesHint'))}</p>
        <button class="link-danger" data-action="delete-profile">${esc(t('deleteProfile'))}</button>
      </section>
      <section class="card">
        <h2 class="section-h">${esc(t('reminder'))}</h2>
        <div class="reminder-row">
          <input type="time" id="reminder-time" value="${esc(state.reminderTime || '20:00')}" aria-label="${esc(t('reminder'))}">
          <button class="btn-ghost" data-action="reminder">${esc(t('reminderBtn'))}</button>
        </div>
        <p class="journal-hint">${esc(t('reminderHint'))}</p>
      </section>
      <section class="card">
        <h2 class="section-h">${esc(t('breakTitle'))}</h2>
        <div class="chips chips--small" role="group" aria-label="${esc(t('breakTitle'))}">
          ${[0, 45, 60, 90].map((n) => `<button class="chip" data-action="break-every" data-n="${n}" aria-pressed="${(state.breakEvery || 0) === n}">${esc(n ? t('breakEvery', { n }) : t('breakOff'))}</button>`).join('')}
        </div>
        <p class="journal-hint">${esc(t('breakHint'))}</p>
        ${ui.installPrompt ? `<div class="journal-actions"><button class="btn-ghost" data-action="install">${esc(t('install'))}</button></div>` : ''}
      </section>
      <p class="data-links">${esc(t('myData'))}:
        <button data-action="export" data-format="json">JSON</button>
        <button data-action="export" data-format="csv">CSV</button>
      </p>`;
  }

  // ---------- Practices (1-minute pauses) ----------

  const resetById = (id) => W.resets.find((r) => r.id === id);
  const resetSeconds = (r) => r.kind === 'breath'
    ? r.cycles * r.pattern.reduce((a, x) => a + x.s, 0)
    : r.kind === 'write' ? r.s : r.steps.reduce((a, x) => a + x.s, 0);
  const resetScore = (id) => {
    const f = state.resetFeedback?.[id];
    return f ? f.y * 2 + f.b - f.n * 2 : 0;
  };

  // Ըստ տրամադրության 2 առաջարկ։ Եթե օգտատիրոջ գնահատականներով ինչ-որ պրակտիկա օգնել է, այն առաջինն է։
  function rankedResets(mood) {
    const base = W.recommend[mood] || ['sigh', 'eyes'];
    const best = W.resets.map((r) => r.id).filter((id) => resetScore(id) > 0)
      .sort((a, b) => resetScore(b) - resetScore(a))[0];
    const ids = best ? [best, ...base.filter((id) => id !== best)] : base;
    return ids.slice(0, 2).map((id) => ({ r: resetById(id), helped: id === best }));
  }

  function recordReset(id, v) {
    const fb = (state.resetFeedback ||= {});
    const f = (fb[id] ||= { y: 0, b: 0, n: 0 });
    f[v] += 1;
    save();
  }

  // ---------- Your week ----------

  const PLEASANT = ['great', 'calm'];
  const BRIGHT_PROMPTS = ['calm.1', 'calm.2', 'great.2', 'evening.1'];

  function weekHtml() {
    const lang = state.lang;
    const keys = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      keys.push(dateKey(day));
    }
    const days = keys.map((k) => state.days[k]).filter(Boolean);
    const logged = days.filter((d) => d.mood);
    const head = `<h2 class="section-h">${esc(t('weekTitle'))}</h2>`;
    if (!logged.length) return `<section class="card week-card">${head}<p class="muted">${esc(t('weekEmpty'))}</p></section>`;

    const good = logged.filter((d) => PLEASANT.includes(d.mood));
    const heavy = logged.filter((d) => !PLEASANT.includes(d.mood));
    const topTags = (list) => {
      const f = {};
      list.forEach((d) => (d.tags || []).forEach((x) => (f[x] = (f[x] || 0) + 1)));
      return Object.entries(f).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
    };
    const heavyTags = topTags(heavy);
    const goodTags = topTags(good);
    const tagChips = (ids) => ids.map((id) => `<span class="chip chip--static">${esc(tagById(id).label[lang])}</span>`).join('');

    const bright = days.flatMap((d) => d.journal || [])
      .filter((e) => BRIGHT_PROMPTS.includes(e.promptId) && e.text).slice(-3);

    const best = W.resets.map((r) => r.id).filter((id) => resetScore(id) > 0)
      .sort((a, b) => resetScore(b) - resetScore(a))[0];

    // Պարզ, բացատրելի կանոններ. ոչ մի ախտորոշում։
    let sug = 'sugDefault';
    if (heavy.length >= 5) sug = 'sugHeavy';
    else if (heavyTags.some((x) => ['deadlines', 'workload', 'targets'].includes(x))) sug = 'sugDeadlines';
    else if (heavyTags.includes('meetings')) sug = 'sugMeetings';
    else if (heavyTags.includes('clients')) sug = 'sugClients';
    else if (heavyTags.includes('screens')) sug = 'sugScreens';
    else if (heavyTags.includes('sleep')) sug = 'sugSleep';
    else if (good.length / logged.length >= 0.6) sug = 'sugGood';

    const pGood = Math.round((good.length / logged.length) * 100);
    return `
      <section class="card week-card">
        ${head}
        <p class="muted">${esc(t('weekDays', { n: logged.length }))}</p>
        <div class="balance" role="img" aria-label="${esc(t('weekPleasant'))} ${good.length}, ${esc(t('weekHeavy'))} ${heavy.length}">
          <span class="balance-good" style="width:${pGood}%"></span>
        </div>
        <p class="balance-legend"><span>${esc(t('weekPleasant'))} · ${good.length}</span><span>${esc(t('weekHeavy'))} · ${heavy.length}</span></p>
        ${heavyTags.length ? `<p class="sum-k">${esc(t('weekHeavyTags'))}</p><p class="day-tags">${tagChips(heavyTags)}</p>` : ''}
        ${goodTags.length ? `<p class="sum-k">${esc(t('weekGoodTags'))}</p><p class="day-tags">${tagChips(goodTags)}</p>` : ''}
        ${bright.length ? `<p class="sum-k">${esc(t('weekBright'))}</p><ul class="bright">${bright.map((e) => `<li>${esc(e.text)}</li>`).join('')}</ul>` : ''}
        ${best ? `<p class="sum-k">${esc(t('weekHelpful'))}</p><p class="sum-p"><button class="link-btn" data-action="practice" data-id="${best}">${esc(resetById(best).name[lang])}</button></p>` : ''}
        <p class="sum-k">${esc(t('weekTry'))}</p>
        <p class="sum-p sum-tip">${esc(t(sug))}</p>
      </section>`;
  }

  // «Ի՞նչ հանգիստ է քեզ պետք». առաջարկ, ոչ թե գնահատական։ Ցույց ենք տալիս միայն ամենաբարձր պատասխանները։
  function quizHtml() {
    const lang = state.lang;
    const head = `<h2 class="section-h">${esc(t('quizTitle'))}</h2>`;
    const note = `<p class="journal-hint">${esc(t('quizNote'))} ${esc(t('quizSource'))}</p>`;

    if (ui.quiz) {
      const item = R.quiz[ui.quiz.step];
      const opts = [['quizNo', 0], ['quizBit', 1], ['quizYes', 2]];
      return `
        <section class="card quiz">
          ${head}
          <p class="journal-tag">${esc(t('progress', { i: ui.quiz.step + 1, n: R.quiz.length }))}</p>
          <p class="quiz-q" aria-live="polite">${esc(item.q[lang])}</p>
          <div class="chips">${opts.map(([k, v]) => `<button class="chip quiz-opt" data-action="quiz-answer" data-v="${v}">${esc(t(k))}</button>`).join('')}</div>
        </section>`;
    }

    const last = state.restQuiz;
    if (last) {
      const max = Math.max(...last.answers);
      const top = max > 0 ? R.quiz.filter((_, i) => last.answers[i] === max) : [];
      return `
        <section class="card quiz">
          ${head}
          ${top.length ? `
            <p class="sum-k">${esc(t('quizResult'))}</p>
            <ul class="quiz-res">${top.map((x) => `<li><strong>${esc(x.name[lang])}</strong><span>${esc(x.ideas[lang])}</span></li>`).join('')}</ul>`
            : `<p class="sum-p">${esc(t('quizRested'))}</p>`}
          <div class="journal-actions"><button class="btn-ghost" data-action="quiz-start">${esc(t('quizAgain'))}</button></div>
          ${note}
        </section>`;
    }

    return `
      <section class="card quiz">
        ${head}
        <p class="sum-p">${esc(t('quizIntro'))}</p>
        <div class="journal-actions"><button class="btn-primary" data-action="quiz-start">${esc(t('quizStart'))}</button></div>
        ${note}
      </section>`;
  }

  function renderDays() {
    app.innerHTML = `
      ${headerHtml()}
      <div class="days">
        ${streakHtml()}
        ${weekHtml()}
        ${calendarHtml()}
        ${dayDetailHtml()}
        ${distributionHtml()}
        ${insightsHtml()}
        ${quizHtml()}
        ${savedHtml()}
        ${settingsHtml()}
      </div>`;
  }

  // ---------- Events (delegated) ----------

  const actions = {
    'onboard-lang': (el) => { ui.onboarding = { step: 'name', lang: el.dataset.lang }; },
    'ob-back': () => { ui.onboarding = { step: 'lang' }; },
    'ob-cancel': () => { ui.onboarding = null; },
    'lang-toggle': () => { ui.langMenuOpen = !ui.langMenuOpen; ui.profileMenuOpen = false; },
    'profile-toggle': () => { ui.profileMenuOpen = !ui.profileMenuOpen; ui.langMenuOpen = false; },
    'switch-profile': (el) => {
      if (el.dataset.id === profiles.active) ui.profileMenuOpen = false;
      else loadProfile(el.dataset.id);
      window.scrollTo(0, 0);
    },
    'add-profile': () => { ui.profileMenuOpen = false; ui.onboarding = { step: 'lang' }; },
    'delete-profile': () => {
      const me = activeProfile();
      if (!me || !confirm(t('confirmDeleteProfile', { name: me.name }))) return false;
      deleteProfile(me.id);
      window.scrollTo(0, 0);
    },
    'set-lang': (el) => { state.lang = el.dataset.lang; ui.langMenuOpen = false; save(); },
    'set-view': (el) => { ui.view = el.dataset.view; window.scrollTo(0, 0); },
    mood: (el) => {
      const d = today();
      const m = el.dataset.mood;
      if (d.mood !== m) {
        d.mood = m;
        d.emotion = null;
        d.moodLog.push({ mood: m, emotion: null, at: new Date().toISOString() });
        save();
      }
    },
    emotion: (el) => {
      const d = today();
      d.emotion = d.emotion === el.dataset.emotion ? null : el.dataset.emotion;
      if (d.emotion) d.moodLog.push({ mood: d.mood, emotion: d.emotion, at: new Date().toISOString() });
      save();
    },
    tag: (el) => {
      const d = today();
      const id = el.dataset.tag;
      d.tags = d.tags.includes(id) ? d.tags.filter((x) => x !== id) : [...d.tags, id];
      save();
    },
    breathe: () => { openPractice('sigh'); return false; },
    practice: (el) => { openPractice(el.dataset.id); return false; },
    pause: () => { openPauseSheet(); return false; },
    'tip-fb': (el) => {
      const v = Number(el.dataset.v);
      state.tipFeedback = { ...(state.tipFeedback || {}) };
      if (state.tipFeedback[el.dataset.key] === v) delete state.tipFeedback[el.dataset.key];
      else state.tipFeedback[el.dataset.key] = v;
      save();
    },
    'break-every': (el) => {
      state.breakEvery = Number(el.dataset.n);
      ui.lastBreak = Date.now();
      save();
      if (state.breakEvery && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    },
    install: () => {
      const p = ui.installPrompt;
      ui.installPrompt = null;
      p?.prompt();
    },
    'mq-step': (el) => { stepMoodQuote(today().mood, Number(el.dataset.step)); return false; },
    'j-save': () => { saveJournal(); return false; },
    'j-other': () => { ui.guideIdx = firstUnanswered(today().mood, ui.guideIdx + 1); },
    'j-skip': () => { nextFollowUp(today().mood); },
    'j-finish': () => { completeSession(today().mood); },
    'quiz-start': () => { ui.quiz = { step: 0, answers: [] }; },
    'quiz-answer': (el) => {
      ui.quiz.answers.push(Number(el.dataset.v));
      ui.quiz.step += 1;
      if (ui.quiz.step >= R.quiz.length) {
        state.restQuiz = { at: new Date().toISOString(), answers: ui.quiz.answers };
        ui.quiz = null;
        save();
      }
    },
    'j-del': (el) => { deleteEntry(el.dataset.date, el.dataset.id); return false; },
    'e-save': () => { saveEvening(); return false; },
    fav: (el) => {
      toggleSaved(el.dataset.key);
      // Carousel-ում թարմացնում ենք միայն կոճակը, որ քարտը չշարժվի
      if (el.closest('.mq-body')) {
        const on = isSaved(el.dataset.key);
        el.textContent = on ? '♥' : '♡';
        el.setAttribute('aria-pressed', on);
        el.setAttribute('aria-label', t(on ? 'unsaveQuote' : 'saveQuote'));
        return false;
      }
    },
    share: (el) => { shareQuote(el.dataset.key); return false; },
    'cal-step': (el) => {
      const m = ui.calMonth;
      ui.calMonth = new Date(m.getFullYear(), m.getMonth() + Number(el.dataset.step), 1);
    },
    'cal-day': (el) => { ui.selectedDate = el.dataset.date; },
    reminder: () => { downloadReminder(); return false; },
    export: (el) => { (el.dataset.format === 'json' ? exportJson : exportCsv)(); return false; }
  };

  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || !app.contains(el)) return;
    const fn = actions[el.dataset.action];
    if (!fn) return;
    const scrollY = window.scrollY;
    if (fn(el) === false) return;
    render();
    if (el.dataset.action !== 'set-view') window.scrollTo(0, scrollY);
  });

  app.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    const name = form.elements.name.value.trim().slice(0, NAME_MAX);
    if (!name) return;
    if (form.dataset.form === 'rename' || ui.onboarding?.rename) {
      activeProfile().name = name;
      saveProfiles();
      ui.onboarding = null;
    } else {
      createProfile(name, ui.onboarding.lang);
    }
    render();
  });

  app.addEventListener('input', (e) => {
    const which = e.target.dataset?.draft;
    if (which === 'journal') ui.draft = e.target.value;
    else if (which === 'evening') ui.eveningDraft = e.target.value;
    else if (e.target.id === 'reminder-time') { state.reminderTime = e.target.value; save(); return; }
    else return;
    saveDrafts();
  });

  app.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !(e.ctrlKey || e.metaKey)) return;
    if (e.target.dataset?.draft === 'journal') saveJournal();
    if (e.target.dataset?.draft === 'evening') saveEvening();
  });

  // Swipe «Մտքեր քեզ համար» քարտի վրա
  let swipeX = null;
  app.addEventListener('pointerdown', (e) => {
    swipeX = e.target.closest('.mq-card') && !e.target.closest('button') ? e.clientX : null;
  });
  app.addEventListener('pointerup', (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 40) stepMoodQuote(today().mood, dx < 0 ? 1 : -1);
  });

  // ---------- Practice player (breath / steps / write) ----------

  function overlayShell(cls) {
    const overlay = document.createElement('div');
    overlay.className = `breath-overlay ${cls}`;
    overlay.dataset.sky = skyPhase();
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    document.body.appendChild(overlay);
    const prevFocus = document.activeElement;
    const timers = [];
    const close = () => {
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      prevFocus?.focus?.();
    };
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return { overlay, timers, close };
  }

  function openPauseSheet() {
    const lang = state.lang;
    const mood = today().mood;
    const top = new Set(mood ? rankedResets(mood).map((x) => x.r.id) : []);
    const { overlay, close } = overlayShell('pause-sheet');
    overlay.setAttribute('aria-labelledby', 'pause-h');
    overlay.innerHTML = `
      <div class="sheet">
        <h2 id="pause-h" class="sheet-h">${esc(t('pauseTitle'))}</h2>
        <p class="sheet-intro">${esc(t('pauseIntro'))}</p>
        <ul class="reset-list">
          ${W.resets.map((r) => `
            <li>
              <button class="reset-item" data-id="${r.id}">
                <span class="reset-name">${esc(r.name[lang])}${top.has(r.id) ? ` <em>${esc(t('recommended'))}</em>` : ''}</span>
                <span class="reset-about">${esc(r.about[lang])}</span>
                <span class="reset-time">${esc(t('seconds', { n: resetSeconds(r) }))}</span>
              </button>
            </li>`).join('')}
        </ul>
        <button class="breath-close">${esc(t('close'))}</button>
      </div>`;
    overlay.querySelector('.breath-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      const item = e.target.closest('.reset-item');
      if (item) { close(); openPractice(item.dataset.id); }
      else if (e.target === overlay) close();
    });
    overlay.querySelector('.reset-item')?.focus();
  }

  function openPractice(id) {
    const r = resetById(id);
    if (!r) return;
    const lang = state.lang;
    const { overlay, timers, close } = overlayShell(`practice practice--${r.kind}`);
    const total = resetSeconds(r) * 1000;
    overlay.innerHTML = `
      <p class="practice-name">${esc(r.name[lang])}</p>
      ${r.kind === 'write'
        ? `<textarea class="dump-input" rows="7" aria-label="${esc(r.name[lang])}" placeholder="${esc(r.prompt[lang])}"></textarea>`
        : '<div class="breath-circle" aria-hidden="true"></div>'}
      <p class="breath-label" aria-live="polite"></p>
      <div class="breath-progress" aria-hidden="true"><span></span></div>
      <div class="practice-end" hidden>
        <p class="practice-q">${esc(t('helped'))}</p>
        <div class="practice-fb">
          <button data-v="y">${esc(t('helpYes'))}</button>
          <button data-v="b">${esc(t('helpBit'))}</button>
          <button data-v="n">${esc(t('helpNo'))}</button>
        </div>
      </div>
      <button class="breath-close">${esc(t('close'))}</button>`;

    const circle = overlay.querySelector('.breath-circle');
    const label = overlay.querySelector('.breath-label');
    const bar = overlay.querySelector('.breath-progress span');
    const end = overlay.querySelector('.practice-end');
    const dump = overlay.querySelector('.dump-input');
    const closeBtn = overlay.querySelector('.breath-close');

    const finish = () => {
      if (dump?.value.trim()) {
        addEntry('free', 'dump', t('dumpSaved'), dump.value.trim());
        save();
      }
      close();
      render();
    };
    closeBtn.addEventListener('click', finish);
    end.addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]');
      if (!b) return;
      recordReset(r.id, b.dataset.v);
      end.innerHTML = `<p class="practice-q">${esc(t('thanks'))}</p>`;
      timers.push(setTimeout(finish, 1400));
    });

    const done = () => {
      ui.lastBreak = Date.now();
      overlay.classList.add('is-done');
      label.textContent = r.kind === 'write' ? r.after[lang] : t('done');
      end.hidden = false;
      end.querySelector('button')?.focus();
    };

    if (r.kind === 'breath') {
      const SCALE = { in: 1, in2: 1.08, out: 0.55 };
      let at = 50;
      for (let c = 0; c < r.cycles; c++) {
        r.pattern.forEach((ph) => {
          timers.push(setTimeout(() => {
            if (SCALE[ph.p]) {
              circle.style.transitionDuration = `${ph.s * 1000}ms`;
              circle.style.transform = `scale(${SCALE[ph.p]})`;
            }
            label.textContent = ph.l[lang];
          }, at));
          at += ph.s * 1000;
        });
      }
      closeBtn.focus();
    } else if (r.kind === 'steps') {
      let at = 50;
      r.steps.forEach((st, i) => {
        timers.push(setTimeout(() => {
          label.textContent = st.l[lang];
          circle.dataset.step = `${i + 1} / ${r.steps.length}`;
          circle.classList.toggle('is-in', i % 2 === 0);
        }, at));
        at += st.s * 1000;
      });
      closeBtn.focus();
    } else {
      label.textContent = r.about[lang];
      dump.focus();
    }
    timers.push(setTimeout(done, total + 50));

    void bar.offsetWidth; // force layout so the transition starts from scaleX(0)
    bar.style.transitionDuration = `${total}ms`;
    bar.style.transform = 'scaleX(1)';
  }

  // ---------- Break reminder (while the page is open) ----------

  const baseTitle = document.title;
  setInterval(() => {
    if (!state?.breakEvery || document.querySelector('.breath-overlay')) return;
    if (Date.now() - ui.lastBreak < state.breakEvery * 60000) return;
    ui.lastBreak = Date.now();
    const msg = t('breakNow');
    if (document.visibilityState === 'hidden' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification('Mindful Companion', { body: msg, icon: 'icon.svg', tag: 'mc-break' });
        n.onclick = () => { window.focus(); openPauseSheet(); n.close(); };
      } catch { /* ignore */ }
    }
    document.title = `⏸ ${msg}`;
    showToast(msg, () => openPauseSheet());
  }, 30000);

  function showToast(msg, onOpen) {
    document.querySelector('.toast')?.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `<span>${esc(msg)}</span><button>${esc(t('start'))}</button><button aria-label="${esc(t('close'))}">×</button>`;
    const [go, x] = el.querySelectorAll('button');
    const dismiss = () => { el.remove(); document.title = baseTitle; };
    go.addEventListener('click', () => { dismiss(); onOpen(); });
    x.addEventListener('click', dismiss);
    document.body.appendChild(el);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    ui.installPrompt = e;
    if (ui.view === 'days' && state?.lang) render();
  });

  // ---------- Keyboard shortcuts (desktop) ----------

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || !state?.lang || ui.onboarding) return;
    if (e.target.closest?.('input, textarea, select, [contenteditable]') || document.querySelector('.breath-overlay')) return;
    const k = e.key.toLowerCase();
    if (k >= '1' && k <= '7' && ui.view === 'today') {
      app.querySelectorAll('[data-action="mood"]')[Number(k) - 1]?.click();
    } else if (k === 'p') {
      openPauseSheet();
    } else if (k === 't' || k === 'd') {
      app.querySelector(`[data-action="set-view"][data-view="${k === 't' ? 'today' : 'days'}"]`)?.click();
    } else return;
    e.preventDefault();
  });

  // ---------- Boot ----------

  function render() {
    if (ui.onboarding || !state?.lang || !C.ui[state.lang]) renderOnboarding();
    else {
      document.documentElement.lang = state.lang;
      if (ui.view === 'days') renderDays();
      else renderToday();
    }
    setTimeout(() => app.classList.add('settled'), 1000);
  }

  // Եթե հավելվածը բաց է մնացել կեսգիշերից հետո՝ վերադառնալիս թարմացնել օրը։
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state?.lang && state.lastDate !== todayKey()) {
      syncDay();
      render();
    }
  });

  if (profiles.active && profiles.list.some((p) => p.id === profiles.active)) loadProfile(profiles.active);
  render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
