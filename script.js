```
// Intro Logic
document.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('.intro');
    const calculatorContainer = document.getElementById('calculatorContainer');

    if (!intro || !calculatorContainer) {
        console.error('Intro or Calculator container not found in DOM');
        console.warn('Forcing calculator display as fallback');
        if (calculatorContainer) {
            calculatorContainer.style.display = 'block';
            calculatorContainer.classList.add('visible');
        }
        return;
    }

    console.log('Page loaded, intro visible');
    calculatorContainer.style.display = 'none';

    // Function to handle transition
    function showCalculator() {
        try {
            console.log('Initiating transition: hiding intro, showing calculator');
            intro.classList.add('hidden');
            calculatorContainer.style.display = 'block';

            // Use requestAnimationFrame for smooth CSS transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    calculatorContainer.classList.add('visible');
                    console.log('Calculator now visible');
                });
            });
        } catch (error) {
            console.error('Error during intro transition:', error);
            console.warn('Forcing calculator display due to error');
            intro.style.display = 'none';
            calculatorContainer.style.display = 'block';
            calculatorContainer.classList.add('visible');
        }
    }

    // Attempt transition after 3 seconds
    setTimeout(showCalculator, 3000);

    // Fallback: Force show calculator after 5 seconds if transition fails
    setTimeout(() => {
        if (!intro.classList.contains('hidden') || !calculatorContainer.classList.contains('visible')) {
            console.warn('Transition timeout: forcing calculator display');
            intro.style.display = 'none';
            calculatorContainer.style.display = 'block';
            calculatorContainer.classList.add('visible');
        }
    }, 5000);
});

// Load math.js for safe and precise calculations
const script = document.createElement('script');
script.src = 'https://unpkg.com/mathjs@12.4.2/lib/browser/math.js';
document.head.appendChild(script);

// Calculator Logic
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.buttons button');
let currentInput = '0';
let currentLang = 'en-IN';
let calculationHistory = [];
let lastClickTime = 0;

if (!display || !buttons.length) {
    console.error('Display or buttons not found in DOM');
} else {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime < 200) return; // Debounce clicks
            lastClickTime = now;

            const value = button.textContent;
            console.log('Button clicked:', value);
            if (value === 'C') {
                currentInput = '0';
                speak('Cleared');
            } else if (value === '=') {
                try {
                    const result = math.evaluate(currentInput).toString();
                    speakResult(result);
                    calculationHistory.push({
                        date: new Date().toLocaleString(),
                        input: currentInput,
                        result: result
                    });
                    currentInput = result;
                } catch (error) {
                    console.error('Calculation error:', error);
                    currentInput = 'Error';
                    speak('Error in calculation');
                }
            } else {
                if (currentInput === '0' && value !== '+' && value !== '-' && value !== '*' && value !== '/' && value !== '(' && value !== ')') {
                    currentInput = value;
                } else if (/[+\-*/]$/.test(currentInput) && /[+\-*/]/.test(value)) {
                    currentInput = currentInput.slice(0, -1) + value;
                } else {
                    currentInput += value;
                }
                speak(value);
            }
            display.textContent = currentInput;
        });
    });
}

// Theme Initialization
const themeCycle = document.getElementById('theme-cycle');
const themes = ['light', 'dark', 'colorful'];
let themeIndex = 0;

if (themeCycle) {
    themeCycle.addEventListener('click', () => {
        themeIndex = (themeIndex + 1) % themes.length;
        applyTheme(themes[themeIndex]);
        speak(`Theme changed to ${themes[themeIndex]}`);
    });
}

function applyTheme(theme) {
    document.body.className = theme;
    console.log('Theme switched to:', theme);
}

// Language Cycling
const langCycle = document.getElementById('lang-cycle');
const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-IN', name: 'Bengali' }
];
let langIndex = 0;

if (langCycle) {
    langCycle.addEventListener('click', () => {
        langIndex = (langIndex + 1) % languages.length;
        currentLang = languages[langIndex].code;
        if (recognition) recognition.lang = currentLang;
        speak(`Language changed to ${languages[langIndex].name}`);
    });
}

// History Toggle
const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');

if (historyToggle && historyPanel) {
    historyToggle.addEventListener('click', () => {
        historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
        updateHistoryUI();
    });
}

function updateHistoryUI() {
    const historyList = document.getElementById('historyList');
    const historyInsights = document.getElementById('historyInsights');
    if (historyList && historyInsights) {
        historyList.innerHTML = '';
        calculationHistory.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.date}: ${entry.input} = ${entry.result}`;
            historyList.appendChild(li);
        });

        const totals = calculationHistory.filter(h => !isNaN(parseFloat(h.result))).map(h => parseFloat(h.result));
        if (totals.length > 0) {
            const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
            historyInsights.textContent = `Average Result: ${avg.toFixed(2)}`;
        } else {
            historyInsights.textContent = 'No numeric results yet.';
        }
    } else {
        console.error('History list or insights element not found');
    }
}

// Voice Support
const voiceToggle = document.getElementById('voiceToggle');
let recognition = null;
let recognitionAttempts = 0;
const maxRecognitionAttempts = 3;
let lastVoiceToggleTime = 0;

function initializeRecognition() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        console.error('SpeechRecognition not supported in this browser.');
        speak('Voice recognition is not supported. Please use Chrome.');
        voiceToggle.disabled = true;
        voiceToggle.style.opacity = '0.5';
        voiceToggle.style.cursor = 'not-allowed';
        return false;
    }

    try {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLang;
        console.log('SpeechRecognition initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize SpeechRecognition:', error);
        return false;
    }
}

async function checkMicPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        console.log('Microphone permission state:', result.state);
        if (result.state === 'denied') {
            speak('Microphone permission is denied. Please enable it in your browser settings.');
            console.log('Go to Chrome Settings > Privacy and Security > Site Settings > Microphone to allow access.');
            return false;
        } else if (result.state === 'prompt') {
            console.log('Microphone permission not yet granted. Requesting permission...');
            return true;
        } else if (result.state === 'granted') {
            console.log('Microphone permission granted.');
            return true;
        }
    } catch (error) {
        console.error('Error checking microphone permission:', error);
        speak('Error checking microphone permission. Please check your browser settings.');
        return false;
    }
}

async function startRecognition() {
    if (!recognition) {
        if (recognitionAttempts < maxRecognitionAttempts) {
            recognitionAttempts++;
            console.log(`Retrying SpeechRecognition initialization, attempt ${recognitionAttempts}`);
            if (initializeRecognition()) {
                setTimeout(startRecognition, 1000);
            } else {
                speak('Voice recognition unavailable. Please use Chrome.');
            }
            return;
        } else {
            console.error('Failed to initialize SpeechRecognition after retries');
            speak('Voice recognition unavailable. Please use Chrome.');
            voiceToggle.disabled = true;
            voiceToggle.style.opacity = '0.5';
            voiceToggle.style.cursor = 'not-allowed';
            return;
        }
    }

    const permissionGranted = await checkMicPermission();
    if (!permissionGranted) {
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
        return;
    }

    try {
        recognition.start();
        isVoiceActive = true;
        console.log('Microphone is ON, speak now...');
    } catch (error) {
        console.error('Microphone start error:', error);
        speak('Failed to start microphone. Please ensure your microphone is connected and permissions are granted.');
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
    }
}

let isVoiceActive = false;

if (voiceToggle) {
    voiceToggle.addEventListener('click', async () => {
        const now = Date.now();
        if (now - lastVoiceToggleTime < 1000) return;
        lastVoiceToggleTime = now;

        if (!isVoiceActive) {
            await startRecognition();
            if (isVoiceActive) {
                voiceToggle.classList.add('active');
                speak('Voice control activated');
            }
        } else {
            if (recognition) recognition.stop();
            voiceToggle.classList.remove('active');
            speak('Voice control stopped');
            isVoiceActive = false;
        }
    });
}

if (recognition) {
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Heard:', command);

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
        } else if (command.includes('change theme') || command.includes('theme badlo')) {
            themeIndex = (themeIndex + 1) % themes.length;
            applyTheme(themes[themeIndex]);
            speak(`Theme changed to ${themes[themeIndex]}`);
        } else if (command.includes('light theme') || command.includes('light mode')) {
            applyTheme('light');
            speak('Theme changed to light');
        } else if (command.includes('dark theme') || command.includes('dark mode')) {
            applyTheme('dark');
            speak('Theme changed to dark');
        } else if (command.includes('colorful theme') || command.includes('colorful mode')) {
            applyTheme('colorful');
            speak('Theme changed to colorful');
        } else if (command.includes('current time') || command.includes('time bolo')) {
            const now = new Date();
            const timeString = now.toLocaleTimeString(currentLang === 'en-IN' ? 'en-US' : currentLang);
            currentInput = timeString;
            display.textContent = currentInput;
            const timeMessages = {
                'en-IN': `The current time is ${timeString}`,
                'hi-IN': `अभी का समय है ${timeString}`,
                'bn-IN': `বর্তমান সময় হল ${timeString}`
            };
            speak(timeMessages[currentLang]);
        } else if (command.includes('show history')) {
            historyPanel.style.display = 'block';
            updateHistoryUI();
            speak('Showing your calculation history');
        } else if (command.includes('average of my calculations')) {
            const totals = calculationHistory.filter(h => !isNaN(parseFloat(h.result))).map(h => parseFloat(h.result));
            if (totals.length > 0) {
                const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
                speak(`Your average calculation result is ${avg.toFixed(2)}`);
            } else {
                speak('No numeric calculations in history yet');
            }
        } else if (command.includes('clear') || command.includes('saaf karo')) {
            currentInput = '0';
            speak('Cleared');
            display.textContent = currentInput;
        } else {
            const match = command.match(/(\d+\.?\d*)\s*([+\-*/])\s*(\d+\.?\d*)/);
            if (match) {
                let num1 = match[1];
                let operator = match[2];
                let num2 = match[3];
                currentInput = `${num1}${operator}${num2}`;
                display.textContent = currentInput;
                console.log('Expression:', currentInput);
                try {
                    const result = math.evaluate(currentInput).toString();
                    speakResult(result);
                    display.textContent = result;
                    console.log('Result:', result);
                    calculationHistory.push({
                        date: new Date().toLocaleString(),
                        input: `${num1} ${operator} ${num2}`,
                        result: result
                    });
                    currentInput = result;
                } catch {
                    currentInput = 'Error';
                    speak('Error in calculation');
                    display.textContent = currentInput;
                }
            } else {
                speak('Please repeat the command clearly');
            }
        }

        recognition.stop();
        if (isVoiceActive) setTimeout(startRecognition, 1500);
    };

    recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        let errorMessage = 'Voice error, please try again';
        if (event.error === 'no-speech') errorMessage = 'No speech detected, please speak';
        else if (event.error === 'audio-capture') errorMessage = 'Microphone not found, please check your device';
        else if (event.error === 'not-allowed') errorMessage = 'Microphone permission denied, please enable it in browser settings';
        speak(errorMessage);
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
        if (event.error === 'not-allowed') checkMicPermission();
    };

    recognition.onend = () => {
        console.log('Voice recognition stopped');
        if (isVoiceActive) setTimeout(startRecognition, 1500);
    };
}

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
            'Please repeat the command clearly': 'Please repeat the command clearly',
            'Voice control activated': 'Voice control activated',
            'Voice control stopped': 'Voice control stopped',
            'Voice error, please try again': 'Voice error, please try again',
            'Mic failed to start, check permissions': 'Failed to start microphone. Please ensure your microphone is connected and permissions are granted.',
            'No speech detected, please speak': 'No speech detected, please speak',
            'Mic not found, check your device': 'Microphone not found, please check your device',
            'Mic permission denied, allow it': 'Microphone permission denied, please enable it in browser settings',
            'Theme changed to light': 'Theme changed to light',
            'Theme changed to dark': 'Theme changed to dark',
            'Theme changed to colorful': 'Theme changed to colorful',
            'Language changed to English': 'Language changed to English',
            'Language changed to Hindi': 'Language changed to Hindi',
            'Language changed to Bengali': 'Language changed to Bengali',
            'Scanning bill': 'Scanning bill',
            'Error scanning bill': 'Error scanning bill',
            'Scan complete': 'Scan complete',
            'Showing your calculation history': 'Showing your calculation history',
            'Your average calculation result is': 'Your average calculation result is',
            'No numeric calculations in history yet': 'No numeric calculations in history yet',
            'Voice recognition unavailable. Please use Chrome.': 'Voice recognition unavailable. Please use Chrome.',
            'Microphone permission is denied. Please enable it in your browser settings.': 'Microphone permission is denied. Please enable it in your browser settings.',
            'Error checking microphone permission. Please check your browser settings.': 'Error checking microphone permission. Please check your browser settings.',
            'Failed to start microphone. Please ensure your microphone is connected and permissions are granted.': 'Failed to start microphone. Please ensure your microphone is connected and permissions are granted.'
        },
        'hi-IN': {
            'Cleared': 'साफ हो गया',
            'Plus': 'जोड़',
            'Minus': 'घटाव',
            'Multiply': 'गुणा',
            'Divide': 'भाग',
            'Number': 'नंबर',
            'Error in calculation': 'गणना में त्रुटि',
            'Please repeat the command clearly': 'कृपया कमांड को स्पष्ट रूप से दोहराएं',
            'Voice control activated': 'वॉइस कंट्रोल शुरू हो गया',
            'Voice control stopped': 'वॉइस कंट्रोल बंद हो गया',
            'Voice error, please try again': 'वॉइस में त्रुटि, कृपया फिर से कोशिश करें',
            'Mic failed to start, check permissions': 'माइक शुरू करने में असफल, कृपया सुनिश्चित करें कि माइक कनेक्ट है और अनुमतियाँ दी गई हैं।',
            'No speech detected, please speak': 'कोई आवाज नहीं मिली, कृपया बोलें',
            'Mic not found, check your device': 'माइक नहीं मिला, अपने डिवाइस की जांच करें',
            'Mic permission denied, allow it': 'माइक अनुमति अस्वीकृत, कृपया ब्राउज़र सेटिंग्स में इसे सक्षम करें',
            'Theme changed to light': 'थीम लाइट में बदल गई',
            'Theme changed to dark': 'थीम डार्क में बदल गई',
            'Theme changed to colorful': 'थीम रंगीन में बदल गई',
            'Language changed to English': 'भाषा अंग्रेजी में बदल गई',
            'Language changed to Hindi': 'भाषा हिंदी में बदल गई',
            'Language changed to Bengali': 'भाषा बंगाली में बदल गई',
            'Scanning bill': 'बिल स्कैन हो रहा है',
            'Error scanning bill': 'बिल स्कैन करने में त्रुटि',
            'Scan complete': 'स्कैन पूरा हुआ',
            'Showing your calculation history': 'आपकी गणना का इतिहास दिखा रहा हूँ',
            'Your average calculation result is': 'आपका औसत गणना परिणाम है',
            'No numeric calculations in history yet': 'अभी तक इतिहास में कोई संख्यात्मक गणना नहीं',
            'Voice recognition unavailable. Please use Chrome.': 'वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया क्रोम का उपयोग करें।',
            'Microphone permission is denied. Please enable it in your browser settings.': 'माइक अनुमति अस्वीकृत है। कृपया अपनी ब्राउज़र सेटिंग्स में इसे सक्षम करें।',
            'Error checking microphone permission. Please check your browser settings.': 'माइक अनुमति जाँचने में त्रुटि। कृपया अपनी ब्राउज़र सेटिंग्स जाँचें।',
            'Failed to start microphone. Please ensure your microphone is connected and permissions are granted.': 'माइक शुरू करने में असफल। कृपया सुनिश्चित करें कि माइक कनेक्ट है और अनुमतियाँ दी गई हैं।'
        },
        'bn-IN': {
            'Cleared': 'পরিষ্কার হয়ে গেছে',
            'Plus': 'যোগ',
            'Minus': 'বিয়োগ',
            'Multiply': 'গুণ',
            'Divide': 'ভাগ',
            'Number': 'নম্বর',
            'Error in calculation': 'গণনায় ত্রুটি',
            'Please repeat the command clearly': 'দয়া করে কমান্ডটি স্পষ্টভাবে পুনরাবৃত্তি করুন',
            'Voice control activated': 'ভয়েস নিয়ন্ত্রণ চালু হয়েছে',
            'Voice control stopped': 'ভয়েস নিয়ন্ত্রণ বন্ধ হয়েছে',
            'Voice error, please try again': 'ভয়েসে ত্রুটি, আবার চেষ্টা করুন',
            'Mic failed to start, check permissions': 'মাইক চালু করতে ব্যর্থ, দয়া করে নিশ্চিত করুন মাইক সংযুক্ত আছে এবং অনুমতি দেওয়া হয়েছে।',
            'No speech detected, please speak': 'কোনো শব্দ শনাক্ত হয়নি, বলুন',
            'Mic not found, check your device': 'মাইক পাওয়া যায়নি, আপনার ডিভাইস চেক করুন',
            'Mic permission denied, allow it': 'মাইকের অনুমতি প্রত্যাখ্যাত, দয়া করে ব্রাউজার সেটিংসে এটি সক্ষম করুন',
            'Theme changed to light': 'থিম লাইটে পরিবর্তন হয়েছে',
            'Theme changed to dark': 'থিম গাঢ়ে পরিবর্তন হয়েছে',
            'Theme changed to colorful': 'থিম রঙিনে পরিবর্তন হয়েছে',
            'Language changed to English': 'ভাষা ইংরেজিতে পরিবর্তন হয়েছে',
            'Language changed to Hindi': 'ভাষা হিন্দিতে পরিবর্তন হয়েছে',
            'Language changed to Bengali': 'ভাষা বাংলায় পরিবর্তন হয়েছে',
            'Scanning bill': 'বিল স্ক্যান হচ্ছে',
            'Error scanning bill': 'বিল স্ক্যান করতে ত্রুটি',
            'Scan complete': 'স্ক্যান সম্পূর্ণ',
            'Showing your calculation history': 'আপনার গণনার ইতিহাস দেখাচ্ছি',
            'Your average calculation result is': 'আপনার গড় গণনার ফলাফল হল',
            'No numeric calculations in history yet': 'এখনও ইতিহাসে কোনো সংখ্যার গণনা নেই',
            'Voice recognition unavailable. Please use Chrome.': 'ভয়েস রিকগনিশন উপলব্ধ নয়। দয়া করে ক্রোম ব্যবহার করুন।',
            'Microphone permission is denied. Please enable it in your browser settings.': 'মাইকের অনুমতি প্রত্যাখ্যাত। দয়া করে আপনার ব্রাউজার সেটিংসে এটি সক্ষম করুন।',
            'Error checking microphone permission. Please check your browser settings.': 'মাইক অনুমতি পরীক্ষা করতে ত্রুটি। দয়া করে আপনার ব্রাউজার সেটিংস পরীক্ষা করুন।',
            'Failed to start microphone. Please ensure your microphone is connected and permissions are granted.': 'মাইক চালু করতে ব্যর্থ। দয়া করে নিশ্চিত করুন মাইক সংযুক্ত আছে এবং অনুমতি দেওয়া হয়েছে।'
        }
    };

    const translatedText = translations[currentLang][text] || text;
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

// Smart Bill Scanner
const billInput = document.getElementById('billInput');
const billResult = document.getElementById('billResult');
const scanStatus = document.getElementById('scanStatus');

if (billInput && billResult && scanStatus) {
    billInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        scanStatus.textContent = translations[currentLang]['Scanning bill'] || 'Scanning bill';
        scanStatus.classList.add('scanning');
        speak('Scanning bill');

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                ctx.filter = 'contrast(2) grayscale(1) brightness(1.2)';
                const enhancedImg = canvas.toDataURL('image/jpeg', 0.8);

                const worker = await Tesseract.createWorker('eng', Tesseract.OEM.LSTM_ONLY, {
                    workerPath: 'https://unpkg.com/tesseract.js@v5.0.4/dist/worker.min.js',
                    langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
                    corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
                });
                await worker.setParameters({
                    tessedit_char_whitelist: '0123456789₹$.TotalAMOUNT',
                    tessedit_pageseg_mode: Tesseract.PSM.AUTO,
                    user_defined_dpi: '300'
                });

                const { data: { text } } = await worker.recognize(enhancedImg);
                console.log('Bill text:', text);

                const totalMatch = text.match(/(?:Total|TOTAL|Amount|AMOUNT|Sum|SUM|Final|Grand Total)[:\s]*[₹$]?(\d+\.?\d{0,2})/i) ||
                                  text.match(/(\d+\.?\d{0,2})(?:\s*$|\s+[^\d])/i);
                const total = totalMatch ? totalMatch[1] : 'Not Found';
                billResult.textContent = `Total: ${total}`;

                scanStatus.textContent = translations[currentLang]['Scan complete'] || 'Scan complete';
                scanStatus.classList.remove('scanning');
                scanStatus.classList.add('complete');

                if (total !== 'Not Found') {
                    currentInput = total;
                    display.textContent = currentInput;
                    const totalMessages = {
                        'en-IN': `Scan complete, the bill total is ${total}`,
                        'hi-IN': `स्कैन पूरा हुआ, बिल का कुल योग है ${total}`,
                        'bn-IN': `স্ক্যান সম্পূর্ণ, বিলের মোট হল ${total}`
                    };
                    speak(totalMessages[currentLang]);
                    calculationHistory.push({
                        date: new Date().toLocaleString(),
                        input: 'Bill Scan',
                        result: total
                    });
                } else {
                    speak('Error scanning bill');
                    scanStatus.textContent = translations[currentLang]['Error scanning bill'] || 'Error scanning bill';
                }

                await worker.terminate();
            } catch (error) {
                console.error('Detailed scan error:', error.message, error.stack);
                billResult.textContent = 'Error scanning bill';
                scanStatus.textContent = translations[currentLang]['Error scanning bill'] || 'Error scanning bill';
                scanStatus.classList.remove('scanning');
                speak('Error scanning bill');
                console.log('Check image quality, lighting, or network connection.');
            }
        };
        img.onerror = () => {
            console.error('Image load error');
            billResult.textContent = 'Error loading image';
            scanStatus.textContent = translations[currentLang]['Error scanning bill'] || 'Error scanning bill';
            scanStatus.classList.remove('scanning');
            speak('Error scanning bill');
        };
    });
} else {
    console.error('Bill scanner elements not found');
}
```