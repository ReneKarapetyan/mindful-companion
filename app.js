(() => {
  'use strict';

  const QUOTES = window.MC_QUOTES;
  const C = window.MC_CONTENT;
  const MQ = window.MC_MOOD_QUOTES;
  const J = window.MC_JOURNAL;
  const EM = window.MC_EMOTIONS;
  // Պրոֆիլներ. նույն սարքում մի քանի օգտատեր, ամեն մեկի տվյալները՝ առանձին բանալիով։
  const PROFILES_KEY = 'mindful-companion.profiles';
  const LEGACY_KEY = 'mindful-companion.v1';
  const LEGACY_DRAFT_KEY = 'mindful-companion.draft';
  const dataKey = (id) => `mindful-companion.p.${id}`;
  const draftKey = (id) => `mindful-companion.p.${id}.draft`;
  const NAME_MAX = 30;
  const LOCALES = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };
  const BREATH_IN_MS = 4000;
  const BREATH_OUT_MS = 6000;
  const BREATH_CYCLES = 6; // 6 × 10 վրկ = 1 րոպե
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
    selectedDate: null
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
    ctx.font = `${size}px "Noto Serif", "Noto Serif Armenian", Georgia, serif`;
    ctx.fillStyle = color('--ink');
    ctx.textBaseline = 'top';
    const lines = wrapLines(ctx, q.text, W - PAD * 2);
    const lh = size * 1.42;
    const blockH = lines.length * lh + 40 + 34;
    let y = Math.max(PAD + 100, (H - blockH) / 2);
    lines.forEach((l) => { ctx.fillText(l, PAD, y); y += lh; });

    ctx.font = `32px Inter, "Noto Sans Armenian", system-ui, sans-serif`;
    ctx.fillStyle = color('--muted');
    ctx.fillText(q.source ? `${q.author} · ${q.source}` : q.author, PAD, y + 40);
    ctx.font = `600 26px Inter, "Noto Sans Armenian", system-ui, sans-serif`;
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

  function currentQuestion(mood) {
    if (ui.jMood !== mood) {
      ui.jMood = mood;
      ui.guideIdx = firstUnanswered(mood);
      ui.followIdx = null;
    }
    const list = J.moods[mood];
    if (ui.guideIdx >= list.length) return { id: 'free', kind: 'free', q: J.free };
    const g = list[ui.guideIdx];
    if (ui.followIdx !== null) {
      return { id: `${mood}.${ui.guideIdx + 1}.${ui.followIdx + 1}`, kind: 'clarify', q: g.f[ui.followIdx] };
    }
    return { id: `${mood}.${ui.guideIdx + 1}`, kind: 'guide', q: g.q };
  }

  function nextGuide(mood) {
    ui.followIdx = null;
    ui.guideIdx = firstUnanswered(mood, ui.guideIdx + 1);
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
    else if (q.kind === 'clarify') {
      const followUps = J.moods[mood][ui.guideIdx].f;
      if (ui.followIdx + 1 < followUps.length) ui.followIdx += 1;
      else nextGuide(mood);
    }
    save();
    render();
    app.querySelector('#journal-input')?.focus({ preventScroll: true });
  }

  function eveningIndex() {
    const answered = answeredIds();
    const i = J.evening.findIndex((_, k) => !answered.has(`evening.${k + 1}`));
    return i === -1 ? null : i;
  }

  function saveEvening() {
    const text = ui.eveningDraft.trim();
    if (!text) return app.querySelector('#evening-input')?.focus();
    const i = eveningIndex();
    if (i === null) return;
    addEntry('evening', `evening.${i + 1}`, J.evening[i][state.lang], text);
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
          <div class="mark" aria-hidden="true"></div>
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
        <div class="mark" aria-hidden="true"></div>
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
            <div class="chips chips--small">
              ${C.tags.map((x) => `<button class="chip" data-action="tag" data-tag="${x.id}" aria-pressed="${d.tags.includes(x.id)}">${esc(x.label[lang])}</button>`).join('')}
            </div>
          </div>

          <div class="response mood--${mood.id}" role="status">
            <p>${esc(mood.response[lang])}</p>
            ${mood.breathing ? `<button class="breathe-btn" data-action="breathe">${esc(t('breathe'))}</button>` : ''}
          </div>

          ${needsSupport() ? `<p class="support-note" role="note">${esc(t('supportNote'))}</p>` : ''}` : ''}
      </section>`;
  }

  function journalHtml(mood) {
    const q = currentQuestion(mood);
    const isFollowUp = q.kind === 'clarify';
    const entries = today().journal.filter((e) => e.kind !== 'evening');

    return `
      <section class="journal mood--${mood}" aria-labelledby="journal-h">
        <h2 id="journal-h" class="section-h">${esc(t('journalTitle'))}</h2>
        <div class="card">
          ${isFollowUp ? `<p class="journal-tag">${esc(t('followUp'))}</p>` : ''}
          <label for="journal-input" class="journal-q">${esc(q.q[state.lang])}</label>
          <textarea id="journal-input" data-draft="journal" rows="4" placeholder="${esc(t('placeholder'))}">${esc(ui.draft)}</textarea>
          <div class="journal-actions">
            <button class="btn-primary" data-action="j-save">${esc(t('save'))}</button>
            ${isFollowUp
              ? `<button class="btn-ghost" data-action="j-skip">${esc(t('skip'))}</button>`
              : q.kind === 'guide' ? `<button class="btn-ghost" data-action="j-other">${esc(t('otherQuestion'))} ↻</button>` : ''}
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
    const entries = today().journal.filter((e) => e.kind === 'evening');
    return `
      <section class="journal evening" aria-labelledby="evening-h">
        <h2 id="evening-h" class="section-h">☾ ${esc(t('eveningTitle'))}</h2>
        <div class="card">
          ${i === null
            ? `<p class="evening-done">${esc(t('eveningDone'))}</p>`
            : `
              <label for="evening-input" class="journal-q">${esc(J.evening[i][state.lang])}</label>
              <textarea id="evening-input" data-draft="evening" rows="3" placeholder="${esc(t('placeholder'))}">${esc(ui.eveningDraft)}</textarea>
              <div class="journal-actions">
                <button class="btn-primary" data-action="e-save">${esc(t('save'))}</button>
                <span class="evening-step">${i + 1} / ${J.evening.length}</span>
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

      <article class="quote">
        <p class="quote-day">${esc(t('day', { n: state.dayCount }))}</p>
        <blockquote class="quote-text">${esc(quote.text[lang])}</blockquote>
        <div class="quote-foot">
          <p class="quote-source">${esc(quote.author)}<span class="dot" aria-hidden="true">·</span><cite>${esc(quote.book[lang])}</cite></p>
          ${quoteActions(`d:${quote.id}`)}
        </div>
      </article>

      ${checkinHtml(d)}

      ${mood ? journalHtml(mood.id) : ''}

      ${isEvening ? eveningHtml() : ''}

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

      <footer class="footnote"><p>${esc(t('tomorrow'))}</p></footer>`;
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
      <p class="data-links">${esc(t('myData'))}:
        <button data-action="export" data-format="json">JSON</button>
        <button data-action="export" data-format="csv">CSV</button>
      </p>`;
  }

  function renderDays() {
    app.innerHTML = `
      ${headerHtml()}
      <div class="days">
        ${streakHtml()}
        ${calendarHtml()}
        ${dayDetailHtml()}
        ${distributionHtml()}
        ${insightsHtml()}
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
    breathe: () => { openBreathing(); return false; },
    'mq-step': (el) => { stepMoodQuote(today().mood, Number(el.dataset.step)); return false; },
    'j-save': () => { saveJournal(); return false; },
    'j-other': () => { ui.guideIdx = firstUnanswered(today().mood, ui.guideIdx + 1); },
    'j-skip': () => { nextGuide(today().mood); },
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

  // ---------- Breathing practice ----------

  function openBreathing() {
    const overlay = document.createElement('div');
    overlay.className = 'breath-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="breath-circle" aria-hidden="true"></div>
      <p class="breath-label" aria-live="polite"></p>
      <div class="breath-progress" aria-hidden="true"><span></span></div>
      <button class="breath-close">${esc(t('close'))}</button>`;
    document.body.appendChild(overlay);

    const circle = overlay.querySelector('.breath-circle');
    const label = overlay.querySelector('.breath-label');
    const bar = overlay.querySelector('.breath-progress span');
    const closeBtn = overlay.querySelector('.breath-close');
    const timers = [];
    const total = BREATH_CYCLES * (BREATH_IN_MS + BREATH_OUT_MS);

    const close = () => {
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      app.querySelector('.breathe-btn')?.focus();
    };
    const onKey = (e) => e.key === 'Escape' && close();
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    closeBtn.focus();

    const phase = (inhale) => {
      circle.style.transitionDuration = `${inhale ? BREATH_IN_MS : BREATH_OUT_MS}ms`;
      circle.classList.toggle('is-in', inhale);
      label.textContent = t(inhale ? 'inhale' : 'exhale');
    };

    for (let i = 0; i < BREATH_CYCLES; i++) {
      const start = i * (BREATH_IN_MS + BREATH_OUT_MS);
      timers.push(setTimeout(() => phase(true), start + 50));
      timers.push(setTimeout(() => phase(false), start + BREATH_IN_MS));
    }
    timers.push(setTimeout(() => {
      label.textContent = t('done');
      overlay.classList.add('is-done');
    }, total));

    void bar.offsetWidth; // force layout so the transition starts from scaleX(0)
    bar.style.transitionDuration = `${total}ms`;
    bar.style.transform = 'scaleX(1)';
  }

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
