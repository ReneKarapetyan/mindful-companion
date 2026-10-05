/*
 * Էմոցիաների բառարան։ Ընտրվում է երկու քայլով՝ նախ ընտանիք (C.moods), հետո ըստ ցանկության կոնկրետ էմոցիա։
 *
 * Հիմք.
 *  - Marc Brackett, «Permission to Feel» (2019), Yale Center for Emotional Intelligence — Mood Meter.
 *    Էմոցիաները բաժանվում են ըստ էներգիայի (բարձր/ցածր) և հաճելիության (հաճելի/տհաճ)։
 *  - Robert Plutchik, «Emotion: A Psychoevolutionary Synthesis» (1980) — հիմնական էմոցիաների անիվը.
 *    ուրախություն, վստահություն, վախ, զարմանք, տխրություն, զզվանք, զայրույթ, սպասում։
 *  - Paul Ekman — 6 համընդհանուր հիմնական էմոցիաներ։
 *  - Brené Brown, «Atlas of the Heart» (2021) — մեղքի և ամոթի տարբերությունը։
 *  - Christina Maslach — այրման (burnout) եռաչափ մոդելը։
 * Նկարագրությունները մեր ձևակերպումն են, ոչ թե գրքերից մեջբերում։
 *
 * about  — ի՞նչ է այս էմոցիան
 * signal — ի՞նչ է այն ասում քեզ / ինչ անել
 */
window.MC_EMOTIONS = {
  // Mood Meter-ի քառակուսին ըստ ընտանիքի (դաշբորդի համար)
  quadrant: {
    great: "high-pleasant",
    calm: "low-pleasant",
    stressed: "high-unpleasant",
    angry: "high-unpleasant",
    sad: "low-unpleasant",
    tired: "low-unpleasant",
    unmotivated: "low-unpleasant"
  },

  list: {
    great: [
      { id: "joy",
        label: { hy: "Ուրախություն", ru: "Радость", en: "Joy" },
        about: { hy: "Հաճելի զգացում, երբ ինչ-որ լավ բան է կատարվում կամ իրականանում է ցանկալին։", ru: "Приятное чувство, когда происходит что-то хорошее или сбывается желаемое.", en: "The pleasant feeling of something good happening or a wish coming true." },
        signal: { hy: "Ցույց է տալիս, թե ինչն է քեզ համար իսկապես արժեքավոր։ Կիսված ուրախությունն ավելի ուժեղ է։", ru: "Показывает, что для тебя по-настоящему ценно. Разделённая радость становится сильнее.", en: "It shows what truly matters to you. Shared joy grows stronger." } },
      { id: "excitement",
        label: { hy: "Ոգևորություն", ru: "Воодушевление", en: "Excitement" },
        about: { hy: "Բարձր էներգիա՝ ինչ-որ լավ կամ նոր բանի սպասումով։", ru: "Высокая энергия в ожидании чего-то хорошего или нового.", en: "High energy in anticipation of something good or new." },
        signal: { hy: "Լավ պահ է նոր գործ սկսելու համար։ Ուղղիր էներգիան մեկ կոնկրետ նպատակի։", ru: "Хороший момент для нового начала — направь энергию на одну конкретную цель.", en: "A good moment to start something — channel the energy into one concrete goal." } },
      { id: "pride",
        label: { hy: "Հպարտություն", ru: "Гордость", en: "Pride" },
        about: { hy: "Բավականություն սեփական ջանքից կամ ձեռքբերումից։", ru: "Удовлетворение от собственных усилий или достижения.", en: "Satisfaction in your own effort or achievement." },
        signal: { hy: "Նկատիր, թե ինչն աշխատեց, որ կարողանաս կրկնել։", ru: "Заметь, что сработало, чтобы повторить это снова.", en: "Notice what worked so you can repeat it." } },
      { id: "hope",
        label: { hy: "Հույս", ru: "Надежда", en: "Hope" },
        about: { hy: "Համոզմունք, որ ապագան կարող է լավը լինել, և դու կարող ես ազդել դրա վրա։", ru: "Убеждённость, что будущее может быть хорошим и ты можешь на него влиять.", en: "The belief that the future can be good and that you can influence it." },
        signal: { hy: "Հույսն ամրանում է պլանով. գրիր նպատակը և դրա առաջին քայլը։", ru: "Надежда крепнет, когда есть план: запиши цель и первый шаг.", en: "Hope grows with a plan: write down the goal and the first step." } },
      { id: "curiosity",
        label: { hy: "Հետաքրքրասիրություն", ru: "Любопытство", en: "Curiosity" },
        about: { hy: "Ցանկություն իմանալու, հասկանալու կամ փորձելու նոր բան։", ru: "Желание узнать, понять или попробовать что-то новое.", en: "The desire to learn, understand or try something new." },
        signal: { hy: "Միտքդ պատրաստ է սովորելու. լավ ժամանակ է կարդալու կամ նոր հմտության համար։", ru: "Ум готов учиться — хорошее время для чтения или нового навыка.", en: "Your mind is ready to learn — a great time for reading or a new skill." } }
    ],

    calm: [
      { id: "calm",
        label: { hy: "Խաղաղություն", ru: "Умиротворение", en: "Peaceful" },
        about: { hy: "Խաղաղ, հավասարակշռված վիճակ՝ առանց լարվածության։", ru: "Мирное, уравновешенное состояние без напряжения.", en: "A peaceful, balanced state without tension." },
        signal: { hy: "Լավ պահ է մտածված որոշումների համար. միտքը պարզ է։", ru: "Хороший момент для взвешенных решений — ум ясен.", en: "A good time for thoughtful decisions — your mind is clear." } },
      { id: "gratitude",
        label: { hy: "Երախտագիտություն", ru: "Благодарность", en: "Gratitude" },
        about: { hy: "Գիտակցում, որ ստացել ես ինչ-որ լավ բան՝ մարդկանցից կամ կյանքից։", ru: "Осознание, что ты получаешь что-то хорошее — от людей или от жизни.", en: "Recognizing the good you've received from people or from life." },
        signal: { hy: "Երախտագիտությունն ամրացնում է հարաբերությունները։ Կարող ես այսօր այն արտահայտել որևէ մեկին։", ru: "Благодарность укрепляет отношения — можно выразить её кому-то сегодня.", en: "Gratitude strengthens relationships — consider expressing it to someone today." } },
      { id: "content",
        label: { hy: "Բավարարվածություն", ru: "Удовлетворённость", en: "Content" },
        about: { hy: "Զգացում, որ այն, ինչ կա հիմա, բավական է։", ru: "Ощущение, что того, что есть сейчас, достаточно.", en: "The sense that what you have right now is enough." },
        signal: { hy: "Նկատիր, թե ինչն է ստեղծում այս զգացումը. սա քո հանգստի աղբյուրն է։", ru: "Заметь, что создаёт это чувство — это твой источник покоя.", en: "Notice what creates this feeling — it's your source of peace." } },
      { id: "relief",
        label: { hy: "Թեթևացում", ru: "Облегчение", en: "Relief" },
        about: { hy: "Զգացում, որ ծանր բանն անցավ, կամ վախը չիրականացավ։", ru: "Чувство, что тяжёлое позади или страх не сбылся.", en: "The feeling that something hard has passed or a fear didn't come true." },
        signal: { hy: "Ժամանակ տուր քեզ վերականգնվելու համար. մարմինը դուրս է գալիս լարվածությունից։", ru: "Дай себе время восстановиться — тело выходит из напряжения.", en: "Give yourself time to recover — your body is coming out of tension." } }
    ],

    stressed: [
      { id: "anxiety",
        label: { hy: "Անհանգստություն", ru: "Тревога", en: "Anxiety" },
        about: { hy: "Լարվածություն ապագայի անորոշ վտանգի կամ վատ սցենարի պատճառով։", ru: "Напряжение из-за неопределённой угрозы или плохого сценария в будущем.", en: "Tension about an uncertain threat or a bad scenario in the future." },
        signal: { hy: "Միտքդ փորձում է քեզ պաշտպանել։ Տարանջատիր՝ ինչն է քո վերահսկողության տակ, և ինչը՝ ոչ։", ru: "Ум пытается тебя защитить. Раздели: что в твоей власти, а что нет.", en: "Your mind is trying to protect you. Separate what's in your control from what isn't." } },
      { id: "fear",
        label: { hy: "Վախ", ru: "Страх", en: "Fear" },
        about: { hy: "Արձագանք կոնկրետ՝ իրական կամ ընկալվող վտանգի։", ru: "Реакция на конкретную — реальную или воспринимаемую — опасность.", en: "A response to a specific danger, real or perceived." },
        signal: { hy: "Հարցրու քեզ՝ վտանգն իրակա՞ն է հենց հիմա։ Եթե այո՝ գործիր, եթե ոչ՝ շնչիր և դանդաղիր։", ru: "Спроси себя: опасность реальна прямо сейчас? Если да — действуй, если нет — дыши и замедлись.", en: "Ask yourself: is the danger real right now? If yes, act; if not, breathe and slow down." } },
      { id: "overwhelm",
        label: { hy: "Ծանրաբեռնվածություն", ru: "Перегруженность", en: "Overwhelmed" },
        about: { hy: "Զգացում, որ պահանջները գերազանցում են քո ուժերն ու ժամանակը։", ru: "Ощущение, что требования превышают твои силы и время.", en: "The feeling that demands exceed your energy and time." },
        signal: { hy: "Ժամանակն է առաջնահերթություններ դնելու. ընտրիր մեկ գործ, մնացածը մի կողմ դիր։", ru: "Время расставить приоритеты: выбери одно дело, остальное отложи.", en: "Time to prioritize: pick one task and set the rest aside." } },
      { id: "nervous",
        label: { hy: "Հուզմունք", ru: "Волнение", en: "Nervous" },
        about: { hy: "Անհանգստություն կարևոր իրադարձությունից առաջ՝ ելույթ, քննություն, հանդիպում։", ru: "Волнение перед важным событием: выступление, экзамен, встреча.", en: "Unease before an important event: a talk, an exam, a meeting." },
        signal: { hy: "Սա նշան է, որ քեզ համար կարևոր է։ Նույն էներգիան ուղղիր պատրաստվելուն։", ru: "Это знак, что тебе не всё равно. Ту же энергию направь на подготовку.", en: "It means you care. Channel that same energy into preparation." } }
    ],

    angry: [
      { id: "anger",
        label: { hy: "Զայրույթ", ru: "Гнев", en: "Anger" },
        about: { hy: "Ուժեղ արձագանք անարդարության կամ քո սահմանների խախտման։", ru: "Сильная реакция на несправедливость или нарушение твоих границ.", en: "A strong reaction to injustice or to your boundaries being crossed." },
        signal: { hy: "Զայրույթը ցույց է տալիս, թե ինչն է քեզ համար կարևոր։ Նախ հանդարտվիր, հետո որոշիր՝ ինչպես պաշտպանել դա։", ru: "Гнев показывает, что для тебя важно. Сначала успокойся, потом реши, как это защитить.", en: "Anger shows what matters to you. Calm down first, then decide how to protect it." } },
      { id: "irritation",
        label: { hy: "Ջղայնություն", ru: "Раздражение", en: "Irritated" },
        about: { hy: "Զայրույթի թեթև ձև՝ մանր խոչընդոտների կամ կրկնվող անհարմարությունների պատճառով։", ru: "Лёгкая форма злости из-за мелких помех или повторяющихся неудобств.", en: "A mild form of anger from small obstacles or repeated annoyances." },
        signal: { hy: "Հաճախ կապված է հոգնածության կամ քաղցի հետ։ Ստուգիր՝ արդյոք հանգիստ կամ սնունդ պետք չէ։", ru: "Часто связано с усталостью или голодом. Проверь, не нужен ли отдых или еда.", en: "Often linked to tiredness or hunger. Check whether you need rest or food." } },
      { id: "frustration",
        label: { hy: "Անզորություն", ru: "Фрустрация", en: "Frustrated" },
        about: { hy: "Զգացում, երբ ջանք ես գործադրում, բայց ինչ-որ բան խանգարում է հասնել նպատակին։", ru: "Чувство, когда прилагаешь усилия, но что-то мешает достичь цели.", en: "The feeling of putting in effort while something blocks your goal." },
        signal: { hy: "Փոխիր մոտեցումը, ոչ թե նպատակը. փորձիր այլ ճանապարհ կամ օգնություն խնդրիր։", ru: "Меняй подход, а не цель: попробуй другой путь или попроси помощи.", en: "Change the approach, not the goal: try another way or ask for help." } },
      { id: "resentment",
        label: { hy: "Վիրավորանք", ru: "Обида", en: "Resentment" },
        about: { hy: "Երկար պահվող ցավ այն բանի համար, որ քեզ հետ անարդար են վարվել։", ru: "Долго удерживаемая боль от того, что с тобой поступили несправедливо.", en: "Lingering hurt from being treated unfairly." },
        signal: { hy: "Ասում է, որ ինչ-որ բան չի խոսվել։ Մտածիր՝ ի՞նչ կարող ես ասել, կամ ինչի՞ց կարող ես ազատվել։", ru: "Говорит о том, что что-то осталось несказанным. Подумай, что можно сказать или что отпустить.", en: "It signals something left unsaid. Consider what you could say — or let go of." } }
    ],

    sad: [
      { id: "sadness",
        label: { hy: "Տխրություն", ru: "Грусть", en: "Sadness" },
        about: { hy: "Արձագանք կորստի, բաժանման կամ չիրականացած սպասումի։", ru: "Реакция на потерю, расставание или несбывшиеся ожидания.", en: "A response to loss, separation or unmet expectations." },
        signal: { hy: "Տխրությունը դանդաղեցնում է, որ ժամանակ ունենաս վերաիմաստավորելու։ Թույլ տուր քեզ զգալ և աջակցություն խնդրիր։", ru: "Грусть замедляет, чтобы дать время осмыслить. Позволь себе чувствовать и попроси поддержки.", en: "Sadness slows you down to give you time to process. Let yourself feel it and ask for support." } },
      { id: "loneliness",
        label: { hy: "Միայնություն", ru: "Одиночество", en: "Lonely" },
        about: { hy: "Ցավոտ զգացում, որ կապը մարդկանց հետ ավելի քիչ է, քան ուզում ես։", ru: "Болезненное ощущение, что связи с людьми меньше, чем хочется.", en: "The painful sense of having less connection than you want." },
        signal: { hy: "Սա կապի կարիքի ազդանշան է։ Մեկ փոքր քայլ՝ գրիր կամ զանգիր որևէ մեկին այսօր։", ru: "Это сигнал потребности в близости. Маленький шаг — напиши или позвони кому-то сегодня.", en: "It signals a need for connection. One small step: message or call someone today." } },
      { id: "disappointment",
        label: { hy: "Հուսախաբություն", ru: "Разочарование", en: "Disappointed" },
        about: { hy: "Տխրություն, երբ իրականությունը չի համապատասխանում սպասելիքներին։", ru: "Грусть, когда реальность не совпала с ожиданиями.", en: "Sadness when reality doesn't match your expectations." },
        signal: { hy: "Վերանայիր սպասելիքը. արդյո՞ք այն իրատեսական էր, և ի՞նչ կարող ես սովորել։", ru: "Пересмотри ожидание: было ли оно реалистичным и чему можно научиться?", en: "Revisit the expectation: was it realistic, and what can you learn?" } },
      { id: "guilt",
        label: { hy: "Մեղքի զգացում", ru: "Вина", en: "Guilt" },
        about: { hy: "Զգացում, որ արարքդ հակասում է քո արժեքներին («ես վատ բան արեցի»)։", ru: "Ощущение, что поступок противоречит твоим ценностям («это был плохой поступок»).", en: "The sense that something you did goes against your values (\"I did something bad\")." },
        signal: { hy: "Մեղքը կարող է օգտակար լինել. այն մղում է ներողություն խնդրել կամ ուղղել սխալը։", ru: "Вина может быть полезной: она подталкивает извиниться или исправить ошибку.", en: "Guilt can be useful: it nudges you to apologize or make amends." } },
      { id: "shame",
        label: { hy: "Ամոթ", ru: "Стыд", en: "Shame" },
        about: { hy: "Ցավոտ զգացում, որ դու ինքդ ես «վատը» կամ «բավարար չես» («ես վատն եմ»)։ Բրենե Բրաունը այն տարբերում է մեղքից. մեղքը արարքի մասին է, ամոթը՝ անձի։", ru: "Болезненное чувство «со мной что-то не так», «я недостаточно хорош». Брене Браун отличает его от вины: вина — о поступке, стыд — о личности.", en: "The painful feeling that you yourself are \"bad\" or \"not enough\". Brené Brown distinguishes it from guilt: guilt is about an action, shame is about the self." },
        signal: { hy: "Ամոթը թուլանում է, երբ դրա մասին խոսում ես վստահելի մարդու հետ։ Խոսիր քեզ հետ այնպես, ինչպես կխոսեիր ընկերոջ հետ։", ru: "Стыд слабеет, когда о нём говоришь с тем, кому доверяешь. Говори с собой так же бережно, как с другом.", en: "Shame loses power when shared with someone you trust. Speak to yourself as you would to a friend." } }
    ],

    tired: [
      { id: "fatigue",
        label: { hy: "Ֆիզիկական հոգնածություն", ru: "Физическая усталость", en: "Physically tired" },
        about: { hy: "Մարմնի էներգիայի պակաս՝ քնի, շարժման կամ սննդի պակասից։", ru: "Нехватка энергии тела из-за недостатка сна, движения или питания.", en: "Low bodily energy from too little sleep, movement or nourishment." },
        signal: { hy: "Մարմինը հանգիստ է խնդրում. քուն, ջուր, սնունդ և կարճ զբոսանք։", ru: "Тело просит отдыха: сон, вода, еда и короткая прогулка.", en: "Your body is asking for rest: sleep, water, food and a short walk." } },
      { id: "exhaustion",
        label: { hy: "Էմոցիոնալ սպառվածություն", ru: "Эмоциональное истощение", en: "Emotionally drained" },
        about: { hy: "Զգացում, որ ներքին ռեսուրսները սպառված են, նույնիսկ եթե մարմինը հանգստացել է։", ru: "Ощущение, что внутренние ресурсы исчерпаны, даже если тело отдохнуло.", en: "The sense that your inner resources are drained, even if your body has rested." },
        signal: { hy: "Պետք է նվազեցնել էմոցիոնալ բեռը. սահմաններ դիր և ժամանակ տուր քեզ։", ru: "Нужно снизить эмоциональную нагрузку: обозначь границы и дай себе время.", en: "Lower the emotional load: set boundaries and give yourself time." } },
      { id: "burnout",
        label: { hy: "Այրում", ru: "Выгорание", en: "Burnout" },
        about: { hy: "Երկարատև սթրեսի արդյունք. սպառվածություն, ցինիզմ և արդյունավետության անկում (Քրիստինա Մասլաչի մոդել)։", ru: "Результат длительного стресса: истощение, цинизм и снижение эффективности (модель Кристины Маслач).", en: "The result of prolonged stress: exhaustion, cynicism and reduced effectiveness (Christina Maslach's model)." },
        signal: { hy: "Սա թուլություն չէ, այլ ծանրաբեռնվածության նշան։ Եթե երկար է տևում, խոսիր մասնագետի հետ։", ru: "Это не слабость, а признак перегрузки. Если длится долго, поговори со специалистом.", en: "It's not weakness but a sign of overload. If it lasts, talk to a professional." } }
    ],

    unmotivated: [
      { id: "apathy",
        label: { hy: "Ապատիա", ru: "Апатия", en: "Apathy" },
        about: { hy: "Հետաքրքրության և զգացմունքների պակաս՝ «ոչինչ չեմ ուզում» վիճակ։", ru: "Нехватка интереса и чувств — состояние «ничего не хочу».", en: "A lack of interest and feeling — the \"I don't want anything\" state." },
        signal: { hy: "Գործողությունը հաճախ գալիս է մոտիվացիայից առաջ. սկսիր 5 րոպեից։", ru: "Действие часто приходит раньше мотивации — начни с 5 минут.", en: "Action often comes before motivation — start with 5 minutes." } },
      { id: "boredom",
        label: { hy: "Ձանձրույթ", ru: "Скука", en: "Bored" },
        about: { hy: "Զգացում, որ կատարվողը իմաստ կամ մարտահրավեր չունի։", ru: "Ощущение, что происходящее лишено смысла или вызова.", en: "The sense that what you're doing lacks meaning or challenge." },
        signal: { hy: "Միտքդ նոր բան է ուզում. փոխիր միջավայրը կամ գործին մարտահրավեր ավելացրու։", ru: "Уму нужно новое: смени обстановку или добавь делу вызов.", en: "Your mind wants novelty: change the setting or add a challenge." } },
      { id: "stuck",
        label: { hy: "Խճճվածություն", ru: "Ступор", en: "Stuck" },
        about: { hy: "Չգիտես՝ որտեղից սկսել կամ ինչ ընտրել, և այդ պատճառով ոչինչ չի կատարվում։", ru: "Не знаешь, с чего начать или что выбрать, и поэтому ничего не происходит.", en: "Not knowing where to start or what to choose, so nothing happens." },
        signal: { hy: "Գրիր բոլոր տարբերակները և ընտրիր ամենափոքր քայլը։ Ոչ կատարյալը, այլ առաջինը։", ru: "Запиши все варианты и выбери самый маленький шаг. Не идеальный, а первый.", en: "Write down the options and pick the smallest step. Not the perfect one — the first one." } },
      { id: "emptiness",
        label: { hy: "Դատարկություն", ru: "Пустота", en: "Empty" },
        about: { hy: "Զգացում, որ ներսում ոչինչ չկա՝ ոչ ուրախություն, ոչ տխրություն։", ru: "Ощущение, что внутри ничего нет — ни радости, ни грусти.", en: "The feeling that there's nothing inside — neither joy nor sadness." },
        signal: { hy: "Եթե այս զգացումը տևում է երկու շաբաթից ավելի, կարևոր է խոսել հոգեբանի կամ բժշկի հետ։", ru: "Если это чувство длится больше двух недель, важно поговорить с психологом или врачом.", en: "If this lasts more than two weeks, it's important to talk to a psychologist or doctor." } }
    ]
  }
};
