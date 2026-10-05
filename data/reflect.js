/*
 * «Կիսվիր օրով» ամփոփում և «Ինչ հանգիստ է քեզ պետք» թեստ։
 *
 * summary["<mood>.<guide №>"]:
 *   n       — պատասխանի պիտակները՝ [ուղղորդող հարց, ճշգրտող 1, ճշգրտող 2]
 *   insight — հավելվածի եզրահանգումը (մեղմ, առանց ախտորոշման)
 *   tip     — «եթե-ապա» առաջարկ (implementation intention, Gollwitzer & Sheeran 2006)
 *
 * Հիմքում՝ affect labeling (Lieberman et al. 2007), Three Good Things (Seligman et al. 2005),
 * savoring (Bryant & Veroff 2007), self-compassion (Neff), 7 types of rest (Dalton-Smith, Sacred Rest, 2017)։
 * Աղբյուրները՝ docs/psychology-methods.md։
 */
window.MC_REFLECT = {
  summary: {
    'calm.1': {
      n: [
        { hy: 'Այսօր քեզ ամենից շատ հանգստություն տվեց', ru: 'Сегодня спокойствие тебе подарило', en: 'Today calm came from' },
        { hy: 'Սա ավելի հաճախ ստեղծելու քո ձևը', ru: 'Как создавать это чаще', en: 'Your way to create it more often' },
        { hy: 'Այդ պահին կողքիդ էր', ru: 'Рядом в тот момент было', en: 'With you in that moment' }
      ],
      insight: { hy: 'Դա լավ է։ Երբ գիտես, թե ինչն է քեզ հանգստություն տալիս, կարող ես դա ավելի հաճախ ընտրել։', ru: 'Это хорошо. Когда знаешь, что приносит спокойствие, это можно выбирать чаще.', en: "That's good. When you know what brings you calm, you can choose it more often." },
      tip: { hy: 'Երբ հոգնած կամ լարված լինես, հիշիր այս պահը։ Հենց այդ ժամանակ այս զգացումը քեզ ամենից շատ պետք կլինի։', ru: 'Когда придёт усталость или напряжение, вспомни этот момент. Именно тогда это чувство будет нужнее всего.', en: "When you feel tired or tense, remember this moment. That's when you'll need this feeling most." }
    },
    'calm.2': {
      n: [
        { hy: 'Այսօր երախտապարտ ես', ru: 'Сегодня благодарность за', en: "Today you're grateful for" },
        { hy: 'Դրանցից ամենակարևորը', ru: 'Самое важное из этого', en: 'What matters most' },
        { hy: 'Կուզենայիր շնորհակալություն հայտնել', ru: 'Хочется поблагодарить', en: "You'd like to thank" }
      ],
      insight: { hy: 'Երախտագիտությունը ուշադրությունը տեղափոխում է այն ամենի վրա, ինչ արդեն կա։ Ուսումնասիրություններում լավ բաները ամեն օր գրառելը բարձրացրել է երջանկության զգացումը։', ru: 'Благодарность переносит внимание на то, что уже есть. В исследованиях ежедневная запись хороших событий повышала ощущение счастья.', en: 'Gratitude moves your attention to what you already have. In studies, writing down good things each day raised people’s sense of happiness.' },
      tip: { hy: 'Եթե ցանկանում ես, այսօր շնորհակալություն հայտնիր այն մարդուն, ում հիշեցիր։ Կարճ նամակն էլ բավական է։', ru: 'Если хочется, поблагодари сегодня того, о ком вспомнилось. Короткого сообщения достаточно.', en: "If you'd like, thank the person you thought of today. A short message is enough." }
    },
    'calm.3': {
      n: [
        { hy: 'Հանգիստ վիճակում պարզ դարձավ', ru: 'В спокойствии стало ясно', en: 'In this calm it became clear' },
        { hy: 'Առաջին քայլը', ru: 'Первый шаг', en: 'The first step' },
        { hy: 'Ուզում ես հիշել', ru: 'Хочется запомнить', en: 'You want to remember' }
      ],
      insight: { hy: 'Հանգիստ վիճակում ընդունած որոշումները հաճախ ավելի պարզ են։ Լավ է, որ դա գրի առար։', ru: 'Решения, принятые в спокойствии, часто яснее. Хорошо, что это записано.', en: "Decisions made in calm are often clearer. It's good that you wrote this down." },
      tip: { hy: 'Երբ կասկածներ ունենաս, վերադարձիր այս գրառմանը և հիշիր, թե ինչն էր քեզ համար պարզ այսօր։', ru: 'Когда появятся сомнения, вернись к этой записи и вспомни, что было ясно сегодня.', en: 'When doubts come back, return to this note and remember what was clear to you today.' }
    },

    'angry.1': {
      n: [
        { hy: 'Ինչ պատահեց', ru: 'Что произошло', en: 'What happened' },
        { hy: 'Խախտված արժեքը կամ սահմանը', ru: 'Затронутая ценность или граница', en: 'The value or boundary that was crossed' },
        { hy: 'Մեկ շաբաթ անց', ru: 'Через неделю', en: 'A week from now' }
      ],
      insight: { hy: 'Զայրույթը հաճախ ցույց է տալիս, որ քեզ համար կարևոր բան է խախտվել։ Երբ զգացումը բառերով ես անվանում, այն սովորաբար թուլանում է։', ru: 'Злость часто показывает, что задето что-то важное. Когда чувство названо словами, оно обычно ослабевает.', en: 'Anger often shows that something important to you was crossed. Naming a feeling in words tends to make it less intense.' },
      tip: { hy: 'Հաջորդ անգամ, երբ զայրույթ զգաս, նախքան պատասխանելը մտքում անվանիր այն՝ «Ես հիմա զայրացած եմ»։', ru: 'В следующий раз, когда придёт злость, перед ответом назови её про себя: «Сейчас я злюсь».', en: 'Next time anger comes, name it to yourself before you answer: “I’m angry right now.”' }
    },
    'angry.2': {
      n: [
        { hy: 'Այս զայրույթով ուզում էիր', ru: 'Со злостью хотелось', en: 'With this anger you wanted to' },
        { hy: 'Հնարավոր հետևանքը', ru: 'Возможные последствия', en: 'The likely consequences' },
        { hy: 'Ավելի խելացի քայլը', ru: 'Более мудрый шаг', en: 'The wiser step' }
      ],
      insight: { hy: 'Դու դադար տվեցիր իմպուլսի և գործողության միջև։ Հենց այդ դադարն է օգնում պահել ինքնատիրապետումը։', ru: 'Между импульсом и действием появилась пауза. Именно она помогает сохранить контроль.', en: 'You paused between the impulse and the action. That pause is what helps you stay in control.' },
      tip: { hy: 'Երբ նորից ուժեղ զայրույթ զգաս, արա 10 դանդաղ շունչ, հետո ընտրիր ավելի խելացի քայլը։', ru: 'Когда злость снова станет сильной, сделай 10 медленных вдохов, а потом выбери более мудрый шаг.', en: 'When anger runs high again, take 10 slow breaths, then choose the wiser step.' }
    },
    'angry.3': {
      n: [
        { hy: 'Կուզենայիր ասել', ru: 'Хотелось сказать', en: 'You wanted to say' },
        { hy: 'Հանգիստ և պարզ ձևով', ru: 'Спокойно и ясно', en: 'Said calmly and clearly' },
        { hy: 'Ուզում ես փոխել', ru: 'Хочется изменить', en: 'You want to change' }
      ],
      insight: { hy: 'Հիմա ունես նույն միտքը՝ հանգիստ ձևակերպված։ Այդպես ավելի հավանական է, որ քեզ կլսեն։', ru: 'Теперь та же мысль есть в спокойной форме. Так её скорее услышат.', en: "Now you have the same thought in a calm form. That way it's more likely to be heard." },
      tip: { hy: 'Եթե որոշես խոսել այդ մարդու հետ, օգտագործիր այն հանգիստ տարբերակը, որը գրեցիր այստեղ։', ru: 'Если решишь поговорить с этим человеком, используй спокойную версию из этой записи.', en: 'If you decide to talk to this person, use the calm version you wrote here.' }
    },

    'great.1': {
      n: [
        { hy: 'Այս էներգիայով այսօր կանես', ru: 'С этой энергией сегодня', en: "With this energy today you'll take on" },
        { hy: 'Առաջին փոքր քայլը', ru: 'Первый маленький шаг', en: 'The first small step' },
        { hy: 'Լավ օրի նշանը', ru: 'Признак удачного дня', en: 'A sign that today went well' }
      ],
      insight: { hy: 'Էներգիան ամենաօգտակարն է, երբ այն ուղղված է մեկ պարզ նպատակի։ Դու հենց դա արեցիր։', ru: 'Энергия полезнее всего, когда она направлена на одну ясную цель. Здесь это получилось.', en: 'Energy is most useful when it points at one clear goal. You just did that.' },
      tip: { hy: 'Երեկոյան ստուգիր՝ արդյո՞ք օրն անցավ այնպես, ինչպես նկարագրեցիր։ Եթե ոչ, դա էլ օգտակար տեղեկություն է։', ru: 'Вечером проверь, прошёл ли день так, как описано. Если нет, это тоже полезная информация.', en: "In the evening, check if the day went the way you described. If not, that's useful to know too." }
    },
    'great.2': {
      n: [
        { hy: 'Այսօր քեզ էներգիա տվեց', ru: 'Сегодня энергию дало', en: 'Today energy came from' },
        { hy: 'Ավելի հաճախ կրկնելու ձևը', ru: 'Как повторять это чаще', en: 'How to repeat it more often' },
        { hy: 'Դրա մասնակիցը', ru: 'Рядом были', en: 'Who was part of it' }
      ],
      insight: { hy: 'Դա լավ է։ Երբ լավ պահը մտքում նորից ես ապրում, այն ավելի երկար է մնում հիշողության մեջ։', ru: 'Это хорошо. Когда хороший момент проживаешь ещё раз в мыслях, он дольше остаётся в памяти.', en: "That's good. When you relive a good moment in your mind, it stays in your memory longer." },
      tip: { hy: 'Երբ էներգիան պակասի, հիշիր այս պահը և այն, ինչը քեզ ուժ տվեց։ Հենց այդ ժամանակ այս զգացումը քեզ ամենից շատ պետք կլինի։', ru: 'Когда энергии будет мало, вспомни этот момент и то, что дало силы. Именно тогда это чувство будет нужнее всего.', en: "When your energy runs low, remember this moment and what gave you strength. That's when you'll need this feeling most." }
    },
    'great.3': {
      n: [
        { hy: 'Այսօր վերջապես կսկսես', ru: 'Сегодня наконец начнёшь', en: "Today you'll finally start" },
        { hy: 'Մինչ այժմ խանգարում էր', ru: 'До сих пор мешало', en: 'What held you back' },
        { hy: 'Ավարտելուց հետո կփոխվի', ru: 'Когда будет готово, изменится', en: "What changes once it's done" }
      ],
      insight: { hy: 'Լավ տրամադրությունը հարմար պահ է հետաձգված գործերը սկսելու համար։ Եվ հիմա գիտես, թե ինչն էր խանգարում։', ru: 'Хорошее настроение подходит, чтобы начать отложенные дела. И теперь понятно, что мешало раньше.', en: 'A good mood is a good time to start postponed tasks. And now you know what held you back.' },
      tip: { hy: 'Եթե նորից հետաձգելու ցանկություն լինի, հիշիր, թե ինչ կփոխվի, երբ ավարտես։', ru: 'Если снова захочется отложить, вспомни, что изменится, когда дело будет сделано.', en: "If the urge to postpone comes back, remember what changes once it's done." }
    },

    'tired.1': {
      n: [
        { hy: 'Այսօրվա ամենակարևորը', ru: 'Самое важное сегодня', en: 'The one important thing today' },
        { hy: 'Կարելի է հետաձգել', ru: 'Можно отложить', en: 'Can wait' },
        { hy: 'Կարող է օգնել', ru: 'Может помочь', en: 'Could help' }
      ],
      insight: { hy: 'Հոգնած ժամանակ մեկ կարևոր գործը բավական է։ Մնացածը կարող է սպասել, և դա նորմալ է։', ru: 'Когда сил мало, одного важного дела достаточно. Остальное может подождать, и это нормально.', en: "When you're tired, one important thing is enough. The rest can wait, and that's okay." },
      tip: { hy: 'Երբ ավարտես այդ մեկ գործը, թույլ տուր քեզ հանգստանալ՝ առանց մեղքի զգացման։', ru: 'Когда это одно дело будет сделано, позволь себе отдых без чувства вины.', en: 'When that one thing is done, let yourself rest without guilt.' }
    },
    'tired.2': {
      n: [
        { hy: 'Վերջերս քեզ ամենից շատ հյուծում է', ru: 'Больше всего в последнее время утомляет', en: "Lately you're most drained by" },
        { hy: 'Հոգնածության տեսակը', ru: 'Вид усталости', en: 'Kind of tiredness' },
        { hy: 'Այսօր կարող ես թողնել', ru: 'Сегодня можно отпустить', en: 'You can drop today' }
      ],
      insight: { hy: 'Հոգնածությունը միշտ չէ, որ ֆիզիկական է։ Երբ գիտես դրա պատճառը, ավելի հեշտ է ընտրել ճիշտ հանգիստը։', ru: 'Усталость не всегда физическая. Когда понятна её причина, легче выбрать подходящий отдых.', en: "Tiredness isn't always physical. When you know its cause, it's easier to choose the right kind of rest." },
      tip: { hy: 'Եթե ուզում ես, «Իմ օրերը» բաժնում անցիր «Ի՞նչ հանգիստ է քեզ պետք» թեստը։', ru: 'Если хочется, пройди тест «Какой отдых тебе нужен?» в разделе «Мои дни».', en: 'If you like, try the “What kind of rest do you need?” quiz in My days.' }
    },
    'tired.3': {
      n: [
        { hy: 'Վերջին օրերին քունդ', ru: 'Сон в последнее время', en: 'Your sleep lately' },
        { hy: 'Վաղ քնելուն խանգարում է', ru: 'Лечь раньше мешает', en: 'What keeps you from going to bed earlier' },
        { hy: 'Այս երեկո կարող ես այլ կերպ անել', ru: 'Этим вечером можно иначе', en: 'This evening you could' }
      ],
      insight: { hy: 'Քունը ազդում է տրամադրության և էներգիայի վրա։ Փոքր փոփոխությունն էլ կարող է տարբերություն ստեղծել։', ru: 'Сон влияет на настроение и энергию. Даже маленькое изменение может помочь.', en: 'Sleep affects mood and energy. Even a small change can make a difference.' },
      tip: { hy: 'Այս երեկո փորձիր այն մեկ փոփոխությունը, որը գրեցիր, և վաղը նկատիր, թե ինչպես ես քեզ զգում։', ru: 'Попробуй этим вечером одно изменение из записи, а завтра заметь, как самочувствие.', en: 'Try the one change you wrote about this evening, and notice how you feel tomorrow.' }
    },

    'stressed.1': {
      n: [
        { hy: 'Քեզ լարում է', ru: 'Напряжение вызывает', en: 'Stress comes from' },
        { hy: 'Քեզնից կախված է', ru: 'Зависит от тебя', en: 'In your control' },
        { hy: 'Վատագույն դեպքը և դրա հավանականությունը', ru: 'Худший вариант и его вероятность', en: 'The worst case and how likely it is' }
      ],
      insight: { hy: 'Երբ առանձնացնում ես այն, ինչ կախված է քեզնից, լարվածությունը սովորաբար նվազում է։ Էներգիադ ուղղիր հենց դրան։', ru: 'Когда отделяешь то, что зависит от тебя, напряжение обычно снижается. Направь силы именно туда.', en: 'When you separate what depends on you, stress usually eases. Put your energy there.' },
      tip: { hy: 'Հաջորդ անգամ, երբ լարվածություն զգաս, ինքդ քեզ հարցրու՝ «Ի՞նչն է այստեղ կախված ինձնից»։', ru: 'В следующий раз, когда придёт напряжение, спроси себя: «Что здесь зависит от меня?»', en: 'Next time stress comes, ask yourself: “What here depends on me?”' }
    },
    'stressed.2': {
      n: [
        { hy: 'Քեզ ծանրացնող գործերը', ru: 'Давят дела', en: 'Tasks weighing on you' },
        { hy: 'Եթե միայն մեկը', ru: 'Если только одно', en: 'If only one' },
        { hy: 'Դրա ամենափոքր քայլը', ru: 'Самый маленький первый шаг', en: 'Its tiniest first step' }
      ],
      insight: { hy: 'Երբ գործերը գրված են, դրանք այլևս չեն պտտվում գլխումդ։ Մեկ փոքր քայլը բավական է սկսելու համար։', ru: 'Когда дела записаны, они больше не крутятся в голове. Одного маленького шага достаточно, чтобы начать.', en: 'Once tasks are written down, they stop spinning in your head. One tiny step is enough to begin.' },
      tip: { hy: 'Փորձիր «եթե-ապա» պլան․ «Եթե ժամը 10-ն է, ապա սկսում եմ այս քայլը»։', ru: 'Попробуй план «если-то»: «Если уже 10:00, то начинаю этот шаг».', en: 'Try an if-then plan: “If it’s 10:00, then I start this step.”' }
    },
    'stressed.3': {
      n: [
        { hy: 'Լարվածությունը մարմնումդ', ru: 'Напряжение в теле', en: 'Tension in your body' },
        { hy: 'Նախկինում օգնել է', ru: 'Раньше помогало', en: 'What helped before' },
        { hy: 'Հաջորդ 10 րոպեում', ru: 'В ближайшие 10 минут', en: 'In the next 10 minutes' }
      ],
      insight: { hy: 'Մարմինը հաճախ առաջինն է զգում լարվածությունը։ Եվ դու արդեն գիտես, թե ինչն է քեզ նախկինում օգնել։', ru: 'Тело часто первым замечает напряжение. И уже известно, что помогало раньше.', en: 'The body often feels stress first. And you already know what has helped you before.' },
      tip: { hy: 'Երբ նորից զգաս լարվածությունը նույն տեղում, փորձիր շնչառական պրակտիկան կամ այն, ինչը գրեցիր։', ru: 'Когда напряжение снова появится там же, попробуй дыхательную практику или то, что записано здесь.', en: 'When the tension shows up there again, try the breathing practice or what you wrote here.' }
    },

    'sad.1': {
      n: [
        { hy: 'Հիմա զգում ես', ru: 'Сейчас на душе', en: 'Right now you feel' },
        { hy: 'Այս զգացումը սկսվեց', ru: 'Это чувство началось', en: 'This feeling began' },
        { hy: 'Մտերիմ ընկերոջը կասեիր', ru: 'Слова для близкого друга', en: "What you'd tell a close friend" }
      ],
      insight: { hy: 'Տխրությունը բառերով անվանելն արդեն օգնում է։ Իսկ այն բարի խոսքերը, որ կասեիր ընկերոջը, դու էլ ես արժանի լսելու։', ru: 'Назвать грусть словами уже помогает. А добрые слова для друга подходят и тебе.', en: 'Naming sadness in words already helps. And the kind words you’d tell a friend are words you deserve too.' },
      tip: { hy: 'Երբ նորից տխուր լինես, կարդա այն, ինչ գրեցիր ընկերոջդ համար, և ասա դա ինքդ քեզ։', ru: 'Когда снова станет грустно, перечитай слова для друга и скажи их себе.', en: 'When sadness comes back, reread what you’d tell your friend, and say it to yourself.' }
    },
    'sad.2': {
      n: [
        { hy: 'Քեզ կարող է մխիթարել', ru: 'Утешить может', en: 'What could comfort you' },
        { hy: 'Խանգարում է', ru: 'Мешает', en: "What's in the way" },
        { hy: 'Այսօր կարող ես դա անել', ru: 'Сегодня можно сделать это', en: 'When today you could do it' }
      ],
      insight: { hy: 'Փոքր հոգատարությունն էլ կարևոր է։ Դու արդեն ունես պարզ պլան՝ ինչ և երբ։', ru: 'Даже маленькая забота важна. Уже есть простой план: что и когда.', en: 'Even small care matters. You already have a simple plan: what and when.' },
      tip: { hy: 'Պահիր քո խոստումը քեզ։ Երբ ժամանակը գա, արա այդ փոքր բանը, նույնիսկ եթե ցանկություն չլինի։', ru: 'Сдержи обещание себе. Когда придёт время, сделай эту маленькую вещь, даже если не хочется.', en: "Keep your promise to yourself. When the time comes, do that small thing, even if you don't feel like it." }
    },
    'sad.3': {
      n: [
        { hy: 'Կուզենայիր խոսել', ru: 'Хочется поговорить с', en: "You'd like to talk to" },
        { hy: 'Կուզենայիր, որ իմանա', ru: 'Хочется рассказать', en: "What you'd want them to know" },
        { hy: 'Կապվելուն խանգարում է', ru: 'Связаться мешает', en: 'What holds you back from reaching out' }
      ],
      insight: { hy: 'Կապը ուրիշների հետ օգնում է տխրության ժամանակ։ Շատերն են նման բան զգում, և դու միայնակ չես։', ru: 'Связь с другими помогает в грусти. Многие чувствуют похожее, и в этом никто не одинок.', en: "Connection helps when you're sad. Many people feel this way, and you're not alone in it." },
      tip: { hy: 'Եթե պատրաստ ես, գրիր այդ մարդուն կարճ նամակ։ Սկզբի համար «Մտածում էի քո մասին»-ը բավական է։', ru: 'Если есть готовность, напиши этому человеку короткое сообщение. Для начала хватит: «Думаю о тебе».', en: "If you're ready, send that person a short message. “I was thinking of you” is enough to start." }
    },

    'unmotivated.1': {
      n: [
        { hy: 'Հիմա 5 րոպեում կարող ես', ru: 'За 5 минут сейчас можно', en: 'In 5 minutes you could' },
        { hy: 'Սկսելու համար պետք է', ru: 'Чтобы начать, нужно', en: 'To get started you need' },
        { hy: '5 րոպեից հետո', ru: 'После 5 минут', en: 'After those 5 minutes' }
      ],
      insight: { hy: 'Մոտիվացիան հաճախ գալիս է գործողությունից հետո, ոչ թե առաջ։ Փոքր սկիզբն էլ իսկական սկիզբ է։', ru: 'Мотивация часто приходит после действия, а не до него. Маленькое начало тоже настоящее.', en: 'Motivation often comes after action, not before it. A small start is still a real start.' },
      tip: { hy: 'Երբ նորից դժվար լինի սկսել, հիշիր այս 5 րոպեն և ինչպես քեզ զգացիր դրանից հետո։', ru: 'Когда снова будет трудно начать, вспомни эти 5 минут и ощущение после них.', en: "When it's hard to start again, remember these 5 minutes and how you felt afterwards." }
    },
    'unmotivated.2': {
      n: [
        { hy: 'Վերջին անգամ մոտիվացված էիր, երբ', ru: 'Последний раз мотивация была, когда', en: 'The last time you felt motivated' },
        { hy: 'Այսօր կարող ես կրկնել', ru: 'Сегодня можно повторить', en: 'You can repeat today' },
        { hy: 'Այսօր տարբեր է', ru: 'Сегодня иначе', en: "What's different today" }
      ],
      insight: { hy: 'Դու արդեն գիտես պահեր, երբ մոտիվացիան կար։ Դա նշանակում է, որ այն կարող է վերադառնալ։', ru: 'Уже есть опыт, когда мотивация была. Значит, она может вернуться.', en: 'You already know times when motivation was there. That means it can come back.' },
      tip: { hy: 'Ընտրիր այդ ժամանակից մեկ բան, որը կարող ես կրկնել, և փորձիր այն վաղը առավոտյան։', ru: 'Выбери одну вещь из того времени, которую можно повторить, и попробуй её завтра утром.', en: 'Pick one thing from that time you can repeat, and try it tomorrow morning.' }
    },
    'unmotivated.3': {
      n: [
        { hy: 'Քեզ համար կարևոր է, որովհետև', ru: 'Это важно, потому что', en: 'It matters to you because' },
        { hy: 'Եթե չանես', ru: 'Если не сделать', en: "If you don't do it" },
        { hy: 'Ում նպատակն է', ru: 'Чья это цель', en: 'Whose goal it is' }
      ],
      insight: { hy: 'Երբ գործը կապված է քո արժեքների հետ, դժվար օրերին էլ ավելի հեշտ է շարունակել։ Իսկ եթե նպատակը քոնը չէ, դա էլ կարևոր բացահայտում է։', ru: 'Когда дело связано с твоими ценностями, его легче продолжать даже в трудные дни. А если цель не твоя, это тоже важное открытие.', en: "When a task connects to your values, it's easier to keep going on hard days. And if the goal isn't yours, that's an important discovery too." },
      tip: { hy: 'Գրիր քո «որովհետև»-ը մի տեղ, որտեղ հաճախ կտեսնես, և կարդա այն, երբ մոտիվացիան պակասի։', ru: 'Запиши своё «потому что» там, где будешь часто его видеть, и перечитывай, когда мотивации мало.', en: 'Write your “because” somewhere you’ll see it often, and read it when motivation runs low.' }
    }
  },

  // «Ի՞նչ հանգիստ է քեզ պետք» — 7 հանգստի տեսակների հիման վրա (Dalton-Smith)։ Պնդումները մերն են։
  // Պատասխաններ՝ 0 = ոչ, 1 = մի փոքր, 2 = այո։ Արդյունքը՝ առաջարկ, ոչ թե գնահատական կամ ախտորոշում։
  quiz: [
    {
      id: 'physical',
      name: { hy: 'Ֆիզիկական հանգիստ', ru: 'Физический отдых', en: 'Physical rest' },
      q: { hy: 'Մարմինս ծանր է կամ ցավում է, կամ վատ եմ քնել։', ru: 'Тело тяжёлое или ноет, или сон был плохим.', en: 'My body feels heavy or sore, or I slept poorly.' },
      ideas: { hy: 'Այսօր վաղ պառկիր, արա թեթև ձգումներ կամ դանդաղ զբոսանք։', ru: 'Ляг сегодня пораньше, сделай лёгкую растяжку или медленную прогулку.', en: 'Go to bed early tonight, do some gentle stretching, or take a slow walk.' }
    },
    {
      id: 'mental',
      name: { hy: 'Մտավոր հանգիստ', ru: 'Ментальный отдых', en: 'Mental rest' },
      q: { hy: 'Գլուխս լիքն է մտքերով, դժվար է կենտրոնանալ կամ անջատվել։', ru: 'Голова переполнена, трудно сосредоточиться или отключиться.', en: 'My head is full; it’s hard to focus or switch off.' },
      ideas: { hy: 'Գործերի միջև արա 5 րոպե ընդմիջում առանց էկրանի։ Քնելուց առաջ գրիր վաղվա գործերը, որ միտքդ ազատվի։', ru: 'Между делами делай 5-минутные перерывы без экрана. Перед сном запиши дела на завтра, чтобы освободить голову.', en: 'Take 5-minute screen-free breaks between tasks. Before bed, write down tomorrow’s tasks to clear your head.' }
    },
    {
      id: 'sensory',
      name: { hy: 'Զգայական հանգիստ', ru: 'Сенсорный отдых', en: 'Sensory rest' },
      q: { hy: 'Աղմուկը, էկրանները կամ ծանուցումներն այսօր ինձ հոգնեցնում են։', ru: 'Шум, экраны или уведомления сегодня утомляют.', en: 'Noise, screens or notifications are tiring me today.' },
      ideas: { hy: 'Անջատիր ծանուցումները մեկ ժամով, անցկացրու 10 րոպե լռության մեջ, երեկոյան մեղմացրու լույսը։', ru: 'Выключи уведомления на час, побудь 10 минут в тишине, вечером приглуши свет.', en: 'Turn off notifications for an hour, spend 10 minutes in silence, and dim the lights in the evening.' }
    },
    {
      id: 'creative',
      name: { hy: 'Ստեղծագործական հանգիստ', ru: 'Творческий отдых', en: 'Creative rest' },
      q: { hy: 'Ոգեշնչում չունեմ, նոր մտքեր չեն գալիս։', ru: 'Нет вдохновения, новые идеи не приходят.', en: 'I feel uninspired; new ideas don’t come.' },
      ideas: { hy: 'Ժամանակ անցկացրու բնության մեջ, լսիր երաժշտություն կամ նայիր արվեստ՝ առանց որևէ նպատակի։', ru: 'Побудь на природе, послушай музыку или посмотри на искусство без всякой цели.', en: 'Spend time in nature, or enjoy music or art with no goal at all.' }
    },
    {
      id: 'emotional',
      name: { hy: 'Էմոցիոնալ հանգիստ', ru: 'Эмоциональный отдых', en: 'Emotional rest' },
      q: { hy: 'Զգացմունքներս պահում եմ ինձ մոտ կամ անընդհատ փորձում եմ հաճոյանալ ուրիշներին։', ru: 'Чувства держу в себе или постоянно стараюсь угодить другим.', en: 'I keep my feelings to myself or keep trying to please others.' },
      ideas: { hy: 'Պատմիր վստահելի մարդուն, թե իրականում ինչպես ես։ Կամ գրիր դա «Կիսվիր օրով» բաժնում։', ru: 'Расскажи близкому человеку, как ты на самом деле. Или запиши это в разделе «Поделись своим днём».', en: 'Tell someone you trust how you really are. Or write it in the journal.' }
    },
    {
      id: 'social',
      name: { hy: 'Սոցիալական հանգիստ', ru: 'Социальный отдых', en: 'Social rest' },
      q: { hy: 'Մարդկանց հետ շփումից հետո ավելի շատ հոգնում եմ, քան ուժ ստանում։', ru: 'После общения с людьми больше устаю, чем набираюсь сил.', en: 'After time with people, I feel more drained than recharged.' },
      ideas: { hy: 'Ժամանակ անցկացրու այն մարդու հետ, ով քեզ ուժ է տալիս, կամ մի քիչ ժամանակ պահիր միայն քեզ համար։', ru: 'Проведи время с тем, кто даёт силы, или оставь немного времени только для себя.', en: 'Spend time with someone who gives you energy, or keep a little time just for yourself.' }
    },
    {
      id: 'spiritual',
      name: { hy: 'Հոգևոր հանգիստ', ru: 'Духовный отдых', en: 'Spiritual rest' },
      q: { hy: 'Իմ արածի մեջ իմաստի զգացումը պակասում է։', ru: 'Не хватает ощущения смысла в том, что я делаю.', en: 'I miss a sense of meaning in what I do.' },
      ideas: { hy: 'Հիշիր, թե ինչու է քո գործը կարևոր, օգնիր ինչ-որ մեկին, կամ գտիր լուռ պահ մտորման համար։', ru: 'Вспомни, почему твоё дело важно, помоги кому-нибудь или найди тихую минуту для размышлений.', en: 'Recall why your work matters, help someone, or find a quiet moment to reflect.' }
    }
  ],

  ui: {
    hy: {
      summaryTitle: 'Այսօրվա ամփոփում',
      summaryWe: 'Ինչ ենք նկատում',
      summaryTry: 'Փորձիր',
      summaryNext: 'Եթե տրամադրությունդ փոխվի, կարող ես նորից կիսվել։ Իսկ երեկոյան սպասում է կարճ ամփոփումը։',
      progress: 'Հարց {i} / {n}',
      finish: 'Ավարտել',
      quizTitle: 'Ի՞նչ հանգիստ է քեզ պետք',
      quizIntro: '7 կարճ պնդում։ Ընտրիր, թե որքանով են դրանք քո մասին այս օրերին։',
      quizNote: 'Սա թեստ կամ ախտորոշում չէ։ Սա միայն հուշում է՝ մտածելու, թե ինչն է քեզ հիմա օգնում։',
      quizStart: 'Սկսել',
      quizNo: 'Ոչ',
      quizBit: 'Մի փոքր',
      quizYes: 'Այո',
      quizResult: 'Գուցե քեզ հիմա օգնի',
      quizRested: 'Կարծես հիմա բավական հանգստացած ես։ Լավ է։ Կարող ես անցնել թեստը նորից, երբ զգաս, որ ուժերդ պակասում են։',
      quizAgain: 'Անցնել նորից',
      quizSource: 'Հիմքում՝ հանգստի 7 տեսակները, դոկտոր Սաունդրա Դալթոն-Սմիթ, «Sacred Rest» (2017)։'
    },
    ru: {
      summaryTitle: 'Итог дня',
      summaryWe: 'Что мы замечаем',
      summaryTry: 'Попробуй',
      summaryNext: 'Если настроение изменится, можно поделиться снова. А вечером ждёт короткий итог.',
      progress: 'Вопрос {i} из {n}',
      finish: 'Завершить',
      quizTitle: 'Какой отдых тебе нужен?',
      quizIntro: '7 коротких утверждений. Отметь, насколько они про тебя в эти дни.',
      quizNote: 'Это не тест и не диагноз. Это только подсказка, чтобы подумать, что сейчас помогает.',
      quizStart: 'Начать',
      quizNo: 'Нет',
      quizBit: 'Немного',
      quizYes: 'Да',
      quizResult: 'Возможно, сейчас поможет',
      quizRested: 'Похоже, сейчас сил достаточно. Это хорошо. Пройди тест снова, когда почувствуешь, что силы на исходе.',
      quizAgain: 'Пройти снова',
      quizSource: 'Основано на 7 видах отдыха, д-р Саундра Далтон-Смит, «Sacred Rest» (2017).'
    },
    en: {
      summaryTitle: "Today's summary",
      summaryWe: 'What we notice',
      summaryTry: 'Try this',
      summaryNext: 'If your mood changes, you can share again. A short evening review is waiting later.',
      progress: 'Question {i} of {n}',
      finish: 'Finish',
      quizTitle: 'What kind of rest do you need?',
      quizIntro: '7 short statements. Choose how much each one sounds like you these days.',
      quizNote: 'This is not a test or a diagnosis. It’s only a prompt to think about what helps you right now.',
      quizStart: 'Start',
      quizNo: 'No',
      quizBit: 'A little',
      quizYes: 'Yes',
      quizResult: 'This might help right now',
      quizRested: "Looks like you're fairly rested right now. That's good. Take the quiz again when you feel your energy running low.",
      quizAgain: 'Take it again',
      quizSource: 'Based on the 7 types of rest by Dr. Saundra Dalton-Smith, “Sacred Rest” (2017).'
    }
  }
};
