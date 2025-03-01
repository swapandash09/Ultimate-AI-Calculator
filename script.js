// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
let currentInput = '0';
let currentLang = 'en-IN';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === 'C') {
            currentInput = '0';
            speak('Cleared');
        } else if (value === '=') {
            try {
                currentInput = eval(currentInput).toString();
                speakResult(currentInput);
            } catch {
                currentInput = 'Error';
                speak('Error in calculation');
            }
        } else {
            currentInput = currentInput === '0' ? value : currentInput + value;
            speak(value);
        }
        display.textContent = currentInput;
    });
});

// Voice Support
const voiceToggle = document.getElementById('voiceToggle');
let recognition;

try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true; // Mic hamesha active rahega
    recognition.interimResults = false;
    recognition.lang = currentLang;
} catch (error) {
    console.error('SpeechRecognition not supported:', error);
    alert('Your browser does not support Speech Recognition. Use Chrome.');
}

let isVoiceActive = false;

if (voiceToggle && recognition) {
    voiceToggle.addEventListener('click', () => {
        if (!isVoiceActive) {
            startRecognition();
            voiceToggle.classList.add('active');
            speak('Voice control activated');
        } else {
            recognition.stop();
            voiceToggle.classList.remove('active');
            speak('Voice control stopped');
            isVoiceActive = false;
        }
    });
}

function startRecognition() {
    if (!recognition) return;
    try {
        recognition.start();
        isVoiceActive = true;
        console.log('Mic is ON, speak now...');
    } catch (error) {
        console.error('Mic start error:', error);
        speak('Mic failed to start, check permissions');
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
    }
}

// Voice Recognition Handling
if (recognition) {
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Heard:', command);

        // Mathematical Expression Matching (e.g., "2 + 2")
        const match = command.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
        if (match) {
            let num1 = match[1];
            let operator = match[2];
            let num2 = match[3];

            currentInput = `${num1} ${operator} ${num2}`;
            display.textContent = currentInput;

            try {
                currentInput = eval(currentInput).toString();
                speakResult(currentInput);
                display.textContent = currentInput;
            } catch {
                currentInput = 'Error';
                speak('Error in calculation');
                display.textContent = currentInput;
            }
        }

        // Basic Commands
        else if (command.includes('clear') || command.includes('saaf karo')) {
            currentInput = '0';
            speak('Cleared');
            display.textContent = currentInput;
        } else {
            speak('Please repeat the command clearly.');
        }

        // Auto Restart Recognition for Continuous Mode
        recognition.stop();
        if (isVoiceActive) setTimeout(startRecognition, 1000);
    };

    recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        let errorMessage = 'Voice error, please try again';
        if (event.error === 'no-speech') errorMessage = 'No speech detected, please speak';
        else if (event.error === 'audio-capture') errorMessage = 'Mic not found, check your device';
        else if (event.error === 'not-allowed') errorMessage = 'Mic permission denied, allow it';
        speak(errorMessage);
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
    };

    recognition.onend = () => {
        console.log('Voice recognition stopped');
        if (isVoiceActive) setTimeout(startRecognition, 1000);
    };
}

// Text-to-Speech
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang;
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function speakResult(result) {
    const message = `The result is ${result}`;
    speak(message);
}
