// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
let currentInput = '0';
let currentLang = 'en-IN'; // Default Language English

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
let recognition;
try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true; 
    recognition.interimResults = false;
    recognition.lang = currentLang; // Default English
} catch (error) {
    console.error('SpeechRecognition not supported:', error);
    alert('Your browser does not support Speech Recognition. Use Chrome.');
}

let isVoiceActive = false;
function startRecognition() {
    if (!recognition) return;
    try {
        recognition.lang = currentLang; // Ensure it picks the right language
        recognition.start();
        isVoiceActive = true;
    } catch (error) {
        console.error('Mic start error:', error);
        speak('Mic failed to start, check permissions');
        isVoiceActive = false;
    }
}

if (recognition) {
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Heard:', command);

        // Language Change
        if (command.includes('change language to hindi') || command.includes('भाषा हिंदी करें')) {
            currentLang = 'hi-IN';
            speak('भाषा हिंदी में बदली गई');
        } else if (command.includes('change language to english')) {
            currentLang = 'en-IN';
            speak('Language changed to English');
        } else if (command.includes('change language to bengali') || command.includes('বাংলায় পরিবর্তন করুন')) {
            currentLang = 'bn-IN';
            speak('ভাষা বাংলা তে পরিবর্তন হয়েছে');
        }

        // Mathematical Expression Matching
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

        // Restart Voice Recognition
        recognition.stop();
        if (isVoiceActive) setTimeout(startRecognition, 500);
    };

    recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        speak('Voice recognition error, please try again');
        isVoiceActive = false;
    };

    recognition.onend = () => {
        if (isVoiceActive) setTimeout(startRecognition, 500);
    };
}

// Theme Change Fix
const themeButton = document.getElementById('themeButton');
themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    speak('Theme changed');
    setTimeout(startRecognition, 500);
});

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

// Start Voice Recognition on Page Load
startRecognition();
