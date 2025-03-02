// Intro Logic
document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro');
    const calculatorContainer = document.getElementById('calculatorContainer');

    if (!intro || !calculatorContainer) {
        console.error('Intro or Calculator container not found in DOM');
        return;
    }

    console.log('Page loaded, intro visible');
    calculatorContainer.style.display = 'none'; // Ensure calculator is hidden initially
    setTimeout(() => {
        console.log('Hiding intro, showing calculator');
        intro.classList.add('hidden');
        calculatorContainer.style.display = 'block';
        setTimeout(() => {
            calculatorContainer.classList.add('visible'); // Fade in calculator
            console.log('Calculator now visible');
        }, 10); // Small delay for smooth transition
    }, 3000);
});

// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
let currentInput = '0';
let currentLang = 'en-IN';
let calculationHistory = [];

if (!display || !buttons.length) {
    console.error('Display or buttons not found in DOM');
} else {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            console.log('Button clicked:', value);
            if (value === 'C') {
                currentInput = '0';
                speak('Cleared');
            } else if (value === '=') {
                try {
                    const result = eval(currentInput).toString();
                    speakResult(result);
                    calculationHistory.push({
                        date: new Date().toLocaleString(),
                        input: currentInput,
                        result: result
                    });
                    currentInput = result;
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

// Apply Theme Function
function applyTheme(theme) {
    document.body.className = theme;
    console.log('Theme switched to:', theme);
    const container = document.querySelector('.calculator-container');
    if (container) {
        if (theme === 'dark') {
            container.style.background = 'rgba(40, 40, 40, 0.95)';
            container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else if (theme === 'colorful') {
            container.style.background = 'rgba(255, 255, 255, 0.2)';
            container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else if (theme === 'light') {
            container.style.background = 'rgba(240, 240, 240, 0.95)';
            container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        }
    } else {
        console.error('Calculator container not found for theme apply');
    }
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

// Update History UI
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
let recognition;

try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
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
        checkMicPermission();
    }
}

// Permission Check Function
function checkMicPermission() {
    navigator.permissions.query({ name: 'microphone' }).then((result) => {
        if (result.state === 'denied') {
            speak('Mic permission denied. Please allow it in browser settings.');
            console.log('Permission denied. Go to Chrome Settings > Privacy and Security > Microphone.');
        } else if (result.state === 'prompt') {
            console.log('Permission not yet granted. Click mic again to request.');
        } else if (result.state === 'granted') {
            console.log('Permission granted, but mic still failed. Check device.');
        }
    }).catch((error) => {
        console.error('Permission query error:', error);
    });
}

// Voice Recognition Handling
if (recognition) {
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

        // Theme Switching with UI/UX Change
        else if (command.includes('change theme') || command.includes('theme badlo')) {
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
        }

        // Current Time (Abhi to bole)
        else if (command.includes('abhi to bole') || command.includes('current time') || command.includes('time bolo')) {
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
        }

        // Show History
        else if (command.includes('meri history dikhao') || command.includes('show history')) {
            historyPanel.style.display = 'block';
            updateHistoryUI();
            speak('Showing your calculation history');
        }

        // Average Calculation
        else if (command.includes('mere calculations ka average batao') || command.includes('average of my calculations')) {
            const totals = calculationHistory.filter(h => !isNaN(parseFloat(h.result))).map(h => parseFloat(h.result));
            if (totals.length > 0) {
                const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
                speak(`Your average calculation result is ${avg.toFixed(2)}`);
            } else {
                speak('No numeric calculations in history yet');
            }
        }

        // Mathematical Expression Matching (e.g., "5 + 10")
        const match = command.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
        if (match) {
            let num1 = match[1];
            let operator = match[2];
            let num2 = match[3];
            currentInput = `${num1}${operator}${num2}`;
            display.textContent = currentInput;
            console.log('Expression:', currentInput);
            try {
                currentInput = eval(currentInput).toString();
                speakResult(currentInput);
                display.textContent = currentInput;
                console.log('Result:', currentInput);
                calculationHistory.push({
                    date: new Date().toLocaleString(),
                    input: `${num1} ${operator} ${num2}`,
                    result: currentInput
                });
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
            speak('Please repeat the command clearly');
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
        checkMicPermission();
    };

    recognition.onend = () => {
        console.log('Voice recognition stopped');
        if (isVoiceActive) setTimeout(startRecognition, 1500);
    };
}

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
            'Please repeat the command clearly': 'Please repeat the command clearly',
            'Voice control activated': 'Voice control activated',
            'Voice control stopped': 'Voice control stopped',
            'Voice error, please try again': 'Voice error, please try again',
            'Mic failed to start, check permissions': 'Mic failed to start, check permissions',
            'No speech detected, please speak': 'No speech detected, please speak',
            'Mic not found, check your device': 'Mic not found, check your device',
            'Mic permission denied, allow it': 'Mic permission denied, allow it',
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
            'No numeric calculations in history yet': 'No numeric calculations in history yet'
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
            'Mic failed to start, check permissions': 'माइक शुरू करने में असफल, अनुमति जांचें',
            'No speech detected, please speak': 'कोई आवाज नहीं मिली, कृपया बोलें',
            'Mic not found, check your device': 'माइक नहीं मिला, अपने डिवाइस की जांच करें',
            'Mic permission denied, allow it': 'माइक अनुमति अस्वीकृत, इसे अनुमति दें',
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
            'No numeric calculations in history yet': 'अभी तक इतिहास में कोई संख्यात्मक गणना नहीं'
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
            'Mic failed to start, check permissions': 'মাইক চালু করতে ব্যর্থ, অনুমতি পরীক্ষা করুন',
            'No speech detected, please speak': 'কোনো শব্দ শনাক্ত হয়নি, বলুন',
            'Mic not found, check your device': 'মাইক পাওয়া যায়নি, আপনার ডিভাইস চেক করুন',
            'Mic permission denied, allow it': 'মাইকের অনুমতি প্রত্যাখ্যাত, এটি অনুমতি দিন',
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
            'No numeric calculations in history yet': 'এখনও ইতিহাসে কোনো সংখ্যার গণনা নেই'
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
                ctx.filter = 'contrast(1.5) grayscale(1)';
                const enhancedImg = canvas.toDataURL('image/jpeg');

                const worker = await Tesseract.createWorker('eng', Tesseract.OEM.LSTM_ONLY, {
                    workerPath: 'https://unpkg.com/tesseract.js@v5.0.4/dist/worker.min.js',
                    langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
                    corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
                });
                await worker.setParameters({
                    tessedit_char_whitelist: '0123456789₹$.TotalAMOUNT',
                    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
                    user_defined_dpi: '70'
                });

                const { data: { text } } = await worker.recognize(enhancedImg);
                console.log('Bill text:', text);

                const totalMatch = text.match(/(?:Total|TOTAL|Amount|AMOUNT|Sum|SUM)[:\s]*[₹$]?(\d+(?:\.\d{1,2})?)/i) ||
                                  text.match(/(\d+(?:\.\d{1,2})?)(?:\s*$|\s+[^\d])/i);
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
                console.log('Check image quality or network connection.');
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
