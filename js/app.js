let currentTopic = "";

function initApp() {
    const selector = document.getElementById('topic-selector');
    selector.innerHTML = '';
    
    for (const key in database) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = database[key].title;
        selector.appendChild(option);
    }
    
    const firstKey = Object.keys(database)[0];
    loadTopic(firstKey);
}

function loadTopic(topicId) {
    currentTopic = topicId;
    const data = database[topicId];
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="card">
            <h2>📖 Gramática</h2>
            <p>${data.theory}</p>
        </div>
        <div class="card">
            <h2>🎧 Listening</h2>
            <p>Escucha la pronunciación nativa:</p>
            <p><i>"${data.listenText}"</i></p>
            <button onclick="playAudio('${data.listenText}')">▶ Reproducir Audio</button>
        </div>
        <div class="card">
            <h2>🎙️ Speaking</h2>
            <p>Lee en voz alta para verificar tu pronunciación:</p>
            <p><b>"${data.speakText}"</b></p>
            <button onclick="startRecording('${data.speakText}')">🎤 Presionar para Hablar</button>
            <p id="mic-feedback"></p>
        </div>
        <div class="card">
            <h2>✍️ Ejercicio</h2>
            <p>${data.grammar.question}</p>
            <div class="grammar-options">
                ${data.grammar.options.map(opt => 
                    `<button class="grammar-btn" onclick="checkGrammar('${opt}', '${data.grammar.answer}')">${opt}</button>`
                ).join('')}
            </div>
            <div id="grammar-feedback" class="feedback"></div>
        </div>
    `;
}

function playAudio(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
}

function startRecording(expectedText) {
    const feedback = document.getElementById('mic-feedback');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        feedback.innerHTML = "<span class='error'>Tu navegador no soporta reconocimiento de voz. Usa Google Chrome.</span>";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    feedback.textContent = "Escuchando... (Habla ahora)";

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().replace(/[.,!?]/g, "").trim();
        const expected = expectedText.toLowerCase().replace(/[.,!?]/g, "").trim();
        
        if (transcript === expected) {
            feedback.innerHTML = `<span class='success'>¡Excelente! Escuché: "${transcript}"</span>`;
        } else {
            feedback.innerHTML = `<span class='error'>Casi. Escuché: "${transcript}". Intenta de nuevo.</span>`;
        }
    };

    recognition.onerror = function(event) {
        feedback.innerHTML = `<span class='error'>Error de micrófono: ${event.error}</span>`;
    };
}

function checkGrammar(selected, correct) {
    const feedback = document.getElementById('grammar-feedback');
    if (selected === correct) {
        feedback.textContent = "¡Correcto! ✅";
        feedback.className = "feedback success";
    } else {
        feedback.textContent = "Incorrecto. Intenta de nuevo ❌";
        feedback.className = "feedback error";
    }
}

window.onload = initApp;
