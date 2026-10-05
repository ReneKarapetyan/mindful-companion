/*
 * «Կիսվիր օրով» բաժնի հարցերը։
 * Յուրաքանչյուր տրամադրության համար՝ ուղղորդող հարցեր (q), և յուրաքանչյուրից հետո՝ ճշգրտող հարցեր (f)։
 * Հարցի ID-ն ձևավորվում է ավտոմատ՝ «<mood>.<հարցի №>» և «<mood>.<հարցի №>.<ճշգրտողի №>», օր.՝ stressed.1.2։
 * Եթե ID-ները պետք են դաշբորդի համար, նոր հարցեր ավելացրու միայն ցուցակի վերջում։
 */
window.MC_JOURNAL = {
  free: {
    hy: "Ուրիշ ի՞նչ կուզենայիր գրել այսօրվա մասին։",
    ru: "Что ещё хочется записать о сегодняшнем дне?",
    en: "Anything else you'd like to write about today?"
  },

  // Երեկոյան ամփոփում (ցուցադրվում է 18:00-ից հետո)
  evening: [
    { hy: "Ի՞նչն էր այսօր լավ։", ru: "Что сегодня было хорошего?", en: "What went well today?" },
    { hy: "Ի՞նչ կուզենայիր վաղն այլ կերպ անել։", ru: "Что завтра хочется сделать иначе?", en: "What would you like to do differently tomorrow?" },
    { hy: "Ինչի՞ համար ես շնորհակալ այսօր։", ru: "За что сегодня хочется сказать спасибо?", en: "What are you thankful for today?" }
  ],

  moods: {
    calm: [
      {
        q: { hy: "Ի՞նչն է այսօր քեզ հանգստություն տվել։", ru: "Что сегодня подарило тебе спокойствие?", en: "What brought you this calm today?" },
        f: [
          { hy: "Ինչպե՞ս կարող ես սա ավելի հաճախ ստեղծել։", ru: "Как можно создавать это чаще?", en: "How could you create this more often?" },
          { hy: "Ո՞վ կամ ի՞նչն էր կողքիդ այդ պահին։", ru: "Кто или что было рядом в тот момент?", en: "Who or what was with you in that moment?" }
        ]
      },
      {
        q: { hy: "Ինչի՞ համար ես այսօր երախտապարտ։ Գրիր 3 բան։", ru: "За что сегодня хочется сказать спасибо? Назови 3 вещи.", en: "What are you grateful for today? Name three things." },
        f: [
          { hy: "Դրանցից ո՞րն է ամենակարևորը, և ինչո՞ւ։", ru: "Что из этого самое важное и почему?", en: "Which matters most, and why?" },
          { hy: "Կա՞ մեկը, ում կուզենայիր շնորհակալություն հայտնել։", ru: "Есть ли кто-то, кого хочется поблагодарить?", en: "Is there someone you'd like to thank?" }
        ]
      },
      {
        q: { hy: "Այս հանգիստ վիճակում ի՞նչ որոշում կամ միտք է պարզ դառնում։", ru: "Какое решение или мысль становится яснее в этом спокойствии?", en: "In this calm, what decision or thought becomes clearer?" },
        f: [
          { hy: "Ո՞րն է դրա առաջին քայլը։", ru: "Какой первый шаг?", en: "What's the first step?" },
          { hy: "Ի՞նչ կուզենայիր հիշել այս պահից։", ru: "Что хочется запомнить из этого момента?", en: "What would you like to remember from this moment?" }
        ]
      }
    ],

    angry: [
      {
        q: { hy: "Ի՞նչ պատահեց։ Նկարագրիր միայն փաստերը։", ru: "Что произошло? Опиши только факты.", en: "What happened? Describe just the facts." },
        f: [
          { hy: "Քո ո՞ր կարևոր արժեքն կամ սահմանն է խախտվել։", ru: "Какая важная для тебя ценность или граница была нарушена?", en: "Which value or boundary of yours was crossed?" },
          { hy: "Ինչպե՞ս կնայես սրան մեկ շաբաթ անց։", ru: "Как ты посмотришь на это через неделю?", en: "How will this look a week from now?" }
        ]
      },
      {
        q: { hy: "Ի՞նչ ես ուզում հիմա անել այս զայրույթով։", ru: "Что хочется сделать с этой злостью прямо сейчас?", en: "What do you feel like doing with this anger right now?" },
        f: [
          { hy: "Ի՞նչ հետևանք կունենա դա։", ru: "Какие у этого будут последствия?", en: "What would the consequences be?" },
          { hy: "Ո՞րն է ավելի խելացի քայլը, որը կպաշտպանի քո շահը։", ru: "Какой более мудрый шаг защитит твои интересы?", en: "What wiser step would protect what you care about?" }
        ]
      },
      {
        q: { hy: "Ի՞նչ կասեիր այդ մարդուն, եթե հետևանքներ չլինեին։", ru: "Что бы хотелось сказать этому человеку, если бы не было последствий?", en: "What would you say to that person if there were no consequences?" },
        f: [
          { hy: "Ինչպե՞ս կարող ես նույն միտքն ասել հանգիստ և հստակ։", ru: "Как сказать то же самое спокойно и ясно?", en: "How could you say the same thing calmly and clearly?" },
          { hy: "Ի՞նչ ես ուզում, որ փոխվի։", ru: "Что ты хочешь изменить?", en: "What do you want to change?" }
        ]
      }
    ],

    great: [
      {
        q: { hy: "Ո՞ր գործն ես այսօր անելու այդ էներգիայով։", ru: "Какое дело ты сделаешь сегодня с этой энергией?", en: "What will you take on today with this energy?" },
        f: [
          { hy: "Ո՞րն է դրա առաջին փոքր քայլը։", ru: "Какой у него первый маленький шаг?", en: "What's the first small step?" },
          { hy: "Ինչպե՞ս կիմանաս, որ այսօր հաջողվեց։", ru: "Как ты поймёшь, что сегодня всё получилось?", en: "How will you know today went well?" }
        ]
      },
      {
        q: { hy: "Ի՞նչն է այսօր քեզ էներգիա տվել։", ru: "Что сегодня дало тебе энергию?", en: "What gave you energy today?" },
        f: [
          { hy: "Ինչպե՞ս կարող ես սա ավելի հաճախ կրկնել։", ru: "Как можно повторять это чаще?", en: "How could you repeat this more often?" },
          { hy: "Ո՞վ էր կապված դրա հետ։", ru: "Кто был с этим связан?", en: "Who was part of it?" }
        ]
      },
      {
        q: { hy: "Ո՞ր հետաձգած գործը կարող ես այսօր վերջապես սկսել։", ru: "Какое отложенное дело ты можешь наконец начать сегодня?", en: "Which postponed task could you finally start today?" },
        f: [
          { hy: "Ի՞նչն էր խանգարում այն սկսել ավելի վաղ։", ru: "Что мешало начать его раньше?", en: "What kept you from starting it earlier?" },
          { hy: "Ի՞նչ կփոխվի, երբ այն ավարտես։", ru: "Что изменится, когда ты его закончишь?", en: "What will change once it's done?" }
        ]
      }
    ],

    tired: [
      {
        q: { hy: "Ո՞րն է այսօրվա միակ իսկապես կարևոր գործը։", ru: "Какое единственное по-настоящему важное дело на сегодня?", en: "What is the one truly important thing today?" },
        f: [
          { hy: "Ի՞նչը կարող ես հետաձգել կամ բաց թողնել առանց վնասի։", ru: "Что можно отложить или пропустить без вреда?", en: "What can you postpone or skip without harm?" },
          { hy: "Ո՞վ կարող է քեզ օգնել դրանում։", ru: "Кто может помочь тебе с этим?", en: "Who could help you with it?" }
        ]
      },
      {
        q: { hy: "Ի՞նչն է քեզ ամենաշատը հոգնեցնում վերջին օրերին։", ru: "Что больше всего утомляет тебя в последние дни?", en: "What has been draining you most lately?" },
        f: [
          { hy: "Դա ավելի շատ ֆիզիկակա՞ն հոգնածություն է, թե՞ էմոցիոնալ։", ru: "Это больше физическая или эмоциональная усталость?", en: "Is it more physical or emotional tiredness?" },
          { hy: "Ի՞նչ կարող ես այդ բեռից հանել հենց այսօր։", ru: "Что из этой нагрузки можно убрать уже сегодня?", en: "What part of that load could you drop today?" }
        ]
      },
      {
        q: { hy: "Ինչպե՞ս ես քնել վերջին գիշերները։", ru: "Каким был твой сон последние ночи?", en: "How have you been sleeping lately?" },
        f: [
          { hy: "Ի՞նչն է խանգարում ավելի շուտ քնել։", ru: "Что мешает ложиться раньше?", en: "What keeps you from going to bed earlier?" },
          { hy: "Ի՞նչ կարող ես այսօր երեկոյան անել այլ կերպ։", ru: "Что ты можешь сделать сегодня вечером по-другому?", en: "What could you do differently this evening?" }
        ]
      }
    ],

    stressed: [
      {
        q: { hy: "Ի՞նչն է հիմա քեզ լարվածություն պատճառում։", ru: "Что сейчас вызывает у тебя напряжение?", en: "What's causing you stress right now?" },
        f: [
          { hy: "Դրանից ի՞նչն է քո վերահսկողության տակ, և ի՞նչը՝ ոչ։", ru: "Что из этого под твоим контролем, а что — нет?", en: "Which parts are in your control, and which aren't?" },
          { hy: "Ո՞րն է ամենավատ սցենարը, և որքանո՞վ է այն իրական։", ru: "Каков худший сценарий и насколько он реален?", en: "What's the worst case, and how likely is it really?" }
        ]
      },
      {
        q: { hy: "Ո՞ր գործերն են քեզ վրա ճնշում։ Թվարկիր դրանք։", ru: "Какие дела давят на тебя? Перечисли их.", en: "Which tasks are weighing on you? List them." },
        f: [
          { hy: "Եթե միայն մեկը կարողանայիր անել, ո՞րը կլիներ։", ru: "Если бы можно было сделать только одно, что бы это было?", en: "If you could do only one, which would it be?" },
          { hy: "Ո՞րն է դրա ամենափոքր առաջին քայլը։", ru: "Какой у него самый маленький первый шаг?", en: "What's its tiniest first step?" }
        ]
      },
      {
        q: { hy: "Մարմնիդ ո՞ր մասում ես զգում լարվածությունը։", ru: "В какой части тела ты чувствуешь напряжение?", en: "Where in your body do you feel the tension?" },
        f: [
          { hy: "Ի՞նչն է նախկինում օգնել քեզ հանգստանալ։", ru: "Что раньше помогало тебе расслабиться?", en: "What has helped you relax before?" },
          { hy: "Ի՞նչ կարող ես անել քեզ համար հաջորդ 10 րոպեում։", ru: "Что ты можешь сделать для себя в ближайшие 10 минут?", en: "What could you do for yourself in the next 10 minutes?" }
        ]
      }
    ],

    sad: [
      {
        q: { hy: "Ի՞նչ ես զգում հիմա։ Գրիր այնպես, ինչպես կա։", ru: "Что ты чувствуешь сейчас? Напиши как есть.", en: "What are you feeling right now? Write it as it is." },
        f: [
          { hy: "Ե՞րբ սկսեցիր այսպես զգալ։", ru: "Когда появилось это чувство?", en: "When did this feeling start?" },
          { hy: "Ի՞նչ կասեիր մտերիմ ընկերոջդ, եթե նա այսպես զգար։", ru: "Если бы так чувствовал близкий друг, какие слова поддержки ему подошли бы?", en: "What would you say to a close friend who felt this way?" }
        ]
      },
      {
        q: { hy: "Ի՞նչը կարող է այսօր քեզ գոնե մի փոքր ջերմություն տալ։", ru: "Что сегодня может подарить тебе хоть немного тепла?", en: "What could bring you even a little comfort today?" },
        f: [
          { hy: "Ի՞նչն է խանգարում դա անել։", ru: "Что мешает это сделать?", en: "What's getting in the way of doing it?" },
          { hy: "Ե՞րբ կարող ես դա անել այսօր։", ru: "Когда сегодня ты можешь это сделать?", en: "When today could you do it?" }
        ]
      },
      {
        q: { hy: "Ո՞ւմ հետ կցանկանայիր խոսել։", ru: "С кем тебе хотелось бы поговорить?", en: "Who would you like to talk to?" },
        f: [
          { hy: "Ի՞նչ կցանկանայիր, որ նա իմանար։", ru: "Что бы тебе хотелось, чтобы этот человек знал?", en: "What would you want them to know?" },
          { hy: "Ի՞նչն է քեզ հետ պահում նրան գրելուց կամ զանգելուց։", ru: "Что удерживает тебя от того, чтобы написать или позвонить?", en: "What's holding you back from texting or calling?" }
        ]
      }
    ],

    unmotivated: [
      {
        q: { hy: "Ո՞ր փոքր գործը կարող ես անել հենց հիմա՝ 5 րոպեում։", ru: "Какое маленькое дело можно сделать прямо сейчас, за 5 минут?", en: "What small thing could you do right now, in 5 minutes?" },
        f: [
          { hy: "Ի՞նչ է պետք, որ այն սկսես։", ru: "Что нужно, чтобы начать?", en: "What do you need to get started?" },
          { hy: "Ինչպե՞ս ես քեզ զգում այդ 5 րոպեից հետո։", ru: "Как ты себя чувствуешь после этих 5 минут?", en: "How do you feel after those 5 minutes?" }
        ]
      },
      {
        q: { hy: "Հիշիր վերջին անգամը, երբ մոտիվացված էիր։ Ի՞նչն էր այն ժամանակ այլ։", ru: "Вспомни последний раз, когда была мотивация. Что тогда было иначе?", en: "Think of the last time you felt motivated. What was different then?" },
        f: [
          { hy: "Դրանից ի՞նչ կարող ես այսօր կրկնել։", ru: "Что из этого можно повторить сегодня?", en: "What from that could you repeat today?" },
          { hy: "Ի՞նչն է այսօր այլ։", ru: "Что сегодня по-другому?", en: "What's different today?" }
        ]
      },
      {
        q: { hy: "Ինչո՞ւ է այն գործը, որ պետք է անես, կարևոր քեզ համար։", ru: "Почему дело, которое нужно сделать, важно для тебя?", en: "Why does the thing you need to do matter to you?" },
        f: [
          { hy: "Ի՞նչ կլինի, եթե այն չանես։", ru: "Что будет, если его не сделать?", en: "What happens if you don't do it?" },
          { hy: "Դա իսկապես քո նպատա՞կն է, թե՞ ուրիշի ակնկալիքը։", ru: "Это действительно твоя цель или чьи-то ожидания?", en: "Is it truly your goal, or someone else's expectation?" }
        ]
      }
    ]
  }
};
