<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultimate Advanced Calculator</title>
    <style>
        body { text-align: center; font-family: Arial, sans-serif; transition: background 0.5s, color 0.5s; }
        .dark-theme { background: #222; color: white; }
        .light-theme { background: white; color: black; }
        .colorful-theme { background: linear-gradient(45deg, #ff9800, #ff5722); color: white; }
        .calculator { display: inline-block; padding: 20px; background: rgba(0, 0, 0, 0.1); border-radius: 10px; margin-top: 20px; }
        button { font-size: 20px; margin: 5px; padding: 10px; }
        #display { font-size: 24px; width: 100%; padding: 10px; text-align: right; border: none; }
        .mic { font-size: 30px; cursor: pointer; padding: 10px; }
    </style>
</head>
<body class="light-theme">

    <h1>Ultimate Advanced Calculator</h1>
    <div class="calculator">
        <input type="text" id="display" disabled>
        <br>
        <button onclick="clearDisplay()">C</button>
        <button onclick="appendNumber('1')">1</button>
        <button onclick="appendNumber('2')">2</button>
        <button onclick="appendOperator('+')">+</button>
        <br>
        <button onclick="appendNumber('3')">3</button>
        <button onclick="appendNumber('4')">4</button>
        <button onclick="appendNumber('5')">5</button>
        <button onclick="appendOperator('-')">-</button>
        <br>
        <button onclick="appendNumber('6')">6</button>
        <button onclick="appendNumber('7')">7</button>
        <button onclick="appendNumber('8')">8</button>
        <button onclick="appendOperator('*')">*</button>
        <br>
        <button onclick="appendNumber('9')">9</button>
        <button onclick="appendNumber('0')">0</button>
        <button onclick="calculateResult()">=</button>
        <button onclick="appendOperator('/')">/</button>
        <br>
        <button onclick="toggleTheme()">Change Theme</button>
        <button onclick="changeLanguage()">Change Language</button>
        <span class="mic" onclick="toggleVoice()">🎤</span>
    </div>

    <script>
        let currentLang = 'en-US';
        let isVoiceActive = true;
        let themes = ["light-theme", "dark-theme", "colorful-theme"];
        let currentThemeIndex = 0;

        function toggleTheme() {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            document.body.className = themes[currentThemeIndex];
        }

        function appendNumber(num) {
            document.getElementById("display").value += num;
            speak(num);
        }

        function appendOperator(op) {
            document.getElementById("display").value += ` ${op} `;
        }

        function calculateResult() {
            let expression = document.getElementById("display").value;
            try {
                let result = eval(expression);
                document.getElementById("display").value = result;
                speak("The answer is " + result);
            } catch {
                document.getElementById("display").value = "Error";
                speak("Error");
            }
        }

        function clearDisplay() {
            document.getElementById("display").value = "";
            speak("Cleared");
        }

        function changeLanguage() {
            let langs = { "en-US": "hi-IN", "hi-IN": "bn-IN", "bn-IN": "en-US" };
            currentLang = langs[currentLang];
            speak("Language changed");
        }

        function speak(text) {
            if ('speechSynthesis' in window) {
                let synth = window.speechSynthesis;
                let utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = currentLang;
                utterance.rate = 1;
                synth.cancel();
                synth.speak(utterance);
            }
        }

        function toggleVoice() {
            isVoiceActive = !isVoiceActive;
            if (isVoiceActive) {
                recognition.start();
                speak("Voice activated");
            } else {
                recognition.stop();
                speak("Voice deactivated");
            }
        }

        // Voice Recognition (Always-On)
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = currentLang;
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = function (event) {
            let voiceText = event.results[event.results.length - 1][0].transcript.trim();
            document.getElementById("display").value = voiceText;

            if (voiceText.toLowerCase().includes("plus") || voiceText.includes("+")) {
                voiceText = voiceText.replace(/plus/g, '+');
            }
            if (voiceText.toLowerCase().includes("minus") || voiceText.includes("-")) {
                voiceText = voiceText.replace(/minus/g, '-');
            }
            if (voiceText.toLowerCase().includes("times") || voiceText.includes("*")) {
                voiceText = voiceText.replace(/times/g, '*');
            }
            if (voiceText.toLowerCase().includes("divide") || voiceText.includes("/")) {
                voiceText = voiceText.replace(/divide/g, '/');
            }

            try {
                let result = eval(voiceText);
                if (!isNaN(result)) {
                    document.getElementById("display").value = result;
                    speak("The answer is " + result);
                }
            } catch (error) {
                speak("Sorry, I didn't understand.");
            }
        };

        recognition.onerror = function (event) {
            console.error("Speech Recognition Error: ", event.error);
            if (event.error === "not-allowed") {
                speak("Please allow microphone access");
            }
        };

        setInterval(() => {
            if (isVoiceActive && !window.speechSynthesis.speaking) {
                recognition.start();
            }
        }, 3000);

        recognition.start();
    </script>
</body>
</html>
