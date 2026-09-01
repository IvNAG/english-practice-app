// 1. Función auxiliar para elegir palabras al azar
function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 2. MEGA BANCO DE VOCABULARIO A1
const subjectsI = ["I"];

const subjectsIs = [
    "My mother", "His brother", "The teacher", "The doctor", "The student", "My friend", "The engineer", "The programmer",
    "The car", "The house", "The book", "The phone", "The cat", "The dog", "The coffee", "The weather", "The train",
    "The operating system", "My PS5", "Vegeta", "My black backpack", "The physics exam", "The algebra test", "The server", "The algorithm", "My laptop", "The internet connection"
];

const subjectsAre = [
    "We", "They", "My parents", "The students", "The teachers", "My friends", "The children", "The doctors",
    "The computers", "The books", "The keys", "The cars", "The cats", "The dogs",
    "The servers", "The engineering students", "The algorithms", "The gym weights", "The hard drives"
];

const complementsPlaces = [
    "at home.", "at school.", "in the park.", "in the hospital.", "in the city.", "on the table.", "in the room.", "at work.", "in the garden.", "under the desk.",
    "in Corrientes.", "in Chaco.", "at the gym.", "in the laboratory.", "at the university."
];

const complementsAdjectives = [
    "happy.", "sad.", "big.", "small.", "tall.", "short.", "hot.", "cold.", "expensive.", "cheap.", "beautiful.", "good.", "bad.", "easy.", "hard.", "tired.", "hungry.", "thirsty.", "new.", "old.",
    "online.", "offline.", "very fast.", "extremely heavy.", "ready.", "complex.", "difficult.", "broken."
];

const complementsNouns = [
    "a doctor.", "a teacher.", "a good friend.", "a student.", "a happy person.",
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

    for (let i = 0; i < 6; i++) {
        let isSubj = getRandom(subjectsIs);
        let areSubj = getRandom(subjectsAre);
        
        let compForIs = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsNouns]);
        let compForAre = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsPluralNouns]);
        let compForI = getRandom([...complementsPlaces, ...complementsAdjectives, ...complementsNouns]);

        let listenSentence = `${isSubj} is ${compForIs}`;
        let speakSentence = `${areSubj} are ${compForAre}`;
        let iSentence = `I am ${compForI}`;

        listening.push(listenSentence);
        speaking.push(speakSentence);

        // Generamos un quiz gramatical aleatorio CON EXPLICACIONES
        let randomQuizType = Math.random();
        if (randomQuizType < 0.33) {
            grammar.push({ 
                question: `${isSubj} ___ ${compForIs}`, 
                options: ["am", "is", "are"], 
                answer: "is",
                explanation: `El sujeto "${isSubj}" actúa como tercera persona en singular (equivalente a he, she o it), por lo que siempre debe ir acompañado del verbo "is".`
            });
        } else if (randomQuizType < 0.66) {
            grammar.push({ 
                question: `${areSubj} ___ ${compForAre}`, 
                options: ["am", "is", "are"], 
                answer: "are",
                explanation: `El sujeto "${areSubj}" representa un plural (equivalente a we, you o they), por lo que siempre le corresponde la forma "are".`
            });
        } else {
            grammar.push({ 
                question: `I ___ ${compForI}`, 
                options: ["am", "is", "are"], 
                answer: "am",
                explanation: `El pronombre "I" (Yo) es exclusivo en inglés y siempre, sin excepción, utiliza la forma "am" del verbo to be en presente.`
            });
        }

        let sentenceToScramble = "";
        let scrambleChoice = Math.random();
        if(scrambleChoice < 0.33) sentenceToScramble = listenSentence;
        else if(scrambleChoice < 0.66) sentenceToScramble = speakSentence;
        else sentenceToScramble = iSentence;

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