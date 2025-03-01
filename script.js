<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Voice Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #222;
            color: white;
        }
        #calculator {
            width: 300px;
            margin: 50px auto;
            padding: 20px;
            background: #333;
            border-radius: 10px;
        }
        #display {
            width: 100%;
            height: 50px;
            text-align: right;
            font-size: 24px;
            padding: 10px;
            background: black;
            color: white;
            border: none;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 20px;
        }
        button {
            padding: 15px;
            font-size: 18px;
            background: #444;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:active {
            background: #666;
        }
        #voiceToggle {
            margin-top: 10px;
            padding: 10px;
            background: red;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <h1>AI Voice Calculator</h1>
    <div id="calculator">
        <input id="display" type="text" disabled>
        <div class="buttons">
            <button>7</button> <button>8</button> <button>9</button> <button>/</button>
            <button>4</button> <button>5</button> <button>6</button> <button>*</button>
            <button>1</button> <button>2</button> <button>3</button> <button>-</button>
            <button>0</button> <button>C</button> <button>=</button> <button>+</button>
        </div>
    </div>
    <button id="voiceToggle">🎤 Voice Control</button>

    <script>
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
                }
                display.value = currentInput;
            });
        });

        const voiceToggle = document.getElementById('voiceToggle');
        let recognition;
        try {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = true;
            recognition.lang = currentLang;
        } catch (error) {
            console.error('SpeechRecognition not supported:', error);
            alert('Your browser does not support Speech Recognition. Use Chrome.');
        }

        let isVoiceActive = false;

        voiceToggle.addEventListener('click', () => {
            if (!isVoiceActive) {
                startRecognition();
                voiceToggle.textContent = "🎤 Listening...";
                speak('Voice control activated');
            } else {
                recognition.stop();
                voiceToggle.textContent = "🎤 Voice Control";
                speak('Voice control stopped');
                isVoiceActive = false;
            }
        });

        function startRecognition() {
            if (!recognition) return;
            recognition.start();
            isVoiceActive = true;
            console.log('Mic is ON, speak now...');
        }

        recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
            console.log('Heard:', command);

            if (command.includes('clear') || command.includes('saaf karo')) {
                currentInput = '0';
                speak('Cleared');
                display.value = currentInput;
            } else if (command.includes('plus')) {
                currentInput += '+';
                speak('Plus');
            } else if (command.includes('minus')) {
                currentInput += '-';
                speak('Minus');
            } else if (command.includes('multiply')) {
                currentInput += '*';
                speak('Multiply');
            } else if (command.includes('divide')) {
                currentInput += '/';
                speak('Divide');
            } else if (command.match(/\d+.*[+\-*/].*\d+/)) {
                try {
                    currentInput = eval(command).toString();
                    speakResult(currentInput);
                    display.value = currentInput;
                } catch {
                    speak('Invalid calculation');
                }
            } else if (command.includes('equals') || command.includes('jawab') || command.includes('kitna hota hai')) {
                try {
                    currentInput = eval(currentInput).toString();
                    speakResult(currentInput);
                    display.value = currentInput;
                } catch {
                    speak('Error in calculation');
                }
            } else if (command.includes('change language to hindi')) {
                currentLang = 'hi-IN';
                recognition.lang = 'hi-IN';
                speak('भाषा हिंदी में बदल दी गई');
            } else if (command.includes('change language to english')) {
                currentLang = 'en-IN';
                recognition.lang = 'en-IN';
                speak('Language changed to English');
            } else if (command.includes('change theme')) {
                document.body.style.backgroundColor = document.body.style.backgroundColor === 'black' ? '#222' : 'black';
                speak('Theme changed');
            }

            recognition.stop();
            if (isVoiceActive) setTimeout(startRecognition, 1000);
        };

        recognition.onerror = (event) => {
            console.error('Voice error:', event.error);
            speak('Voice error, please try again');
            isVoiceActive = false;
        };

        function speak(text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLang;
            window.speechSynthesis.speak(utterance);
        }

        function speakResult(result) {
            const messages = {
                'en-IN': `The result is ${result}`,
                'hi-IN': `जवाब है ${result}`
            };
            speak(messages[currentLang] || messages['en-IN']);
        }
    </script>

</body>
</html>
