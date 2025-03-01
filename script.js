// Select Elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const voiceButton = document.getElementById('voice-btn');
const themeButton = document.getElementById('theme-btn');
const scanButton = document.getElementById('scan-btn');

// Voice Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;

// Button Click Events
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.dataset.value;

        if (value === 'clear') {
            display.value = '';
        } else if (value === 'equals') {
            try {
                display.value = eval(display.value);
                speakResult(display.value);
            } catch {
                display.value = 'Error';
            }
        } else {
            display.value += value;
        }
    });
});

// Voice Command Feature
voiceButton.addEventListener('click', () => {
    recognition.start();
});

recognition.onresult = (event) => {
    const voiceInput = event.results[0][0].transcript;
    display.value += voiceInput.replace(/\s/g, '');
};

// Speak Out Result
function speakResult(result) {
    const speech = new SpeechSynthesisUtterance(result);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
}

// Theme Toggle Feature
themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Scan Bill Feature (Placeholder - Actual OCR Implementation Required)
scanButton.addEventListener('click', () => {
    alert("Scan feature is under development.");
});
