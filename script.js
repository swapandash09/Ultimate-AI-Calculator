/* ========================================================
   Smart Calculator — script.js
   Fixes: multi-digit chaining bug, wrong-answer bug,
          bill scanner, adds real voice answering.
   ======================================================== */

// ---------- i18n ----------
const I18N = {
  en: {
    code: "EN", speech: "en-US",
    theme: "Theme", history: "History", voice: "Voice",
    historyTitle: "🕘 History", billScannerTitle: "📷 Bill Scanner",
    scanBtn: "Scan Bill", clearHistory: "Clear History",
    scanning: "Scanning bill...", complete: "Scan complete",
    noAmounts: "No amounts found. Try a clearer photo.",
    scanFailed: "Scan failed. Please try again.",
    total: "Total", calculations: "calculations logged",
    noHistory: "No calculations yet.",
    avg: "Average result"
  },
  hi: {
    code: "HI", speech: "hi-IN",
    theme: "थीम", history: "इतिहास", voice: "आवाज़",
    historyTitle: "🕘 इतिहास", billScannerTitle: "📷 बिल स्कैनर",
    scanBtn: "बिल स्कैन करें", clearHistory: "इतिहास साफ़ करें",
    scanning: "बिल स्कैन हो रहा है...", complete: "स्कैन पूरा हुआ",
    noAmounts: "कोई राशि नहीं मिली। साफ़ फोटो लें।",
    scanFailed: "स्कैन विफल रहा। फिर कोशिश करें।",
    total: "कुल", calculations: "गणनाएँ दर्ज",
    noHistory: "अभी कोई गणना नहीं।",
    avg: "औसत परिणाम"
  },
  es: {
    code: "ES", speech: "es-ES",
    theme: "Tema", history: "Historial", voice: "Voz",
    historyTitle: "🕘 Historial", billScannerTitle: "📷 Escáner de facturas",
    scanBtn: "Escanear factura", clearHistory: "Borrar historial",
    scanning: "Escaneando factura...", complete: "Escaneo completo",
    noAmounts: "No se encontraron importes. Prueba con una foto más clara.",
    scanFailed: "Error al escanear. Inténtalo de nuevo.",
    total: "Total", calculations: "cálculos registrados",
    noHistory: "Aún no hay cálculos.",
    avg: "Resultado promedio"
  }
};

const LANG_ORDER = ["en", "hi", "es"];
let currentLang = localStorage.getItem("calc_lang") || "en";

const THEME_ORDER = ["light", "dark", "colorful"];
let currentTheme = localStorage.getItem("calc_theme") || "light";

let voiceOn = localStorage.getItem("calc_voice") === "true";

// ---------- DOM ----------
const display = document.getElementById("display");
const themeBtn = document.getElementById("theme-cycle");
const langBtn = document.getElementById("lang-cycle");
const langLabel = document.getElementById("langLabel");
const voiceBtn = document.getElementById("voiceToggle");
const historyToggleBtn = document.getElementById("history-toggle");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const historyInsights = document.getElementById("historyInsights");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const billInput = document.getElementById("billInput");
const scanBillBtn = document.getElementById("scanBillBtn");
const scanStatus = document.getElementById("scanStatus");
const billResult = document.getElementById("billResult");

// ---------- Calculator state ----------
let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let shouldResetScreen = false;

function formatNumber(numStr) {
  if (numStr === "" || numStr === undefined) return "";
  const [intPart, decPart] = numStr.split(".");
  const intFormatted = isNaN(parseFloat(intPart))
    ? intPart
    : parseFloat(intPart).toLocaleString("en-US");
  return decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted;
}

function updateDisplay() {
  display.value = formatNumber(currentOperand);
}

function appendNumber(number) {
  if (currentOperand === "0" && number !== ".") {
    currentOperand = "";
  }
  if (shouldResetScreen) {
    currentOperand = "";
    shouldResetScreen = false;
  }
  // Prevent multiple decimal points — this was the root cause
  // of the old "multiple numbers / wrong answer" bug.
  if (number === "." && currentOperand.includes(".")) return;
  currentOperand = (currentOperand === "" ? "" : currentOperand) + number;
  updateDisplay();
  speak(number, true);
}

function chooseOperation(op) {
  if (currentOperand === "" && previousOperand === "") return;
  if (currentOperand === "") {
    // allow switching operator before entering second number
    operation = op;
    return;
  }
  if (previousOperand !== "") {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  currentOperand = previousOperand; // show running value while choosing next number
  updateDisplay();
  speak(op, true);
}

function compute() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;
  let result;
  switch (operation) {
    case "+": result = prev + curr; break;
    case "−": result = prev - curr; break;
    case "×": result = prev * curr; break;
    case "÷": result = curr === 0 ? NaN : prev / curr; break;
    default: return;
  }
  const expression = `${formatNumber(previousOperand)} ${operation} ${formatNumber(currentOperand)}`;
  const resultStr = isNaN(result) ? "Error" : trimResult(result);

  currentOperand = resultStr;
  operation = undefined;
  previousOperand = "";
  shouldResetScreen = true;
  updateDisplay();

  if (resultStr !== "Error") {
    addHistory(expression, resultStr);
    speak(`${expression} = ${resultStr}`, false);
  } else {
    speak(currentLangText("scanFailed") === undefined ? "Error" : "Error", false);
  }
}

function trimResult(num) {
  // Avoid floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

function clearAll() {
  currentOperand = "0";
  previousOperand = "";
  operation = undefined;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetScreen) return;
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === "" || currentOperand === "-") currentOperand = "0";
  updateDisplay();
}

function percent() {
  if (currentOperand === "") return;
  currentOperand = trimResult(parseFloat(currentOperand) / 100);
  updateDisplay();
}

// ---------- Button wiring ----------
document.querySelectorAll("[data-num]").forEach(btn => {
  btn.addEventListener("click", () => appendNumber(btn.dataset.num));
});

document.querySelectorAll("[data-op]").forEach(btn => {
  btn.addEventListener("click", () => chooseOperation(btn.dataset.op));
});

document.querySelectorAll("[data-action]").forEach(btn => {
  btn.addEventListener("click", () => {
    switch (btn.dataset.action) {
      case "clear": clearAll(); break;
      case "delete": deleteLast(); break;
      case "percent": percent(); break;
      case "equals": compute(); break;
    }
  });
});

// Keyboard support
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendNumber(e.key);
  else if (e.key === ".") appendNumber(".");
  else if (e.key === "+") chooseOperation("+");
  else if (e.key === "-") chooseOperation("−");
  else if (e.key === "*") chooseOperation("×");
  else if (e.key === "/") { e.preventDefault(); chooseOperation("÷"); }
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); compute(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
});

// ---------- Voice ----------
function speak(text, isKeypress) {
  if (!voiceOn) return;
  if (!("speechSynthesis" in window)) return;
  if (isKeypress) return; // keep voice focused on final answers, not every keypress
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = I18N[currentLang].speech;
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.warn("Voice error:", err);
  }
}

function updateVoiceButton() {
  voiceBtn.classList.toggle("active", voiceOn);
}

voiceBtn.addEventListener("click", () => {
  voiceOn = !voiceOn;
  localStorage.setItem("calc_voice", voiceOn);
  updateVoiceButton();
  if (voiceOn) speak("Voice answers on", false);
});

// ---------- Theme ----------
function applyTheme() {
  THEME_ORDER.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(currentTheme);
}

themeBtn.addEventListener("click", () => {
  const idx = THEME_ORDER.indexOf(currentTheme);
  currentTheme = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  localStorage.setItem("calc_theme", currentTheme);
  applyTheme();
});

// ---------- Language ----------
function currentLangText(key) {
  return I18N[currentLang][key];
}

function applyLanguage() {
  langLabel.textContent = I18N[currentLang].code;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[currentLang][key]) el.textContent = I18N[currentLang][key];
  });
  renderHistory();
}

langBtn.addEventListener("click", () => {
  const idx = LANG_ORDER.indexOf(currentLang);
  currentLang = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
  localStorage.setItem("calc_lang", currentLang);
  applyLanguage();
});

// ---------- History ----------
let history = JSON.parse(localStorage.getItem("calc_history") || "[]");

function addHistory(expression, result) {
  history.unshift({ expression, result, time: Date.now() });
  history = history.slice(0, 50);
  localStorage.setItem("calc_history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyInsights.textContent = currentLangText("noHistory");
    return;
  }
  history.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="expr">${item.expression}</span><strong>${item.result}</strong>`;
    li.addEventListener("click", () => {
      currentOperand = item.result;
      shouldResetScreen = true;
      updateDisplay();
    });
    historyList.appendChild(li);
  });

  const results = history.map(h => parseFloat(h.result)).filter(n => !isNaN(n));
  const avg = results.length
    ? (results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)
    : 0;
  historyInsights.textContent = `${history.length} ${currentLangText("calculations")} · ${currentLangText("avg")}: ${avg}`;
}

historyToggleBtn.addEventListener("click", () => {
  historyPanel.style.display = historyPanel.style.display === "block" ? "none" : "block";
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calc_history");
  renderHistory();
});

// ---------- Bill Scanner (real OCR via Tesseract.js) ----------
function extractAmounts(text) {
  // Matches numbers like 1234, 1234.50, 1,234.50 while skipping stray digits
  const matches = text.match(/\d{1,3}(?:[,.]\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g) || [];
  return matches
    .map(m => parseFloat(m.replace(/,/g, "")))
    .filter(n => !isNaN(n) && n > 0 && n < 1000000);
}

async function scanBill() {
  const file = billInput.files && billInput.files[0];
  if (!file) {
    scanStatus.className = "error";
    scanStatus.textContent = currentLangText("noAmounts");
    return;
  }

  scanBillBtn.disabled = true;
  scanStatus.className = "scanning";
  scanStatus.textContent = currentLangText("scanning");
  billResult.innerHTML = "";

  try {
    if (typeof Tesseract === "undefined") {
      throw new Error("OCR engine failed to load (check internet connection).");
    }
    const { data } = await Tesseract.recognize(file, "eng");
    const amounts = extractAmounts(data.text || "");

    if (amounts.length === 0) {
      scanStatus.className = "error";
      scanStatus.textContent = currentLangText("noAmounts");
      return;
    }

    const total = amounts.reduce((a, b) => a + b, 0);
    const listHtml = amounts
      .map(a => `<li><span>Item</span><span>${a.toFixed(2)}</span></li>`)
      .join("");
    billResult.innerHTML = `
      <ul>${listHtml}</ul>
      <div class="total-line">${currentLangText("total")}: ${total.toFixed(2)}</div>
    `;

    scanStatus.className = "complete";
    scanStatus.textContent = currentLangText("complete");

    // Send the total straight into the calculator
    currentOperand = trimResult(total);
    shouldResetScreen = true;
    updateDisplay();

    if (voiceOn) speak(`${currentLangText("total")} ${total.toFixed(2)}`, false);
  } catch (err) {
    console.error(err);
    scanStatus.className = "error";
    scanStatus.textContent = currentLangText("scanFailed");
  } finally {
    scanBillBtn.disabled = false;
  }
}

scanBillBtn.addEventListener("click", scanBill);
// Auto-scan as soon as a photo is picked, for a faster mobile flow
billInput.addEventListener("change", () => {
  if (billInput.files && billInput.files[0]) scanBill();
});

// ---------- Init ----------
applyTheme();
applyLanguage();
updateVoiceButton();
updateDisplay();
renderHistory();
