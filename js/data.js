const database = {
    "verb_to_be": {
        title: "1. Verb to be (Ser o Estar)",
        theory: "El verbo 'to be' significa 'ser' o 'estar'.<br><br><b>Formas en presente:</b><br>• I <b>am</b> (Yo soy / estoy)<br>• He, She, It <b>is</b> (Él, ella, eso es / está)<br>• You, We, They <b>are</b> (Tú, nosotros, ellos son / están)",
        
        // Múltiples audios para escuchar
        listening: [
            "I am an engineering student.",
            "The operating system is online.",
            "Vegeta is a great warrior."
        ],
        
        // Múltiples frases para practicar pronunciación
        speaking: [
            "We are in the gym.",
            "My backpack is very heavy.",
            "The physics evaluation is difficult."
        ],
        
        // Múltiples preguntas de gramática
        grammar: [
            { question: "I ___ from Corrientes.", options: ["am", "is", "are"], answer: "am" },
            { question: "The servers ___ down today.", options: ["am", "is", "are"], answer: "are" },
            { question: "It ___ a black Redragon backpack.", options: ["am", "is", "are"], answer: "is" },
            { question: "The algebra final exam ___ on September 10.", options: ["am", "is", "are"], answer: "is" }
        ],

        // ¡NUEVO JUEGO! Ordenar las palabras
        order_game: [
            { words: ["student.", "am", "a", "I"], answer: "I am a student." },
            { words: ["Corrientes.", "in", "are", "We"], answer: "We are in Corrientes." },
            { words: ["is", "fast.", "laptop", "My"], answer: "My laptop is fast." }
        ]
    }
};