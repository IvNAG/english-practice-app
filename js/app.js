let currentTopic = "";
let currentRecognition = null; // Variable global para controlar el micrófono

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
                <button onclick="playAudio('${text}')">▶ Reproducir Audio</button>
            </div>`;
    });
    html += `</div>`;

    // Generar sección Speaking (AQUÍ ESTÁ EL NUEVO BOTÓN DE DETENER)
    html += `<div class="card"><h2>🎙️ Speaking (Pronunciación)</h2>`;
    data.speaking.forEach((text, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p><b>"${text}"</b></p>
                <button id="btn-record-${index}" onclick="startRecording('${text}', 'mic-feedback-${index}', ${index})">🎤 Hablar</button>
                <button id="btn-stop-${index}" style="display:none; background-color: #ef4444;" onclick="stopRecording(${index})">⏹ Detener y Evaluar</button>
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
                        ${item.words.map(word => `<button class="grammar-btn" onclick="addWordToSentence('${word}', ${index}, '${item.answer.replace(/'/g, "\\'")}')">${word}</button>`).join('')}
                    </div>
                    <div style="margin-top: 10px; padding: 10px; background: #e2e8f0; min-height: 24px; border-radius: 6px;" id="sentence-${index}"></div>
                    <button style="margin-top: 10px; background-color: #64748b;" onclick="resetSentence(${index})">🔄 Reiniciar</button>
                    <div id="order-feedback-${index}" class="feedback"></div>
                </div>`;
        });
        html += `</div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// NUEVA LÓGICA DE MICRÓFONO
// ==========================================

function startRecording(expectedText, feedbackId, index) {
    const feedback = document.getElementById(feedbackId);
    const btnRecord = document.getElementById(`btn-record-${index}`);
    const btnStop = document.getElementById(`btn-stop-${index}`);
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        feedback.innerHTML = "Tu navegador no soporta reconocimiento de voz. Usa Google Chrome.";
        feedback.className = "feedback error";
        feedback.style.display = "block";
        return;
    }

    // Si ya hay una grabación en curso, la detenemos
    if (currentRecognition) {
        currentRecognition.stop(); 
    }

    currentRecognition = new SpeechRecognition();
    currentRecognition.lang = 'en-US';
    currentRecognition.interimResults = false;
    
    // Cambiar interfaz
    feedback.textContent = "Escuchando... (Toca 'Detener' al terminar)";
    feedback.className = "feedback";
    feedback.style.display = "block";
    btnRecord.style.display = "none";
    btnStop.style.display = "inline-block";
    
    currentRecognition.start();

    // Cuando el sistema procesa el audio (ya sea automático o al forzar la detención)
    currentRecognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().replace(/[.,!?]/g, "").trim();
        const expected = expectedText.toLowerCase().replace(/[.,!?]/g, "").trim();
        
        if (transcript === expected) {
            feedback.innerHTML = `¡Excelente! Escuché: "${transcript}"`;
            feedback.className = "feedback success";
        } else {
            feedback.innerHTML = `Casi. Escuché: "${transcript}". Intenta de nuevo.`;
            feedback.className = "feedback error";
        }
        resetMicButtons(index);
    };

    currentRecognition.onerror = function(event) {
        feedback.innerHTML = `Error al escuchar. Intenta de nuevo.`;
        feedback.className = "feedback error";
        resetMicButtons(index);
    };

    currentRecognition.onend = function() {
        resetMicButtons(index);
    };
}

// Forzar la detención del micrófono y la evaluación
function stopRecording(index) {
    const feedback = document.getElementById(`mic-feedback-${index}`);
    if (currentRecognition) {
        feedback.textContent = "Evaluando tu pronunciación...";
        currentRecognition.stop(); 
    }
}

// Restaurar los botones a su estado original
function resetMicButtons(index) {
    const btnRecord = document.getElementById(`btn-record-${index}`);
    const btnStop = document.getElementById(`btn-stop-${index}`);
    if (btnRecord && btnStop) {
        btnRecord.style.display = "inline-block";
        btnStop.style.display = "none";
    }
}

// ==========================================
// RESTO DEL CÓDIGO (Audio y Gramática)
// ==========================================

function playAudio(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.85; // Un poco más lento para nivel A1
    
    // Obtener todas las voces instaladas en el navegador/sistema
    const voices = window.speechSynthesis.getVoices();
    
    // Buscar las voces más naturales y fluidas disponibles
    const preferredVoices = voices.filter(voice => 
        voice.name.includes('Google US English') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Alex') ||
        voice.name.includes('Daniel')
    );

    // Si encuentra voces premium, usa la primera. Si no, busca cualquier voz en inglés.
    if (preferredVoices.length > 0) {
        speech.voice = preferredVoices[0];
    } else {
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        if (englishVoices.length > 0) {
            speech.voice = englishVoices[0];
        }
    }

    window.speechSynthesis.speak(speech);
}

// Truco para forzar al navegador a cargar las voces en segundo plano al abrir la app
window.speechSynthesis.onvoiceschanged = function() {
    window.speechSynthesis.getVoices();
};

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

let userSentences = {};

function addWordToSentence(word, index, correctAnswer) {
    if (!userSentences[index]) userSentences[index] = [];
    userSentences[index].push(word);
    
    const sentenceDiv = document.getElementById(`sentence-${index}`);
    const currentSentence = userSentences[index].join(' ');
    sentenceDiv.textContent = currentSentence;
    
    event.target.style.display = 'none';

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
    
    const buttons = document.getElementById(`word-bank-${index}`).getElementsByTagName('button');
    for(let btn of buttons) {
        btn.style.display = 'inline-block';
    }
}

window.onload = initApp;