let currentTopic = "";
let currentRecognition = null;

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

    // 🎧 Listening (Solucionado el [object Object] para leer la fonética)
    html += `<div class="card"><h2>🎧 Listening (Escucha)</h2>`;
    data.listening.forEach((item, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p style="font-size: 1.1em; margin-bottom: 5px;"><i>"${item.text}"</i></p>
                <p style="color: #0ea5e9; font-family: monospace; font-size: 0.9em; margin-top: 0;">${item.ipa}</p>
                <button onclick="playAudio('${item.text.replace(/'/g, "\\'")}')">▶ Reproducir Audio</button>
            </div>`;
    });
    html += `</div>`;

    // 🎙️ Speaking (Solucionado el [object Object] para leer la fonética)
    html += `<div class="card"><h2>🎙️ Speaking (Pronunciación)</h2>`;
    data.speaking.forEach((item, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p style="font-size: 1.1em; margin-bottom: 5px;"><b>"${item.text}"</b></p>
                <p style="color: #0ea5e9; font-family: monospace; font-size: 0.9em; margin-top: 0;">${item.ipa}</p>
                <button id="btn-record-${index}" onclick="startRecording('${item.text.replace(/'/g, "\\'")}', 'mic-feedback-${index}', ${index})">🎤 Hablar</button>
                <button id="btn-stop-${index}" style="display:none; background-color: #ef4444;" onclick="stopRecording(${index})">⏹ Detener y Evaluar</button>
                <p id="mic-feedback-${index}" class="feedback" style="display:none;"></p>
            </div>`;
    });
    html += `</div>`;

    // ✍️ Gramática
    html += `<div class="card"><h2>✍️ Quiz de Gramática</h2>`;
    data.grammar.forEach((item, index) => {
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <p>${index + 1}. ${item.question}</p>
                <div class="grammar-options">
                    ${item.options.map(opt => `<button class="grammar-btn" onclick="checkGrammar('${opt}', '${item.answer}', 'gram-feedback-${index}', '${item.explanation.replace(/'/g, "\\'")}')">${opt}</button>`).join('')}
                </div>
                <div id="gram-feedback-${index}" class="feedback" style="display:none; padding: 12px; margin-top: 10px; line-height: 1.5;"></div>
            </div>`;
    });
    html += `</div>`;

    // 🧩 Order Game
    if (data.order_game) {
        html += `<div class="card"><h2>🧩 Juego: Ordena la oración</h2>`;
        data.order_game.forEach((item, index) => {
            html += `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <p>Haz clic en las palabras en el orden correcto:</p>
                    <div class="grammar-options" id="word-bank-${index}">
                        ${item.words.map(word => `<button class="grammar-btn" onclick="addWordToSentence('${word.replace(/'/g, "\\'")}', ${index}, '${item.answer.replace(/'/g, "\\'")}')">${word}</button>`).join('')}
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

// 🔴 FILTRO ESTRICTO DE AUDIO (Voz nativa obligatoria)
function playAudio(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.85; 
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));

    if (englishVoices.length > 0) {
        const premium = englishVoices.find(v => 
            v.name.includes('Samantha') || 
            v.name.includes('Alex') || 
            v.name.includes('Google') ||
            v.name.includes('Daniel')
        );
        speech.voice = premium || englishVoices[0];
    } else {
        speech.lang = 'en-US';
    }
    
    window.speechSynthesis.speak(speech);
}

window.speechSynthesis.onvoiceschanged = function() {
    window.speechSynthesis.getVoices();
};

// MICRÓFONO Y LÓGICA
function startRecording(expectedText, feedbackId, index) {
    const feedback = document.getElementById(feedbackId);
    const btnRecord = document.getElementById(`btn-record-${index}`);
    const btnStop = document.getElementById(`btn-stop-${index}`);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        feedback.innerHTML = "Tu navegador no soporta reconocimiento de voz.";
        feedback.className = "feedback error";
        feedback.style.display = "block";
        return;
    }

    if (currentRecognition) currentRecognition.stop(); 
    
    currentRecognition = new SpeechRecognition();
    currentRecognition.lang = 'en-US';
    currentRecognition.interimResults = false;
    
    feedback.textContent = "Escuchando... (Toca 'Detener' al terminar)";
    feedback.className = "feedback";
    feedback.style.display = "block";
    btnRecord.style.display = "none";
    btnStop.style.display = "inline-block";
    
    currentRecognition.start();

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
    currentRecognition.onerror = function() { resetMicButtons(index); };
    currentRecognition.onend = function() { resetMicButtons(index); };
}

function stopRecording(index) {
    const feedback = document.getElementById(`mic-feedback-${index}`);
    if (currentRecognition) {
        feedback.textContent = "Evaluando tu pronunciación...";
        currentRecognition.stop(); 
    }
}

function resetMicButtons(index) {
    const btnRecord = document.getElementById(`btn-record-${index}`);
    const btnStop = document.getElementById(`btn-stop-${index}`);
    if (btnRecord && btnStop) {
        btnRecord.style.display = "inline-block";
        btnStop.style.display = "none";
    }
}

function checkGrammar(selected, correct, feedbackId, explanation) {
    const feedback = document.getElementById(feedbackId);
    feedback.style.display = "block";
    if (selected === correct) {
        feedback.innerHTML = "¡Correcto! ✅";
        feedback.className = "feedback success";
    } else {
        feedback.innerHTML = `<span style="font-size: 1.1em;">Incorrecto ❌</span><br><br><b>Respuesta correcta:</b> "${correct}"<br><b>¿Por qué?</b> ${explanation}`;
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

    if (userSentences[index].length === correctAnswer.split(' ').length) {
        const feedback = document.getElementById(`order-feedback-${index}`);
        feedback.style.display = "block";
        if (currentSentence === correctAnswer) {
            feedback.textContent = "¡Perfecto! ✅";
            feedback.className = "feedback success";
        } else {
            feedback.textContent = "Orden incorrecto. Toca 'Reiniciar' ❌";
            feedback.className = "feedback error";
        }
    }
}

function resetSentence(index) {
    userSentences[index] = [];
    document.getElementById(`sentence-${index}`).textContent = '';
    document.getElementById(`order-feedback-${index}`).style.display = 'none';
    const buttons = document.getElementById(`word-bank-${index}`).getElementsByTagName('button');
    for(let btn of buttons) btn.style.display = 'inline-block';
}

window.onload = initApp;