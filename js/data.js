// 1. Función auxiliar para elegir palabras al azar
function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 2. DICCIONARIO A1 CON PRONUNCIACIÓN FIGURADA (INFORMAL)
const subjectsIs = [
    { en: "The server", ipa: "da ser-ver" },
    { en: "My laptop", ipa: "mai lap-top" },
    { en: "The algorithm", ipa: "di al-go-ridm" },
    { en: "Vegeta", ipa: "ve-yi-ta" },
    { en: "The physics exam", ipa: "da fi-siks ex-am" },
    { en: "My backpack", ipa: "mai bak-pak" },
    { en: "The teacher", ipa: "da ti-cher" },
    { en: "The student", ipa: "da stu-dent" }
];

const subjectsAre = [
    { en: "We", ipa: "wi" },
    { en: "They", ipa: "dei" },
    { en: "The engineering students", ipa: "di en-yi-ni-ring stu-dents" },
    { en: "The servers", ipa: "da ser-vers" },
    { en: "My friends", ipa: "mai frends" }
];

const complementsPlaces = [
    { en: "in Corrientes.", ipa: "in co-rrien-tes." },
    { en: "in Chaco.", ipa: "in cha-co." },
    { en: "at the university.", ipa: "at da yu-ni-ver-si-ti." },
    { en: "in the laboratory.", ipa: "in da la-bo-ra-to-ri." },
    { en: "at the gym.", ipa: "at da yim." }
];

const complementsAdjectives = [
    { en: "online.", ipa: "on-lain." },
    { en: "offline.", ipa: "of-lain." },
    { en: "very fast.", ipa: "ve-ri fast." },
    { en: "complex.", ipa: "com-plex." },
    { en: "ready.", ipa: "re-di." }
];

const complementsNouns = [
    { en: "an engineer.", ipa: "an en-yi-nir." },
    { en: "a great warrior.", ipa: "a greit wo-rior." },
    { en: "a cybersecurity expert.", ipa: "a sai-ber-se-kiu-ri-ti ex-pert." }
];

const complementsPluralNouns = [
    { en: "good friends.", ipa: "gud frends." },
    { en: "engineers.", ipa: "en-yi-nirs." }
];

// 3. Motor Generador
function generateVerbToBe() {
    let listening = [];
    let speaking = [];
    let grammar = [];
    let order_game = [];

    for (let i = 0; i < 4; i++) {
        let isSubj = getRandom(subjectsIs);
        let areSubj = getRandom(subjectsAre);
        
        let compForIs = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsNouns]);
        let compForAre = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsPluralNouns]);
        let compForI = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsNouns]);

        // Unimos el texto en inglés
        let listenSentence = `${isSubj.en} is ${compForIs.en}`;
        let speakSentence = `${areSubj.en} are ${compForAre.en}`;
        let iSentence = `I am ${compForI.en}`;

        // Unimos la transcripción figurada
        let listenIpa = `/${isSubj.ipa} is ${compForIs.ipa}/`;
        let speakIpa = `/${areSubj.ipa} ar ${compForAre.ipa}/`;
        let iIpa = `/ai am ${compForI.ipa}/`;

        // Guardamos objetos completos
        listening.push({ text: listenSentence, ipa: listenIpa });
        speaking.push({ text: speakSentence, ipa: speakIpa });

        // Gramática
        let randomQuizType = Math.random();
        if (randomQuizType < 0.33) {
            grammar.push({ 
                question: `${isSubj.en} ___ ${compForIs.en}`, options: ["am", "is", "are"], answer: "is",
                explanation: `El sujeto "${isSubj.en}" es tercera persona singular (it, he, she), usa "is".`
            });
        } else if (randomQuizType < 0.66) {
            grammar.push({ 
                question: `${areSubj.en} ___ ${compForAre.en}`, options: ["am", "is", "are"], answer: "are",
                explanation: `El sujeto "${areSubj.en}" es plural (we, you, they), usa "are".`
            });
        } else {
            grammar.push({ 
                question: `I ___ ${compForI.en}`, options: ["am", "is", "are"], answer: "am",
                explanation: `El pronombre "I" siempre usa "am".`
            });
        }

        // Juego de ordenar
        let sentenceToScramble = (Math.random() < 0.5) ? listenSentence : speakSentence;
        order_game.push({
            words: [...sentenceToScramble.split(" ")].sort(() => Math.random() - 0.5),
            answer: sentenceToScramble
        });
    }

    return { listening, speaking, grammar, order_game };
}

const dynamicData = generateVerbToBe();

// 4. Exportamos la base de datos (con teoría de Oxford intacta)
const database = {
    "verb_to_be": {
        title: "1. Verb to be (Oxford Standard)",
        theory: `
            <p>Según la <b>Oxford Learner's Grammar</b>, usamos el verbo <b>to be</b> para identificar personas y cosas, hablar de profesiones, nacionalidades, edades y ubicaciones.</p>
            
            <h3 style="color: #2563eb; margin-bottom: 5px;">✅ Affirmative (Full form ➔ Short form)</h3>
            <ul style="margin-top: 0;">
                <li><b>I am ➔ I'm</b> (<i>I'm twenty years old.</i>)</li>
                <li><b>He / She / It is ➔ He's / She's / It's</b> (<i>She's an engineer.</i>)</li>
                <li><b>You / We / They are ➔ You're / We're / They're</b> (<i>They're in the laboratory.</i>)</li>
            </ul>

            <h3 style="color: #ef4444; margin-bottom: 5px;">❌ Negative (Full form ➔ Short form)</h3>
            <p style="margin-top: 0; font-size: 0.9em; color: #64748b;">En inglés hablado y escrito informal, casi siempre usamos las Short Forms.</p>
            <ul style="margin-top: 0;">
                <li><b>I am not ➔ I'm not</b> (<i>I'm not a teacher.</i>)</li>
                <li><b>He / She / It is not ➔ He / She / It isn't</b> (<i>It isn't a new computer.</i>)</li>
                <li><b>You / We / They are not ➔ You / We / They aren't</b> (<i>We aren't late.</i>)</li>
            </ul>

            <h3 style="color: #22c55e; margin-bottom: 5px;">❓ Questions & Short answers</h3>
            <p style="margin-top: 0; font-size: 0.9em; color: #64748b;">Para preguntar invertimos el orden (Verbo + Sujeto). En las respuestas cortas afirmativas <b>nunca</b> usamos contracciones.</p>
            <ul style="margin-top: 0;">
                <li><b>Am I...?</b> ➔ <i>Yes, I am. / No, I'm not.</i></li>
                <li><b>Is he/she/it...?</b> ➔ <i>Yes, it is. / No, it isn't.</i></li>
                <li><b>Are you/we/they...?</b> ➔ <i>Yes, we are. / No, we aren't.</i></li>
            </ul>
        `,
        listening: dynamicData.listening,
        speaking: dynamicData.speaking,
        grammar: dynamicData.grammar,
        order_game: dynamicData.order_game
    }
};