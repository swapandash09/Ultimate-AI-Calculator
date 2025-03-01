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
            if (/^\d+$/.test(value)) speak(`Number ${value}`);
            else if (value === '+') speak('Plus');
            else if (value === '-') speak('Minus');
            else if (value === '*') speak('Multiply');
            else if (value === '/') speak('Divide');
        }
        display.textContent = currentInput;
    });
});

// Theme Cycling
const themeCycle = document.getElementById('theme-cycle');
const themes = ['light', 'dark', 'colorful'];
let themeIndex = 0;
themeCycle.addEventListener('click', () => {
    themeIndex = (themeIndex + 1) % themes.length;
    document.body.className = themes[themeIndex];
    speak(`Theme changed to ${themes[themeIndex]}`);
});

// Language Cycling
const langCycle = document.getElementById('lang-cycle');
const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-IN', name: 'Bengali' }
];
let langIndex = 0;
langCycle.addEventListener('click', () => {
    langIndex = (langIndex + 1) % languages.length;
    currentLang = languages[langIndex].code;
    recognition.lang = currentLang;
    speak(`Language changed to ${languages[langIndex].name}`);
});

// Voice Support
const voiceToggle = document.getElementById('voiceToggle');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = currentLang;

let isVoiceActive = false;

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

function startRecognition() {
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

recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log('Heard:', command);

    // Language Switching
    if (command.includes('change to hindi') || command.includes('hindi mein badlo')) {
        currentLang = 'hi-IN';
        recognition.lang = currentLang;
        langIndex = 1;
        speak('भाषा हिंदी में बदल गई');
    } else if (command.includes('change to english') || command.includes('english mein badlo')) {
        currentLang = 'en-IN';
        recognition.lang = currentLang;
        langIndex = 0;
        speak('Language changed to English');
    } else if (command.includes('change to bengali') || command.includes('bangla mein badlo')) {
        currentLang = 'bn-IN';
        recognition.lang = currentLang;
        langIndex = 2;
        speak('ভাষা বাংলায় পরিবর্তন হয়েছে');
    }

    // Theme Control
    else if (command.includes('change theme') || command.includes('theme badlo')) {
        themeIndex = (themeIndex + 1) % themes.length;
        document.body.className = themes[themeIndex];
        speak(`Theme changed to ${themes[themeIndex]}`);
    }

    // Number Input
    else if (command.match(/\d+/) || command.includes('do') || command.includes('dui')) {
        const numberMap = {
            'one': '1', 'two': '2', 'do': '2', 'dui': '2', 'three': '3', 'teen': '3', 'four': '4', 'char': '4', 'five': '5', 'paanch': '5', 'ten': '10', 'das': '10'
        };
        const numWord = Object.keys(numberMap).find(word => command.includes(word));
        const num = numWord ? numberMap[numWord] : (command.match(/\d+/) ? command.match(/\d+/)[0] : null);
        if (num) {
            currentInput = currentInput === '0' ? num : currentInput + num;
            speak(`Number ${num}`);
            display.textContent = currentInput;
        }
    }

    // Operations
    else if (command.includes('plus') || command.includes('jod') || command.includes('যোগ')) {
        currentInput += '+';
        speak('Plus');
        display.textContent = currentInput;
    } else if (command.includes('minus') || command.includes('ghata') || command.includes('বিয়োগ')) {
        currentInput += '-';
        speak('Minus');
        display.textContent = currentInput;
    } else if (command.includes('multiply') || command.includes('guna') || command.includes('গুণ')) {
        currentInput += '*';
        speak('Multiply');
        display.textContent = currentInput;
    } else if (command.includes('divide') || command.includes('bhag') || command.includes('ভাগ')) {
        currentInput += '/';
        speak('Divide');
        display.textContent = currentInput;
    } else if (command.includes('clear') || command.includes('saaf karo') || command.includes('পরিষ্কার')) {
        currentInput = '0';
        speak('Cleared');
        display.textContent = currentInput;
    }

    // Calculation Questions (e.g., "5 + 10 kitne hota hai")
    else if (command.match(/\d+.*[+-/*].*\d+/)) {
        const numbers = command.match(/\d+/g);
        const num1 = numbers && numbers[0] ? numbers[0] : null;
        const num2 = numbers && numbers[1] ? numbers[1] : null;
        let operator = '';

        if (command.includes('plus') || command.includes('jod') || command.includes('যোগ')) operator = '+';
        else if (command.includes('minus') || command.includes('ghata') || command.includes('বিয়োগ')) operator = '-';
        else if (command.includes('multiply') || command.includes('guna') || command.includes('গুণ')) operator = '*';
        else if (command.includes('divide') || command.includes('bhag') || command.includes('ভাগ')) operator = '/';

        if (num1 && num2 && operator) {
            currentInput = `${num1}${operator}${num2}`;
            display.textContent = currentInput;
            console.log('Expression:', currentInput);
            try {
                currentInput = eval(currentInput).toString();
                speakResult(currentInput);
                display.textContent = currentInput;
                console.log('Result:', currentInput);
            } catch {
                currentInput = 'Error';
                speak('Invalid calculation');
                display.textContent = currentInput;
            }
        } else {
            speak('Please say it again clearly');
        }
    }

    // Result Request
    else if (command.includes('equals') || command.includes('result') || command.includes('jawab') || command.includes('kitna hota hai') || command.includes('kitne hote hain')) {
        try {
            currentInput = eval(currentInput).toString();
            speakResult(currentInput);
            display.textContent = currentInput;
        } catch {
            currentInput = 'Error';
            speak('Invalid calculation');
            display.textContent = currentInput;
        }
    }

    recognition.stop();
    if (isVoiceActive) setTimeout(startRecognition, 1500);
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
    if (isVoiceActive) setTimeout(startRecognition, 1500);
};

// Text-to-Speech
function speak(text) {
    const translations = {
        'en-IN': {
            'Cleared': 'Cleared',
            'Plus': 'Plus',
            'Minus': 'Minus',
            'Multiply': 'Multiply',
            'Divide': 'Divide',
            'Number': 'Number',
            'Error in calculation': 'Error in calculation',
            'Please say it again clearly': 'Please say it again clearly',
            'Voice control activated': 'Voice control activated',
            'Voice control stopped': 'Voice control stopped',
            'Voice error, please try again': 'Voice error, please try again',
            'Mic failed to start, check permissions': 'Mic failed to start, check permissions',
            'No speech detected, please speak': 'No speech detected, please speak',
            'Mic not found, check your device': 'Mic not found, check your device',
            'Mic permission denied, allow it': 'Mic permission denied, allow it'
        },
        'hi-IN': {
            'Cleared': 'साफ हो गया',
            'Plus': 'जोड़',
            'Minus': 'घटाव',
            'Multiply': 'गुणा',
            'Divide': 'भाग',
            'Number': 'नंबर',
            'Error in calculation': 'गणना में त्रुटि',
            'Please say it again clearly': 'कृपया फिर से स्पष्ट रूप से कहें',
            'Voice control activated': 'वॉइस कंट्रोल शुरू हो गया',
            'Voice control stopped': 'वॉइस कंट्रोल बंद हो गया',
            'Voice error, please try again': 'वॉइस में त्रुटि, कृपया फिर से कोशिश करें',
            'Mic failed to start, check permissions': 'माइक शुरू करने में असफल, अनुमति जांचें',
            'No speech detected, please speak': 'कोई आवाज नहीं मिली, कृपया बोलें',
            'Mic not found, check your device': 'माइक नहीं मिला, अपने डिवाइस की जांच करें',
            'Mic permission denied, allow it': 'माइक अनुमति अस्वीकृत, इसे अनुमति दें'
        },
        'bn-IN': {
            'Cleared': 'পরিষ্কার হয়ে গেছে',
            'Plus': 'যোগ',
            'Minus': 'বিয়োগ',
            'Multiply': 'গুণ',
            'Divide': 'ভাগ',
            'Number': 'নম্বর',
            'Error in calculation': 'গণনায় ত্রুটি',
            'Please say it again clearly': 'দয়া করে আবার স্পষ্টভাবে বলুন',
            'Voice control activated': 'ভয়েস নিয়ন্ত্রণ চালু হয়েছে',
            'Voice control stopped': 'ভয়েস নিয়ন্ত্রণ বন্ধ হয়েছে',
            'Voice error, please try again': 'ভয়েসে ত্রুটি, আবার চেষ্টা করুন',
            'Mic failed to start, check permissions': 'মাইক চালু করতে ব্যর্থ, অনুমতি পরীক্ষা করুন',
            'No speech detected, please speak': 'কোনো শব্দ শনাক্ত হয়নি, বলুন',
            'Mic not found, check your device': 'মাইক পাওয়া যায়নি, আপনার ডিভাইস চেক করুন',
            'Mic permission denied, allow it': 'মাইকের অনুমতি প্রত্যাখ্যাত, এটি অনুমতি দিন'
        }
    };

    const translatedText = translations[currentLang][text.split(' ')[0]] ? 
        text.replace(text.split(' ')[0], translations[currentLang][text.split(' ')[0]]) : text;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = currentLang;
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => console.log('TTS started:', translatedText);
    utterance.onend = () => console.log('TTS ended');
    utterance.onerror = (e) => console.error('TTS error:', e.error);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function speakResult(result) {
    const messages = {
        'en-IN': `The result is ${result}`,
        'hi-IN': `जवाब है ${result}`,
        'bn-IN': `ফলাফল হল ${result}`
    };
    speak(messages[currentLang]);
}
