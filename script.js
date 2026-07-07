/* ========================================================
   Smart Calculator — script.js
   - Speaks every digit / operator / action as it's pressed
   - Speaks theme changes and language changes
   - Full expression always visible (expr line + big display)
   - Real OCR bill scanner
   - Languages: English, Hindi, Bengali
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
    noHistory: "No calculations yet.", avg: "Average result",
    error: "Error", voiceOn: "Voice answers on", voiceOff: "Voice answers off",
    langChanged: "Language changed to English",
    operators: { "+": "plus", "−": "minus", "×": "multiply", "÷": "divide" },
    actions: { clear: "Clear", delete: "Delete", percent: "Percent", equals: "Equals",
      mPlus: "Added to memory", mMinus: "Subtracted from memory",
      mRecall: "Memory recalled", mClear: "Memory cleared" },
    themes: { light: "Light", dark: "Dark", colorful: "Colorful" },
    themeChanged: (t) => `Theme changed to ${t}`,
    undo: "Undo", nothingToUndo: "Nothing to undo", undone: "Undone",
    listening: "Listening...", didntCatch: "Didn't catch that, try again.",
    voiceInputNotSupported: "Voice input isn't supported in this browser.",
    speakCalc: "Speak", speakAmountBtn: "Speak Amount (Handwritten Bill)",
    speakAmountHint: "Bill is handwritten or blurry? Skip the scan and just say the total out loud.",
    amountAdded: (n) => `Amount added: ${n}`,
    detectedItems: "Amounts detected on the bill",
    printedTotal: "Total printed on bill", estimatedTotal: "Estimated total (added up)",
    billScanned: "Bill scanned", themeToastPrefix: "Theme:", langToastPrefix: "Language:",
    calcErrorToast: "Can't divide by zero",
    back: "Back", historyCleared: "History cleared", billReset: "Scanner reset"
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
    noHistory: "अभी कोई गणना नहीं।", avg: "औसत परिणाम",
    error: "त्रुटि", voiceOn: "आवाज़ चालू है", voiceOff: "आवाज़ बंद है",
    langChanged: "भाषा बदलकर हिंदी हो गई है",
    operators: { "+": "जमा", "−": "घटा", "×": "गुणा", "÷": "भाग" },
    actions: { clear: "साफ़", delete: "मिटाओ", percent: "प्रतिशत", equals: "बराबर",
      mPlus: "मेमोरी में जोड़ा गया", mMinus: "मेमोरी से घटाया गया",
      mRecall: "मेमोरी वापस लाई गई", mClear: "मेमोरी साफ़ हुई" },
    themes: { light: "हल्की", dark: "गहरी", colorful: "रंगीन" },
    themeChanged: (t) => `थीम बदलकर ${t} हो गई`,
    undo: "पूर्ववत करें", nothingToUndo: "पूर्ववत करने को कुछ नहीं है", undone: "पूर्ववत हो गया",
    listening: "सुन रहा हूँ...", didntCatch: "समझ नहीं आया, फिर कोशिश करें।",
    voiceInputNotSupported: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।",
    speakCalc: "बोलें", speakAmountBtn: "राशि बोलें (हस्तलिखित बिल)",
    speakAmountHint: "बिल हस्तलिखित या धुंधला है? स्कैन छोड़ें और बस कुल राशि बोल दें।",
    amountAdded: (n) => `राशि जोड़ी गई: ${n}`,
    detectedItems: "बिल पर मिली राशियाँ",
    printedTotal: "बिल पर छपा कुल", estimatedTotal: "अनुमानित कुल (जोड़कर)",
    billScanned: "बिल स्कैन हुआ", themeToastPrefix: "थीम:", langToastPrefix: "भाषा:",
    calcErrorToast: "शून्य से भाग नहीं हो सकता",
    back: "वापस", historyCleared: "इतिहास साफ़ हुआ", billReset: "स्कैनर रीसेट हुआ"
  },
  bn: {
    code: "BN", speech: "bn-IN",
    theme: "থিম", history: "ইতিহাস", voice: "ভয়েস",
    historyTitle: "🕘 ইতিহাস", billScannerTitle: "📷 বিল স্ক্যানার",
    scanBtn: "বিল স্ক্যান করুন", clearHistory: "ইতিহাস মুছুন",
    scanning: "বিল স্ক্যান হচ্ছে...", complete: "স্ক্যান সম্পন্ন",
    noAmounts: "কোনো পরিমাণ পাওয়া যায়নি। পরিষ্কার ছবি নিন।",
    scanFailed: "স্ক্যান ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
    total: "মোট", calculations: "টি হিসাব রেকর্ড হয়েছে",
    noHistory: "এখনো কোনো হিসাব নেই।", avg: "গড় ফলাফল",
    error: "ত্রুটি", voiceOn: "ভয়েস চালু আছে", voiceOff: "ভয়েস বন্ধ আছে",
    langChanged: "ভাষা পরিবর্তন করে বাংলা করা হয়েছে",
    operators: { "+": "যোগ", "−": "বিয়োগ", "×": "গুণ", "÷": "ভাগ" },
    actions: { clear: "মুছুন", delete: "মুছে ফেলুন", percent: "শতাংশ", equals: "সমান",
      mPlus: "মেমোরিতে যোগ হয়েছে", mMinus: "মেমোরি থেকে বিয়োগ হয়েছে",
      mRecall: "মেমোরি ফিরিয়ে আনা হয়েছে", mClear: "মেমোরি মুছে ফেলা হয়েছে" },
    themes: { light: "হালকা", dark: "গাঢ়", colorful: "রঙিন" },
    themeChanged: (t) => `থিম পরিবর্তন করে ${t} করা হয়েছে`,
    undo: "পূর্বাবস্থা", nothingToUndo: "ফিরিয়ে নেওয়ার কিছু নেই", undone: "পূর্বাবস্থায় ফেরানো হয়েছে",
    listening: "শুনছি...", didntCatch: "বুঝতে পারিনি, আবার চেষ্টা করুন।",
    voiceInputNotSupported: "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।",
    speakCalc: "বলুন", speakAmountBtn: "পরিমাণ বলুন (হাতে লেখা বিল)",
    speakAmountHint: "বিল হাতে লেখা বা অস্পষ্ট? স্ক্যান বাদ দিয়ে শুধু মোট পরিমাণ বলুন।",
    amountAdded: (n) => `পরিমাণ যোগ হয়েছে: ${n}`,
    detectedItems: "বিলে পাওয়া পরিমাণ",
    printedTotal: "বিলে ছাপা মোট", estimatedTotal: "আনুমানিক মোট (যোগ করে)",
    billScanned: "বিল স্ক্যান হয়েছে", themeToastPrefix: "থিম:", langToastPrefix: "ভাষা:",
    calcErrorToast: "শূন্য দিয়ে ভাগ করা যায় না",
    back: "ফিরুন", historyCleared: "ইতিহাস মুছে ফেলা হয়েছে", billReset: "স্ক্যানার রিসেট হয়েছে"
  }
};

const LANG_ORDER = ["en", "hi", "bn"];
let currentLang = LANG_ORDER.includes(localStorage.getItem("calc_lang"))
  ? localStorage.getItem("calc_lang") : "en";

const THEME_ORDER = ["light", "dark", "colorful"];
let currentTheme = localStorage.getItem("calc_theme") || "light";

let voiceOn = localStorage.getItem("calc_voice") === "true";

// ---------- DOM ----------
const exprLine = document.getElementById("exprLine");
const display = document.getElementById("display");
const themeBtn = document.getElementById("theme-cycle");
const langBtn = document.getElementById("lang-cycle");
const langLabel = document.getElementById("langLabel");
const voiceBtn = document.getElementById("voiceToggle");
const historyToggleBtn = document.getElementById("history-toggle");
const historyCloseBtn = document.getElementById("historyCloseBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const historyInsights = document.getElementById("historyInsights");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const billInput = document.getElementById("billInput");
const billPreview = document.getElementById("billPreview");
const resetBillBtn = document.getElementById("resetBillBtn");
const scanBillBtn = document.getElementById("scanBillBtn");
const speakAmountBtn = document.getElementById("speakAmountBtn");
const scanStatus = document.getElementById("scanStatus");
const billResult = document.getElementById("billResult");

const memoryBadge = document.getElementById("memoryBadge");
const voiceInputBtn = document.getElementById("voiceInputBtn");
const undoBtn = document.getElementById("undoBtn");
const toastContainer = document.getElementById("toastContainer");

// ---------- Smart Notifications (toasts) ----------
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2450);
}

// ---------- Calculator state ----------
// `expression` holds the FULL raw string the user has typed, e.g. "125+30×2"
// so the full number sequence is always visible, not just the last entry.
let expression = "";
let justEvaluated = false;
let lastEquationText = "";

let memoryValue = parseFloat(localStorage.getItem("calc_memory") || "0");
let undoStack = [];
const MAX_UNDO = 20;

function pushUndo() {
  undoStack.push({ expression, justEvaluated, lastEquationText });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
}

function updateMemoryBadge() {
  memoryBadge.classList.toggle("show", memoryValue !== 0);
}

function getCurrentValue() {
  if (justEvaluated) return parseFloat(expression) || 0;
  const seg = getLastSegment(expression);
  const val = seg !== "" ? seg : expression.replace(/[+\-−×÷.]$/, "");
  return parseFloat(val) || 0;
}

function formatNumber(numStr) {
  if (numStr === "" || numStr === undefined) return "";
  const neg = numStr.startsWith("-") ? "-" : "";
  if (neg) numStr = numStr.slice(1);
  const [intPart, decPart] = numStr.split(".");
  const intFormatted = intPart === "" || isNaN(parseFloat(intPart))
    ? intPart
    : parseInt(intPart, 10).toLocaleString("en-US");
  return neg + (decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted);
}

function getLastSegment(expr) {
  const m = expr.match(/(\d*\.?\d*)$/);
  return m ? m[0] : "";
}

function updateDisplay() {
  if (justEvaluated) {
    exprLine.textContent = lastEquationText;
    display.value = formatNumber(expression) || "0";
  } else {
    exprLine.textContent = expression === "" ? "0" : expression;
    const seg = getLastSegment(expression);
    if (expression === "") {
      display.value = "0";
    } else if (seg === "") {
      // expression ends in an operator — show the running value before it
      display.value = expression.slice(0, -1) === "" ? "0" : formatNumber(expression.slice(0, -1).match(/(\d*\.?\d*)$/)[0]);
    } else {
      display.value = formatNumber(seg);
    }
  }
}

function appendNumber(num) {
  pushUndo();
  if (justEvaluated) {
    expression = "";
    justEvaluated = false;
  }
  const lastSeg = getLastSegment(expression);
  if (num === ".") {
    if (lastSeg.includes(".")) return; // no double decimals
    if (lastSeg === "") expression += "0";
    expression += ".";
  } else if (lastSeg === "0") {
    expression = expression.slice(0, -1) + num;
  } else {
    expression += num;
  }
  updateDisplay();
  speak(num, I18N[currentLang].speech);
}

function chooseOperation(op) {
  if (expression === "" && !justEvaluated) return;
  pushUndo();
  if (justEvaluated) justEvaluated = false;

  const lastChar = expression.slice(-1);
  if (["+", "−", "×", "÷"].includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
  } else if (lastChar === ".") {
    expression = expression.slice(0, -1) + op;
  } else if (expression === "") {
    return;
  } else {
    expression += op;
  }
  updateDisplay();
  speak(I18N[currentLang].operators[op], I18N[currentLang].speech);
}

function evaluateTokens(tokens) {
  const stack = [parseFloat(tokens[0])];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const num = parseFloat(tokens[i + 1]);
    if (op === "×") stack[stack.length - 1] *= num;
    else if (op === "÷") stack[stack.length - 1] = num === 0 ? NaN : stack[stack.length - 1] / num;
    else { stack.push(op); stack.push(num); }
  }
  let result = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const num = stack[i + 1];
    if (op === "+") result += num;
    else if (op === "−") result -= num;
  }
  return result;
}

function trimResult(num) {
  const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

function compute() {
  pushUndo();
  let expr = expression;
  while (expr !== "" && ["+", "−", "×", "÷", "."].includes(expr.slice(-1))) {
    expr = expr.slice(0, -1);
  }
  if (expr === "") return;

  const tokens = expr.match(/\d+\.?\d*|[+\-−×÷]/g);
  if (!tokens || tokens.length === 0) return;

  let result;
  try { result = evaluateTokens(tokens); } catch (e) { result = NaN; }
  const resultStr = (isNaN(result) || !isFinite(result)) ? "Error" : trimResult(result);

  if (resultStr !== "Error") {
    lastEquationText = `${expr} = ${resultStr}`;
    addHistory(expr, resultStr);
    expression = resultStr;
    justEvaluated = true;
    updateDisplay();
    showToast(lastEquationText, "success");
    speak(`${I18N[currentLang].actions.equals} ${resultStr}`, I18N[currentLang].speech);
  } else {
    lastEquationText = `${expr} = ${I18N[currentLang].error}`;
    expression = "";
    justEvaluated = false;
    updateDisplay();
    showToast(I18N[currentLang].calcErrorToast, "error");
    speak(I18N[currentLang].error, I18N[currentLang].speech);
  }
}

function clearAll() {
  pushUndo();
  expression = "";
  justEvaluated = false;
  lastEquationText = "";
  updateDisplay();
  speak(I18N[currentLang].actions.clear, I18N[currentLang].speech);
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  pushUndo();
  expression = expression.slice(0, -1);
  updateDisplay();
  speak(I18N[currentLang].actions.delete, I18N[currentLang].speech);
}

function percent() {
  const lastSeg = getLastSegment(expression);
  if (lastSeg === "") return;
  pushUndo();
  const value = trimResult(parseFloat(lastSeg) / 100);
  expression = expression.slice(0, expression.length - lastSeg.length) + value;
  updateDisplay();
  speak(I18N[currentLang].actions.percent, I18N[currentLang].speech);
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
      case "mc": memoryClear(); break;
      case "mr": memoryRecall(); break;
      case "m-plus": memoryAdd(); break;
      case "m-minus": memorySubtract(); break;
    }
  });
});

function memoryClear() {
  memoryValue = 0;
  localStorage.setItem("calc_memory", "0");
  updateMemoryBadge();
  showToast(I18N[currentLang].actions.mClear, "info");
  speak(I18N[currentLang].actions.mClear, I18N[currentLang].speech);
}

function memoryRecall() {
  if (memoryValue === 0) return;
  pushUndo();
  expression = trimResult(memoryValue);
  justEvaluated = false;
  updateDisplay();
  showToast(`${I18N[currentLang].actions.mRecall}: ${trimResult(memoryValue)}`, "info");
  speak(I18N[currentLang].actions.mRecall, I18N[currentLang].speech);
}

function memoryAdd() {
  memoryValue += getCurrentValue();
  localStorage.setItem("calc_memory", memoryValue.toString());
  updateMemoryBadge();
  showToast(I18N[currentLang].actions.mPlus, "info");
  speak(I18N[currentLang].actions.mPlus, I18N[currentLang].speech);
}

function memorySubtract() {
  memoryValue -= getCurrentValue();
  localStorage.setItem("calc_memory", memoryValue.toString());
  updateMemoryBadge();
  showToast(I18N[currentLang].actions.mMinus, "info");
  speak(I18N[currentLang].actions.mMinus, I18N[currentLang].speech);
}

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

// ---------- Undo ----------
undoBtn.addEventListener("click", () => {
  if (undoStack.length === 0) {
    showToast(I18N[currentLang].nothingToUndo, "error");
    speak(I18N[currentLang].nothingToUndo, I18N[currentLang].speech);
    return;
  }
  const prev = undoStack.pop();
  expression = prev.expression;
  justEvaluated = prev.justEvaluated;
  lastEquationText = prev.lastEquationText;
  updateDisplay();
  showToast(I18N[currentLang].undone, "info");
  speak(I18N[currentLang].undone, I18N[currentLang].speech);
});

// ---------- Voice ----------
// Every keypress/action queues its own utterance (not cancelled), so the
// full sequence of what was typed gets read out in order.
function speak(text, langCode) {
  if (!voiceOn) return;
  if (!("speechSynthesis" in window)) return;
  try {
    const utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = langCode || I18N[currentLang].speech;
    utter.rate = 1.05;
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
  // Announce the toggle itself using direct speech (bypasses the voiceOn gate check timing)
  if (voiceOn && "speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(I18N[currentLang].voiceOn);
    utter.lang = I18N[currentLang].speech;
    window.speechSynthesis.speak(utter);
  }
});

// ---------- Theme ----------
function applyTheme(announce) {
  THEME_ORDER.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(currentTheme);
  if (announce) {
    const themeName = I18N[currentLang].themes[currentTheme];
    showToast(`${I18N[currentLang].themeToastPrefix} ${themeName}`, "info");
    speak(I18N[currentLang].themeChanged(themeName), I18N[currentLang].speech);
  }
}

themeBtn.addEventListener("click", () => {
  const idx = THEME_ORDER.indexOf(currentTheme);
  currentTheme = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  localStorage.setItem("calc_theme", currentTheme);
  applyTheme(true);
});

// ---------- Language ----------
function currentLangText(key) {
  return I18N[currentLang][key];
}

function applyLanguage(announce) {
  langLabel.textContent = I18N[currentLang].code;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[currentLang][key]) el.textContent = I18N[currentLang][key];
  });
  renderHistory();
  if (announce) {
    showToast(`${I18N[currentLang].langToastPrefix} ${I18N[currentLang].code}`, "info");
    speak(I18N[currentLang].langChanged, I18N[currentLang].speech);
  }
}

langBtn.addEventListener("click", () => {
  const idx = LANG_ORDER.indexOf(currentLang);
  currentLang = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
  localStorage.setItem("calc_lang", currentLang);
  applyLanguage(true);
});

// ---------- History ----------
let history = JSON.parse(localStorage.getItem("calc_history") || "[]");

function addHistory(expr, result) {
  history.unshift({ expression: expr, result, time: Date.now() });
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
      expression = item.result;
      justEvaluated = true;
      lastEquationText = `${item.expression} = ${item.result}`;
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

historyCloseBtn.addEventListener("click", () => {
  historyPanel.style.display = "none";
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calc_history");
  renderHistory();
  showToast(currentLangText("historyCleared"), "info");
});

// ---------- Voice Input (Speech-to-Text) ----------
function getSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const recognition = new SR();
  recognition.lang = I18N[currentLang].speech;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

function parseSpokenMath(text) {
  let t = ` ${text.toLowerCase()} `;

  const wordToSymbol = {
    plus: "+", add: "+", added: "+",
    minus: "−", subtract: "−", subtracted: "−",
    times: "×", multiply: "×", multiplied: "×", into: "×", "multiplied by": "×",
    divide: "÷", divided: "÷", "divided by": "÷", by: "÷"
  };
  Object.entries(I18N[currentLang].operators).forEach(([sym, word]) => {
    wordToSymbol[word.toLowerCase()] = sym;
  });

  Object.keys(wordToSymbol)
    .sort((a, b) => b.length - a.length)
    .forEach(word => {
      const re = new RegExp(`\\b${word}\\b`, "gi");
      t = t.replace(re, ` ${wordToSymbol[word]} `);
    });

  t = t.replace(/\bequals?( to)?\b|\bis\b|बराबर|সমান/gi, " ");
  t = t.replace(/[^0-9+\-−×÷.]/g, "");
  return t;
}

voiceInputBtn.addEventListener("click", () => {
  const recognition = getSpeechRecognition();
  if (!recognition) {
    speak(I18N[currentLang].voiceInputNotSupported, I18N[currentLang].speech);
    return;
  }
  voiceInputBtn.classList.add("listening");
  speak(I18N[currentLang].listening, I18N[currentLang].speech);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const hadEquals = /equals?|बराबर|সমান/i.test(transcript);
    const parsed = parseSpokenMath(transcript);
    if (parsed) {
      pushUndo();
      expression = parsed;
      justEvaluated = false;
      updateDisplay();
      if (hadEquals) compute();
    } else {
      speak(I18N[currentLang].didntCatch, I18N[currentLang].speech);
    }
  };
  recognition.onerror = () => {
    speak(I18N[currentLang].didntCatch, I18N[currentLang].speech);
  };
  recognition.onend = () => voiceInputBtn.classList.remove("listening");

  try { recognition.start(); } catch (e) { voiceInputBtn.classList.remove("listening"); }
});

// ---------- Bill Scanner (real OCR via Tesseract.js) ----------
const TOTAL_KEYWORDS = /\b(grand total|amount due|net amount|net payable|total)\b|कुल\s*(राशि|रकम)?|মোট/i;
const DATE_PATTERN = /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/;
const LONG_DIGIT_RUN = /\d{7,}/; // phone numbers, receipt/GST IDs etc.
const NON_ITEM_LINE = /\b(subtotal|sub total|tax|cgst|sgst|gst|vat|service charge|discount|round\s*off)\b/i;
// Quantity units that sit right after a number — e.g. "1KG", "500G", "2 PC" —
// so those numbers don't get mistaken for the price.
const QTY_UNIT = /\d+\.?\d*\s?(kgs?|gms?|grams?|kilo|ltrs?|litres?|\bl\b|pcs?|pieces?|dozen|packet|pkt|nos?)\b/gi;

// Pulls the most likely price out of a single line. Real handwritten bills
// (like a kirana/grocery notebook) often write whole rupee amounts with no
// paisa — "90", "110", "375" — not "90.00". A price is normally the LAST
// number on the line, after the item name and quantity.
function extractLineAmount(line) {
  const stripped = line.replace(QTY_UNIT, " ");

  const decimalMatches = stripped.match(/\d+(?:,\d{3})*\.\d{1,2}\b/g);
  if (decimalMatches && decimalMatches.length) {
    return parseFloat(decimalMatches[decimalMatches.length - 1].replace(/,/g, ""));
  }

  const intMatches = stripped.match(/\d+(?:,\d{3})*/g);
  if (intMatches && intMatches.length) {
    return parseFloat(intMatches[intMatches.length - 1].replace(/,/g, ""));
  }
  return null;
}

function analyzeBillText(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let printedTotal = null;
  const lineItems = [];

  lines.forEach(line => {
    const isDateLine = DATE_PATTERN.test(line);
    const isLongIdLine = LONG_DIGIT_RUN.test(line);
    const isTotalLine = TOTAL_KEYWORDS.test(line);

    if (isTotalLine) {
      const amt = extractLineAmount(line);
      if (amt !== null) printedTotal = amt;
      return; // don't also count the total line as a line item
    }

    if (isDateLine || isLongIdLine || NON_ITEM_LINE.test(line)) return;

    const amount = extractLineAmount(line);
    if (amount !== null && amount > 0 && amount < 1000000) {
      const label = line.replace(/[\d.,\-]+/g, " ").replace(/[^\p{L}\s]/gu, "").trim();
      lineItems.push({ label: label || "Item", amount });
    }
  });

  const subtotal = lineItems.reduce((a, b) => a + b.amount, 0);
  const finalTotal = printedTotal !== null ? printedTotal : subtotal;
  return { lineItems, subtotal, printedTotal, finalTotal };
}

function renderBillResult({ lineItems, subtotal, printedTotal }) {
  let html = "";

  if (lineItems.length) {
    const itemsHtml = lineItems
      .map(li => `<li><span>${li.label}</span><span>${li.amount.toFixed(2)}</span></li>`)
      .join("");
    const breakdown = lineItems.map(li => li.amount.toFixed(2)).join(" + ");
    html += `<div class="breakdown-line">${currentLangText("detectedItems")}:</div>`;
    html += `<ul>${itemsHtml}</ul>`;
    html += `<div class="breakdown-line">${breakdown} = ${subtotal.toFixed(2)}</div>`;
  }

  if (printedTotal !== null) {
    html += `<div class="total-line">${currentLangText("printedTotal")}: ${printedTotal.toFixed(2)}</div>`;
    if (lineItems.length && Math.abs(printedTotal - subtotal) > 0.05) {
      html += `<div class="subtotal-note">(${currentLangText("estimatedTotal")}: ${subtotal.toFixed(2)})</div>`;
    }
  } else {
    html += `<div class="total-line">${currentLangText("estimatedTotal")}: ${subtotal.toFixed(2)}</div>`;
  }

  billResult.innerHTML = html;
}

function showBillPreview(file) {
  if (billPreview.dataset.objectUrl) URL.revokeObjectURL(billPreview.dataset.objectUrl);
  const url = URL.createObjectURL(file);
  billPreview.src = url;
  billPreview.dataset.objectUrl = url;
  billPreview.classList.add("show");
}

// Cleans up the photo before OCR: converts to grayscale, boosts contrast,
// and binarizes (pure black ink / white paper). This makes a huge
// difference on phone photos of handwritten notebook pages — the OCR
// engine is trained mostly on clean printed text, so removing lighting
// gradients, paper texture, and the ruled lines gives it a real chance.
function preprocessBillImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let targetWidth = img.width;
      if (targetWidth > 1600) targetWidth = 1600;
      else if (targetWidth < 900) targetWidth = 900; // upscale small photos
      const ratio = targetWidth / img.width;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const gray = new Float32Array(canvas.width * canvas.height);
      let sum = 0;

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        gray[j] = g;
        sum += g;
      }
      const mean = sum / gray.length;
      const threshold = mean * 0.88; // ink is reliably darker than the page average

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const v = gray[j] < threshold ? 0 : 255;
        data[i] = data[i + 1] = data[i + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

async function runBillOCR(canvasOrFile) {
  const worker = await Tesseract.createWorker("eng");
  // PSM 4 = "assume a single column of text of variable sizes" — a good
  // match for a list of handwritten items, one per line.
  await worker.setParameters({ tessedit_pageseg_mode: "4" });
  const result = await worker.recognize(canvasOrFile);
  await worker.terminate();
  return result.data;
}

async function scanBill() {
  const file = billInput.files && billInput.files[0];
  if (!file) {
    scanStatus.className = "error";
    scanStatus.textContent = currentLangText("noAmounts");
    return;
  }

  showBillPreview(file);
  scanBillBtn.disabled = true;
  scanStatus.className = "scanning";
  scanStatus.textContent = currentLangText("scanning");
  billResult.innerHTML = "";

  try {
    if (typeof Tesseract === "undefined") {
      throw new Error("OCR engine failed to load (check internet connection).");
    }
    const cleanedCanvas = await preprocessBillImage(file);
    const data = await runBillOCR(cleanedCanvas);
    const analysis = analyzeBillText(data.text || "");

    if (analysis.lineItems.length === 0 && analysis.printedTotal === null) {
      scanStatus.className = "error";
      scanStatus.textContent = currentLangText("noAmounts");
      return;
    }

    renderBillResult(analysis);
    scanStatus.className = "complete";
    scanStatus.textContent = currentLangText("complete");
    showToast(currentLangText("billScanned"), "success");

    const total = analysis.finalTotal;
    pushUndo();
    expression = trimResult(total);
    justEvaluated = true;
    lastEquationText = `${currentLangText("total")} = ${trimResult(total)}`;
    updateDisplay();

    speak(`${currentLangText("total")} ${total.toFixed(2)}`, I18N[currentLang].speech);
  } catch (err) {
    console.error(err);
    scanStatus.className = "error";
    scanStatus.textContent = currentLangText("scanFailed");
    showToast(currentLangText("scanFailed"), "error");
  } finally {
    scanBillBtn.disabled = false;
  }
}

scanBillBtn.addEventListener("click", scanBill);
billInput.addEventListener("change", () => {
  if (billInput.files && billInput.files[0]) scanBill();
});

resetBillBtn.addEventListener("click", () => {
  billInput.value = "";
  if (billPreview.dataset.objectUrl) {
    URL.revokeObjectURL(billPreview.dataset.objectUrl);
    delete billPreview.dataset.objectUrl;
  }
  billPreview.src = "";
  billPreview.classList.remove("show");
  billResult.innerHTML = "";
  scanStatus.className = "";
  scanStatus.textContent = "";
  showToast(currentLangText("billReset"), "info");
});

// For handwritten / blurry bills, OCR is unreliable — skip it entirely
// and let the person just say the total amount out loud instead.
speakAmountBtn.addEventListener("click", () => {
  const recognition = getSpeechRecognition();
  if (!recognition) {
    scanStatus.className = "error";
    scanStatus.textContent = currentLangText("voiceInputNotSupported");
    return;
  }

  speakAmountBtn.classList.add("listening");
  scanStatus.className = "scanning";
  scanStatus.textContent = currentLangText("listening");
  billResult.innerHTML = "";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const match = transcript.replace(/,/g, "").match(/\d+(\.\d+)?/);
    if (!match) {
      scanStatus.className = "error";
      scanStatus.textContent = currentLangText("didntCatch");
      return;
    }
    const amount = parseFloat(match[0]);
    billResult.innerHTML = `<div class="total-line">${currentLangText("total")}: ${amount.toFixed(2)}</div>`;
    scanStatus.className = "complete";
    scanStatus.textContent = currentLangText("complete");
    showToast(currentLangText("amountAdded")(amount.toFixed(2)), "success");

    pushUndo();
    expression = trimResult(amount);
    justEvaluated = true;
    lastEquationText = `${currentLangText("total")} = ${trimResult(amount)}`;
    updateDisplay();
    speak(currentLangText("amountAdded")(amount.toFixed(2)), I18N[currentLang].speech);
  };
  recognition.onerror = () => {
    scanStatus.className = "error";
    scanStatus.textContent = currentLangText("didntCatch");
  };
  recognition.onend = () => speakAmountBtn.classList.remove("listening");

  try { recognition.start(); } catch (e) { speakAmountBtn.classList.remove("listening"); }
});

// ---------- Init ----------
applyTheme(false);
applyLanguage(false);
updateVoiceButton();
updateMemoryBadge();
updateDisplay();
renderHistory();
