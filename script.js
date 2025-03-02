let display = document.getElementById('display');
let firstNumber = '';
let operator = '';
let secondNumber = '';
let currentTheme = 'light';
let currentLang = 'en-US';

// Show Dashboard after Intro Animation
setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    const dashboard = document.getElementById('dashboard');
    dashboard.style.display = 'flex';
    setTimeout(() => {
        dashboard.style.opacity = '1';
    }, 100);
}, 3000);

function appendNumber(number) {
    if (operator === '') {
        firstNumber += number;
        display.value = firstNumber;
    } else {
        secondNumber += number;
        display.value = firstNumber + ' ' + operator + ' ' + secondNumber;
    }
}

function setOperator(op) {
    if (firstNumber !== '') {
        operator = op;
        display.value = firstNumber + ' ' + operator;
    }
}

function calculate() {
    if (firstNumber !== '' && operator !== '' && secondNumber !== '') {
        let result;
        const num1 = parseFloat(firstNumber);
        const num2 = parseFloat(secondNumber);
        switch (operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/': result = num2 !== 0 ? num1 / num2 : 'Error'; break;
        }
        display.value = result;
        speakResult(result);
        firstNumber = result.toString();
        operator = '';
        secondNumber = '';
    }
}

function clearDisplay() {
    firstNumber = '';
    operator = '';
    secondNumber = '';
    display.value = '';
}

// Voice Recognition
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function() {
            document.getElementById('voiceBtn').style.background = '#FF5722';
            console.log('Voice recognition started');
        };

        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log('Voice input:', command);
            if (command.includes('plus') || command.includes('jod')) setOperator('+');
            else if (command.includes('minus') || command.includes('ghata')) setOperator('-');
            else if (command.includes('multiply') || command.includes('guna')) setOperator('*');
            else if (command.includes('divide') || command.includes('bhag')) setOperator('/');
            else if (command.includes('equals') || command.includes('barabar')) calculate();
            else if (command.includes('change language to hindi')) switchLanguage('hi-IN');
            else if (command.includes('change language to english')) switchLanguage('en-US');
            else if (!isNaN(command)) appendNumber(command);
        };

        recognition.onend = function() {
            document.getElementById('voiceBtn').style.background = '#2196F3';
            console.log('Voice recognition stopped');
        };

        recognition.onerror = function(event) {
            console.error('Voice recognition error:', event.error);
            alert('Error with voice recognition: ' + event.error);
        };

        recognition.start();
    } else {
        alert('Sorry, your browser does not support voice recognition.');
    }
}

// Voice Output
function speakResult(result) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(
            currentLang === 'hi-IN' ? `परिणाम ${result} है` : `The result is ${result}`
        );
        speech.lang = currentLang;
        window.speechSynthesis.speak(speech);
    } else {
        alert('Speech synthesis not supported in this browser.');
    }
}

// Theme Switching
function switchTheme() {
    const body = document.body;
    if (currentTheme === 'light') {
        body.style.background = 'linear-gradient(135deg, #2c3e50, #4ca1af)';
        currentTheme = 'dark';
    } else if (currentTheme === 'dark') {
        body.style.background = 'linear-gradient(135deg, #ff6f61, #6b5b95)';
        currentTheme = 'colorful';
    } else {
        body.style.background = 'linear-gradient(135deg, #0f2027, #203a43)';
        currentTheme = 'light';
    }
}

// Language Switching
function switchLanguage(lang) {
    currentLang = lang;
    speakResult(lang === 'hi-IN' ? 'भाषा हिंदी में बदल गई' : 'Language changed to English');
}

// Storage Permission
function requestStoragePermission() {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("permission", "granted");
        document.getElementById('storageStatus').textContent = "Status: Granted";
        alert("Storage permission granted!");
    } else {
        alert("Sorry, your browser does not support storage.");
    }
}

function denyStoragePermission() {
    localStorage.removeItem("permission");
    document.getElementById('storageStatus').textContent = "Status: Not Granted";
    alert("Storage permission denied.");
}

// Tools Functions (Placeholders)
function openScientificMode() {
    alert("Scientific Mode: Coming soon!");
}

function openCurrencyConverter() {
    alert("Currency Converter: Coming soon!");
}

function openUnitConverter() {
    alert("Unit Converter: Coming soon!");
}
