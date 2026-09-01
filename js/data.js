// 1. Función auxiliar para elegir palabras al azar
function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 2. MEGA BANCO DE VOCABULARIO A1
// Sujetos
const subjectsI = ["I"];

const subjectsIs = [
    // Personas y familia
    "My mother", "His brother", "The teacher", "The doctor", "The student", "My friend", "The engineer", "The programmer",
    // Objetos cotidianos y A1
    "The car", "The house", "The book", "The phone", "The cat", "The dog", "The coffee", "The weather", "The train",
    // Tecnología y universidad
    "The operating system", "My PS5", "Vegeta", "My black backpack", "The physics exam", "The algebra test", "The server", "The algorithm", "My laptop", "The internet connection"
];

const subjectsAre = [
    // Personas (plural)
    "We", "They", "My parents", "The students", "The teachers", "My friends", "The children", "The doctors",
    // Objetos (plural)
    "The computers", "The books", "The keys", "The cars", "The cats", "The dogs",
    // Tecnología y entorno
    "The servers", "The engineering students", "The algorithms", "The gym weights", "The hard drives"
];

// Complementos
const complementsPlaces = [
    // Lugares A1 estándar
    "at home.", "at school.", "in the park.", "in the hospital.", "in the city.", "on the table.", "in the room.", "at work.", "in the garden.", "under the desk.",
    // Lugares específicos
    "in Corrientes.", "in Chaco.", "at the gym.", "in the laboratory.", "at the university."
];

const complementsAdjectives = [
    // Adjetivos A1 estándar
    "happy.", "sad.", "big.", "small.", "tall.", "short.", "hot.", "cold.", "expensive.", "cheap.", "beautiful.", "good.", "bad.", "easy.", "hard.", "tired.", "hungry.", "thirsty.", "new.", "old.",
    // Adjetivos técnicos/específicos
    "online.", "offline.", "very fast.", "extremely heavy.", "ready.", "complex.", "difficult.", "broken."
];

const complementsNouns = [
    // Sustantivos A1 (profesiones y cosas)
    "a doctor.", "a teacher.", "a good friend.", "a student.", "a happy person.",
    // Sustantivos específicos
    "a great warrior.", "an engineering student.", "a complex algorithm.", "a good programmer.", "a cybersecurity expert."
];

const complementsPluralNouns = [
    "good friends.", "students.", "teachers.", "engineers.", "gamers.", "good people."
];

// 3. Motor Generador de Ejercicios
function generateVerbToBe() {
    let listening = [];
    let speaking = [];
    let grammar = [];
    let order_game = [];

    // Generar 6 ejercicios únicos cada vez para que sea más robusto
    for (let i = 0; i < 6; i++) {
        let isSubj = getRandom(subjectsIs);
        let areSubj = getRandom(subjectsAre);
        
        // Mezclamos todos los complementos para mayor variedad
        let compForIs = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsNouns]);
        let compForAre = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsPluralNouns]);
        let compForI = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsNouns]);

        // Armamos oraciones dinámicas
        let listenSentence = `${isSubj} is ${compForIs}`;
        let speakSentence = `${areSubj} are ${compForAre}`;
        let iSentence = `I am ${compForI}`;

        listening.push(listenSentence);
        speaking.push(speakSentence);

        // Generamos un quiz gramatical aleatorio
        let randomQuizType = Math.random();
        if (randomQuizType < 0.33) {
            grammar.push({ question: `${isSubj} ___ ${compForIs}`, options: ["am", "is", "are"], answer: "is" });
        } else if (randomQuizType < 0.66) {
            grammar.push({ question: `${areSubj} ___ ${compForAre}`, options: ["am", "is", "are"], answer: "are" });
        } else {
            grammar.push({ question: `I ___ ${compForI}`, options: ["am", "is", "are"], answer: "am" });
        }

        // Elegimos al azar qué oración desordenar para el juego (puede ser la de IS, ARE o AM)
        let sentenceToScramble = "";
        let scrambleChoice = Math.random();
        if(scrambleChoice < 0.33) sentenceToScramble = listenSentence;
        else if(scrambleChoice < 0.66) sentenceToScramble = speakSentence;
        else sentenceToScramble = iSentence;

        // Desordenamos la oración elegida
        let wordsArray = sentenceToScramble.split(" ");
        let shuffledWords = [...wordsArray].sort(() => Math.random() - 0.5);
        
        order_game.push({
            words: shuffledWords,
            answer: sentenceToScramble
        });
    }

    return { listening, speaking, grammar, order_game };
}

// 4. Ejecutamos el generador
const dynamicData = generateVerbToBe();

// 5. Exportamos la base de datos a la app
const database = {
    "verb_to_be": {
        title: "1. Verb to be (Aleatorio Masivo)",
        theory: "El verbo 'to be' significa 'ser' o 'estar'.<br><br><b>Formas en presente:</b><br>• I <b>am</b><br>• He, She, It <b>is</b><br>• You, We, They <b>are</b><br><br><i>¡Nota: Tienes miles de combinaciones posibles. Recarga la página para ver ejercicios nuevos!</i>",
        listening: dynamicData.listening,
        speaking: dynamicData.speaking,
        grammar: dynamicData.grammar,
        order_game: dynamicData.order_game
    }
};