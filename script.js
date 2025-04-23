// Load math.js for safe and precise calculations
const script = document.createElement('script');
script.src = 'https://unpkg.com/mathjs@12.4.2/lib/browser/math.js';
document.head.appendChild(script);

// Define speak function early
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
            'Voice recognition unavailable. Please use Chrome or Edge.': 'Voice recognition unavailable. Please use Chrome or Edge.',
            'Unable to detect total, please try another image or enter manually': 'Unable to detect total, please try another image or enter manually',
            'Low confidence in scan, please try a clearer image': 'Low confidence in scan, please try a clearer image with better lighting',
            'Handwritten bill detected, detection may be less accurate': 'Handwritten bill detected, detection may be less accurate',
            'Calculated total from items since total was not provided': 'Calculated total from items since total was not provided',
            'Mic access denied, please enable in browser settings': 'Microphone access denied, please enable in browser settings',
            'Mic access error, please ensure a microphone is connected': 'Microphone access error, please ensure a microphone is connected',
            'Please allow microphone permissions when prompted': 'Please allow microphone permissions when prompted'
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
            'Voice recognition unavailable. Please use Chrome or Edge.': 'वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया क्रोम या एज का उपयोग करें।',
            'Unable to detect total, please try another image or enter manually': 'कुल राशि का पता लगाने में असमर्थ, कृपया दूसरी छवि आज़माएं या मैन्युअल रूप से दर्ज करें',
            'Low confidence in scan, please try a clearer image': 'स्कैन में कम विश्वास, कृपया एक स्पष्ट छवि और बेहतर रोशनी आज़माएं',
            'Handwritten bill detected, detection may be less accurate': 'हस्तलिखित बिल का पता चला, पहचान कम सटीक हो सकती है',
            'Calculated total from items since total was not provided': 'कुल राशि प्रदान नहीं की गई थी, इसलिए वस्तुओं से कुल की गणना की गई',
            'Mic access denied, please enable in browser settings': 'माइक पहुँच अस्वीकृत, कृपया ब्राउज़र सेटिंग्स में सक्षम करें',
            'Mic access error, please ensure a microphone is connected': 'माइक पहुँच में त्रुटि, कृपया सुनिश्चित करें कि माइक कनेक्ट है',
            'Please allow microphone permissions when prompted': 'कृपया माइक अनुमतियाँ अनुरोध करने पर स्वीकार करें'
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
            'Scanning bill': 'বিল স্ক্যান হচ্‌ছে',
            'Error scanning bill': 'বিল স্ক্যান করতে ত্রুটি',
            'Scan complete': 'স্ক্যান সম্পূর্ণ',
            'Showing your calculation history': 'আপনার গণনার ইতিহাস দেখাচ্ছি',
            'Your average calculation result is': 'আপনার গড় গণনার ফলাফল হল',
            'No numeric calculations in history yet': 'এখনও ইতিহাসে কোনো সংখ্যার গণনা নেই',
            'Voice recognition unavailable. Please use Chrome or Edge.': 'ভয়েস রিকগনিশন উপলব্ধ নয়। দয়া করে ক্রোম বা এজ ব্যবহার করুন।',
            'Unable to detect total, please try another image or enter manually': 'মোট সনাক্ত করতে অক্ষম, অনুগ্রহ করে আরেকটি ছবি চেষ্টা করুন বা ম্যানুয়ালি প্রবেশ করুন',
            'Low confidence in scan, please try a clearer image': 'স্ক্যানে কম আস্থা, দয়া করে একটি পরিষ্কার ছবি এবং ভালো আলো চেষ্টা করুন',
            'Handwritten bill detected, detection may be less accurate': 'হাতে লেখা বিল সনাক্ত হয়েছে, সনাক্তকরণ কম নির্ভুল হতে পারে',
            'Calculated total from items since total was not provided': 'মোট প্রদান করা হয়নি, তাই আইটেম থেকে মোট গণনা করা হয়েছে',
            'Mic access denied, please enable in browser settings': 'মাইক অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে, দয়া করে ব্রাউজার সেটিংসে সক্ষম করুন',
            'Mic access error, please ensure a microphone is connected': 'মাইক অ্যাক্সেসে ত্রুটি, দয়া করে নিশ্চিত করুন যে একটি মাইক সংযুক্ত আছে',
            'Please allow microphone permissions when prompted': 'অনুগ্রহ করে মাইকের অনুমতি দেওয়ার সময় অনুমতি দিন'
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
        console.log('Theme changed to:', themes[themeIndex]);
    });
}

function applyTheme(theme) {
    document.body.className = theme;
    console.log('Applied theme:', theme);
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

// Voice Support with Robust Permission Handling
const voiceToggle = document.getElementById('voiceToggle');
let recognition = null;
let recognitionAttempts = 0;
const maxRecognitionAttempts = 3;
let lastVoiceToggleTime = 0;
let isVoiceActive = false;
let permissionRetryCount = 0;
const maxPermissionRetries = 2;

function initializeRecognition() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        console.error('SpeechRecognition not supported in this browser.');
        speak('Voice recognition unavailable. Please use Chrome or Edge.');
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
        recognition.onstart = () => {
            console.log('Voice recognition started');
            voiceToggle.classList.add('active');
            isVoiceActive = true;
        };
        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            handleVoiceError(event.error);
        };
        recognition.onend = () => {
            console.log('Voice recognition ended');
            if (isVoiceActive) setTimeout(startRecognition, 1500);
        };
        console.log('SpeechRecognition initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize SpeechRecognition:', error);
        speak('Voice error, please try again');
        return false;
    }
}

async function requestMicPermission() {
    try {
        speak('Please allow microphone permissions when prompted');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        console.log('Microphone access granted');
        return true;
    } catch (error) {
        console.error('Microphone permission error:', error.message);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            speak('Mic access denied, please enable in browser settings');
        } else if (error.name === 'NotFoundError') {
            speak('Mic access error, please ensure a microphone is connected');
        } else {
            speak('Mic failed to start, check permissions');
        }
        return false;
    }
}

async function checkMicPermission() {
    try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        console.log('Microphone permission state:', permissionStatus.state);

        if (permissionStatus.state === 'granted') {
            return true;
        } else if (permissionStatus.state === 'denied') {
            speak('Mic access denied, please enable in browser settings');
            return false;
        } else {
            // Prompt for permission
            return await requestMicPermission();
        }
    } catch (error) {
        console.error('Error checking microphone permission:', error);
        speak('Mic failed to start, check permissions');
        return false;
    }
}

function handleVoiceError(error) {
    let errorMessage = 'Voice error, please try again';
    if (error === 'no-speech') errorMessage = 'No speech detected, please speak';
    else if (error === 'audio-capture') errorMessage = 'Mic access error, please ensure a microphone is connected';
    else if (error === 'not-allowed') errorMessage = 'Mic access denied, please enable in browser settings';
    speak(errorMessage);
    voiceToggle.classList.remove('active');
    isVoiceActive = false;
}

async function startRecognition() {
    if (!recognition) {
        if (recognitionAttempts < maxRecognitionAttempts) {
            recognitionAttempts++;
            console.log(`Retrying SpeechRecognition initialization, attempt ${recognitionAttempts}`);
            if (initializeRecognition()) {
                setTimeout(startRecognition, 1000);
            } else {
                speak('Voice recognition unavailable. Please use Chrome or Edge.');
                voiceToggle.disabled = true;
                voiceToggle.style.opacity = '0.5';
                voiceToggle.style.cursor = 'not-allowed';
            }
            return;
        } else {
            console.error('Failed to initialize SpeechRecognition after retries');
            speak('Voice recognition unavailable. Please use Chrome or Edge.');
            voiceToggle.disabled = true;
            voiceToggle.style.opacity = '0.5';
            voiceToggle.style.cursor = 'not-allowed';
            return;
        }
    }

    if (permissionRetryCount >= maxPermissionRetries) {
        console.warn('Max permission retries reached');
        speak('Mic access denied, please enable in browser settings');
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
        permissionRetryCount = 0;
        return;
    }

    const permissionGranted = await checkMicPermission();
    if (!permissionGranted) {
        permissionRetryCount++;
        console.log(`Permission retry attempt ${permissionRetryCount}`);
        voiceToggle.classList.remove('active');
        isVoiceActive = false;
        setTimeout(startRecognition, 2000); // Retry after a delay
        return;
    }

    permissionRetryCount = 0; // Reset retry count on success

    try {
        recognition.start();
        console.log('Microphone is ON, speak now...');
    } catch (error) {
        console.error('Microphone start error:', error.message);
        handleVoiceError(error.message.includes('permission') ? 'not-allowed' : 'audio-capture');
    }
}

if (voiceToggle) {
    voiceToggle.addEventListener('click', async () => {
        const now = Date.now();
        if (now - lastVoiceToggleTime < 1000) return;
        lastVoiceToggleTime = now;

        if (!isVoiceActive) {
            await startRecognition();
            if (isVoiceActive) {
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
        const command = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Heard command:', command);

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

        if (isVoiceActive) setTimeout(startRecognition, 1500);
    };
}

// Smart Bill Scanner with Simplified Preprocessing
const billInput = document.getElementById('billInput');
const billResult = document.getElementById('billResult');
const scanStatus = document.getElementById('scanStatus');

// Simplified image preprocessing for handwritten text
function preprocessImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxWidth = 800;
    let width = img.width;
    let height = img.height;

    // Resize image while maintaining aspect ratio
    if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to grayscale
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);

    // Adjust contrast
    imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;
    const contrastFactor = 2.5; // Increased contrast for handwritten text
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrastFactor + 128));
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrastFactor + 128));
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrastFactor + 128));
    }
    ctx.putImageData(imageData, 0, 0);

    // Apply adaptive thresholding
    imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const avg = data[idx];
            const threshold = 90; // Lowered threshold for handwritten text
            const value = avg > threshold ? 255 : 0;
            data[idx] = data[idx + 1] = data[idx + 2] = value;
        }
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
}

if (billInput && billResult && scanStatus) {
    billInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected for bill scanning');
            scanStatus.textContent = translations[currentLang]['Error scanning bill'] || 'Error scanning bill';
            speak('Error scanning bill');
            return;
        }

        scanStatus.textContent = translations[currentLang]['Scanning bill'] || 'Scanning bill';
        scanStatus.classList.add('scanning');
        speak('Scanning bill');

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            try {
                // Preprocess the image for better OCR accuracy
                const processedImg = preprocessImage(img);
                console.log('Image preprocessed successfully');

                const worker = await Tesseract.createWorker('eng', Tesseract.OEM.TESSERACT_ONLY, {
                    workerPath: 'https://unpkg.com/tesseract.js@v5.0.4/dist/worker.min.js',
                    langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
                    corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
                });
                await worker.setParameters({
                    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK, // Better for handwritten bills
                    user_defined_dpi: '300', // Higher DPI for better accuracy
                });

                const { data: { text, confidence } } = await worker.recognize(processedImg);
                console.log('OCR Confidence:', confidence);
                console.log('Raw OCR text:', text);

                // Check OCR confidence and warn if it's a handwritten bill
                if (confidence < 70) {
                    console.warn('Low OCR confidence, possibly a handwritten bill');
                    speak('Handwritten bill detected, detection may be less accurate');
                }
                if (confidence < 50) {
                    console.warn('Very low OCR confidence, scan may be inaccurate');
                    billResult.textContent = 'Low confidence in scan';
                    scanStatus.textContent = translations[currentLang]['Low confidence in scan, please try a clearer image'] || 'Low confidence in scan, please try a clearer image with better lighting';
                    scanStatus.classList.remove('scanning');
                    speak('Low confidence in scan, please try a clearer image');
                    await worker.terminate();
                    URL.revokeObjectURL(img.src);
                    return;
                }

                // Clean up the OCR text
                const cleanedText = text
                    .replace(/[^a-zA-Z0-9\s₹$€£¥.:-]/g, '') // Remove special characters except allowed ones
                    .replace(/\s+/g, ' ') // Normalize spaces
                    .trim();
                console.log('Cleaned OCR text:', cleanedText);

                // Split text into lines for better detection
                const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                console.log('Text lines:', lines);

                // Enhanced regex for number detection
                let total = null;
                const totalKeywords = /(?:Total|TOTAL|Amount|AMOUNT|Amt|Sum|SUM|Final|Grand Total|Bill|Invoice|Net|Payable|Balance|Due)/i;
                const numberPattern = /(?:[₹$€£¥]?[\s]*)?(\d{1,3}(?:[.,]\d{3})*(?:\.\d{1,2})?)/i;
                const pricePattern = /\b(\d{1,3}(?:[.,]\d{3})*(?:\.\d{1,2})?)\s*(?:RUPEES|RS|RPS|₹|$|INR)?\b/i;

                // First, try to find a line with a keyword followed by a number
                for (const line of lines) {
                    if (totalKeywords.test(line)) {
                        const match = line.match(numberPattern);
                        if (match) {
                            total = match[1];
                            console.log('Found total with keyword in line:', line);
                            break;
                        }
                    }
                }

                // If total not found, calculate it from item prices
                if (!total) {
                    console.log('Total not found, attempting to calculate from item prices');
                    let calculatedTotal = 0;
                    const prices = [];

                    for (const line of lines) {
                        const matches = line.matchAll(pricePattern);
                        for (const match of matches) {
                            let price = match[1].replace(/[.,]/g, m => m === ',' ? '' : '.');
                            price = parseFloat(price);
                            if (!isNaN(price)) {
                                prices.push(price);
                                calculatedTotal += price;
                                console.log('Found price in line:', line, 'Price:', price);
                            }
                        }
                    }

                    if (prices.length > 0) {
                        total = calculatedTotal.toFixed(2);
                        console.log('Calculated total from items:', total);
                        speak('Calculated total from items since total was not provided');
                    }
                }

                // Fallback: Look for any large number in the last few lines
                if (!total) {
                    for (let i = Math.max(0, lines.length - 3); i < lines.length; i++) {
                        const match = lines[i].match(numberPattern);
                        if (match) {
                            total = match[1];
                            console.log('Found total in last lines:', lines[i]);
                            break;
                        }
                    }
                }

                // Clean and validate the detected or calculated total
                if (total) {
                    total = total.replace(/[.,]/g, m => m === ',' ? '' : '.');
                    total = parseFloat(total).toFixed(2);
                    console.log('Processed total:', total);

                    // Validate total
                    const totalValue = parseFloat(total);
                    if (totalValue < 0 || totalValue > 1000000) {
                        console.warn('Total value out of reasonable range:', totalValue);
                        total = 'Not Found';
                    }
                } else {
                    total = 'Not Found';
                    console.log('Total not found in text');
                }

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
                    speak('Unable to detect total, please try another image or enter manually');
                    scanStatus.textContent = translations[currentLang]['Unable to detect total, please try another image or enter manually'] || 'Unable to detect total, please try another image or enter manually';
                }

                await worker.terminate();
                URL.revokeObjectURL(img.src);
            } catch (error) {
                console.error('Scan error:', error.message);
                billResult.textContent = 'Error scanning bill';
                scanStatus.textContent = translations[currentLang]['Error scanning bill'] || 'Error scanning bill';
                scanStatus.classList.remove('scanning');
                speak('Error scanning bill');
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