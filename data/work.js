/*
 * Աշխատանքային օրվա հնարավորություններ (զբաղված բանկային աշխատողի համար).
 *  - resets: 1 րոպեանոց «Դադար» պրակտիկաներ (ընդմիջումների միջև)
 *  - eveningWork: «Աշխատանքային օրվա փակում» (աշխատանքային օրերին), eveningWeekend՝ հանգստյան օրերին
 *  - recommend: ըստ տրամադրության առաջարկվող պրակտիկաները
 *  - ui: նոր տեքստերը (միաձուլվում են C.ui-ի հետ)
 *
 * Աղբյուրները՝ docs/research-v2.md։
 *  - Cyclic sighing, box breathing — Balban et al., Cell Reports Medicine (2023)
 *  - 20-20-20 — American Optometric Association
 *  - Micro-breaks — Albulescu et al., PLOS ONE (2022)
 *  - Psychological detachment — Sonnentag & Fritz (2007)
 *
 * Պրակտիկայի տեսակներ.
 *  breath — ցիկլ [{ p: 'in'|'in2'|'out'|'hold', s: վրկ, l: տեքստ }] × cycles
 *  steps  — հաջորդական քայլեր [{ s: վրկ, l: տեքստ }]
 *  write  — գրառում ժամանակաչափով
 */
window.MC_WORK = {
  resets: [
    {
      id: 'sigh',
      kind: 'breath',
      cycles: 6,
      name: { hy: 'Ֆիզիոլոգիական հառաչ', ru: 'Циклический вздох', en: 'Cyclic sighing' },
      about: { hy: 'Երկու ներշնչում քթով և երկար արտաշնչում բերանով։ Ամենաարագ ձևը՝ հանգստանալու։', ru: 'Два вдоха носом и долгий выдох ртом. Самый быстрый способ успокоиться.', en: 'Two inhales through the nose and a long exhale through the mouth. The quickest way to settle.' },
      pattern: [
        { p: 'in', s: 2, l: { hy: 'Ներշնչիր քթով', ru: 'Вдох носом', en: 'Inhale through the nose' } },
        { p: 'in2', s: 1, l: { hy: 'Եվս մեկ կարճ ներշնչում', ru: 'Ещё один короткий вдох', en: 'One more short inhale' } },
        { p: 'out', s: 6, l: { hy: 'Երկար, դանդաղ արտաշնչիր բերանով', ru: 'Долгий, медленный выдох ртом', en: 'Long, slow exhale through the mouth' } }
      ]
    },
    {
      id: 'box',
      kind: 'breath',
      cycles: 4,
      name: { hy: 'Քառակուսի շնչառություն', ru: 'Квадратное дыхание', en: 'Box breathing' },
      about: { hy: '4 վայրկյան ներշնչում, պահում, արտաշնչում, պահում։ Օգնում է կենտրոնանալ կարևոր զանգից առաջ։', ru: '4 секунды вдох, задержка, выдох, задержка. Помогает собраться перед важным звонком.', en: '4 seconds in, hold, out, hold. Helps you focus before an important call.' },
      pattern: [
        { p: 'in', s: 4, l: { hy: 'Ներշնչիր', ru: 'Вдох', en: 'Inhale' } },
        { p: 'hold', s: 4, l: { hy: 'Պահիր', ru: 'Задержка', en: 'Hold' } },
        { p: 'out', s: 4, l: { hy: 'Արտաշնչիր', ru: 'Выдох', en: 'Exhale' } },
        { p: 'hold', s: 4, l: { hy: 'Պահիր', ru: 'Задержка', en: 'Hold' } }
      ]
    },
    {
      id: 'eyes',
      kind: 'steps',
      name: { hy: 'Աչքերի ընդմիջում 20-20-20', ru: 'Перерыв для глаз 20-20-20', en: '20-20-20 eye break' },
      about: { hy: 'Ամեն 20 րոպե էկրանից հետո 20 վայրկյան նայիր մոտ 6 մետր հեռու։', ru: 'Каждые 20 минут у экрана смотри 20 секунд на предмет примерно в 6 метрах.', en: 'Every 20 minutes at a screen, look about 6 metres away for 20 seconds.' },
      steps: [
        { s: 20, l: { hy: 'Նայիր որևէ բանի առնվազն 6 մետր հեռու', ru: 'Посмотри на что-нибудь минимум в 6 метрах', en: 'Look at something at least 6 metres away' } },
        { s: 10, l: { hy: 'Դանդաղ թարթիր մի քանի անգամ', ru: 'Медленно моргни несколько раз', en: 'Blink slowly a few times' } }
      ]
    },
    {
      id: 'neck',
      kind: 'steps',
      name: { hy: 'Պարանոց և ուսեր', ru: 'Шея и плечи', en: 'Neck and shoulders' },
      about: { hy: 'Թեթև շարժումներ նստած՝ երկար աշխատանքից հետո։', ru: 'Лёгкие движения сидя после долгой работы.', en: 'Gentle seated moves after long desk work.' },
      steps: [
        { s: 10, l: { hy: 'Դանդաղ պտտիր ուսերդ հետ, 5 անգամ', ru: 'Медленно вращай плечами назад, 5 раз', en: 'Roll your shoulders back slowly, 5 times' } },
        { s: 10, l: { hy: 'Գլուխդ թեքիր ձախ, ականջը դեպի ուսը', ru: 'Наклони голову влево, ухом к плечу', en: 'Tilt your head left, ear toward your shoulder' } },
        { s: 10, l: { hy: 'Հիմա՝ աջ', ru: 'Теперь вправо', en: 'Now to the right' } },
        { s: 10, l: { hy: 'Բարձրացրու ուսերդ մինչև ականջներ… և բաց թող', ru: 'Подними плечи к ушам… и отпусти', en: 'Lift your shoulders to your ears… and let them drop' } },
        { s: 10, l: { hy: 'Ձգիր ձեռքերդ վեր և արտաշնչիր', ru: 'Потянись руками вверх и выдохни', en: 'Stretch your arms up and breathe out' } }
      ]
    },
    {
      id: 'ground',
      kind: 'steps',
      name: { hy: 'Վերադարձ ներկային 5-4-3-2-1', ru: 'Заземление 5-4-3-2-1', en: '5-4-3-2-1 grounding' },
      about: { hy: 'Ուշադրությունը մտքերից վերադարձնում է ներկա պահին։', ru: 'Возвращает внимание из мыслей в настоящий момент.', en: 'Brings your attention from your thoughts back to the present.' },
      steps: [
        { s: 10, l: { hy: 'Գտիր 5 բան, որ տեսնում ես', ru: 'Найди 5 вещей, которые видишь', en: 'Find 5 things you can see' } },
        { s: 10, l: { hy: '4 բան, որ կարող ես շոշափել', ru: '4 вещи, которых можешь коснуться', en: '4 things you can touch' } },
        { s: 10, l: { hy: '3 ձայն, որ լսում ես', ru: '3 звука, которые слышишь', en: '3 sounds you can hear' } },
        { s: 10, l: { hy: '2 հոտ, որ զգում ես', ru: '2 запаха, которые чувствуешь', en: '2 things you can smell' } },
        { s: 10, l: { hy: '1 լավ բան հենց այս պահին', ru: '1 хорошая вещь прямо сейчас', en: '1 good thing about right now' } }
      ]
    },
    {
      id: 'dump',
      kind: 'write',
      s: 60,
      name: { hy: 'Մտքերի դատարկում', ru: 'Разгрузка мыслей', en: 'Brain dump' },
      about: { hy: '1 րոպե գրիր ամեն ինչ, ինչ գլխումդ է։ Հետո ընտրիր մեկ հաջորդ քայլ։', ru: '1 минуту записывай всё, что в голове. Потом выбери один следующий шаг.', en: 'For 1 minute, write everything on your mind. Then pick one next step.' },
      prompt: { hy: 'Գրիր ամեն ինչ, առանց դասավորելու…', ru: 'Пиши всё подряд, не сортируя…', en: 'Write it all down, no sorting…' },
      after: { hy: 'Հիմա ընտրիր մեկ բան, որը կանես հաջորդը։ Մնացածը կսպասի։', ru: 'Теперь выбери одно, что сделаешь следующим. Остальное подождёт.', en: 'Now pick one thing to do next. The rest can wait.' }
    }
  ],

  // Ըստ տրամադրության՝ առաջին երկու առաջարկը (եթե օգտատիրոջ գնահատականները այլ բան չեն ասում)
  recommend: {
    great: ['eyes', 'neck'],
    calm: ['eyes', 'box'],
    stressed: ['sigh', 'ground'],
    angry: ['sigh', 'box'],
    sad: ['ground', 'neck'],
    tired: ['neck', 'eyes'],
    unmotivated: ['dump', 'neck']
  },

  // Աշխատանքային օրերին (երկ–ուրբ) երեկոյան՝ օրվա փակում. օգնում է «անջատվել» աշխատանքից։
  eveningWork: [
    { hy: 'Ի՞նչ ավարտեցիր կամ առաջ տարար այսօր։', ru: 'Что сегодня удалось закончить или продвинуть?', en: 'What did you finish or move forward today?' },
    { hy: 'Ո՞րն է վաղվա առաջին գործը։', ru: 'Какое первое дело на завтра?', en: "What's the first task for tomorrow?" },
    { hy: 'Ի՞նչ կանես այս երեկո քեզ համար, ոչ թե աշխատանքի։', ru: 'Что ты сделаешь этим вечером для себя, а не для работы?', en: 'What will you do this evening for yourself, not for work?' }
  ],

  ui: {
    hy: {
      pause: 'Դադար',
      pauseTitle: '1 րոպե քեզ համար',
      pauseIntro: 'Ընտրիր կարճ պրակտիկա. կարելի է անել աշխատավայրում, երկու հանդիպման միջև։',
      recommended: 'Առաջարկում ենք',
      helpedBefore: 'Նախկինում օգնել է',
      seconds: '{n} վրկ',
      start: 'Սկսել',
      helped: 'Օգնե՞ց',
      helpYes: 'Այո',
      helpBit: 'Մի փոքր',
      helpNo: 'Ոչ',
      thanks: 'Շնորհակալություն։ Կհիշենք, թե ինչն է քեզ օգնում։',
      tryNow: 'Փորձիր հիմա',
      workClose: 'Աշխատանքային օրվա փակում',
      workClosed: 'Աշխատանքային օրը փակված է։ Գործերը կսպասեն մինչև վաղը։ Հիմա քո ժամանակն է։',
      groupWork: 'Աշխատանք',
      groupLife: 'Կյանք',
      weekTitle: 'Քո շաբաթը',
      weekDays: '{n} / 7 օր check-in',
      weekPleasant: 'Հաճելի',
      weekHeavy: 'Ծանր',
      weekHeavyTags: 'Ծանր օրերին հաճախ',
      weekGoodTags: 'Լավ օրերին հաճախ',
      weekBright: 'Լավ պահեր',
      weekHelpful: 'Քեզ ամենից շատ օգնում է',
      weekTry: 'Հաջորդ շաբաթ փորձիր',
      weekEmpty: 'Այս շաբաթ դեռ check-in չկա։ Օրական մեկ կարճ check-in-ը բավական է, որ օրինաչափություններ երևան։',
      sugHeavy: 'Այս շաբաթ շատ ծանր օրեր կային։ Մեղմ եղիր քո հանդեպ։ Եթե սա շարունակվի, խոսիր վստահելի մարդու կամ մասնագետի հետ։',
      sugDeadlines: 'Ժամկետները և ծանրաբեռնվածությունը հաճախ ուղեկցում էին ծանր օրերին։ Երեկոյան գրիր վաղվա առաջին գործը, որ առավոտը սկսես պարզ պլանով։',
      sugMeetings: 'Հանդիպումները հաճախ ուղեկցում էին ծանր օրերին։ Փորձիր 1 րոպե դադար հենց հանդիպումից հետո։',
      sugClients: 'Հաճախորդների հետ շփումը հաճախ ուղեկցում էր ծանր օրերին։ Բարդ զրույցից հետո փորձիր ֆիզիոլոգիական հառաչը։',
      sugScreens: 'Էկրանները հաճախ ուղեկցում էին ծանր օրերին։ Փորձիր 20-20-20 ընդմիջումը։',
      sugSleep: 'Քունը հաճախ ուղեկցում էր ծանր օրերին։ Փորձիր այս շաբաթ մեկ երեկո ավելի վաղ քնել։',
      sugGood: 'Օրերիդ մեծ մասը հաճելի էր։ Նկատիր, թե ինչ արեցիր այլ կերպ, և պահիր դա։',
      sugDefault: 'Օրական մեկ check-in և մեկ կարճ դադար բավական են սկսելու համար։',
      tipHelpful: 'Օգտակար էր',
      tipNot: 'Ինձ համար չէ',
      breakTitle: 'Ընդմիջման հիշեցում',
      breakHint: 'Մինչ էջը բաց է, հավելվածը կհիշեցնի կարճ դադարի մասին։ Կարճ ընդմիջումները նվազեցնում են հոգնածությունը։',
      breakOff: 'Անջատված',
      breakEvery: 'Ամեն {n} րոպե',
      breakNow: 'Ժամանակն է 1 րոպե դադարի',
      install: 'Տեղադրել որպես հավելված',
      shortcuts: 'Ստեղներ. 1–7՝ տրամադրություն · P՝ դադար · T՝ Այսօր · D՝ Իմ օրերը',
      dumpSaved: 'Մտքերի դատարկում',
      yesDelete: 'Այո, ջնջել',
      cancel: 'Չեղարկել',
      deleteAll: 'Ջնջել բոլոր պրոֆիլները և սկսել նորից',
      deleteAllTitle: 'Ջնջել բոլոր պրոֆիլները',
      deleteAllText: 'Այս դիտարկիչի բոլոր պրոֆիլները ({n}) և նրանց բոլոր գրառումները կջնջվեն։ Սա հնարավոր չէ հետ բերել։ Համաձա՞յն ես։',
      yesDeleteAll: 'Այո, ջնջել բոլորը',
      keepTitle: 'Այս դիտարկիչում մի քանի պրոֆիլ կա',
      keepIntro: 'Հիմա մեկ դիտարկիչում կարող է լինել միայն մեկ օգտատեր, որ մեկ մարդու գրառումները հասանելի չլինեն մյուսին։ Ընտրիր այն պրոֆիլը, որը պետք է մնա։',
      keepConfirmTitle: 'Պահել «{name}» պրոֆիլը',
      keepConfirmText: 'Մյուս պրոֆիլները ({n}) և նրանց բոլոր գրառումները կջնջվեն։ Սա հնարավոր չէ հետ բերել։ Համաձա՞յն ես։'
    },
    ru: {
      pause: 'Пауза',
      pauseTitle: '1 минута для себя',
      pauseIntro: 'Выбери короткую практику: её можно сделать на рабочем месте, между встречами.',
      recommended: 'Рекомендуем',
      helpedBefore: 'Помогало раньше',
      seconds: '{n} сек',
      start: 'Начать',
      helped: 'Помогло?',
      helpYes: 'Да',
      helpBit: 'Немного',
      helpNo: 'Нет',
      thanks: 'Спасибо. Мы запомним, что тебе помогает.',
      tryNow: 'Попробуй сейчас',
      workClose: 'Закрытие рабочего дня',
      workClosed: 'Рабочий день закрыт. Дела подождут до завтра. Теперь это твоё время.',
      groupWork: 'Работа',
      groupLife: 'Жизнь',
      weekTitle: 'Твоя неделя',
      weekDays: 'Check-in: {n} из 7 дней',
      weekPleasant: 'Приятные',
      weekHeavy: 'Тяжёлые',
      weekHeavyTags: 'В тяжёлые дни часто',
      weekGoodTags: 'В хорошие дни часто',
      weekBright: 'Хорошие моменты',
      weekHelpful: 'Тебе больше всего помогает',
      weekTry: 'На следующей неделе попробуй',
      weekEmpty: 'На этой неделе ещё нет check-in. Одного короткого check-in в день достаточно, чтобы увидеть закономерности.',
      sugHeavy: 'На этой неделе было много тяжёлых дней. Будь бережнее к себе. Если это продолжится, поговори с близким человеком или специалистом.',
      sugDeadlines: 'Дедлайны и нагрузка часто сопровождали тяжёлые дни. Вечером записывай первое дело на завтра, чтобы начинать утро с ясного плана.',
      sugMeetings: 'Встречи часто сопровождали тяжёлые дни. Попробуй паузу на 1 минуту сразу после встречи.',
      sugClients: 'Общение с клиентами часто сопровождало тяжёлые дни. После сложного разговора попробуй циклический вздох.',
      sugScreens: 'Экраны часто сопровождали тяжёлые дни. Попробуй перерыв 20-20-20.',
      sugSleep: 'Сон часто сопровождал тяжёлые дни. Попробуй на этой неделе один вечер лечь пораньше.',
      sugGood: 'Большинство дней были приятными. Заметь, что ты делаешь иначе, и сохрани это.',
      sugDefault: 'Для начала достаточно одного check-in и одной короткой паузы в день.',
      tipHelpful: 'Полезно',
      tipNot: 'Не про меня',
      breakTitle: 'Напоминание о перерыве',
      breakHint: 'Пока страница открыта, приложение напомнит о короткой паузе. Короткие перерывы снижают усталость.',
      breakOff: 'Выключено',
      breakEvery: 'Каждые {n} мин',
      breakNow: 'Время для паузы на 1 минуту',
      install: 'Установить как приложение',
      shortcuts: 'Клавиши: 1–7 настроение · P пауза · T Сегодня · D Мои дни',
      dumpSaved: 'Разгрузка мыслей',
      yesDelete: 'Да, удалить',
      cancel: 'Отмена',
      deleteAll: 'Удалить все профили и начать заново',
      deleteAllTitle: 'Удалить все профили',
      deleteAllText: 'Все профили этого браузера ({n}) и все их записи будут удалены. Это нельзя отменить. Подтверждаешь?',
      yesDeleteAll: 'Да, удалить все',
      keepTitle: 'В этом браузере несколько профилей',
      keepIntro: 'Теперь в одном браузере может быть только один пользователь, чтобы записи одного человека не были доступны другому. Выбери профиль, который нужно оставить.',
      keepConfirmTitle: 'Оставить профиль «{name}»',
      keepConfirmText: 'Остальные профили ({n}) и все их записи будут удалены. Это нельзя отменить. Подтверждаешь?'
    },
    en: {
      pause: 'Pause',
      pauseTitle: '1 minute for you',
      pauseIntro: 'Pick a short practice. You can do it at your desk, between meetings.',
      recommended: 'Suggested',
      helpedBefore: 'Helped you before',
      seconds: '{n} sec',
      start: 'Start',
      helped: 'Did it help?',
      helpYes: 'Yes',
      helpBit: 'A little',
      helpNo: 'No',
      thanks: "Thanks. We'll remember what helps you.",
      tryNow: 'Try it now',
      workClose: 'Close the workday',
      workClosed: 'Workday closed. Work can wait until tomorrow. This time is yours now.',
      groupWork: 'Work',
      groupLife: 'Life',
      weekTitle: 'Your week',
      weekDays: 'Checked in {n} of 7 days',
      weekPleasant: 'Pleasant',
      weekHeavy: 'Heavy',
      weekHeavyTags: 'Often on heavy days',
      weekGoodTags: 'Often on good days',
      weekBright: 'Good moments',
      weekHelpful: 'What helps you most',
      weekTry: 'Next week, try',
      weekEmpty: 'No check-ins this week yet. One short check-in a day is enough to start seeing patterns.',
      sugHeavy: 'This week had many heavy days. Be gentle with yourself. If it continues, talk to someone you trust or a specialist.',
      sugDeadlines: 'Deadlines and workload often came with heavy days. In the evening, write down tomorrow’s first task so the morning starts with a clear plan.',
      sugMeetings: 'Meetings often came with heavy days. Try a 1-minute pause right after a meeting.',
      sugClients: 'Client conversations often came with heavy days. After a hard conversation, try cyclic sighing.',
      sugScreens: 'Screen time often came with heavy days. Try the 20-20-20 eye break.',
      sugSleep: 'Sleep often came up on heavy days. Try going to bed earlier one evening this week.',
      sugGood: 'Most of your days were pleasant. Notice what you did differently and keep it.',
      sugDefault: 'One check-in and one short pause a day is enough to start.',
      tipHelpful: 'Helpful',
      tipNot: 'Not for me',
      breakTitle: 'Break reminder',
      breakHint: 'While this page is open, the app will remind you to take a short pause. Short breaks reduce fatigue.',
      breakOff: 'Off',
      breakEvery: 'Every {n} min',
      breakNow: 'Time for a 1-minute pause',
      install: 'Install as an app',
      shortcuts: 'Keys: 1–7 mood · P pause · T Today · D My days',
      dumpSaved: 'Brain dump',
      yesDelete: 'Yes, delete',
      cancel: 'Cancel',
      deleteAll: 'Delete all profiles and start again',
      deleteAllTitle: 'Delete all profiles',
      deleteAllText: 'All profiles in this browser ({n}) and all their notes will be deleted. This can’t be undone. Do you agree?',
      yesDeleteAll: 'Yes, delete all',
      keepTitle: 'This browser has several profiles',
      keepIntro: 'Now one browser can have only one user, so one person’s notes are never visible to another. Choose the profile to keep.',
      keepConfirmTitle: 'Keep the “{name}” profile',
      keepConfirmText: 'The other profiles ({n}) and all their notes will be deleted. This can’t be undone. Do you agree?'
    }
  }
};
