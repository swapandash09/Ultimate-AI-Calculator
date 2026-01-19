/**
 * Voice Calculator Pro - Final Upgraded Logic
 * Fully compatible with your existing HTML.
 */

class VoiceCalculator {
    constructor() {
        // --- State ---
        this.currentInput = '0';
        this.isVoiceActive = false;
        this.recognition = null;
        this.worker = null; // Tesseract worker
        this.history = [];
        this.recognitionAttempts = 0;

        // --- Configuration ---
        this.langIndex = 0;
        this.themeIndex = 0;
        this.themes = ['light', 'dark', 'colorful'];
        this.languages = [
            { code: 'en-IN', name: 'English', currency: '₹' },
            { code: 'hi-IN', name: 'Hindi', currency: '₹' },
            { code: 'bn-IN', name: 'Bengali', currency: '₹' }
        ];

        // --- Translations ---
        this.i18n = {
            'en-IN': { error: 'Error', copied: 'Copied', scanning: 'Scanning bill...', total: 'Total: ', timeIs: 'The current time is ' },
            'hi-IN': { error: 'त्रुटि', copied: 'कॉपी किया गया', scanning: 'बिल स्कैन हो रहा है...', total: 'कुल: ', timeIs: 'अभी का समय है ' },
            'bn-IN': { error: 'ত্রুটি', copied: 'অনুলিপি করা হয়েছে', scanning: 'বিল স্ক্যান করা হচ্ছে...', total: 'মোট: ', timeIs: 'বর্তমান সময় হল ' }
        };

        // Initialize
        this.init();
    }

    async init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateDisplay();
        this.initOCR(); // Pre-load scanner
        console.log("Calculator Initialized");
    }

    cacheDOM() {
        this.dom = {
            display: document.getElementById('display'),
            themeBtn: document.getElementById('theme-cycle'),
            langBtn: document.getElementById('lang-cycle'),
            voiceBtn: document.getElementById('voiceToggle'),
            historyBtn: document.getElementById('historyToggle'),
            historyPanel: document.getElementById('historyPanel'),
            historyList: document.getElementById('historyList'),
            historyInsights: document.getElementById('historyInsights'),
            billInput: document.getElementById('billInput'),
            billResult: document.getElementById('billResult'),
            scanStatus: document.getElementById('scanStatus')
        };
    }

    bindEvents() {
        // Main Event Listeners
        this.dom.themeBtn.addEventListener('click', () => this.cycleTheme());
        this.dom.langBtn.addEventListener('click', () => this.cycleLang());
        this.dom.voiceBtn.addEventListener('click', () => this.toggleVoice());
        this.dom.historyBtn.addEventListener('click', () => this.toggleHistory());
        this.dom.billInput.addEventListener('change', (e) => this.handleScan(e));
    }

    // --- 1. Calculator Logic ---

    handleButtonInput(value) {
        if (navigator.vibrate) navigator.vibrate(15); // Tactile feedback

        if (value === 'C') {
            this.currentInput = '0';
            this.speak('Cleared');
        } else if (value === '=') {
            this.calculate();
        } else {
            // Prevent multiple decimals
            if (value === '.' && this.currentInput.includes('.')) return;
            
            // Replace initial 0 unless adding an operator
            if (this.currentInput === '0' && !['+', '-', '*', '/', '.'].includes(value)) {
                this.currentInput = value;
            } else {
                this.currentInput += value;
            }
            this.speak(value);
        }
        this.updateDisplay();
    }

    calculate() {
        try {
            const result = math.evaluate(this.currentInput).toString();
            this.addToHistory(this.currentInput, result);
            this.currentInput = result;
            this.speakResult(result);
            this.updateDisplay();
        } catch (error) {
            this.currentInput = 'Error';
            this.speak(this.i18n[this.languages[this.langIndex].code].error);
            this.updateDisplay();
            setTimeout(() => { this.currentInput = '0'; this.updateDisplay(); }, 1500);
        }
    }

    updateDisplay() {
        this.dom.display.textContent = this.currentInput;
    }

    // --- 2. Voice Command Logic (Restored) ---

    toggleVoice() {
        if (this.isVoiceActive) {
            if (this.recognition) this.recognition.stop();
            this.isVoiceActive = false;
            this.dom.voiceBtn.classList.remove('active');
            this.dom.voiceBtn.textContent = "Voice OFF";
        } else {
            this.startVoice();
        }
    }

    startVoice() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Voice not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = this.languages[this.langIndex].code;

        this.recognition.onstart = () => {
            this.isVoiceActive = true;
            this.dom.voiceBtn.classList.add('active');
            this.dom.voiceBtn.textContent = "Listening...";
        };

        this.recognition.onend = () => {
            this.isVoiceActive = false;
            this.dom.voiceBtn.classList.remove('active');
            this.dom.voiceBtn.textContent = "Voice OFF";
        };

        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log("Heard:", command);
            this.processVoiceCommand(command);
        };

        this.recognition.start();
    }

    processVoiceCommand(command) {
        // --- Language Commands ---
        if (command.includes('change to hindi') || command.includes('hindi mein badlo')) {
            this.setLang(1);
        } else if (command.includes('change to english') || command.includes('english mein badlo')) {
            this.setLang(0);
        } else if (command.includes('change to bengali') || command.includes('bangla mein badlo')) {
            this.setLang(2);
        
        // --- Theme Commands ---
        } else if (command.includes('light theme') || command.includes('light mode')) {
            this.setTheme('light');
        } else if (command.includes('dark theme') || command.includes('dark mode')) {
            this.setTheme('dark');
        } else if (command.includes('colorful theme') || command.includes('colorful mode')) {
            this.setTheme('colorful');
        } else if (command.includes('change theme') || command.includes('theme badlo')) {
            this.cycleTheme();
        
        // --- Utility Commands ---
        } else if (command.includes('time') || command.includes('samay')) {
            this.sayTime();
        } else if (command.includes('history')) {
            this.toggleHistory();
            this.speak("Showing history");
        } else if (command.includes('clear') || command.includes('saaf')) {
            this.handleButtonInput('C');
        
        // --- Math Calculation ---
        } else {
            // Smart Math Parsing: "50 plus 20" -> "50+20"
            let mathStr = command
                .replace(/plus|add|jod/g, '+')
                .replace(/minus|subtract|ghatao/g, '-')
                .replace(/multiply|into|guna/g, '*')
                .replace(/divide|bhag/g, '/')
                .replace(/x/g, '*')
                .replace(/equals|result|barabar/g, '');

            const cleanMath = mathStr.replace(/[^0-9+\-*/.]/g, '');

            if (cleanMath.length > 0) {
                this.currentInput = cleanMath;
                this.calculate();
            } else {
                this.speak("Please repeat");
            }
        }
    }

    // --- 3. Helpers ---

    setLang(index) {
        this.langIndex = index;
        this.dom.langBtn.textContent = this.languages[this.langIndex].name;
        this.speak("Language changed");
        // Update recognition language immediately
        if (this.recognition) this.recognition.lang = this.languages[this.langIndex].code;
    }

    cycleLang() {
        this.setLang((this.langIndex + 1) % this.languages.length);
    }

    setTheme(themeName) {
        document.body.className = themeName;
        this.themeIndex = this.themes.indexOf(themeName);
        this.speak("Theme changed");
    }

    cycleTheme() {
        const nextTheme = this.themes[(this.themeIndex + 1) % this.themes.length];
        this.setTheme(nextTheme);
    }

    sayTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString(this.languages[this.langIndex].code);
        this.currentInput = timeString; // Temporarily show time
        this.updateDisplay();
        
        const prefix = this.i18n[this.languages[this.langIndex].code].timeIs;
        this.speak(prefix + timeString);
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.languages[this.langIndex].code;
            window.speechSynthesis.speak(utterance);
        }
    }

    speakResult(result) {
        let prefix = "Result is ";
        if (this.langIndex === 1) prefix = "Jawab hai ";
        if (this.langIndex === 2) prefix = "Fola-fol holo ";
        this.speak(prefix + result);
    }

    // --- 4. History & Scanner ---

    toggleHistory() {
        const panel = this.dom.historyPanel;
        panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
        if (panel.style.display === 'block') this.renderHistory();
    }

    addToHistory(input, result) {
        this.history.unshift({ input, result, time: new Date().toLocaleTimeString() });
        if (this.history.length > 10) this.history.pop();
    }

    renderHistory() {
        this.dom.historyList.innerHTML = this.history.map(item => 
            `<li>${item.time}: <b>${item.input} = ${item.result}</b></li>`
        ).join('');
        
        // Avg Calculation
        const validNums = this.history.filter(h => !isNaN(h.result)).map(h => parseFloat(h.result));
        if (validNums.length > 0) {
            const avg = validNums.reduce((a, b) => a + b, 0) / validNums.length;
            this.dom.historyInsights.textContent = `Avg: ${avg.toFixed(2)}`;
        }
    }

    async initOCR() {
        if (typeof Tesseract !== 'undefined') {
            this.worker = await Tesseract.createWorker('eng');
        }
    }

    async handleScan(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.dom.scanStatus.textContent = this.i18n[this.languages[this.langIndex].code].scanning;
        this.dom.scanStatus.className = 'scan-status scanning';
        this.speak("Scanning bill");

        try {
            if (!this.worker) await this.initOCR();
            const { data: { text } } = await this.worker.recognize(file);
            
            // Extract Total
            const totalMatch = text.match(/(?:Total|Amount|Grand Total)[\s:.]*?(\d+\.?\d{0,2})/i) || 
                               text.match(/(\d+\.?\d{0,2})(?:\s*$)/);

            if (totalMatch) {
                const amount = totalMatch[1];
                this.currentInput = amount;
                this.dom.billResult.textContent = `Total: ${amount}`;
                this.dom.scanStatus.className = 'scan-status complete';
                this.dom.scanStatus.textContent = "Success";
                this.speak(this.i18n[this.languages[this.langIndex].code].total + amount);
                this.updateDisplay();
                this.addToHistory("Bill Scan", amount);
            } else {
                throw new Error("No total found");
            }
        } catch (e) {
            console.error(e);
            this.dom.scanStatus.textContent = "Error";
            this.speak("Scan failed");
        }
        // Reset input
        this.dom.billInput.value = '';
    }
}

// --- Global Initialization ---
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Math.js
    const loadCheck = setInterval(() => {
        if (typeof math !== 'undefined') {
            clearInterval(loadCheck);
            app = new VoiceCalculator();
        }
    }, 100);
});

// HTML Button Bridge
function handleButton(val) {
    if (app) app.handleButtonInput(val);
}
