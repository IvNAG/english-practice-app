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
    
    let html = `
        <div class="card">
            <h2>📖 Gramática</h2>
            <p>${data.theory}</p>
        </div>
    `;

    // Generar sección Listening
    html += `<div class="card"><h2>🎧 Listening (Escucha)</h2>`;
    data.listening.forEach((text, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p><i>"${text}"</i></p>
                <button onclick="playAudio('${text}')">▶ Reproducir Audio ${index + 1}</button>
            </div>`;
    });
    html += `</div>`;

    // Generar sección Speaking
    html += `<div class="card"><h2>🎙️ Speaking (Pronunciación)</h2>`;
    data.speaking.forEach((text, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p><b>"${text}"</b></p>
                <button onclick="startRecording('${text}', 'mic-feedback-${index}')">🎤 Hablar ${index + 1}</button>
                <p id="mic-feedback-${index}" class="feedback" style="display:none;"></p>
            </div>`;
    });
    html += `</div>`;

    // Generar sección Grammar
    html += `<div class="card"><h2>✍️ Quiz de Gramática</h2>`;
    data.grammar.forEach((item, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p>${index + 1}. ${item.question}</p>
                <div class="grammar-options">
                    ${item.options.map(opt => `<button class="grammar-btn" onclick="checkGrammar('${opt}', '${item.answer}', 'gram-feedback-${index}')">${opt}</button>`).join('')}
                </div>
                <div id="gram-feedback-${index}" class="feedback"></div>
            </div>`;
    });
    html += `</div>`;

    // Generar sección Order Game
    if (data.order_game) {
        html += `<div class="card"><h2>🧩 Juego: Ordena la oración</h2>`;
        data.order_game.forEach((item, index) => {
            html += `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <p>Haz clic en las palabras en el orden correcto:</p>
                    <div class="grammar-options" id="word-bank-${index}">
                        ${item.words.map(word => `<button class="grammar-btn" onclick="addWordToSentence('${word}', ${index}, '${item.answer}')">${word}</button>`).join('')}
                    </div>
                    <div style="margin-top: 10px; padding: 10px; background: #e2e8f0; min-height: 24px; border-radius: 6px;" id="sentence-${index}"></div>
                    <button style="margin-top: 10px; background-color: #64748b;" onclick="resetSentence(${index})">🔄 Reiniciar esta oración</button>
                    <div id="order-feedback-${index}" class="feedback"></div>
                </div>`;
        });
        html += `</div>`;
    }

    container.innerHTML = html;
}

// Funciones de Audio y Micrófono
function playAudio(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
}

function startRecording(expectedText, feedbackId) {
    const feedback = document.getElementById(feedbackId);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        feedback.innerHTML = "Tu navegador no soporta reconocimiento de voz.";
        feedback.className = "feedback error";
        feedback.style.display = "block";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    feedback.textContent = "Escuchando...";
    feedback.className = "feedback";
    feedback.style.display = "block";
    
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().replace(/[.,!?]/g, "").trim();
        const expected = expectedText.toLowerCase().replace(/[.,!?]/g, "").trim();
        
        if (transcript === expected) {
            feedback.innerHTML = `¡Excelente! Escuché: "${transcript}"`;
            feedback.className = "feedback success";
        } else {
            feedback.innerHTML = `Casi. Escuché: "${transcript}".`;
            feedback.className = "feedback error";
        }
    };
}

function checkGrammar(selected, correct, feedbackId) {
    const feedback = document.getElementById(feedbackId);
    feedback.style.display = "block";
    if (selected === correct) {
        feedback.textContent = "¡Correcto! ✅";
        feedback.className = "feedback success";
    } else {
        feedback.textContent = "Incorrecto ❌";
        feedback.className = "feedback error";
    }
}

// Lógica del nuevo juego de ordenar
let userSentences = {};

function addWordToSentence(word, index, correctAnswer) {
    if (!userSentences[index]) userSentences[index] = [];
    userSentences[index].push(word);
    
    const sentenceDiv = document.getElementById(`sentence-${index}`);
    const currentSentence = userSentences[index].join(' ');
    sentenceDiv.textContent = currentSentence;
    
    // Ocultar el botón temporalmente (opcional)
    event.target.style.display = 'none';

    // Check if finished
    const wordsInCorrect = correctAnswer.split(' ').length;
    if (userSentences[index].length === wordsInCorrect) {
        const feedback = document.getElementById(`order-feedback-${index}`);
        feedback.style.display = "block";
        if (currentSentence === correctAnswer) {
            feedback.textContent = "¡Perfecto! ✅";
            feedback.className = "feedback success";
        } else {
            feedback.textContent = "Orden incorrecto. Toca 'Reiniciar' e intenta de nuevo ❌";
            feedback.className = "feedback error";
        }
    }
}

function resetSentence(index) {
    userSentences[index] = [];
    document.getElementById(`sentence-${index}`).textContent = '';
    document.getElementById(`order-feedback-${index}`).style.display = 'none';
    
    // Mostrar todos los botones de nuevo
    const buttons = document.getElementById(`word-bank-${index}`).getElementsByTagName('button');
    for(let btn of buttons) {
        btn.style.display = 'inline-block';
    }
}

window.onload = initApp;