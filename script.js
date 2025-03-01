function appendValue(value) {
    document.getElementById('result').value += value;
}

function clearScreen() {
    document.getElementById('result').value = '';
}

function calculate() {
    try {
        let result = eval(document.getElementById('result').value);
        document.getElementById('result').value = result;
        speak(result);
    } catch (error) {
        alert('Invalid Input');
    }
}

function startListening() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let voiceInput = event.results[0][0].transcript;
        document.getElementById('result').value = voiceInput;
    }
}

function speak(text) {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-US';
    speech.text = "The result is " + text;
    speech.rate = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
}

function scanBill() {
    alert("Bill Scanner Feature Coming Soon...");
}
