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
    voiceItemNotFound: "Not found in your saved items — add it first.",
    askQtyPcs: "How many pieces?", askQtyWeight: "How much — kg or grams?",
    voiceAddBtn: "Speak to Add Item",
    voiceAddHint: "Say it like \"Atta 5 kg\" or \"Chana Dal 500 gram\" — the item must already be saved in your item list above.",
    customerSearchPh: "Ramesh Kumar", customerSavedHint: "Saved customers auto-fill their phone & address — type a saved name to reuse it.",
    speakCalc: "Speak", speakAmountBtn: "Speak Amount (Handwritten Bill)",
    speakAmountHint: "Bill is handwritten or blurry? Skip the scan and just say the total out loud.",
    amountAdded: (n) => `Amount added: ${n}`,
    detectedItems: "Amounts detected on the bill",
    printedTotal: "Total printed on bill", estimatedTotal: "Estimated total (added up)",
    billScanned: "Bill scanned", themeToastPrefix: "Theme:", langToastPrefix: "Language:",
    calcErrorToast: "Can't divide by zero",
    back: "Back", historyCleared: "History cleared", billReset: "Scanner reset",
    modeStandard: "Standard", modeEmi: "EMI", modeGst: "GST", modeDiscount: "Discount",
    modeInterest: "Interest", modeSplit: "Split Bill",
    calculate: "Calculate", principalLabel: "Loan Amount (₹)", rateLabel: "Interest Rate (% per year)",
    tenureLabel: "Tenure (months)", amountLabel: "Amount (₹)", gstRateLabel: "GST Rate",
    addGstLabel: "Add GST", removeGstLabel: "Remove GST", discountLabel: "Discount (%)",
    timeLabel: "Time (years)", simpleLabel: "Simple", compoundLabel: "Compound",
    peopleLabel: "Number of People", tipLabel: "Tip (%)", fillFieldsError: "Please fill all fields with valid numbers",
    monthlyEmiLabel: "Monthly EMI", totalInterestLabel: "Total Interest", totalPaymentLabel: "Total Payment",
    weeklyEmiLabel: "Weekly EMI", tenureWeeksLabel: "Tenure (weeks)",
    findRateLabel: "Interest Rate", maturityValueLabel: "Maturity Value",
    gstAmountLabel: "GST Amount", totalWithGstLabel: "Total Amount", originalAmountLabel: "Original Amount",
    finalPriceLabel: "Final Price", youSaveLabel: "You Save", interestEarnedLabel: "Interest",
    totalAmountLabel: "Total Amount", perPersonLabel: "Per Person", tipAmountLabel: "Tip Amount",
    grandTotalLabel: "Grand Total",
    modeBillMaker: "Bill Maker", customerNameLabel: "Customer Name",
    customerPhoneLabel: "Phone Number", customerAddressLabel: "Address",
    itemNameLabel: "Item", generatePdfBtn: "Generate PDF Bill",
    billTotalLabel: "Total", noItemsYet: "No items added yet.",
    fillItemError: "Enter an item name and price.", itemAdded: "Item added",
    itemRemoved: "Item removed", billCleared: "Bill cleared",
    clearBillBtn: "Clear", tapAgainToClear: "Tap again to confirm clearing the bill",
    pdfGenerating: "Generating PDF...", pdfGenerated: "Bill PDF downloaded",
    pdfFailed: "Couldn't generate PDF. Check your internet connection.",
    addAtLeastOneItem: "Add at least one item first.",
    shopDetailsLabel: "🏪 Shop Details", shopDetailsHint: "Saved only in this browser — never uploaded anywhere.",
    shopNamePh: "Shop Name", shopAddressPh: "Shop Address", shopMobilePh: "Mobile Number",
    invoiceNoLabel: "Invoice No.", manageItemsLabel: "📦 Manage Saved Items",
    catNamePh: "Item name", searchItemPh: "Search saved item or type new...",
    pdfBtn: "PDF", jpgBtn: "JPG",
    jpgGenerating: "Generating image...", jpgGenerated: "Bill image downloaded",
    jpgFailed: "Couldn't generate image. Check your internet connection.",
    catalogItemAdded: "Saved to item list", catalogItemRemoved: "Removed from item list",
    catalogEmpty: "No saved items yet — add one above.",
    fillCatalogError: "Enter item name and rate.",
    distNamePh: "Distributor Name (optional)", distContactPh: "Distributor Contact",
    shopQrLabel: "Shop QR Code (UPI/payment)", customerWhatsappLabel: "WhatsApp Number (optional)",
    scanAndPayLabel: "SCAN & PAY",
    catalogHint: "Preset qty + price, e.g. \"6 PCS = ₹280\" or \"1 Kg = ₹120\". Billing quantity auto-converts from this.",
    costPricePh: "Cost Price ₹ (optional)", sellPricePh: "Selling Price ₹",
    mrpPh: "MRP ₹ (optional, for showing discount)",
    marginPh: "Margin % (auto cost)", marginHint: "Know your margin %? Cost Price fills in by itself: MRP ÷ (1 + margin/100).",
    purchaseRateLabel: "Purchase rate", estimatedLabel: "estimated",
    invoiceColumnsLabel: "⚙️ Invoice Columns",
    invoiceColumnsHint: "Choose what shows on the printed PDF/JPG. Item name and final Amount always show.",
    boughtAtLabel: "bought at", profitLabel: "profit",
    autoFetchAddedToCatalog: (n) => `${n} item(s) added to your saved items — set their selling price before billing`,
    autoFetchPdfNotSupported: "PDFs can't be read directly — please take a screenshot or photo of the invoice instead.",
    showMrpCol: "Show MRP", showRateCol: "Show Rate", showDiscountCol: "Show Discount", showGstCol: "Show GST",
    autoFetchLabel: "📤 Auto-Fetch Items from Invoice Photo",
    autoFetchHint: "Reads item names and amounts (as MRP) from a photo, and saves them to your item list — set each one's selling price before billing.",
    itemDiscountPh: "Discount % (optional)", billDiscountLabel: "Overall Bill Discount %",
    whatsappBtn: "Send via WhatsApp",
    whatsappHint: "Downloads the PDF and opens WhatsApp with a message — attach the downloaded PDF yourself (browsers can't auto-attach files).",
    subtotalLabel: "Subtotal", itemDiscountsLabel: "Item Discounts", billDiscountAmtLabel: "Bill Discount",
    taxableValueLabel: "Taxable Value", gstTotalLabel: "GST", grandTotalBillLabel: "Grand Total",
    totalProfitLabel: "Total Profit (this bill)",
    helpBotTitle: "🤖 Help Assistant", helpChatPh: "Ask a question...",
    autoFetchScanning: "Reading invoice...", autoFetchSuccess: (n) => `${n} item(s) added — please check qty/unit/GST`,
    autoFetchNoItems: "Couldn't find item amounts in this photo.", autoFetchFailed: "Couldn't read the photo. Try again.",
    qrUploaded: "QR code saved", needCustomerWhatsapp: "Add a WhatsApp number first.",
    whatsappOpening: "Opening WhatsApp...",
    businessTypeLabel: "Business Type", kiranaLabel: "Kirana Store", distributorLabel: "Distributor",
    browseGroceryLabel: "📋 Browse Common Grocery Items", browseGroceryHint: "Tap an item to fill its name & unit — just add your price.",
    grocerySearchPh: "Search: rice, dal, kitkat, lactogen...",
    tapToEditHint: "Tap an item's price to edit it.",
    tapToEdit: "Tap to edit price", priceUpdated: "Price updated",
    billReportsLabel: "📊 Previous Bills Report", billReportsHint: "Saved only in this browser after you generate a PDF/JPG.",
    stockEntryLabel: "📦 Stock Entry", stockReportLabel: "📊 Stock Report",
    stockEntryHint: "Only for PCS/Box/CS items. Search a saved item, add how many came in, and it's added to that item's running stock.",
    piecesPerBoxPh: "PCS per Box/CS", excelBtn: "Excel",
    stockPcsOnly: "Stock tracking is only for PCS/Box/CS items, not weight-based ones.",
    stockNowLabel: "now in stock:", noStockYet: "No stock entries yet.",
    totalStockValueLabel: "Total Stock Value",
    clearReports: "Clear All", noReportsYet: "No bills generated yet.",
    itemPriceUpdated: "Price updated", reportsCleared: "Reports cleared"
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
    voiceItemNotFound: "आपकी सेव्ड वस्तुओं में नहीं मिला — पहले उसे जोड़ें।",
    askQtyPcs: "कितने पीस चाहिए?", askQtyWeight: "कितना चाहिए — किलो या ग्राम?",
    voiceAddBtn: "बोलकर वस्तु जोड़ें",
    voiceAddHint: "ऐसे बोलें \"आटा 5 किलो\" या \"चना दाल 500 ग्राम\" — वस्तु पहले से ऊपर की सूची में सेव होनी चाहिए।",
    customerSearchPh: "रमेश कुमार", customerSavedHint: "सेव्ड ग्राहक का फ़ोन व पता अपने आप भर जाएगा — सेव्ड नाम टाइप करें।",
    speakCalc: "बोलें", speakAmountBtn: "राशि बोलें (हस्तलिखित बिल)",
    speakAmountHint: "बिल हस्तलिखित या धुंधला है? स्कैन छोड़ें और बस कुल राशि बोल दें।",
    amountAdded: (n) => `राशि जोड़ी गई: ${n}`,
    detectedItems: "बिल पर मिली राशियाँ",
    printedTotal: "बिल पर छपा कुल", estimatedTotal: "अनुमानित कुल (जोड़कर)",
    billScanned: "बिल स्कैन हुआ", themeToastPrefix: "थीम:", langToastPrefix: "भाषा:",
    calcErrorToast: "शून्य से भाग नहीं हो सकता",
    back: "वापस", historyCleared: "इतिहास साफ़ हुआ", billReset: "स्कैनर रीसेट हुआ",
    modeStandard: "सामान्य", modeEmi: "ईएमआई", modeGst: "जीएसटी", modeDiscount: "छूट",
    modeInterest: "ब्याज", modeSplit: "बिल बाँटें",
    calculate: "गणना करें", principalLabel: "ऋण राशि (₹)", rateLabel: "ब्याज दर (% प्रति वर्ष)",
    tenureLabel: "अवधि (महीने)", amountLabel: "राशि (₹)", gstRateLabel: "जीएसटी दर",
    addGstLabel: "जीएसटी जोड़ें", removeGstLabel: "जीएसटी हटाएँ", discountLabel: "छूट (%)",
    timeLabel: "समय (वर्ष)", simpleLabel: "साधारण", compoundLabel: "चक्रवृद्धि",
    peopleLabel: "लोगों की संख्या", tipLabel: "टिप (%)", fillFieldsError: "कृपया सभी फ़ील्ड सही संख्या से भरें",
    monthlyEmiLabel: "मासिक ईएमआई", totalInterestLabel: "कुल ब्याज", totalPaymentLabel: "कुल भुगतान",
    weeklyEmiLabel: "साप्ताहिक ईएमआई", tenureWeeksLabel: "अवधि (सप्ताह)",
    findRateLabel: "ब्याज दर", maturityValueLabel: "परिपक्वता राशि",
    gstAmountLabel: "जीएसटी राशि", totalWithGstLabel: "कुल राशि", originalAmountLabel: "मूल राशि",
    finalPriceLabel: "अंतिम कीमत", youSaveLabel: "आपकी बचत", interestEarnedLabel: "ब्याज",
    totalAmountLabel: "कुल राशि", perPersonLabel: "प्रति व्यक्ति", tipAmountLabel: "टिप राशि",
    grandTotalLabel: "कुल योग",
    modeBillMaker: "बिल बनाएं", customerNameLabel: "ग्राहक का नाम",
    customerPhoneLabel: "फ़ोन नंबर", customerAddressLabel: "पता",
    itemNameLabel: "वस्तु", generatePdfBtn: "PDF बिल बनाएं",
    billTotalLabel: "कुल", noItemsYet: "अभी कोई वस्तु नहीं जोड़ी गई।",
    fillItemError: "वस्तु का नाम और कीमत डालें।", itemAdded: "वस्तु जोड़ी गई",
    itemRemoved: "वस्तु हटाई गई", billCleared: "बिल साफ़ हुआ",
    clearBillBtn: "साफ़ करें", tapAgainToClear: "बिल साफ़ करने के लिए फिर टैप करें",
    pdfGenerating: "PDF बन रहा है...", pdfGenerated: "बिल PDF डाउनलोड हो गया",
    pdfFailed: "PDF नहीं बन सका। इंटरनेट जांचें।",
    addAtLeastOneItem: "पहले कम से कम एक वस्तु जोड़ें।",
    shopDetailsLabel: "🏪 दुकान का विवरण", shopDetailsHint: "यह सिर्फ़ आपके ब्राउज़र में सेव होता है — कहीं भेजा नहीं जाता।",
    shopNamePh: "दुकान का नाम", shopAddressPh: "दुकान का पता", shopMobilePh: "मोबाइल नंबर",
    invoiceNoLabel: "इनवॉइस नंबर", manageItemsLabel: "📦 सेव्ड वस्तुएँ प्रबंधित करें",
    catNamePh: "वस्तु का नाम", searchItemPh: "सेव्ड वस्तु खोजें या नई टाइप करें...",
    pdfBtn: "PDF", jpgBtn: "JPG",
    jpgGenerating: "इमेज बन रही है...", jpgGenerated: "बिल इमेज डाउनलोड हो गई",
    jpgFailed: "इमेज नहीं बन सकी। इंटरनेट जांचें।",
    catalogItemAdded: "वस्तु सूची में सेव हुई", catalogItemRemoved: "वस्तु सूची से हटाई गई",
    catalogEmpty: "अभी कोई सेव्ड वस्तु नहीं — ऊपर एक जोड़ें।",
    fillCatalogError: "वस्तु का नाम और दर डालें।",
    distNamePh: "डिस्ट्रीब्यूटर नाम (वैकल्पिक)", distContactPh: "डिस्ट्रीब्यूटर संपर्क",
    shopQrLabel: "दुकान QR कोड (UPI/पेमेंट)", customerWhatsappLabel: "WhatsApp नंबर (वैकल्पिक)",
    scanAndPayLabel: "स्कैन करें और भुगतान करें",
    catalogHint: "प्रीसेट मात्रा + कीमत, जैसे \"6 PCS = ₹280\" या \"1 Kg = ₹120\"। बिलिंग मात्रा इससे अपने आप कन्वर्ट होगी।",
    costPricePh: "खरीद मूल्य ₹ (वैकल्पिक)", sellPricePh: "विक्रय मूल्य ₹",
    mrpPh: "MRP ₹ (वैकल्पिक, छूट दिखाने के लिए)",
    marginPh: "मार्जिन % (कॉस्ट अपने आप)", marginHint: "अपना मार्जिन % पता है? कॉस्ट प्राइस खुद भर जाएगी: MRP ÷ (1 + मार्जिन/100)।",
    purchaseRateLabel: "खरीद दर", estimatedLabel: "अनुमानित",
    invoiceColumnsLabel: "⚙️ इनवॉइस कॉलम",
    invoiceColumnsHint: "PDF/JPG पर क्या दिखेगा चुनें। वस्तु का नाम और अंतिम राशि हमेशा दिखेंगे।",
    boughtAtLabel: "खरीदा", profitLabel: "मुनाफ़ा",
    autoFetchAddedToCatalog: (n) => `${n} वस्तुएँ सेव्ड आइटम में जोड़ी गईं — बिलिंग से पहले उनकी बिक्री कीमत सेट करें`,
    autoFetchPdfNotSupported: "PDF सीधे नहीं पढ़ी जा सकती — इनवॉइस का स्क्रीनशॉट या फोटो लें।",
    showMrpCol: "MRP दिखाएँ", showRateCol: "दर दिखाएँ", showDiscountCol: "छूट दिखाएँ", showGstCol: "GST दिखाएँ",
    autoFetchLabel: "📤 इनवॉइस फोटो से वस्तुएँ ऑटो-फेच करें",
    autoFetchHint: "फोटो से वस्तु के नाम और राशि (MRP के रूप में) पढ़ता है, और उन्हें आपकी वस्तु सूची में सेव करता है — बिलिंग से पहले हर एक की बिक्री कीमत सेट करें।",
    itemDiscountPh: "छूट % (वैकल्पिक)", billDiscountLabel: "कुल बिल छूट %",
    whatsappBtn: "WhatsApp से भेजें",
    whatsappHint: "PDF डाउनलोड होगा और WhatsApp खुलेगा — डाउनलोड की गई PDF खुद अटैच करें (ब्राउज़र फ़ाइल अपने आप अटैच नहीं कर सकते)।",
    subtotalLabel: "उप-योग", itemDiscountsLabel: "वस्तु छूट", billDiscountAmtLabel: "बिल छूट",
    taxableValueLabel: "कर योग्य राशि", gstTotalLabel: "जीएसटी", grandTotalBillLabel: "कुल योग",
    totalProfitLabel: "कुल मुनाफ़ा (इस बिल पर)",
    helpBotTitle: "🤖 सहायक", helpChatPh: "सवाल पूछें...",
    autoFetchScanning: "इनवॉइस पढ़ा जा रहा है...", autoFetchSuccess: (n) => `${n} वस्तुएँ जोड़ी गईं — मात्रा/यूनिट/GST जांच लें`,
    autoFetchNoItems: "इस फोटो में राशि नहीं मिली।", autoFetchFailed: "फोटो पढ़ी नहीं जा सकी। फिर कोशिश करें।",
    qrUploaded: "QR कोड सेव हुआ", needCustomerWhatsapp: "पहले WhatsApp नंबर डालें।",
    whatsappOpening: "WhatsApp खुल रहा है...",
    businessTypeLabel: "बिज़नेस टाइप", kiranaLabel: "किराना स्टोर", distributorLabel: "डिस्ट्रीब्यूटर",
    browseGroceryLabel: "📋 आम किराना वस्तुएँ देखें", browseGroceryHint: "वस्तु टैप करें — नाम और यूनिट अपने आप भर जाएगा, बस अपनी कीमत डालें।",
    grocerySearchPh: "खोजें: चावल, दाल, किटकैट, लैक्टोजन...",
    tapToEditHint: "कीमत बदलने के लिए वस्तु पर टैप करें।",
    tapToEdit: "कीमत बदलने के लिए टैप करें", priceUpdated: "कीमत अपडेट हुई",
    billReportsLabel: "📊 पिछले बिलों की रिपोर्ट", billReportsHint: "PDF/JPG बनाने के बाद यह सिर्फ़ इस ब्राउज़र में सेव होता है।",
    stockEntryLabel: "📦 स्टॉक एंट्री", stockReportLabel: "📊 स्टॉक रिपोर्ट",
    stockEntryHint: "सिर्फ़ PCS/Box/CS वस्तुओं के लिए। सेव्ड वस्तु खोजें, कितनी आई बताएं — उस वस्तु के कुल स्टॉक में जुड़ जाएगा।",
    piecesPerBoxPh: "PCS प्रति Box/CS", excelBtn: "Excel",
    stockPcsOnly: "स्टॉक ट्रैकिंग सिर्फ़ PCS/Box/CS वस्तुओं के लिए है, वज़न वाली वस्तुओं के लिए नहीं।",
    stockNowLabel: "अब स्टॉक में:", noStockYet: "अभी कोई स्टॉक एंट्री नहीं।",
    totalStockValueLabel: "कुल स्टॉक मूल्य",
    clearReports: "सभी साफ़ करें", noReportsYet: "अभी कोई बिल नहीं बना।",
    itemPriceUpdated: "कीमत अपडेट हुई", reportsCleared: "रिपोर्ट साफ़ हुई"
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
    voiceItemNotFound: "আপনার সেভ করা পণ্যে পাওয়া যায়নি — আগে যোগ করুন।",
    askQtyPcs: "কয়টি পিস চাই?", askQtyWeight: "কতটা চাই — কেজি না গ্রাম?",
    voiceAddBtn: "বলে পণ্য যোগ করুন",
    voiceAddHint: "এভাবে বলুন \"আটা ৫ কেজি\" বা \"ছোলার ডাল ৫০০ গ্রাম\" — পণ্যটি আগে থেকেই উপরের তালিকায় সেভ থাকতে হবে।",
    customerSearchPh: "রমেশ কুমার", customerSavedHint: "সেভ করা গ্রাহকের ফোন ও ঠিকানা স্বয়ংক্রিয়ভাবে ভরবে — সেভ করা নাম টাইপ করুন।",
    speakCalc: "বলুন", speakAmountBtn: "পরিমাণ বলুন (হাতে লেখা বিল)",
    speakAmountHint: "বিল হাতে লেখা বা অস্পষ্ট? স্ক্যান বাদ দিয়ে শুধু মোট পরিমাণ বলুন।",
    amountAdded: (n) => `পরিমাণ যোগ হয়েছে: ${n}`,
    detectedItems: "বিলে পাওয়া পরিমাণ",
    printedTotal: "বিলে ছাপা মোট", estimatedTotal: "আনুমানিক মোট (যোগ করে)",
    billScanned: "বিল স্ক্যান হয়েছে", themeToastPrefix: "থিম:", langToastPrefix: "ভাষা:",
    calcErrorToast: "শূন্য দিয়ে ভাগ করা যায় না",
    back: "ফিরুন", historyCleared: "ইতিহাস মুছে ফেলা হয়েছে", billReset: "স্ক্যানার রিসেট হয়েছে",
    modeStandard: "সাধারণ", modeEmi: "ইএমআই", modeGst: "জিএসটি", modeDiscount: "ছাড়",
    modeInterest: "সুদ", modeSplit: "বিল ভাগ",
    calculate: "গণনা করুন", principalLabel: "ঋণের পরিমাণ (₹)", rateLabel: "সুদের হার (% বার্ষিক)",
    tenureLabel: "মেয়াদ (মাস)", amountLabel: "পরিমাণ (₹)", gstRateLabel: "জিএসটি হার",
    addGstLabel: "জিএসটি যোগ করুন", removeGstLabel: "জিএসটি বাদ দিন", discountLabel: "ছাড় (%)",
    timeLabel: "সময় (বছর)", simpleLabel: "সাধারণ", compoundLabel: "চক্রবৃদ্ধি",
    peopleLabel: "মানুষের সংখ্যা", tipLabel: "টিপ (%)", fillFieldsError: "অনুগ্রহ করে সঠিক সংখ্যা দিন",
    monthlyEmiLabel: "মাসিক ইএমআই", totalInterestLabel: "মোট সুদ", totalPaymentLabel: "মোট পরিশোধ",
    weeklyEmiLabel: "সাপ্তাহিক ইএমআই", tenureWeeksLabel: "মেয়াদ (সপ্তাহ)",
    findRateLabel: "সুদের হার", maturityValueLabel: "পরিপক্কতা মূল্য",
    gstAmountLabel: "জিএসটি পরিমাণ", totalWithGstLabel: "মোট পরিমাণ", originalAmountLabel: "মূল পরিমাণ",
    finalPriceLabel: "চূড়ান্ত মূল্য", youSaveLabel: "আপনার সাশ্রয়", interestEarnedLabel: "সুদ",
    totalAmountLabel: "মোট পরিমাণ", perPersonLabel: "জনপ্রতি", tipAmountLabel: "টিপের পরিমাণ",
    grandTotalLabel: "সর্বমোট",
    modeBillMaker: "বিল তৈরি", customerNameLabel: "গ্রাহকের নাম",
    customerPhoneLabel: "ফোন নম্বর", customerAddressLabel: "ঠিকানা",
    itemNameLabel: "পণ্য", generatePdfBtn: "PDF বিল তৈরি করুন",
    billTotalLabel: "মোট", noItemsYet: "এখনো কোনো পণ্য যোগ হয়নি।",
    fillItemError: "পণ্যের নাম ও দাম দিন।", itemAdded: "পণ্য যোগ হয়েছে",
    itemRemoved: "পণ্য মুছে ফেলা হয়েছে", billCleared: "বিল মুছে ফেলা হয়েছে",
    clearBillBtn: "মুছুন", tapAgainToClear: "বিল মুছতে আবার ট্যাপ করুন",
    pdfGenerating: "PDF তৈরি হচ্ছে...", pdfGenerated: "বিল PDF ডাউনলোড হয়েছে",
    pdfFailed: "PDF তৈরি করা যায়নি। ইন্টারনেট পরীক্ষা করুন।",
    addAtLeastOneItem: "প্রথমে অন্তত একটি পণ্য যোগ করুন।",
    shopDetailsLabel: "🏪 দোকানের বিবরণ", shopDetailsHint: "শুধু আপনার ব্রাউজারে সেভ থাকে — কোথাও পাঠানো হয় না।",
    shopNamePh: "দোকানের নাম", shopAddressPh: "দোকানের ঠিকানা", shopMobilePh: "মোবাইল নম্বর",
    invoiceNoLabel: "ইনভয়েস নম্বর", manageItemsLabel: "📦 সেভ করা পণ্য পরিচালনা",
    catNamePh: "পণ্যের নাম", searchItemPh: "সেভ করা পণ্য খুঁজুন বা নতুন লিখুন...",
    pdfBtn: "PDF", jpgBtn: "JPG",
    jpgGenerating: "ছবি তৈরি হচ্ছে...", jpgGenerated: "বিলের ছবি ডাউনলোড হয়েছে",
    jpgFailed: "ছবি তৈরি করা যায়নি। ইন্টারনেট পরীক্ষা করুন।",
    catalogItemAdded: "পণ্য তালিকায় সেভ হয়েছে", catalogItemRemoved: "পণ্য তালিকা থেকে সরানো হয়েছে",
    catalogEmpty: "এখনো কোনো সেভ করা পণ্য নেই — উপরে একটি যোগ করুন।",
    fillCatalogError: "পণ্যের নাম ও দাম দিন।",
    distNamePh: "ডিস্ট্রিবিউটর নাম (ঐচ্ছিক)", distContactPh: "ডিস্ট্রিবিউটর যোগাযোগ",
    shopQrLabel: "দোকানের QR কোড (UPI/পেমেন্ট)", customerWhatsappLabel: "WhatsApp নম্বর (ঐচ্ছিক)",
    scanAndPayLabel: "স্ক্যান করুন ও পে করুন",
    catalogHint: "প্রিসেট পরিমাণ + দাম, যেমন \"6 PCS = ₹280\" বা \"1 Kg = ₹120\"। বিলিং পরিমাণ থেকে স্বয়ংক্রিয়ভাবে রূপান্তরিত হবে।",
    costPricePh: "ক্রয় মূল্য ₹ (ঐচ্ছিক)", sellPricePh: "বিক্রয় মূল্য ₹",
    mrpPh: "MRP ₹ (ঐচ্ছিক, ছাড় দেখানোর জন্য)",
    marginPh: "মার্জিন % (কস্ট স্বয়ংক্রিয়)", marginHint: "আপনার মার্জিন % জানেন? কস্ট প্রাইস নিজে থেকেই ভরবে: MRP ÷ (1 + মার্জিন/100)।",
    purchaseRateLabel: "ক্রয় মূল্য", estimatedLabel: "আনুমানিক",
    invoiceColumnsLabel: "⚙️ ইনভয়েস কলাম",
    invoiceColumnsHint: "PDF/JPG-এ কী দেখাবে বেছে নিন। পণ্যের নাম ও চূড়ান্ত পরিমাণ সবসময় দেখাবে।",
    boughtAtLabel: "কেনা দাম", profitLabel: "লাভ",
    autoFetchAddedToCatalog: (n) => `${n}টি পণ্য সেভ করা আইটেমে যোগ হয়েছে — বিলিং করার আগে বিক্রয় মূল্য সেট করুন`,
    autoFetchPdfNotSupported: "PDF সরাসরি পড়া যায় না — ইনভয়েসের স্ক্রিনশট বা ছবি নিন।",
    showMrpCol: "MRP দেখান", showRateCol: "রেট দেখান", showDiscountCol: "ছাড় দেখান", showGstCol: "GST দেখান",
    autoFetchLabel: "📤 ইনভয়েস ছবি থেকে পণ্য অটো-ফেচ করুন",
    autoFetchHint: "ছবি থেকে পণ্যের নাম ও পরিমাণ (MRP হিসেবে) পড়ে, এবং আপনার পণ্য তালিকায় সেভ করে — বিলিং করার আগে প্রতিটির বিক্রয় মূল্য সেট করুন।",
    itemDiscountPh: "ছাড় % (ঐচ্ছিক)", billDiscountLabel: "মোট বিল ছাড় %",
    whatsappBtn: "WhatsApp দিয়ে পাঠান",
    whatsappHint: "PDF ডাউনলোড হবে এবং WhatsApp খুলবে — ডাউনলোড করা PDF নিজে সংযুক্ত করুন (ব্রাউজার স্বয়ংক্রিয়ভাবে ফাইল সংযুক্ত করতে পারে না)।",
    subtotalLabel: "উপ-মোট", itemDiscountsLabel: "পণ্য ছাড়", billDiscountAmtLabel: "বিল ছাড়",
    taxableValueLabel: "করযোগ্য মূল্য", gstTotalLabel: "জিএসটি", grandTotalBillLabel: "সর্বমোট",
    totalProfitLabel: "মোট লাভ (এই বিলে)",
    helpBotTitle: "🤖 সহায়ক", helpChatPh: "প্রশ্ন জিজ্ঞাসা করুন...",
    autoFetchScanning: "ইনভয়েস পড়া হচ্ছে...", autoFetchSuccess: (n) => `${n}টি পণ্য যোগ হয়েছে — পরিমাণ/ইউনিট/GST যাচাই করুন`,
    autoFetchNoItems: "এই ছবিতে কোনো পরিমাণ পাওয়া যায়নি।", autoFetchFailed: "ছবি পড়া যায়নি। আবার চেষ্টা করুন।",
    qrUploaded: "QR কোড সেভ হয়েছে", needCustomerWhatsapp: "প্রথমে WhatsApp নম্বর দিন।",
    whatsappOpening: "WhatsApp খুলছে...",
    billReportsLabel: "📊 আগের বিলের রিপোর্ট", billReportsHint: "PDF/JPG তৈরি করার পর এটি শুধু এই ব্রাউজারে সেভ থাকে।",
    stockEntryLabel: "📦 স্টক এন্ট্রি", stockReportLabel: "📊 স্টক রিপোর্ট",
    stockEntryHint: "শুধু PCS/Box/CS পণ্যের জন্য। সেভ করা পণ্য খুঁজুন, কতগুলো এসেছে দিন — সেই পণ্যের মোট স্টকে যোগ হয়ে যাবে।",
    piecesPerBoxPh: "PCS প্রতি Box/CS", excelBtn: "Excel",
    stockPcsOnly: "স্টক ট্র্যাকিং শুধু PCS/Box/CS পণ্যের জন্য, ওজন-ভিত্তিক পণ্যের জন্য নয়।",
    stockNowLabel: "এখন স্টকে:", noStockYet: "এখনো কোনো স্টক এন্ট্রি নেই।",
    totalStockValueLabel: "মোট স্টক মূল্য",
    clearReports: "সব মুছুন", noReportsYet: "এখনো কোনো বিল তৈরি হয়নি।", reportsCleared: "রিপোর্ট মুছে ফেলা হয়েছে",
    businessTypeLabel: "ব্যবসার ধরন", kiranaLabel: "মুদি দোকান", distributorLabel: "ডিস্ট্রিবিউটর",
    browseGroceryLabel: "📋 সাধারণ মুদি পণ্য দেখুন", browseGroceryHint: "নাম ও ইউনিট ভরতে একটি পণ্যে ট্যাপ করুন — শুধু দাম যোগ করুন।",
    grocerySearchPh: "খুঁজুন: চাল, ডাল, কিটক্যাট, ল্যাকটোজেন...",
    tapToEditHint: "দাম পরিবর্তন করতে পণ্যে ট্যাপ করুন।", tapToEdit: "দাম বদলাতে ট্যাপ করুন",
    priceUpdated: "দাম আপডেট হয়েছে", itemPriceUpdated: "দাম আপডেট হয়েছে"
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
function speak(text, langCode, onEnd) {
  if (!voiceOn || !("speechSynthesis" in window)) {
    if (onEnd) onEnd(); // voice is off — don't make the caller wait on speech that will never happen
    return;
  }
  try {
    // Cancel anything still queued/speaking first. Without this, rapid
    // typing queues one utterance per keypress and the voice keeps
    // "catching up" long after you've stopped — this keeps it snappy and
    // always on the latest thing you did instead of falling behind.
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = langCode || I18N[currentLang].speech;
    utter.rate = 1.15;
    if (onEnd) {
      utter.onend = onEnd;
      utter.onerror = onEnd; // still proceed even if TTS itself fails
    }
    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.warn("Voice error:", err);
    if (onEnd) onEnd();
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
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.dataset.i18nPh;
    if (I18N[currentLang][key]) el.placeholder = I18N[currentLang][key];
  });
  renderHistory();
  if (typeof renderBmItems === "function") renderBmItems();
  if (typeof renderBmCatalog === "function") renderBmCatalog();
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
  // Ask for several candidate transcripts, not just one — in a noisy shop
  // the top guess is often wrong, but a lower-ranked alternative is
  // frequently the actual word. Callers that care about accuracy (like
  // catalog item matching) should try each alternative, not just [0].
  recognition.maxAlternatives = 5;
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

  recognition.onresult = (event) => {
    const alternatives = Array.from(event.results[0]).map(r => r.transcript);
    // Try every alternative the engine offered and use the first one that
    // actually parses into a valid expression — the top guess is often
    // wrong in a noisy room, a lower-ranked one frequently isn't.
    let parsed = null, hadEquals = false;
    for (const transcript of alternatives) {
      const p = parseSpokenMath(transcript);
      if (p) { parsed = p; hadEquals = /equals?|बराबर|সমান/i.test(transcript); break; }
    }
    if (parsed) {
      pushUndo();
      expression = parsed;
      justEvaluated = false;
      updateDisplay();
      if (hadEquals) compute();
    } else {
      speak(I18N[currentLang].didntCatch, I18N[currentLang].speech);
      showToast(I18N[currentLang].didntCatch, "error");
    }
  };
  recognition.onerror = (event) => {
    const msg = event.error === "no-speech" ? I18N[currentLang].listening : I18N[currentLang].didntCatch;
    speak(msg, I18N[currentLang].speech);
    showToast(I18N[currentLang].didntCatch, "error");
  };
  recognition.onend = () => voiceInputBtn.classList.remove("listening");

  // Start listening exactly when the "listening..." prompt finishes
  // speaking, not on a guess-and-wait timer — avoids the mic picking up
  // the tail end of our own announcement.
  speak(I18N[currentLang].listening, I18N[currentLang].speech, () => {
    voiceInputBtn.classList.add("listening");
    try { recognition.start(); } catch (e) { voiceInputBtn.classList.remove("listening"); }
  });
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

// --- Distributor/wholesale tax invoice parser ---
// These invoices have a fixed, predictable row shape:
//   S.No  Product Name ...case-pack-size...  HSN Code  MNF B.Code  MRP  CS  EA  S.Rate ...
// e.g. "11 LACTOGEN PRO1 BIB 24x400g  1901 10 90  61350453K1  450  0  12  393.18 ..."
// The HSN code (a distinctive "dddd dd dd" pattern) is a reliable anchor:
// everything before it is the product name, everything right after it is
// the MNF code followed by MRP/CS/EA as three numbers in that fixed order.
// The case-pack size (the "24" in "24x400g") tells us how many individual
// pieces one CS (case/carton) actually is, since that varies per product.
const HSN_ANCHOR_PATTERN = /(\d{4}\s?\d{2}\s?\d{2})/;

function parseDistributorInvoiceTable(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const items = [];

  lines.forEach(line => {
    const hsnMatch = line.match(HSN_ANCHOR_PATTERN);
    if (!hsnMatch) return; // not a product row (header/footer/total line)

    const beforeHsn = line.slice(0, hsnMatch.index).trim();
    const afterHsn = line.slice(hsnMatch.index + hsnMatch[0].length).trim();

    // Strip the leading serial number ("11 LACTOGEN..." -> "LACTOGEN...")
    const nameMatch = beforeHsn.match(/^\d{1,3}\s+(.+)$/);
    const productName = (nameMatch ? nameMatch[1] : beforeHsn).trim();
    if (!productName) return;

    // After the HSN code: MNF B.Code (alphanumeric, contains a letter),
    // then MRP, CS, EA as the next three numbers.
    const afterTokens = afterHsn.split(/\s+/).filter(Boolean);
    let idx = 0;
    if (afterTokens[0] && /[A-Za-z]/.test(afterTokens[0])) idx = 1;

    const mrp = parseFloat(afterTokens[idx]);
    const cs = parseInt(afterTokens[idx + 1], 10);
    const ea = parseInt(afterTokens[idx + 2], 10);
    if (isNaN(mrp) || mrp <= 0) return;

    // Case-pack size from the product name itself, e.g. "24x400g" -> 24,
    // "24(30x19g)" -> 24 (outer case count, not the inner multipack size).
    const caseSizeMatch = productName.match(/(\d+)\s*[x×(]/);
    const piecesPerCase = caseSizeMatch ? parseInt(caseSizeMatch[1], 10) : null;

    let qty = 1;
    if (!isNaN(cs) && cs > 0 && piecesPerCase) {
      qty = cs * piecesPerCase;
    } else if (!isNaN(ea) && ea > 0) {
      qty = ea;
    } else if (!isNaN(cs) && cs > 0) {
      qty = cs;
    }

    items.push({ name: productName, mrp, qty });
  });

  return items;
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
// Loads the OCR engine only when the person actually scans a bill, instead
// of on every page load — this is what was making the whole app feel slow.
let tesseractLoadPromise = null;
function loadTesseractLib() {
  if (window.Tesseract) return Promise.resolve();
  if (tesseractLoadPromise) return tesseractLoadPromise;
  tesseractLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.4/tesseract.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load OCR engine"));
    document.body.appendChild(script);
  });
  return tesseractLoadPromise;
}

// Local/adaptive thresholding instead of one global cutoff. A single global
// threshold fails badly on real phone photos because lighting is uneven —
// one corner of the page is brighter than the other (shadows, hand
// covering the light, etc). Splitting the image into small blocks and
// thresholding each block against its own local brightness handles that
// far better and is the single biggest accuracy win for handwritten notes.
function adaptiveThreshold(gray, width, height, blockSize = 24, bias = 12) {
  const out = new Uint8ClampedArray(width * height);
  const blocksX = Math.ceil(width / blockSize);
  const blocksY = Math.ceil(height / blockSize);
  const blockMeans = new Float32Array(blocksX * blocksY);

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      let sum = 0, count = 0;
      const x0 = bx * blockSize, y0 = by * blockSize;
      const x1 = Math.min(x0 + blockSize, width), y1 = Math.min(y0 + blockSize, height);
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          sum += gray[y * width + x];
          count++;
        }
      }
      blockMeans[by * blocksX + bx] = count ? sum / count : 255;
    }
  }

  for (let y = 0; y < height; y++) {
    const by = Math.min(Math.floor(y / blockSize), blocksY - 1);
    for (let x = 0; x < width; x++) {
      const bx = Math.min(Math.floor(x / blockSize), blocksX - 1);
      const localMean = blockMeans[by * blocksX + bx];
      out[y * width + x] = gray[y * width + x] < (localMean - bias) ? 0 : 255;
    }
  }
  return out;
}

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

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }

      const bw = adaptiveThreshold(gray, canvas.width, canvas.height);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const v = bw[j];
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

async function runBillOCR(canvas) {
  const worker = await Tesseract.createWorker("eng");
  try {
    // Try a couple of page-segmentation modes and keep whichever actually
    // finds usable numbers — handwriting layouts vary too much for one
    // fixed mode to always win.
    const psmCandidates = ["4", "6"]; // 4: list of lines, 6: uniform block
    let best = { text: "", score: -1 };

    for (const psm of psmCandidates) {
      await worker.setParameters({ tessedit_pageseg_mode: psm });
      const { data } = await worker.recognize(canvas);
      const text = data.text || "";
      const score = (text.match(/\d+/g) || []).length;
      if (score > best.score) best = { text, score };
      if (best.score >= 4) break; // good enough, stop early to stay fast
    }
    return { text: best.text };
  } finally {
    await worker.terminate();
  }
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
    scanStatus.textContent = currentLangText("scanning");
    await loadTesseractLib();
    const cleanedCanvas = await preprocessBillImage(file);
    const ocrData = await runBillOCR(cleanedCanvas);
    const analysis = analyzeBillText(ocrData.text || "");

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

// ---------- Calculator Mode Switcher ----------
const modeChips = document.querySelectorAll(".mode-chip");
const modePanels = document.querySelectorAll(".mode-panel");
const billScannerSection = document.getElementById("billScannerSection");

function switchMode(mode) {
  modeChips.forEach(chip => chip.classList.toggle("active", chip.dataset.mode === mode));
  modePanels.forEach(panel => panel.classList.toggle("active", panel.id === `${mode}Mode`));
  // Bill scanner only makes sense for everyday shopping totals, so keep it
  // attached to standard mode rather than cluttering finance tools.
  billScannerSection.style.display = mode === "standard" ? "block" : "none";
  localStorage.setItem("calc_last_mode", mode);
}

modeChips.forEach(chip => {
  chip.addEventListener("click", () => switchMode(chip.dataset.mode));
});

function fmtMoney(n) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderFinanceResult(el, rows) {
  el.innerHTML = rows.map(r => {
    const variantClass = r.variant ? ` ${r.variant}` : "";
    return `<div class="result-row${r.highlight ? " highlight" : ""}${variantClass}"><span>${r.label}</span><span>${r.value}</span></div>`;
  }).join("");
}

function showInsight(el, text) {
  el.textContent = `🤖 ${text}`;
  el.classList.add("show");
}

function validNumber(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// --- EMI / Loan Calculator ---
const emiPrincipal = document.getElementById("emiPrincipal");
const emiRate = document.getElementById("emiRate");
const emiTenure = document.getElementById("emiTenure");
const emiTenureLabel = document.getElementById("emiTenureLabel");
const emiMonthlyBtn = document.getElementById("emiMonthlyBtn");
const emiWeeklyBtn = document.getElementById("emiWeeklyBtn");
const emiResult = document.getElementById("emiResult");
const emiInsight = document.getElementById("emiInsight");
let emiFrequency = "monthly"; // "monthly" or "weekly"

emiMonthlyBtn.addEventListener("click", () => {
  emiFrequency = "monthly";
  emiMonthlyBtn.classList.add("active");
  emiWeeklyBtn.classList.remove("active");
  emiTenureLabel.textContent = currentLangText("tenureLabel");
});
emiWeeklyBtn.addEventListener("click", () => {
  emiFrequency = "weekly";
  emiWeeklyBtn.classList.add("active");
  emiMonthlyBtn.classList.remove("active");
  emiTenureLabel.textContent = currentLangText("tenureWeeksLabel");
});

document.getElementById("emiCalcBtn").addEventListener("click", () => {
  const P = validNumber(emiPrincipal.value);
  const annualRate = validNumber(emiRate.value);
  const n = validNumber(emiTenure.value);
  if (P === null || annualRate === null || n === null || P <= 0 || n <= 0) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }
  const periodsPerYear = emiFrequency === "weekly" ? 52 : 12;
  const r = annualRate / periodsPerYear / 100;
  const installment = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = installment * n;
  const totalInterest = totalPayment - P;
  const installmentLabel = emiFrequency === "weekly" ? currentLangText("weeklyEmiLabel") : currentLangText("monthlyEmiLabel");

  renderFinanceResult(emiResult, [
    { label: installmentLabel, value: fmtMoney(installment), highlight: true },
    { label: currentLangText("totalInterestLabel"), value: fmtMoney(totalInterest) },
    { label: currentLangText("totalPaymentLabel"), value: fmtMoney(totalPayment) }
  ]);

  const interestShare = (totalInterest / totalPayment) * 100;
  const periodWord = emiFrequency === "weekly" ? "weeks" : "months";
  showInsight(emiInsight,
    interestShare > 40
      ? `Interest makes up ${interestShare.toFixed(0)}% of your total payment — a shorter tenure would cut that down a lot.`
      : `You'll pay ${interestShare.toFixed(0)}% extra as interest over ${n} ${periodWord} — that's a reasonably efficient loan.`
  );
  speak(`${installmentLabel} ${installment.toFixed(0)} rupees`, I18N[currentLang].speech);
});

// --- GST Calculator ---
const gstAmountInput = document.getElementById("gstAmount");
const gstRateSelect = document.getElementById("gstRate");
const gstAddBtn = document.getElementById("gstAddBtn");
const gstRemoveBtn = document.getElementById("gstRemoveBtn");
const gstResult = document.getElementById("gstResult");
const gstInsight = document.getElementById("gstInsight");
let gstMode = "add";

gstAddBtn.addEventListener("click", () => {
  gstMode = "add";
  gstAddBtn.classList.add("active");
  gstRemoveBtn.classList.remove("active");
});
gstRemoveBtn.addEventListener("click", () => {
  gstMode = "remove";
  gstRemoveBtn.classList.add("active");
  gstAddBtn.classList.remove("active");
});

document.getElementById("gstCalcBtn").addEventListener("click", () => {
  const amount = validNumber(gstAmountInput.value);
  const rate = parseFloat(gstRateSelect.value);
  if (amount === null || amount <= 0) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }
  let base, gstAmt, total;
  if (gstMode === "add") {
    base = amount;
    gstAmt = amount * (rate / 100);
    total = base + gstAmt;
  } else {
    total = amount;
    base = amount / (1 + rate / 100);
    gstAmt = total - base;
  }

  renderFinanceResult(gstResult, [
    { label: "Base Amount", value: fmtMoney(base) },
    { label: `GST (${rate}%)`, value: fmtMoney(gstAmt) },
    { label: "Total", value: fmtMoney(total), highlight: true }
  ]);
  showInsight(gstInsight, `At ${rate}% GST, tax adds ${fmtMoney(gstAmt)} on a base of ${fmtMoney(base)}.`);
  speak(`Total ${total.toFixed(0)} rupees including GST`, I18N[currentLang].speech);
});

// --- Discount Calculator ---
const discPrice = document.getElementById("discPrice");
const discPercent = document.getElementById("discPercent");
const discResult = document.getElementById("discResult");
const discInsight = document.getElementById("discInsight");

document.getElementById("discCalcBtn").addEventListener("click", () => {
  const price = validNumber(discPrice.value);
  const pct = validNumber(discPercent.value);
  if (price === null || pct === null || price <= 0 || pct < 0) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }
  const discountAmt = price * (pct / 100);
  const finalPrice = price - discountAmt;

  renderFinanceResult(discResult, [
    { label: "You Save", value: fmtMoney(discountAmt) },
    { label: "Final Price", value: fmtMoney(finalPrice), highlight: true }
  ]);
  showInsight(discInsight,
    pct >= 40
      ? `${pct}% off is a strong discount — worth grabbing if you actually need the item.`
      : `You're saving ${fmtMoney(discountAmt)}, about ${pct}% off the original price.`
  );
  speak(`Final price ${finalPrice.toFixed(0)} rupees`, I18N[currentLang].speech);
});

// --- Simple / Compound Interest Calculator ---
const siPrincipal = document.getElementById("siPrincipal");
const siRate = document.getElementById("siRate");
const siRateLabel = document.getElementById("siRateLabel");
const siTotalAmount = document.getElementById("siTotalAmount");
const siTime = document.getElementById("siTime");
const siSimpleBtn = document.getElementById("siSimpleBtn");
const siCompoundBtn = document.getElementById("siCompoundBtn");
const siFindTotalBtn = document.getElementById("siFindTotalBtn");
const siFindRateBtn = document.getElementById("siFindRateBtn");
const siResult = document.getElementById("siResult");
const siInsight = document.getElementById("siInsight");
let siMode = "simple";
let siDirection = "findTotal"; // "findTotal" (P+rate+t -> total) or "findRate" (P+total+t -> rate)

siSimpleBtn.addEventListener("click", () => {
  siMode = "simple";
  siSimpleBtn.classList.add("active");
  siCompoundBtn.classList.remove("active");
});
siCompoundBtn.addEventListener("click", () => {
  siMode = "compound";
  siCompoundBtn.classList.add("active");
  siSimpleBtn.classList.remove("active");
});

siFindTotalBtn.addEventListener("click", () => {
  siDirection = "findTotal";
  siFindTotalBtn.classList.add("active");
  siFindRateBtn.classList.remove("active");
  siRateLabel.style.display = "";
  siRate.style.display = "";
  siTotalAmount.style.display = "none";
});
siFindRateBtn.addEventListener("click", () => {
  siDirection = "findRate";
  siFindRateBtn.classList.add("active");
  siFindTotalBtn.classList.remove("active");
  siRateLabel.style.display = "none";
  siRate.style.display = "none";
  siTotalAmount.style.display = "";
});

document.getElementById("siCalcBtn").addEventListener("click", () => {
  const P = validNumber(siPrincipal.value);
  const t = validNumber(siTime.value);
  if (P === null || t === null || P <= 0 || t <= 0) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }

  if (siDirection === "findRate") {
    // Reverse calculation: given how much was actually paid back in total,
    // work out what interest rate that implies — handy when you know the
    // loan amount and the final payoff figure but not the quoted rate.
    const total = validNumber(siTotalAmount.value);
    if (total === null || total <= P) {
      showToast(currentLangText("fillFieldsError"), "error");
      return;
    }
    const interest = total - P;
    let rate;
    if (siMode === "simple") {
      rate = (interest / P / t) * 100;
    } else {
      rate = (Math.pow(total / P, 1 / t) - 1) * 100;
    }
    renderFinanceResult(siResult, [
      { label: currentLangText("interestEarnedLabel"), value: fmtMoney(interest) },
      { label: currentLangText("findRateLabel"), value: `${rate.toFixed(2)}%`, highlight: true }
    ]);
    showInsight(siInsight,
      `On ${fmtMoney(P)} growing to ${fmtMoney(total)} over ${t} years, that works out to about ${rate.toFixed(2)}% ${siMode} interest per year.`
    );
    speak(`Interest rate ${rate.toFixed(1)} percent`, I18N[currentLang].speech);
    return;
  }

  const rate = validNumber(siRate.value);
  if (rate === null) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }
  let interest, total;
  if (siMode === "simple") {
    interest = (P * rate * t) / 100;
    total = P + interest;
  } else {
    total = P * Math.pow(1 + rate / 100, t);
    interest = total - P;
  }

  renderFinanceResult(siResult, [
    { label: currentLangText("interestEarnedLabel"), value: fmtMoney(interest) },
    { label: currentLangText("maturityValueLabel"), value: fmtMoney(total), highlight: true }
  ]);
  const gain = ((total - P) / P) * 100;
  showInsight(siInsight,
    siMode === "compound"
      ? `Compounding grows your money by ${gain.toFixed(1)}% over ${t} years — faster than simple interest would.`
      : `Simple interest grows your money by ${gain.toFixed(1)}% over ${t} years, at a steady, predictable rate.`
  );
  speak(`Maturity value ${total.toFixed(0)} rupees`, I18N[currentLang].speech);
});

// --- Split Bill Calculator ---
const splitAmount = document.getElementById("splitAmount");
const splitPeople = document.getElementById("splitPeople");
const splitTip = document.getElementById("splitTip");
const splitResult = document.getElementById("splitResult");
const splitInsight = document.getElementById("splitInsight");

document.getElementById("splitCalcBtn").addEventListener("click", () => {
  const amount = validNumber(splitAmount.value);
  const people = validNumber(splitPeople.value);
  const tipPct = validNumber(splitTip.value) || 0;
  if (amount === null || people === null || amount <= 0 || people <= 0) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }
  const tipAmt = amount * (tipPct / 100);
  const total = amount + tipAmt;
  const perPerson = total / people;

  renderFinanceResult(splitResult, [
    { label: "Tip Amount", value: fmtMoney(tipAmt) },
    { label: "Total with Tip", value: fmtMoney(total) },
    { label: "Per Person", value: fmtMoney(perPerson), highlight: true }
  ]);
  showInsight(splitInsight, `Each of the ${people} people owes ${fmtMoney(perPerson)}, including a ${tipPct}% tip.`);
  speak(`Each person pays ${perPerson.toFixed(0)} rupees`, I18N[currentLang].speech);
});

// ---------- Bill Maker (grocery-style bill builder + PDF/JPG export) ----------
const bmCustomerName = document.getElementById("bmCustomerName");
const bmCustomerPhone = document.getElementById("bmCustomerPhone");
const bmCustomerWhatsapp = document.getElementById("bmCustomerWhatsapp");
const bmCustomerAddress = document.getElementById("bmCustomerAddress");
const bmCustomerDatalist = document.getElementById("bmCustomerDatalist");
const bmVoiceAddBtn = document.getElementById("bmVoiceAddBtn");
const bmVoiceAddStatus = document.getElementById("bmVoiceAddStatus");
const bmItemName = document.getElementById("bmItemName");
const bmItemQty = document.getElementById("bmItemQty");
const bmItemPrice = document.getElementById("bmItemPrice");
const bmItemGst = document.getElementById("bmItemGst");
const bmItemDiscount = document.getElementById("bmItemDiscount");
const bmBillDiscount = document.getElementById("bmBillDiscount");
const bmAddItemBtn = document.getElementById("bmAddItemBtn");
const bmItemList = document.getElementById("bmItemList");
const bmTotal = document.getElementById("bmTotal");
const bmLiveAmount = document.getElementById("bmLiveAmount");
const bmGeneratePdfBtn = document.getElementById("bmGeneratePdfBtn");
const bmGenerateJpgBtn = document.getElementById("bmGenerateJpgBtn");
const bmClearBtn = document.getElementById("bmClearBtn");
const bmColumnsToggle = document.getElementById("bmColumnsToggle");
const bmColumnsPanel = document.getElementById("bmColumnsPanel");
const bmColMrp = document.getElementById("bmColMrp");
const bmColRate = document.getElementById("bmColRate");
const bmColDiscount = document.getElementById("bmColDiscount");
const bmColGst = document.getElementById("bmColGst");
const bmItemMrp = document.getElementById("bmItemMrp");
const bmWhatsappBtn = document.getElementById("bmWhatsappBtn");

const bmShopToggle = document.getElementById("bmShopToggle");
const bmShopPanel = document.getElementById("bmShopPanel");
const bmTypeKirana = document.getElementById("bmTypeKirana");
const bmTypeDistributor = document.getElementById("bmTypeDistributor");
const bmDistFields = document.getElementById("bmDistFields");
const bmShopName = document.getElementById("bmShopName");
const bmShopAddress = document.getElementById("bmShopAddress");
const bmShopPan = document.getElementById("bmShopPan");
const bmShopGst = document.getElementById("bmShopGst");
const bmShopMobile = document.getElementById("bmShopMobile");
const bmDistName = document.getElementById("bmDistName");
const bmDistContact = document.getElementById("bmDistContact");
const bmShopQrInput = document.getElementById("bmShopQrInput");
const bmShopQrPreview = document.getElementById("bmShopQrPreview");
const bmInvoiceNo = document.getElementById("bmInvoiceNo");

const bmCatalogToggle = document.getElementById("bmCatalogToggle");
const bmCatalogPanel = document.getElementById("bmCatalogPanel");
const bmCatName = document.getElementById("bmCatName");
const bmCatQty = document.getElementById("bmCatQty");
const bmCatUnit = document.getElementById("bmCatUnit");
const bmCatCost = document.getElementById("bmCatCost");
const bmCatSell = document.getElementById("bmCatSell");
const bmCatMrp = document.getElementById("bmCatMrp");
const bmCatMargin = document.getElementById("bmCatMargin");
const bmCatGst = document.getElementById("bmCatGst");
const bmCatAddBtn = document.getElementById("bmCatAddBtn");
const bmCatalogList = document.getElementById("bmCatalogList");
const bmCatalogDatalist = document.getElementById("bmCatalogDatalist");

const bmGroceryListToggle = document.getElementById("bmGroceryListToggle");
const bmGroceryListPanel = document.getElementById("bmGroceryListPanel");
const bmGrocerySearch = document.getElementById("bmGrocerySearch");
const bmGroceryResults = document.getElementById("bmGroceryResults");

const bmAutoFetchToggle = document.getElementById("bmAutoFetchToggle");
const bmAutoFetchPanel = document.getElementById("bmAutoFetchPanel");
const bmAutoFetchInput = document.getElementById("bmAutoFetchInput");
const bmAutoFetchStatus = document.getElementById("bmAutoFetchStatus");

const bmStockToggle = document.getElementById("bmStockToggle");
const bmStockPanel = document.getElementById("bmStockPanel");
const bmStockItemName = document.getElementById("bmStockItemName");
const bmStockPerBox = document.getElementById("bmStockPerBox");
const bmStockQty = document.getElementById("bmStockQty");
const bmStockAddBtn = document.getElementById("bmStockAddBtn");
const bmStockLivePreview = document.getElementById("bmStockLivePreview");
const bmStockUnitBtns = { pcs: document.getElementById("bmStockUnitPcs"), box: document.getElementById("bmStockUnitBox"), cs: document.getElementById("bmStockUnitCs") };

const bmStockReportToggle = document.getElementById("bmStockReportToggle");
const bmStockReportPanel = document.getElementById("bmStockReportPanel");
const bmStockReportList = document.getElementById("bmStockReportList");
const bmStockReportTotal = document.getElementById("bmStockReportTotal");
const bmStockPdfBtn = document.getElementById("bmStockPdfBtn");
const bmStockExcelBtn = document.getElementById("bmStockExcelBtn");

const bmReportsToggle = document.getElementById("bmReportsToggle");
const bmReportsPanel = document.getElementById("bmReportsPanel");
const bmReportsList = document.getElementById("bmReportsList");
const bmReportsClearBtn = document.getElementById("bmReportsClearBtn");

const unitButtons = { kg: document.getElementById("bmUnitKg"), g: document.getElementById("bmUnitG"), pcs: document.getElementById("bmUnitPcs") };
let bmSelectedUnit = "kg";
let bmMatchedCatalogItem = null; // reference used to auto-recompute rate on unit switch

let bmItems = JSON.parse(localStorage.getItem("calc_bm_items") || "[]");
let bmCatalog = JSON.parse(localStorage.getItem("calc_bm_catalog") || "[]");
let bmShopProfile = JSON.parse(localStorage.getItem("calc_bm_shop") || "{}");
let bmInvoiceCounter = parseInt(localStorage.getItem("calc_bm_invoice_counter") || "1", 10);
let bmSavedCustomers = JSON.parse(localStorage.getItem("calc_bm_customers") || "[]");

// Migration guard: earlier versions of this app saved catalog/bill items in
// an older shape (no qty/cost/gst fields). Without this, loading that old
// data on the new code throws and silently breaks the whole Bill Maker
// screen on startup — this repairs old entries in place instead of crashing.
bmCatalog = bmCatalog.map(item => ({
  name: item.name || "Item",
  qty: item.qty || 1,
  unit: item.unit || "kg",
  cost: item.cost || 0,
  costEstimated: item.costEstimated || false,
  costFormula: item.costFormula || null,
  sell: item.sell != null ? item.sell : (item.rate != null ? item.rate : 0),
  mrp: item.mrp || 0,
  gst: item.gst != null ? item.gst : 5,
  stock: item.stock || 0
}));
bmItems = bmItems.map(item => {
  const rate = item.rate != null ? item.rate : (item.price != null ? item.price : 0);
  const qty = item.qty || 1;
  const discount = item.discount || 0;
  return {
    name: item.name || "Item",
    qty,
    unit: item.unit || "pcs",
    rate,
    mrp: item.mrp || 0,
    gst: item.gst != null ? item.gst : 0,
    discount,
    amount: item.amount != null ? item.amount : (qty * rate - qty * rate * discount / 100)
  };
});

// --- Smart GST suggestion: keyword-matches an item name against common
// Indian grocery/retail GST slabs. This is rule-based pattern matching, not
// a live AI model — it's a quick starting guess, always editable by hand.
const GST_KEYWORD_RATES = [
  { rate: 40, keywords: ["cold drink", "soft drink", "pepsi", "coca cola", "coke", "sprite", "fanta", "thums up", "thumsup"] },
  { rate: 18, keywords: ["perfume", "deo", "cosmetic", "mineral water", "bisleri", "ice cream", "icecream", "chocolate", "choco", "energy drink", "red bull"] },
  { rate: 5, keywords: ["biscuit", "namkeen", "noodle", "maggi", "yippee", "pasta", "tea", "chai", "coffee", "edible oil", "cooking oil", "sarso", "mustard oil", "ghee", "butter", "makhan", "cheese", "jam", "sauce", "ketchup", "soap", "sabun", "shampoo", "toothpaste", "paste", "hair oil", "toothbrush", "brush", "detergent", "surf", "cream", "dal", "rice", "chawal", "atta", "flour"] },
  { rate: 0, keywords: ["milk", "doodh", "fresh milk"] }
];
function guessGstForName(name) {
  const n = (name || "").toLowerCase();
  for (const group of GST_KEYWORD_RATES) {
    if (group.keywords.some(kw => n.includes(kw))) return group.rate;
  }
  return null; // no confident match — leave whatever's currently selected
}

// --- Grocery Master List: common Kirana-store items pre-loaded so adding
// them is fast. Loose grains/dals are Kg-based with no preset price (rates
// change daily, so you just fill in today's price) — quantity is naturally
// unlimited since it's sold by weight. Branded packets are PCS-based with
// their actual real-world pack sizes as separate variants. Tapping one only
// fills the Name + Unit fields — you still enter your own price.
function makeVariants(brand, sizes, cat) {
  return sizes.map(s => ({ name: `${brand} ${s}`, unit: "pcs", cat }));
}
const GROCERY_MASTER_LIST = [
  // Loose grains, dals & staples — sold by weight, unlimited quantity
  { name: "Rice (Chawal)", unit: "kg", cat: "Grains & Pulses" },
  { name: "Atta", unit: "kg", cat: "Grains & Pulses" },
  { name: "Maida", unit: "kg", cat: "Grains & Pulses" },
  { name: "Besan", unit: "kg", cat: "Grains & Pulses" },
  { name: "Sugar (Cheeni)", unit: "kg", cat: "Grains & Pulses" },
  { name: "Moong Dal", unit: "kg", cat: "Grains & Pulses" },
  { name: "Arhar/Rahar Dal", unit: "kg", cat: "Grains & Pulses" },
  { name: "Chana Dal", unit: "kg", cat: "Grains & Pulses" },
  { name: "Urad Dal", unit: "kg", cat: "Grains & Pulses" },
  { name: "Masoor Dal", unit: "kg", cat: "Grains & Pulses" },
  { name: "Rajma", unit: "kg", cat: "Grains & Pulses" },
  { name: "Chana (Whole)", unit: "kg", cat: "Grains & Pulses" },
  { name: "Salt (Namak)", unit: "kg", cat: "Grains & Pulses" },
  // Kirana staples sold by weight, various sizes
  { name: "Mustard Oil (Sarso)", unit: "kg", cat: "Oil & Ghee" },
  { name: "Palm Oil", unit: "kg", cat: "Oil & Ghee" },
  { name: "Sunflower/Refined Oil", unit: "kg", cat: "Oil & Ghee" },
  { name: "Ghee", unit: "kg", cat: "Oil & Ghee" },
  { name: "Tea Leaves (Chai Patti)", unit: "kg", cat: "Oil & Ghee" },
  // Spices — sold in small weights, often grams
  { name: "Elaichi (Cardamom)", unit: "g", cat: "Spices (Masala)" },
  { name: "Jeera (Cumin)", unit: "g", cat: "Spices (Masala)" },
  { name: "Haldi (Turmeric)", unit: "g", cat: "Spices (Masala)" },
  { name: "Mirchi Powder (Chilli)", unit: "g", cat: "Spices (Masala)" },
  { name: "Dhania Powder (Coriander)", unit: "g", cat: "Spices (Masala)" },
  { name: "Garam Masala", unit: "g", cat: "Spices (Masala)" },
  { name: "Kali Mirch (Black Pepper)", unit: "g", cat: "Spices (Masala)" },
  { name: "Laung (Cloves)", unit: "g", cat: "Spices (Masala)" },

  // Instant food
  { name: "Maggi Noodles", unit: "pcs", cat: "Instant Food" },
  { name: "Cereal", unit: "pcs", cat: "Instant Food" },

  // Baby / infant formula milk — sold by numbered stage
  ...makeVariants("Lactogen", [1, 2, 3, 4], "Baby Food"),
  ...makeVariants("Nestogen", [1, 2], "Baby Food"),
  ...makeVariants("Nan", [1, 2, 3], "Baby Food"),
  ...makeVariants("Similac", [1, 2, 3], "Baby Food"),

  // Chocolates & confectionery — real pack sizes (grams) as separate items
  ...makeVariants("Kitkat", [10, 20, 25, 30, 35, 55, 90, 210], "Chocolates"),
  ...makeVariants("Milkybar", [10, 20, 50], "Chocolates"),
  ...makeVariants("Munch", [5, 10, 20, 25], "Chocolates")
];

function renderGroceryResults(query) {
  const q = query.trim().toLowerCase();
  const matches = q === ""
    ? []
    : GROCERY_MASTER_LIST.filter(item => item.name.toLowerCase().includes(q)).slice(0, 40);

  if (matches.length === 0) {
    bmGroceryResults.innerHTML = "";
    return;
  }
  bmGroceryResults.innerHTML = matches.map(item =>
    `<button type="button" class="bm-grocery-chip" data-name="${item.name}" data-unit="${item.unit}">${item.name} <span class="bm-grocery-chip-unit">${item.unit}</span></button>`
  ).join("");
  bmGroceryResults.querySelectorAll(".bm-grocery-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      bmCatName.value = chip.dataset.name;
      bmCatUnit.value = chip.dataset.unit;
      bmCatQty.value = "1";
      if (!bmCatGstTouched) {
        const guess = guessGstForName(chip.dataset.name);
        if (guess !== null) bmCatGst.value = String(guess);
      }
      bmCatSell.focus();
    });
  });
}
// Small debounce helper — used on search inputs so filtering runs once
// typing pauses instead of re-rendering on every single keystroke.
function debounce(fn, delay = 150) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
bmGrocerySearch.addEventListener("input", debounce(() => renderGroceryResults(bmGrocerySearch.value), 120));

function saveBmItems() { localStorage.setItem("calc_bm_items", JSON.stringify(bmItems)); }
function saveBmCatalog() { localStorage.setItem("calc_bm_catalog", JSON.stringify(bmCatalog)); }
function saveBmShopProfile() { localStorage.setItem("calc_bm_shop", JSON.stringify(bmShopProfile)); }

// --- Collapsible sections ---
function setupCollapsible(toggleBtn, panel) {
  toggleBtn.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggleBtn.classList.toggle("open", open);
  });
}
setupCollapsible(bmShopToggle, bmShopPanel);
setupCollapsible(bmCatalogToggle, bmCatalogPanel);
setupCollapsible(bmAutoFetchToggle, bmAutoFetchPanel);
setupCollapsible(bmColumnsToggle, bmColumnsPanel);
setupCollapsible(bmStockToggle, bmStockPanel);
setupCollapsible(bmStockReportToggle, bmStockReportPanel);

// Which columns show on the printed PDF/JPG — saved locally so the choice
// sticks between bills.
let bmPrintPrefs = JSON.parse(localStorage.getItem("calc_bm_print_prefs") || "null") || {
  mrp: true, rate: true, discount: true, gst: false
};
function loadPrintPrefsUI() {
  bmColMrp.checked = bmPrintPrefs.mrp;
  bmColRate.checked = bmPrintPrefs.rate;
  bmColDiscount.checked = bmPrintPrefs.discount;
  bmColGst.checked = bmPrintPrefs.gst;
}
function savePrintPrefsFromUI() {
  bmPrintPrefs = {
    mrp: bmColMrp.checked,
    rate: bmColRate.checked,
    discount: bmColDiscount.checked,
    gst: bmColGst.checked
  };
  localStorage.setItem("calc_bm_print_prefs", JSON.stringify(bmPrintPrefs));
}
[bmColMrp, bmColRate, bmColDiscount, bmColGst].forEach(cb => cb.addEventListener("change", savePrintPrefsFromUI));
setupCollapsible(bmGroceryListToggle, bmGroceryListPanel);
setupCollapsible(bmReportsToggle, bmReportsPanel);

// --- Business type: Kirana Store vs Distributor ---
// Distributor gets the extra distributor-name/contact fields on the
// invoice; Kirana Store hides them since a retail shop doesn't need them.
function setBusinessType(type) {
  bmShopProfile.businessType = type;
  saveBmShopProfile();
  bmTypeKirana.classList.toggle("active", type === "kirana");
  bmTypeDistributor.classList.toggle("active", type === "distributor");
  bmDistFields.style.display = type === "distributor" ? "grid" : "none";
}
bmTypeKirana.addEventListener("click", () => setBusinessType("kirana"));
bmTypeDistributor.addEventListener("click", () => setBusinessType("distributor"));

// --- Shop profile (local only, never sent anywhere) ---
function loadShopProfileFields() {
  bmShopName.value = bmShopProfile.name || "";
  bmShopAddress.value = bmShopProfile.address || "";
  bmShopPan.value = bmShopProfile.pan || "";
  bmShopGst.value = bmShopProfile.gst || "";
  bmShopMobile.value = bmShopProfile.mobile || "";
  bmDistName.value = bmShopProfile.distName || "";
  bmDistContact.value = bmShopProfile.distContact || "";
  if (bmShopProfile.qr) {
    bmShopQrPreview.src = bmShopProfile.qr;
    bmShopQrPreview.classList.add("show");
  }
  setBusinessType(bmShopProfile.businessType || "kirana");
}
[bmShopName, bmShopAddress, bmShopPan, bmShopGst, bmShopMobile, bmDistName, bmDistContact].forEach(input => {
  input.addEventListener("input", () => {
    bmShopProfile = {
      ...bmShopProfile,
      name: bmShopName.value.trim(),
      address: bmShopAddress.value.trim(),
      pan: bmShopPan.value.trim(),
      gst: bmShopGst.value.trim(),
      mobile: bmShopMobile.value.trim(),
      distName: bmDistName.value.trim(),
      distContact: bmDistContact.value.trim()
    };
    saveBmShopProfile();
  });
});

bmShopQrInput.addEventListener("change", () => {
  const file = bmShopQrInput.files && bmShopQrInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    bmShopProfile = { ...bmShopProfile, qr: reader.result };
    saveBmShopProfile();
    bmShopQrPreview.src = reader.result;
    bmShopQrPreview.classList.add("show");
    showToast(currentLangText("qrUploaded"), "success");
  };
  reader.readAsDataURL(file);
});

// --- Invoice number (local counter only — no bill data is ever stored/sent anywhere) ---
function displayInvoiceNo() {
  bmInvoiceNo.textContent = `INV-${String(bmInvoiceCounter).padStart(4, "0")}`;
}
function advanceInvoiceNo() {
  bmInvoiceCounter += 1;
  localStorage.setItem("calc_bm_invoice_counter", String(bmInvoiceCounter));
  displayInvoiceNo();
}

// --- Item catalog: save name + preset qty/unit + cost/sell price + GST once,
// then search & tap to reuse. Billing quantity auto-converts against this preset. ---
function renderBmCatalog() {
  if (bmCatalog.length === 0) {
    bmCatalogList.innerHTML = `<li class="bm-empty">${currentLangText("catalogEmpty")}</li>`;
  } else {
    bmCatalogList.innerHTML = bmCatalog.map((item, i) => {
      let costNote = "";
      if (item.cost > 0) {
        costNote = ` · ${currentLangText("purchaseRateLabel")} ${fmtMoney(item.cost)}${item.costEstimated ? ` (${currentLangText("estimatedLabel")})` : ""} · margin ${fmtMoney(item.sell - item.cost)}`;
      }
      const mrpNote = item.mrp > 0
        ? ` · MRP <span class="bm-editable-price bm-editable-mrp" data-index="${i}" title="${currentLangText("tapToEdit")}">${fmtMoney(item.mrp)}</span>`
        : "";
      const stockNote = item.unit === "pcs" && item.stock > 0 ? ` · 📦 ${item.stock} PCS` : "";
      return `
      <li>
        <div class="bm-item-info">
          <span class="bm-item-name bm-editable-name" data-index="${i}" title="${currentLangText("tapToEdit")}">${item.name}</span>
          <span class="bm-item-qty">${item.qty} ${item.unit} = <span class="bm-editable-price" data-index="${i}" title="${currentLangText("tapToEdit")}">${fmtMoney(item.sell)}</span> (GST ${item.gst}%)${mrpNote}${costNote}${stockNote}</span>
        </div>
        <button class="bm-remove-btn" data-index="${i}" title="Remove">✕</button>
      </li>`;
    }).join("");
  }
  bmCatalogDatalist.innerHTML = bmCatalog.map(item => `<option value="${item.name}">`).join("");

  bmCatalogList.querySelectorAll(".bm-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      bmCatalog.splice(parseInt(btn.dataset.index, 10), 1);
      saveBmCatalog();
      renderBmCatalog();
      showToast(currentLangText("catalogItemRemoved"), "info");
    });
  });

  // Tap a saved item's price to edit it in place — prices change often
  // (supplier rates go up/down), no need to delete and re-add the item.
  bmCatalogList.querySelectorAll(".bm-editable-price:not(.bm-editable-mrp)").forEach(span => {
    span.addEventListener("click", () => {
      const idx = parseInt(span.dataset.index, 10);
      const item = bmCatalog[idx];
      const input = document.createElement("input");
      input.type = "number";
      input.inputMode = "decimal";
      input.className = "bm-inline-edit";
      input.value = item.sell;
      span.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const newVal = validNumber(input.value);
        if (newVal !== null && newVal > 0) {
          bmCatalog[idx].sell = newVal;
          saveBmCatalog();
          showToast(currentLangText("priceUpdated"), "success");
        }
        renderBmCatalog();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); input.blur(); }
        if (e.key === "Escape") { renderBmCatalog(); }
      });
    });
  });

  // Tap MRP to edit it — for Nestlé baby-food products this automatically
  // recalculates the Purchase Rate too (Sale Rate = MRP÷1.09, then
  // Purchase Rate = Sale Rate × (1 − 3.96%)), so a revised MRP is the only
  // thing you ever need to correct by hand.
  bmCatalogList.querySelectorAll(".bm-editable-mrp").forEach(span => {
    span.addEventListener("click", () => {
      const idx = parseInt(span.dataset.index, 10);
      const item = bmCatalog[idx];
      const input = document.createElement("input");
      input.type = "number";
      input.inputMode = "decimal";
      input.className = "bm-inline-edit";
      input.value = item.mrp;
      span.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const newVal = validNumber(input.value);
        if (newVal !== null && newVal > 0) {
          bmCatalog[idx].mrp = newVal;
          if (item.costFormula === "nestle") {
            bmCatalog[idx].cost = nestleCostFromMrp(newVal).purchaseRate;
          }
          saveBmCatalog();
          showToast(currentLangText("priceUpdated"), "success");
        }
        renderBmCatalog();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); input.blur(); }
        if (e.key === "Escape") { renderBmCatalog(); }
      });
    });
  });

  // Tap the item name to rename it.
  bmCatalogList.querySelectorAll(".bm-editable-name").forEach(span => {
    span.addEventListener("click", () => {
      const idx = parseInt(span.dataset.index, 10);
      const item = bmCatalog[idx];
      const input = document.createElement("input");
      input.type = "text";
      input.className = "bm-inline-edit bm-inline-edit-name";
      input.value = item.name;
      span.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const newName = input.value.trim();
        if (newName) {
          bmCatalog[idx].name = newName;
          saveBmCatalog();
          showToast(currentLangText("priceUpdated"), "success");
        }
        renderBmCatalog();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); input.blur(); }
        if (e.key === "Escape") { renderBmCatalog(); }
      });
    });
  });
}

let bmCatGstTouched = false;
bmCatGst.addEventListener("change", () => { bmCatGstTouched = true; });
bmCatName.addEventListener("input", () => {
  if (bmCatGstTouched) return;
  const guess = guessGstForName(bmCatName.value);
  if (guess !== null) bmCatGst.value = String(guess);
});

// This specific auto-cost formula is only valid for Nestlé baby-food
// products (their retailer/distributor margin structure is well known and
// consistent) — it must NEVER apply to regular grocery items, where cost
// price is just an optional manual field with no assumed formula.
const NESTLE_BABY_FOOD_TOKENS = ["cerelac", "lactogen", "nestogen", "nestum", "nangrow", "ceregrow", "nan"];
function isNestleBabyFood(name) {
  const tokens = name.toLowerCase().split(/\s+/);
  return tokens.some(tok => NESTLE_BABY_FOOD_TOKENS.includes(tok));
}
const NESTLE_DISTRIBUTOR_MARGIN_PCT = 3.96;
function nestleCostFromMrp(mrp) {
  const saleRate = mrp / 1.09;                                    // retailer's selling price
  const purchaseRate = saleRate * (1 - NESTLE_DISTRIBUTOR_MARGIN_PCT / 100); // what the distributor pays
  return { saleRate, purchaseRate };
}

// Live-preview the computed cost price as MRP/Margin are typed, so the
// purchase rate is visible right away — not just silently used on add.
let bmCatCostTouched = false;
let bmCatSellTouched = false;
bmCatCost.addEventListener("input", () => { bmCatCostTouched = true; });
bmCatSell.addEventListener("input", () => { bmCatSellTouched = true; });
function previewCatCost() {
  const mrp = validNumber(bmCatMrp.value);
  const margin = validNumber(bmCatMargin.value);
  if (mrp === null || mrp <= 0) return;

  if (isNestleBabyFood(bmCatName.value)) {
    // For Nestlé baby-food products both prices come straight from MRP:
    // Selling Price = MRP ÷ 1.09, Cost Price = that × (1 − 3.96%).
    const { saleRate, purchaseRate } = nestleCostFromMrp(mrp);
    if (!bmCatSellTouched) bmCatSell.value = saleRate.toFixed(2);
    if (!bmCatCostTouched) bmCatCost.value = purchaseRate.toFixed(2);
    return;
  }

  // Regular grocery: only Cost Price can be derived (from your own margin
  // %), and only if you gave one — Selling Price always stays yours to set.
  if (!bmCatCostTouched && margin !== null && margin > 0) {
    bmCatCost.value = (mrp / (1 + margin / 100)).toFixed(2);
  }
}
bmCatName.addEventListener("input", previewCatCost);
bmCatMrp.addEventListener("input", previewCatCost);
bmCatMargin.addEventListener("input", previewCatCost);

bmCatAddBtn.addEventListener("click", () => {
  const name = bmCatName.value.trim();
  const qty = validNumber(bmCatQty.value) || 1;
  const unit = bmCatUnit.value;
  const manualCost = validNumber(bmCatCost.value); // optional, private (never printed)
  let sell = validNumber(bmCatSell.value);
  const mrp = validNumber(bmCatMrp.value);
  const margin = validNumber(bmCatMargin.value);
  const gst = parseFloat(bmCatGst.value);
  const isNestle = isNestleBabyFood(name);
  // Defensive fallback in case the live preview didn't fire for some reason
  // (e.g. values pasted in) — Nestlé Selling Price always comes from MRP.
  if ((sell === null || sell <= 0) && isNestle && mrp > 0) {
    sell = nestleCostFromMrp(mrp).saleRate;
  }
  if (!name || sell === null || sell <= 0) {
    showToast(currentLangText("fillCatalogError"), "error");
    return;
  }
  // Purchase/cost price priority: a manually typed cost always wins. Next,
  // your own margin % (Cost = MRP ÷ (1 + margin/100)) if given. Only for
  // recognized Nestlé baby-food products, with neither given, apply their
  // specific formula. Every other product: no auto-estimate at all.
  let cost = manualCost;
  let costEstimated = false;
  let costFormula = null;
  if ((cost === null || cost <= 0) && mrp > 0) {
    if (margin !== null && margin > 0) {
      cost = mrp / (1 + margin / 100);
    } else if (isNestle) {
      cost = nestleCostFromMrp(mrp).purchaseRate;
      costEstimated = true;
      costFormula = "nestle";
    }
  }
  bmCatalog.push({ name, qty, unit, cost: cost || 0, costEstimated, costFormula, sell, mrp: mrp || 0, gst, stock: 0 });
  saveBmCatalog();
  renderBmCatalog();
  showToast(currentLangText("catalogItemAdded"), "success");
  bmCatName.value = "";
  bmCatQty.value = "1";
  bmCatCost.value = "";
  bmCatSell.value = "";
  bmCatMrp.value = "";
  bmCatMargin.value = "";
  bmCatCostTouched = false;
  bmCatSellTouched = false;
  bmCatGstTouched = false;
});

// --- Saved Customers: no more retyping the same customer's phone/address
// every single time. Saved locally, same as everything else here. ---
function saveBmCustomers() {
  localStorage.setItem("calc_bm_customers", JSON.stringify(bmSavedCustomers));
}

function renderCustomerDatalist() {
  bmCustomerDatalist.innerHTML = bmSavedCustomers.map(c => `<option value="${c.name}">`).join("");
}

function upsertSavedCustomer() {
  const name = bmCustomerName.value.trim();
  if (!name) return;
  const phone = bmCustomerPhone.value.trim();
  const whatsapp = bmCustomerWhatsapp.value.trim();
  const address = bmCustomerAddress.value.trim();
  const idx = bmSavedCustomers.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
  const record = { name, phone, whatsapp, address };
  if (idx >= 0) bmSavedCustomers[idx] = record;
  else bmSavedCustomers.unshift(record);
  bmSavedCustomers = bmSavedCustomers.slice(0, 200);
  saveBmCustomers();
  renderCustomerDatalist();
}

// Typing/selecting a saved customer's exact name autofills their details.
bmCustomerName.addEventListener("input", () => {
  const match = bmSavedCustomers.find(c => c.name.toLowerCase() === bmCustomerName.value.trim().toLowerCase());
  if (match) {
    bmCustomerPhone.value = match.phone || "";
    bmCustomerWhatsapp.value = match.whatsapp || "";
    bmCustomerAddress.value = match.address || "";
  }
});

// Converts a catalog item's preset price into a rate for ANY target unit —
// this is the actual fix: "6 PCS = ₹280" becomes ₹46.67/pcs, "1 Kg = ₹120"
// becomes ₹0.12/gram, so buying 500g auto-computes to ₹60, not ₹60,000.
function getPerUnitRate(item, targetUnit) {
  const isCount = item.unit === "pcs";
  const targetIsCount = targetUnit === "pcs";
  if (isCount !== targetIsCount) return null; // incompatible categories (weight vs count)
  if (isCount) return item.sell / item.qty;
  const presetGrams = item.unit === "kg" ? item.qty * 1000 : item.qty;
  const ratePerGram = item.sell / presetGrams;
  return targetUnit === "kg" ? ratePerGram * 1000 : ratePerGram;
}

// --- Voice Add Item: say "Atta 5 kg" or "Chana Dal 500 gram" and it's
// found in the saved item list and added straight to the bill. The item
// must already exist in "Manage Saved Items" — voice only picks a name,
// quantity, and unit out of what's said, it can't invent a price. ---
const UNIT_SPEECH_WORDS = {
  kg: ["kg", "kilo", "kilos", "kilogram", "kilograms", "किलो", "কেজি"],
  g: ["gram", "grams", "gm", "gms", "ग्राम", "গ্রাম"],
  pcs: ["pcs", "pc", "piece", "pieces", "पीस", "পিস"]
};

// Speech engines don't always return numbers as digits — especially for
// Hindi/Bengali, quantities often come back as spoken words. This converts
// common number-words (across all three languages, tried together since
// recognition can mix scripts) into digits before any digit-parsing runs.
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  dozen: 12, half: 0.5, quarter: 0.25,
  "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5, "पाँच": 5, "छह": 6, "छः": 6, "सात": 7,
  "आठ": 8, "नौ": 9, "दस": 10, "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15,
  "सोलह": 16, "सत्रह": 17, "अठारह": 18, "उन्नीस": 19, "बीस": 20, "पच्चीस": 25, "तीस": 30,
  "चालीस": 40, "पचास": 50, "साठ": 60, "सत्तर": 70, "अस्सी": 80, "नब्बे": 90,
  "सौ": 100, "हज़ार": 1000, "हजार": 1000, "आधा": 0.5, "आधी": 0.5,
  "এক": 1, "দুই": 2, "তিন": 3, "চার": 4, "পাঁচ": 5, "ছয়": 6, "সাত": 7, "আট": 8, "নয়": 9,
  "দশ": 10, "এগারো": 11, "বারো": 12, "তেরো": 13, "চৌদ্দ": 14, "পনেরো": 15, "ষোল": 16,
  "সতেরো": 17, "আঠারো": 18, "উনিশ": 19, "বিশ": 20, "পঁচিশ": 25, "ত্রিশ": 30, "চল্লিশ": 40,
  "পঞ্চাশ": 50, "ষাট": 60, "সত্তর": 70, "আশি": 80, "নব্বই": 90,
  "একশ": 100, "শ": 100, "শত": 100, "হাজার": 1000, "আধা": 0.5
};

const HUNDRED_WORDS = new Set(["hundred", "सौ", "একশ", "শ", "শত"]);
const THOUSAND_WORDS = new Set(["thousand", "हज़ार", "हजार", "হাজার"]);

// Handles compound spoken numbers ("two hundred fifty", Hindi "दो सौ
// पचास") by combining them into a single number BEFORE the generic
// word-to-digit pass — without this, "two hundred fifty" was splitting
// into three separate numbers (2, 100, 50) and breaking quantity detection
// for anything that wasn't a plain two-digit value.
function wordsToDigits(text) {
  const tokens = text.split(/\s+/);
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    const clean = tokens[i].toLowerCase().replace(/[.,!?।]+$/, "");
    const hasVal = Object.prototype.hasOwnProperty.call(NUMBER_WORDS, clean);
    const val = hasVal ? NUMBER_WORDS[clean] : null;

    if (hasVal && val < 100 && i + 1 < tokens.length) {
      const nextClean = tokens[i + 1].toLowerCase().replace(/[.,!?।]+$/, "");
      if (HUNDRED_WORDS.has(nextClean) || THOUSAND_WORDS.has(nextClean)) {
        const multiplier = HUNDRED_WORDS.has(nextClean) ? 100 : 1000;
        let combined = val * multiplier;
        let consumed = 2;
        if (i + 2 < tokens.length) {
          const addendClean = tokens[i + 2].toLowerCase().replace(/[.,!?।]+$/, "");
          const addendVal = Object.prototype.hasOwnProperty.call(NUMBER_WORDS, addendClean) ? NUMBER_WORDS[addendClean] : null;
          if (addendVal !== null && addendVal < multiplier) {
            combined += addendVal;
            consumed = 3;
          }
        }
        out.push(String(combined));
        i += consumed;
        continue;
      }
    }
    out.push(hasVal ? String(val) : tokens[i]);
    i += 1;
  }
  return out.join(" ");
}

// Filler/trigger words people naturally say around the actual item —
// stripped so they don't interfere with catalog matching.
const VOICE_FILLER_WORDS_SET = new Set([
  "add", "please", "chahiye", "do", "de", "दो", "जोड़ो", "চাই", "যোগ", "করো"
]);

function stripFillerWords(text) {
  return text.split(/\s+/)
    .filter(tok => !VOICE_FILLER_WORDS_SET.has(tok.toLowerCase().replace(/[.,!?।]+$/, "")))
    .join(" ");
}

function tokenize(s) {
  return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function levenshteinDistance(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Finds the catalog item whose name is closest to what was heard, tolerant
// of small mishearings — but only trusts the match if it's genuinely close
// (the allowed distance scales with word length so short names stay strict).
function findClosestCatalogMatch(spokenName, bmCatalog) {
  let best = null;
  let bestScore = Infinity;
  bmCatalog.forEach(item => {
    const itemName = item.name.toLowerCase();
    const distance = levenshteinDistance(spokenName, itemName);
    const threshold = Math.max(2, Math.floor(Math.max(spokenName.length, itemName.length) * 0.3));
    if (distance <= threshold && distance < bestScore) {
      bestScore = distance;
      best = item;
    }
  });
  return best;
}

function findCatalogItemByName(spokenName, bmCatalog) {
  const n = spokenName.toLowerCase().trim();
  if (!n) return { item: null, tier: 0 };
  const nTokens = tokenize(n);

  let item = bmCatalog.find(i => i.name.toLowerCase() === n);
  if (item) return { item, tier: 3 }; // exact match — most trustworthy

  // Sequential prefix match, compared token-by-token (never raw substring)
  // — this is what actually fixes "Lactogen 16" no longer falsely matching
  // "Lactogen 1". Raw string prefix matching would wrongly say "lactogen
  // 16" starts with "lactogen 1" as text, even though 16 and 1 are
  // completely different tokens/quantities.
  item = bmCatalog.find(i => {
    const iTokens = tokenize(i.name);
    const shorter = iTokens.length <= nTokens.length ? iTokens : nTokens;
    const longer = iTokens.length <= nTokens.length ? nTokens : iTokens;
    return shorter.length > 0 && shorter.every((tok, idx) => tok === longer[idx]);
  });
  if (item) return { item, tier: 2 };

  // Loose fallback — token SET overlap (order-independent), still exact
  // per-token comparison so "16" can never match "1" here either.
  item = bmCatalog.find(i => {
    const iTokens = tokenize(i.name);
    const overlap = nTokens.filter(t => iTokens.includes(t)).length;
    return overlap > 0 && overlap >= Math.min(nTokens.length, iTokens.length);
  });
  if (item) return { item, tier: 1 };

  // Fuzzy fallback — for noisy shop environments where the mic mishears a
  // word slightly ("lactojen" instead of "lactogen"). Compares how close
  // the spoken name is to each saved item's name and picks the closest
  // match, as long as it's close enough to be trustworthy.
  const fuzzy = findClosestCatalogMatch(n, bmCatalog);
  if (fuzzy) return { item: fuzzy, tier: 0.5 };

  return { item: null, tier: 0 };
}

function stripUnitWord(text) {
  // Token-based for the same reason as wordsToDigits above — regex \b
  // silently fails to match Hindi/Bengali unit words.
  const tokens = text.split(/\s+/);
  let spokenUnit = null;
  const outTokens = [];
  for (const tok of tokens) {
    const clean = tok.toLowerCase().replace(/[.,!?।]+$/, "");
    if (spokenUnit === null) {
      const foundEntry = Object.entries(UNIT_SPEECH_WORDS).find(([, words]) => words.includes(clean));
      if (foundEntry) {
        spokenUnit = foundEntry[0];
        continue; // drop this token from the remaining name text
      }
    }
    outTokens.push(tok);
  }
  return { rest: outTokens.join(" "), spokenUnit };
}

function cleanSpokenName(text) {
  // Keep digits here (unlike earlier) — some product names legitimately
  // contain a number (Lactogen 2, Kitkat 20, Similac 1) and stripping
  // digits unconditionally broke matching for exactly those items.
  return text.replace(/[^\p{L}0-9\s]/gu, " ").replace(/\s+/g, " ").trim();
}

// Pure parse — no side effects — so it can be run against every candidate
// transcript the speech engine offers, not just its top (often wrong, in a
// noisy shop) guess.
function parseVoiceTranscriptToCandidate(rawTranscript) {
  const transcript = stripFillerWords(wordsToDigits(rawTranscript)).replace(/\s+/g, " ").trim();
  const numbers = [...transcript.matchAll(/\d+\.?\d*/g)].map(m => m[0]);
  let qty = 1;
  let qtyWasExplicit = false;
  let nameSource = transcript;

  if (numbers.length >= 2) {
    // "Lactogen 2, 3 pieces" — the LAST number is the quantity being
    // bought; earlier numbers (like the "2" in "Lactogen 2") stay as part
    // of the product name.
    const lastNum = numbers[numbers.length - 1];
    qty = parseFloat(lastNum);
    qtyWasExplicit = true;
    const idx = transcript.lastIndexOf(lastNum);
    nameSource = transcript.slice(0, idx) + transcript.slice(idx + lastNum.length);
  } else if (numbers.length === 1) {
    // Ambiguous with only one number — e.g. "Kitkat 20" could mean the
    // Kitkat-20 variant (qty 1) or "20 Kitkats". Try both readings and
    // trust whichever finds the stronger catalog match.
    const n = numbers[0];
    const idx = transcript.lastIndexOf(n);
    const withoutNum = transcript.slice(0, idx) + transcript.slice(idx + n.length);

    const resWithout = findCatalogItemByName(cleanSpokenName(stripUnitWord(withoutNum).rest), bmCatalog);
    const resWith = findCatalogItemByName(cleanSpokenName(stripUnitWord(transcript).rest), bmCatalog);

    if (resWith.tier > resWithout.tier) {
      qty = 1; // the number belongs to the product name — quantity wasn't actually said
      nameSource = transcript;
    } else if (resWithout.item) {
      qty = parseFloat(n); // the number was the quantity
      qtyWasExplicit = true;
      nameSource = withoutNum;
    } else {
      qty = 1;
      nameSource = transcript;
    }
  }

  const { rest, spokenUnit } = stripUnitWord(nameSource);
  const spokenName = cleanSpokenName(rest);
  const { item: match, tier } = findCatalogItemByName(spokenName, bmCatalog);
  const unit = match ? (spokenUnit || (match.unit === "pcs" ? "pcs" : match.unit)) : spokenUnit;

  return { match, tier, qty, qtyWasExplicit, unit, spokenName };
}

// Tries every alternative transcript the speech engine offered and keeps
// whichever one actually resolves to a real saved item — this is the fix
// for "wrong word" recognition in a noisy shop: the #1 guess is often
// wrong, but #2 or #3 frequently matches a real product.
function processVoiceBillCommand(alternatives) {
  const transcripts = Array.isArray(alternatives) ? alternatives : [alternatives];
  let best = null;
  for (const t of transcripts) {
    const candidate = parseVoiceTranscriptToCandidate(t);
    if (!best || candidate.tier > best.tier) best = candidate;
    if (best.tier >= 3) break; // exact match already — no need to check the rest
  }

  const { match, qty, qtyWasExplicit, unit, spokenName } = best;

  if (!match) {
    bmVoiceAddStatus.className = "error";
    bmVoiceAddStatus.textContent = `"${spokenName}" — ${currentLangText("voiceItemNotFound")}`;
    showToast(currentLangText("voiceItemNotFound"), "error");
    speak(currentLangText("voiceItemNotFound"), I18N[currentLang].speech);
    return;
  }

  if (!qtyWasExplicit) {
    // Found the product, but no quantity was actually said — ask instead
    // of silently guessing 1, phrased for whatever unit this item sells in.
    askForVoiceQuantity(match, unit);
    return;
  }

  finalizeVoiceAdd(match, qty, unit);
}

function finalizeVoiceAdd(match, qty, unit) {
  let rate = getPerUnitRate(match, unit);
  if (rate === null) { // spoken unit was incompatible (e.g. said "kg" for a PCS item) — fall back
    unit = match.unit;
    rate = getPerUnitRate(match, unit);
  }

  // MRP is the fixed price printed on the product's packaging — it doesn't
  // shrink for partial quantities (selling 500g of a 1kg pack still
  // references the same ₹180 MRP, not a synthetic "₹90"). Only Amount
  // (what's actually charged) scales with quantity.
  const mrp = match.mrp > 0 ? match.mrp : 0;

  const amount = qty * rate;
  let cost = 0;
  if (match.cost > 0) {
    const costPerUnit = getPerUnitRate({ ...match, sell: match.cost }, unit);
    if (costPerUnit !== null) cost = costPerUnit * qty;
  }
  bmItems.push({ name: match.name, qty, unit, rate, mrp, gst: match.gst, discount: 0, amount, cost });
  saveBmItems();
  renderBmItems();

  bmVoiceAddStatus.className = "complete";
  bmVoiceAddStatus.textContent = `${match.name} — ${qty} ${unit} — ${fmtMoney(amount)}`;
  showToast(`${match.name} ${qty}${unit} — ${fmtMoney(amount)}`, "success");
  speak(`${match.name}, ${qty} ${unit}, ${amount.toFixed(0)} rupees added`, I18N[currentLang].speech);
}

// Asks how much of the item is wanted, phrased for its unit type, then
// listens for just the quantity and finishes adding it. Works in whichever
// language is currently selected (English/Hindi/Bengali).
function askForVoiceQuantity(match, unit) {
  const isCount = unit === "pcs";
  const question = isCount ? currentLangText("askQtyPcs") : currentLangText("askQtyWeight");
  bmVoiceAddStatus.className = "scanning";
  bmVoiceAddStatus.textContent = `${match.name} — ${question}`;

  const recognition = getSpeechRecognition();
  if (!recognition) return; // already confirmed supported by the caller's initial check

  const startListening = () => {
    bmVoiceAddBtn.classList.add("listening");
    recognition.onresult = (event) => {
      const replyRaw = wordsToDigits(event.results[0][0].transcript);
      const { rest, spokenUnit } = stripUnitWord(replyRaw);
      const numMatch = rest.match(/\d+\.?\d*/);
      const qty = numMatch ? parseFloat(numMatch[0]) : 1;
      finalizeVoiceAdd(match, qty, spokenUnit || unit);
    };
    recognition.onerror = () => {
      bmVoiceAddStatus.className = "error";
      bmVoiceAddStatus.textContent = currentLangText("didntCatch");
    };
    recognition.onend = () => bmVoiceAddBtn.classList.remove("listening");
    try { recognition.start(); } catch (e) { bmVoiceAddBtn.classList.remove("listening"); }
  };

  // Listens right as our own question finishes speaking — no more fixed
  // guess-and-wait delay, so short questions start listening immediately
  // and long ones never get cut off.
  speak(`${match.name}. ${question}`, I18N[currentLang].speech, startListening);
}

// --- Stock Entry & Stock Report ---
// Only for PCS/Box/CS items — weight-based loose grocery (kg/gram) doesn't
// get a stock count here, since it's typically sold straight from a bulk
// sack rather than tracked as discrete units.
let bmStockUnit = "pcs";
function selectStockUnit(unit) {
  bmStockUnit = unit;
  Object.entries(bmStockUnitBtns).forEach(([u, btn]) => btn.classList.toggle("active", u === unit));
  bmStockPerBox.disabled = unit === "pcs";
  if (unit === "pcs") bmStockPerBox.value = "1";
  updateStockLivePreview();
}
Object.entries(bmStockUnitBtns).forEach(([unit, btn]) => btn.addEventListener("click", () => selectStockUnit(unit)));

function updateStockLivePreview() {
  const perBox = validNumber(bmStockPerBox.value) || 1;
  const qty = validNumber(bmStockQty.value);
  if (qty === null) { bmStockLivePreview.textContent = ""; return; }
  const totalPcs = bmStockUnit === "pcs" ? qty : qty * perBox;
  bmStockLivePreview.textContent = `= ${totalPcs} PCS`;
}
[bmStockPerBox, bmStockQty].forEach(el => el.addEventListener("input", updateStockLivePreview));

bmStockAddBtn.addEventListener("click", () => {
  const name = bmStockItemName.value.trim();
  const match = bmCatalog.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (!match) {
    showToast(currentLangText("voiceItemNotFound"), "error");
    return;
  }
  if (match.unit !== "pcs") {
    showToast(currentLangText("stockPcsOnly"), "error");
    return;
  }
  const perBox = validNumber(bmStockPerBox.value) || 1;
  const qty = validNumber(bmStockQty.value);
  if (qty === null || qty <= 0) {
    showToast(currentLangText("fillItemError"), "error");
    return;
  }
  const totalPcs = bmStockUnit === "pcs" ? qty : qty * perBox;
  match.stock = (match.stock || 0) + totalPcs;
  saveBmCatalog();
  renderBmCatalog();
  renderStockReport();
  showToast(`${match.name}: +${totalPcs} PCS (${currentLangText("stockNowLabel")} ${match.stock})`, "success");
  speak(`${match.name}, ${totalPcs} PCS added to stock`, I18N[currentLang].speech);

  bmStockItemName.value = "";
  bmStockQty.value = "1";
  bmStockPerBox.value = "1";
  bmStockLivePreview.textContent = "";
  selectStockUnit("pcs");
});

function renderStockReport() {
  const stockItems = bmCatalog.filter(item => item.unit === "pcs" && item.stock > 0);
  if (stockItems.length === 0) {
    bmStockReportList.innerHTML = `<li class="bm-empty">${currentLangText("noStockYet")}</li>`;
    bmStockReportTotal.innerHTML = "";
    return;
  }
  bmStockReportList.innerHTML = stockItems.map(item => `
    <li>
      <div class="bm-item-info">
        <span class="bm-item-name">${item.name}</span>
        <span class="bm-item-qty">${item.stock} PCS × ${fmtMoney(item.mrp || item.sell)}</span>
      </div>
      <span class="bm-item-price">${fmtMoney(item.stock * (item.mrp || item.sell))}</span>
    </li>
  `).join("");

  const grandTotal = stockItems.reduce((sum, item) => sum + item.stock * (item.mrp || item.sell), 0);
  renderFinanceResult(bmStockReportTotal, [
    { label: currentLangText("totalStockValueLabel"), value: fmtMoney(grandTotal), highlight: true }
  ]);
}

bmStockPdfBtn.addEventListener("click", async () => {
  const stockItems = bmCatalog.filter(item => item.unit === "pcs" && item.stock > 0);
  if (stockItems.length === 0) {
    showToast(currentLangText("noStockYet"), "error");
    return;
  }
  bmStockPdfBtn.disabled = true;
  showToast(currentLangText("pdfGenerating"), "info");
  try {
    await loadJsPdf();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Bordered page + colored header band, matching the invoice design.
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.roundedRect(8, 8, 194, 281, 3, 3);

    doc.setFillColor(99, 102, 241);
    doc.rect(8, 8, 194, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(bmShopProfile.name || currentLangText("stockReportLabel"), 105, 18, { align: "center" });
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(`${currentLangText("stockReportLabel")} — ${new Date().toLocaleDateString()}`, 105, 26, { align: "center" });
    doc.setTextColor(0, 0, 0);

    let y = 40;
    doc.setFillColor(243, 242, 255);
    doc.rect(11, y - 5, 188, 8, "F");
    doc.setFont(undefined, "bold");
    doc.setTextColor(99, 102, 241);
    doc.text("Item", 14, y);
    doc.text("Stock (PCS)", 110, y);
    doc.text("MRP", 150, y);
    doc.text("Value", 194, y, { align: "right" });
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    y += 8;

    let grandTotal = 0;
    stockItems.forEach((item, i) => {
      if (y > 260) {
        doc.addPage();
        doc.setDrawColor(99, 102, 241);
        doc.roundedRect(8, 8, 194, 281, 3, 3);
        y = 20;
      }
      if (i % 2 === 1) {
        doc.setFillColor(250, 250, 255);
        doc.rect(11, y - 5, 188, 7, "F");
      }
      const mrp = item.mrp || item.sell;
      const value = item.stock * mrp;
      grandTotal += value;
      doc.text(item.name, 14, y);
      doc.text(String(item.stock), 110, y);
      doc.text(`Rs.${mrp.toFixed(2)}`, 150, y);
      doc.setFont(undefined, "bold");
      doc.text(`Rs. ${value.toFixed(2)}`, 194, y, { align: "right" });
      doc.setFont(undefined, "normal");
      y += 7;
    });

    y += 3;
    doc.setDrawColor(99, 102, 241);
    doc.line(11, y, 199, y);
    y += 10;
    doc.setFillColor(99, 102, 241);
    doc.rect(11, y - 7, 188, 10, "F");
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${currentLangText("totalStockValueLabel")}: Rs. ${grandTotal.toFixed(2)}`, 194, y, { align: "right" });
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text("Generated with Smart Calculator v2.0 — Developed by Swapan", 105, 285, { align: "center" });

    doc.save(`Stock_Report_${Date.now()}.pdf`);
    showToast(currentLangText("pdfGenerated"), "success");
  } catch (err) {
    console.error(err);
    showToast(currentLangText("pdfFailed"), "error");
  } finally {
    bmStockPdfBtn.disabled = false;
  }
});

const loadExcelJsLib = makeLazyLoader("https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js");

bmStockExcelBtn.addEventListener("click", async () => {
  const stockItems = bmCatalog.filter(item => item.unit === "pcs" && item.stock > 0);
  if (stockItems.length === 0) {
    showToast(currentLangText("noStockYet"), "error");
    return;
  }
  bmStockExcelBtn.disabled = true;
  showToast(currentLangText("pdfGenerating"), "info");
  try {
    if (!window.ExcelJS) await loadExcelJsLib();
    const workbook = new window.ExcelJS.Workbook();
    workbook.creator = "Smart Calculator";
    const sheet = workbook.addWorksheet("Stock Report", {
      views: [{ state: "frozen", ySplit: 4 }] // header rows stay visible while scrolling
    });

    const ACCENT = "FF6366F1"; // matches the app's Bill Maker accent color
    const LIGHT = "FFF3F2FF";

    sheet.mergeCells("A1:D1");
    sheet.getCell("A1").value = bmShopProfile.name || "Stock Report";
    sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT } };
    sheet.getRow(1).height = 28;

    sheet.mergeCells("A2:D2");
    sheet.getCell("A2").value = `${currentLangText("stockReportLabel")} — ${new Date().toLocaleDateString()}`;
    sheet.getCell("A2").font = { italic: true, size: 10, color: { argb: "FFFFFFFF" } };
    sheet.getCell("A2").alignment = { horizontal: "center" };
    sheet.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT } };

    sheet.getRow(3).values = [];
    const headerRow = sheet.getRow(4);
    headerRow.values = ["Item", "Stock (PCS)", "MRP (₹)", "Total Value (₹)"];
    headerRow.font = { bold: true, color: { argb: "FF1a1a2e" } };
    headerRow.eachCell(cell => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT } };
      cell.border = { bottom: { style: "medium", color: { argb: ACCENT } } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    headerRow.height = 20;

    let grandTotal = 0;
    stockItems.forEach((item, i) => {
      const mrp = item.mrp || item.sell;
      const value = item.stock * mrp;
      grandTotal += value;
      const row = sheet.addRow([item.name, item.stock, mrp, value]);
      row.getCell(2).alignment = { horizontal: "center" };
      row.getCell(3).numFmt = "₹#,##0.00";
      row.getCell(4).numFmt = "₹#,##0.00";
      row.getCell(4).font = { bold: true };
      if (i % 2 === 1) {
        row.eachCell(cell => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFF" } }; });
      }
      row.eachCell(cell => { cell.border = { bottom: { style: "thin", color: { argb: "FFE0E0F0" } } }; });
    });

    const totalRow = sheet.addRow(["", "", currentLangText("totalStockValueLabel"), grandTotal]);
    totalRow.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
    totalRow.getCell(4).numFmt = "₹#,##0.00";
    totalRow.eachCell(cell => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT } }; });
    totalRow.getCell(3).alignment = { horizontal: "right" };

    sheet.columns = [{ width: 30 }, { width: 14 }, { width: 14 }, { width: 16 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Stock_Report_${Date.now()}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);

    showToast(currentLangText("pdfGenerated"), "success");
  } catch (err) {
    console.error(err);
    showToast(currentLangText("pdfFailed"), "error");
  } finally {
    bmStockExcelBtn.disabled = false;
  }
});


bmVoiceAddBtn.addEventListener("click", () => {
  const recognition = getSpeechRecognition();
  if (!recognition) {
    bmVoiceAddStatus.className = "error";
    bmVoiceAddStatus.textContent = currentLangText("voiceInputNotSupported");
    return;
  }
  bmVoiceAddBtn.classList.add("listening");
  bmVoiceAddStatus.className = "scanning";
  bmVoiceAddStatus.textContent = currentLangText("listening");

  recognition.onresult = (event) => {
    const alternatives = Array.from(event.results[0]).map(r => r.transcript);
    processVoiceBillCommand(alternatives);
  };
  recognition.onerror = () => {
    bmVoiceAddStatus.className = "error";
    bmVoiceAddStatus.textContent = currentLangText("didntCatch");
  };
  recognition.onend = () => bmVoiceAddBtn.classList.remove("listening");

  try { recognition.start(); } catch (e) { bmVoiceAddBtn.classList.remove("listening"); }
});

// --- Unit selector for the item currently being added to the bill ---
function selectUnit(unit) {
  bmSelectedUnit = unit;
  Object.entries(unitButtons).forEach(([u, btn]) => btn.classList.toggle("active", u === unit));
  if (bmMatchedCatalogItem) {
    const rate = getPerUnitRate(bmMatchedCatalogItem, unit);
    if (rate !== null) bmItemPrice.value = rate.toFixed(2);
    if (bmMatchedCatalogItem.mrp > 0) bmItemMrp.value = bmMatchedCatalogItem.mrp.toFixed(2);
  }
  updateLiveAmount();
}
Object.entries(unitButtons).forEach(([unit, btn]) => btn.addEventListener("click", () => selectUnit(unit)));

// Typing a name that exactly matches a saved catalog item autofills its
// converted rate, unit, and GST rate.
let bmItemGstTouched = false;
bmItemGst.addEventListener("change", () => { bmItemGstTouched = true; });

bmItemName.addEventListener("input", () => {
  const match = bmCatalog.find(item => item.name.toLowerCase() === bmItemName.value.trim().toLowerCase());
  if (match) {
    bmMatchedCatalogItem = match;
    bmItemGst.value = match.gst;
    selectUnit(match.unit === "pcs" ? "pcs" : match.unit); // also autofills price via selectUnit
    bmItemMrp.value = match.mrp > 0 ? match.mrp.toFixed(2) : "";
  } else {
    bmMatchedCatalogItem = null;
    if (!bmItemGstTouched) {
      const guess = guessGstForName(bmItemName.value);
      if (guess !== null) bmItemGst.value = String(guess);
    }
  }
});

function updateLiveAmount() {
  const qty = validNumber(bmItemQty.value);
  const rate = validNumber(bmItemPrice.value);
  if (qty === null || rate === null) {
    bmLiveAmount.innerHTML = "";
    return;
  }
  const discountPct = validNumber(bmItemDiscount.value) || 0;
  const base = qty * rate;
  const afterDiscount = base - base * (discountPct / 100);

  // Shopkeeper-only profit preview — bought-at vs selling-at, after
  // whatever discount is being given right now. Never printed on the
  // customer's invoice, just here to help decide the discount on the spot.
  let profitBadge = "";
  if (bmMatchedCatalogItem && bmMatchedCatalogItem.cost > 0) {
    const costPerUnit = getPerUnitRate({ ...bmMatchedCatalogItem, sell: bmMatchedCatalogItem.cost }, bmSelectedUnit);
    const costTotal = costPerUnit !== null ? costPerUnit * qty : 0;
    const profit = afterDiscount - costTotal;
    const profitPct = costTotal > 0 ? (profit / costTotal) * 100 : 0;
    const isLoss = profit < 0;
    profitBadge = `
      <span class="bm-profit-pill ${isLoss ? "loss" : "gain"}">
        ${isLoss ? "📉" : "📈"} ${currentLangText("profitLabel")} ${isLoss ? "-" : ""}${fmtMoney(Math.abs(profit))} (${profitPct.toFixed(1)}%)
      </span>
      <span class="bm-bought-at">${currentLangText("boughtAtLabel")} ${fmtMoney(costTotal)}</span>
    `;
  }
  bmLiveAmount.innerHTML = `<span class="bm-amount-value">= ${fmtMoney(afterDiscount)}</span>${profitBadge}`;
}
[bmItemQty, bmItemPrice, bmItemDiscount].forEach(el => el.addEventListener("input", updateLiveAmount));

// --- The actual bill: items added to this particular invoice ---
function renderBmItems() {
  if (bmItems.length === 0) {
    bmItemList.innerHTML = `<li class="bm-empty">${currentLangText("noItemsYet")}</li>`;
  } else {
    bmItemList.innerHTML = bmItems.map((item, i) => {
      const discNote = item.discount > 0 ? ` · -${item.discount}%` : "";
      return `
      <li>
        <div class="bm-item-info">
          <span class="bm-item-name">${item.name}</span>
          <span class="bm-item-qty">${item.qty} ${item.unit} × <span class="bm-editable-price bm-editable-rate" data-index="${i}" title="${currentLangText("tapToEdit")}">${fmtMoney(item.rate)}</span>${discNote} · GST ${item.gst}%</span>
        </div>
        <span class="bm-item-price">${fmtMoney(item.amount)}</span>
        <button class="bm-remove-btn" data-index="${i}" title="Remove">✕</button>
      </li>`;
    }).join("");
  }

  renderFinanceResult(bmTotal, computeBillTotals().resultRows);

  bmItemList.querySelectorAll(".bm-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      bmItems.splice(parseInt(btn.dataset.index, 10), 1);
      saveBmItems();
      renderBmItems();
      showToast(currentLangText("itemRemoved"), "info");
    });
  });

  // Tap a bill line's rate to edit it — recomputes that line's amount and
  // the whole bill total immediately, no need to remove and re-add.
  bmItemList.querySelectorAll(".bm-editable-rate").forEach(span => {
    span.addEventListener("click", () => {
      const idx = parseInt(span.dataset.index, 10);
      const item = bmItems[idx];
      const input = document.createElement("input");
      input.type = "number";
      input.inputMode = "decimal";
      input.className = "bm-inline-edit";
      input.value = item.rate;
      span.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const newRate = validNumber(input.value);
        if (newRate !== null && newRate > 0) {
          item.rate = newRate;
          item.amount = item.qty * item.rate * (1 - item.discount / 100);
          saveBmItems();
          showToast(currentLangText("priceUpdated"), "success");
        }
        renderBmItems();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); input.blur(); }
        if (e.key === "Escape") { renderBmItems(); }
      });
    });
  });
}

// Central place for every total/discount/GST number so the on-screen
// summary, the PDF, and the JPG all agree with each other.
function computeBillTotals() {
  const subtotal = bmItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const itemDiscountTotal = bmItems.reduce((sum, item) => sum + (item.qty * item.rate) * (item.discount / 100), 0);
  const afterItemDiscounts = subtotal - itemDiscountTotal;

  const billDiscountPct = validNumber(bmBillDiscount.value) || 0;
  const billDiscountAmt = afterItemDiscounts * (billDiscountPct / 100);
  const grandTotal = afterItemDiscounts - billDiscountAmt;

  // Prices are treated as GST-inclusive (standard Indian retail practice) —
  // this splits the final total into taxable value + GST for a proper bill,
  // it does not add tax on top again.
  const gstBreakup = bmItems.reduce((acc, item) => {
    const itemFinal = (item.qty * item.rate) * (1 - item.discount / 100) * (1 - billDiscountPct / 100);
    const base = itemFinal / (1 + item.gst / 100);
    acc.taxable += base;
    acc.gst += itemFinal - base;
    return acc;
  }, { taxable: 0, gst: 0 });

  const resultRows = [{ label: currentLangText("subtotalLabel"), value: fmtMoney(subtotal) }];
  if (itemDiscountTotal > 0) resultRows.push({ label: currentLangText("itemDiscountsLabel"), value: `- ${fmtMoney(itemDiscountTotal)}` });
  if (billDiscountAmt > 0) resultRows.push({ label: currentLangText("billDiscountAmtLabel"), value: `- ${fmtMoney(billDiscountAmt)}` });
  resultRows.push({ label: currentLangText("taxableValueLabel"), value: fmtMoney(gstBreakup.taxable) });
  resultRows.push({ label: currentLangText("gstTotalLabel"), value: fmtMoney(gstBreakup.gst) });
  resultRows.push({ label: currentLangText("grandTotalBillLabel"), value: fmtMoney(grandTotal), highlight: true });

  // Shown only in the app itself, on-screen — this never goes on the
  // printed PDF/JPG, since a customer shouldn't see your margin.
  const hasCostData = bmItems.some(item => item.cost > 0);
  let totalProfit = 0;
  if (hasCostData) {
    const totalCost = bmItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    totalProfit = grandTotal - totalCost;
    const isLoss = totalProfit < 0;
    resultRows.push({
      label: `${isLoss ? "📉" : "📈"} ${currentLangText("totalProfitLabel")}`,
      value: `${isLoss ? "- " : ""}${fmtMoney(Math.abs(totalProfit))}`,
      highlight: true,
      variant: isLoss ? "profit-negative" : "profit-positive"
    });
  }

  return { subtotal, itemDiscountTotal, billDiscountAmt, grandTotal, gstBreakup, totalProfit, resultRows };
}
bmBillDiscount.addEventListener("input", renderBmItems);

// --- Bill Reports: a local log of every bill you've actually printed
// (PDF or JPG), so you can look back at what you billed before. Saved only
// in this browser, same as everything else here — no server involved. ---
let bmBillHistory = JSON.parse(localStorage.getItem("calc_bm_bill_history") || "[]");
function saveBmBillHistory() {
  localStorage.setItem("calc_bm_bill_history", JSON.stringify(bmBillHistory));
}

function recordBillToHistory(totals) {
  bmBillHistory.unshift({
    invoiceNo: bmInvoiceNo.textContent,
    date: new Date().toISOString(),
    customer: bmCustomerName.value.trim() || "-",
    total: totals.grandTotal,
    items: bmItems.map(it => ({ name: it.name, qty: it.qty, unit: it.unit, amount: it.amount }))
  });
  bmBillHistory = bmBillHistory.slice(0, 100); // keep the log from growing forever
  saveBmBillHistory();
  renderBmReports();
}

function renderBmReports() {
  if (bmBillHistory.length === 0) {
    bmReportsList.innerHTML = `<li class="bm-empty">${currentLangText("noReportsYet")}</li>`;
    return;
  }
  bmReportsList.innerHTML = bmBillHistory.map((bill, i) => {
    const dateStr = new Date(bill.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    const itemsHtml = bill.items.map(it => `
      <div class="bm-report-item-row"><span>${it.name} (${it.qty} ${it.unit})</span><span>${fmtMoney(it.amount)}</span></div>
    `).join("");
    return `
      <li class="bm-report-card">
        <div class="bm-report-summary" data-index="${i}">
          <div class="bm-item-info">
            <span class="bm-item-name">${bill.invoiceNo} — ${bill.customer}</span>
            <span class="bm-item-qty">${dateStr} · ${bill.items.length} item(s)</span>
          </div>
          <span class="bm-item-price">${fmtMoney(bill.total)}</span>
        </div>
        <div class="bm-report-detail">${itemsHtml}</div>
      </li>`;
  }).join("");

  bmReportsList.querySelectorAll(".bm-report-summary").forEach(row => {
    row.addEventListener("click", () => {
      row.nextElementSibling.classList.toggle("show");
    });
  });
}

bmReportsClearBtn.addEventListener("click", () => {
  bmBillHistory = [];
  saveBmBillHistory();
  renderBmReports();
  showToast(currentLangText("reportsCleared"), "info");
});

function addBmItem() {
  const name = bmItemName.value.trim();
  const qty = validNumber(bmItemQty.value) || 1;
  const rate = validNumber(bmItemPrice.value);
  const gst = parseFloat(bmItemGst.value) || 0;
  const discount = validNumber(bmItemDiscount.value) || 0;

  if (!name || rate === null || rate <= 0) {
    showToast(currentLangText("fillItemError"), "error");
    return;
  }

  const base = qty * rate;
  const amount = base - base * (discount / 100);
  // MRP is the fixed price printed on the packaging — it does NOT shrink
  // for partial quantities (500g out of a 1kg pack still references the
  // same printed MRP, not a synthetic scaled-down number). Manual entry in
  // the field always wins; otherwise falls back to the catalog's saved MRP.
  let mrp = 0;
  const manualMrp = validNumber(bmItemMrp.value);
  if (manualMrp !== null && manualMrp > 0) {
    mrp = manualMrp;
  } else if (bmMatchedCatalogItem && bmMatchedCatalogItem.mrp > 0) {
    mrp = bmMatchedCatalogItem.mrp;
  }
  let cost = 0;
  if (bmMatchedCatalogItem && bmMatchedCatalogItem.cost > 0) {
    const costPerUnit = getPerUnitRate({ ...bmMatchedCatalogItem, sell: bmMatchedCatalogItem.cost }, bmSelectedUnit);
    if (costPerUnit !== null) cost = costPerUnit * qty;
  }
  bmItems.push({ name, qty, unit: bmSelectedUnit, rate, mrp, gst, discount, amount, cost });
  saveBmItems();
  renderBmItems();
  speak(`${name} ${amount.toFixed(0)}`, I18N[currentLang].speech);

  bmItemName.value = "";
  bmItemQty.value = "1";
  bmItemPrice.value = "";
  bmItemMrp.value = "";
  bmItemDiscount.value = "";
  bmLiveAmount.innerHTML = "";
  bmMatchedCatalogItem = null;
  bmItemGstTouched = false;
  bmItemName.focus();
}

bmAddItemBtn.addEventListener("click", addBmItem);
[bmItemName, bmItemQty, bmItemPrice, bmItemMrp, bmItemDiscount].forEach(input => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addBmItem(); }
  });
});

// Clearing a whole bill is destructive and easy to hit by accident mid-sale
// — first tap arms it (button turns red, "Tap again to confirm") and
// auto-disarms after a few seconds if not confirmed.
let bmClearArmed = false;
let bmClearTimer = null;
const bmClearBtnLabel = bmClearBtn.querySelector("[data-i18n='clearBillBtn']");
const bmClearBtnOriginalText = bmClearBtnLabel ? bmClearBtnLabel.textContent : "Clear";

function disarmClearBtn() {
  bmClearArmed = false;
  bmClearBtn.classList.remove("armed");
  if (bmClearBtnLabel) bmClearBtnLabel.textContent = bmClearBtnOriginalText;
  clearTimeout(bmClearTimer);
}

bmClearBtn.addEventListener("click", () => {
  if (!bmClearArmed) {
    bmClearArmed = true;
    bmClearBtn.classList.add("armed");
    if (bmClearBtnLabel) bmClearBtnLabel.textContent = currentLangText("tapAgainToClear");
    showToast(currentLangText("tapAgainToClear"), "info");
    bmClearTimer = setTimeout(disarmClearBtn, 3500);
    return;
  }
  bmItems = [];
  bmBillDiscount.value = "0";
  saveBmItems();
  renderBmItems();
  disarmClearBtn();
  showToast(currentLangText("billCleared"), "info");
});

// jsPDF, html2canvas, and the OCR engine all load on demand — keep the app
// itself fast, only pull in a heavy library when it's actually used.
function makeLazyLoader(url) {
  let promise = null;
  return () => {
    if (promise) return promise;
    promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.body.appendChild(script);
    });
    return promise;
  };
}
const loadJsPdfLib = makeLazyLoader("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
loadJsPdfLib.check = () => window.jspdf;
const loadHtml2CanvasLibRaw = makeLazyLoader("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
function loadJsPdf() { return window.jspdf ? Promise.resolve() : loadJsPdfLib(); }
function loadHtml2Canvas() { return window.html2canvas ? Promise.resolve() : loadHtml2CanvasLibRaw(); }

// Builds the printable invoice as real DOM (used for the JPG export) with a
// bordered, gradient-header design — shop name gets distinct large type,
// items table includes GST/discount per line, QR shown if uploaded.
function buildInvoiceHtml() {
  const totals = computeBillTotals();
  const rowsHtml = bmItems.map((item, idx) => {
    const stripe = idx % 2 === 1 ? "background:#f9f8ff;" : "";
    const td = `padding:9px 6px;border-bottom:1px solid #e6e3fa;${stripe}`;
    const rateCell = bmPrintPrefs.rate
      ? `<td style="${td}text-align:center;">₹${item.rate.toFixed(2)}${bmPrintPrefs.mrp && item.mrp > 0 && Math.abs(item.mrp - item.rate) > 0.01 ? `<br><span style="font-size:9px;color:#999;">MRP ₹${item.mrp.toFixed(2)}</span>` : ""}</td>`
      : "";
    const gstCell = bmPrintPrefs.gst ? `<td style="${td}text-align:center;">${item.gst}%</td>` : "";
    const discCell = bmPrintPrefs.discount ? `<td style="${td}text-align:center;">${item.discount > 0 ? item.discount + "%" : "-"}</td>` : "";
    return `
    <tr>
      <td style="${td}border-left:3px solid #6366f1;">${item.name}</td>
      <td style="${td}text-align:center;">${item.qty} ${item.unit}</td>
      ${rateCell}${gstCell}${discCell}
      <td style="${td}text-align:right;font-weight:600;">₹${item.amount.toFixed(2)}</td>
    </tr>`;
  }).join("");

  const qrHtml = bmShopProfile.qr
    ? `<div style="text-align:center;">
        <img src="${bmShopProfile.qr}" style="width:70px;height:70px;object-fit:contain;background:#fff;border-radius:8px;padding:4px;border:1px solid #ddd;">
        <div style="font-size:9px;font-weight:700;color:#fff;margin-top:3px;letter-spacing:0.5px;">${currentLangText("scanAndPayLabel")}</div>
      </div>`
    : "";

  const wrap = document.createElement("div");
  wrap.style.cssText = "width:650px;background:#ffffff;color:#1a1a1a;font-family:Poppins,Arial,sans-serif;border:3px solid #6366f1;border-radius:14px;overflow:hidden;";
  wrap.innerHTML = `
    <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:22px 28px;color:#fff;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:26px;font-weight:800;letter-spacing:0.5px;">${bmShopProfile.name || "INVOICE"}</div>
        <div style="font-size:11px;opacity:0.9;margin-top:4px;">${bmShopProfile.address || ""}</div>
        <div style="font-size:11px;opacity:0.9;">
          ${bmShopProfile.mobile ? `Mob: ${bmShopProfile.mobile}` : ""}
          ${bmShopProfile.gst ? ` &nbsp;|&nbsp; GSTIN: ${bmShopProfile.gst}` : ""}
          ${bmShopProfile.pan ? ` &nbsp;|&nbsp; PAN: ${bmShopProfile.pan}` : ""}
        </div>
        ${bmShopProfile.distName ? `<div style="font-size:11px;opacity:0.85;margin-top:2px;">Distributor: ${bmShopProfile.distName}${bmShopProfile.distContact ? " · " + bmShopProfile.distContact : ""}</div>` : ""}
      </div>
      ${qrHtml}
    </div>
    <div style="padding:24px 28px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:14px;">
        <div>
          <strong>Bill To:</strong> ${bmCustomerName.value.trim() || "-"}<br>
          ${bmCustomerPhone.value.trim() ? `Phone: ${bmCustomerPhone.value.trim()}<br>` : ""}
          ${bmCustomerAddress.value.trim() ? `Address: ${bmCustomerAddress.value.trim()}` : ""}
        </div>
        <div style="text-align:right;">
          <strong style="color:#6366f1;">${bmInvoiceNo.textContent}</strong><br>
          ${new Date().toLocaleDateString()}
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead>
          <tr style="background:#f3f2ff;border-bottom:2px solid #6366f1;">
            <th style="text-align:left;padding:8px 6px;">Item</th>
            <th style="text-align:center;padding:8px 6px;">Qty</th>
            ${bmPrintPrefs.rate ? '<th style="text-align:center;padding:8px 6px;">Rate</th>' : ""}
            ${bmPrintPrefs.gst ? '<th style="text-align:center;padding:8px 6px;">GST</th>' : ""}
            ${bmPrintPrefs.discount ? '<th style="text-align:center;padding:8px 6px;">Disc.</th>' : ""}
            <th style="text-align:right;padding:8px 6px;">Amount</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div style="margin-top:14px;padding-top:10px;border-top:1px solid #eee;font-size:13px;">
        <div style="display:flex;justify-content:space-between;padding:2px 0;"><span>Subtotal</span><span>₹${totals.subtotal.toFixed(2)}</span></div>
        ${totals.itemDiscountTotal > 0 ? `<div style="display:flex;justify-content:space-between;padding:2px 0;color:#e11d48;"><span>Item Discounts</span><span>- ₹${totals.itemDiscountTotal.toFixed(2)}</span></div>` : ""}
        ${totals.billDiscountAmt > 0 ? `<div style="display:flex;justify-content:space-between;padding:2px 0;color:#e11d48;"><span>Bill Discount</span><span>- ₹${totals.billDiscountAmt.toFixed(2)}</span></div>` : ""}
        <div style="display:flex;justify-content:space-between;padding:2px 0;opacity:0.75;"><span>Taxable Value</span><span>₹${totals.gstBreakup.taxable.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:2px 0;opacity:0.75;"><span>GST</span><span>₹${totals.gstBreakup.gst.toFixed(2)}</span></div>
      </div>
      <div style="text-align:right;font-size:20px;font-weight:800;margin-top:10px;padding-top:10px;border-top:2px solid #6366f1;color:#6366f1;">
        Total: ₹${totals.grandTotal.toFixed(2)}
      </div>
      <div style="text-align:center;font-size:10px;opacity:0.5;margin-top:22px;">
        Generated with Smart Calculator v2.0 — Developed by Swapan
      </div>
    </div>
  `;
  return wrap;
}

bmGeneratePdfBtn.addEventListener("click", async () => {
  if (bmItems.length === 0) {
    showToast(currentLangText("addAtLeastOneItem"), "error");
    return;
  }
  bmGeneratePdfBtn.disabled = true;
  showToast(currentLangText("pdfGenerating"), "info");

  try {
    await loadJsPdf();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const name = bmCustomerName.value.trim() || "-";
    const phone = bmCustomerPhone.value.trim() || "-";
    const address = bmCustomerAddress.value.trim() || "-";
    const totals = computeBillTotals();

    // Bordered page + gradient-style header band
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.roundedRect(8, 8, 194, 281, 3, 3);

    doc.setFillColor(99, 102, 241);
    doc.rect(8, 8, 194, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont(undefined, "bold");
    doc.text(bmShopProfile.name || "INVOICE", 14, 20);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    if (bmShopProfile.address) doc.text(bmShopProfile.address, 14, 26);
    const shopLine = [
      bmShopProfile.mobile && `Mob: ${bmShopProfile.mobile}`,
      bmShopProfile.gst && `GSTIN: ${bmShopProfile.gst}`,
      bmShopProfile.pan && `PAN: ${bmShopProfile.pan}`
    ].filter(Boolean).join("   |   ");
    if (shopLine) doc.text(shopLine, 14, 31);

    if (bmShopProfile.qr) {
      try {
        const qrFormat = bmShopProfile.qr.includes("image/jpeg") || bmShopProfile.qr.includes("image/jpg") ? "JPEG" : "PNG";
        doc.addImage(bmShopProfile.qr, qrFormat, 172, 11, 22, 22);
        doc.setFontSize(6.5);
        doc.setFont(undefined, "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(currentLangText("scanAndPayLabel"), 183, 35.5, { align: "center" });
      } catch (e) { /* unsupported image format, skip */ }
    }

    doc.setTextColor(0, 0, 0);
    let y = 42;
    if (bmShopProfile.distName) {
      doc.setFontSize(8);
      doc.setFont(undefined, "italic");
      doc.text(`Distributor: ${bmShopProfile.distName}${bmShopProfile.distContact ? " · " + bmShopProfile.distContact : ""}`, 14, y);
      y += 6;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Bill To: ${name}`, 14, y + 4);
    doc.text(`Phone: ${phone}`, 14, y + 10);
    doc.text(`Address: ${address}`, 14, y + 16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(99, 102, 241);
    doc.text(bmInvoiceNo.textContent, 196, y + 4, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, y + 10, { align: "right" });

    y += 26;
    doc.setFillColor(243, 242, 255);
    doc.rect(11, y - 5, 188, 8, "F");
    doc.setFont(undefined, "bold");
    doc.setFontSize(8);

    // Build the optional columns (Rate/GST/Discount) from the Invoice
    // Columns preferences, spacing them evenly between Qty and Amount.
    // Item, Qty, and Amount always show — those aren't optional.
    // colEndX is computed from the actual widest amount in this bill (not
    // a fixed number) — a fixed endpoint was letting big amounts like
    // "Rs. 1,234.56" visually collide with the Discount column next to it.
    const activeCols = [];
    if (bmPrintPrefs.rate) activeCols.push("rate");
    if (bmPrintPrefs.gst) activeCols.push("gst");
    if (bmPrintPrefs.discount) activeCols.push("discount");
    doc.setFontSize(8.5);
    const maxAmountWidth = bmItems.reduce((max, item) => {
      const w = doc.getTextWidth(`Rs. ${item.amount.toFixed(2)}`);
      return Math.max(max, w);
    }, doc.getTextWidth("Rs. 0.00"));
    doc.setFontSize(8);
    const colStartX = 108;
    const colEndX = Math.max(colStartX + 20, 194 - maxAmountWidth - 8);
    const colPositions = {};
    if (activeCols.length > 0) {
      const step = activeCols.length > 1 ? (colEndX - colStartX) / (activeCols.length - 1) : 0;
      activeCols.forEach((col, i) => { colPositions[col] = activeCols.length > 1 ? colStartX + i * step : colStartX; });
    }
    const colLabels = { rate: "Rate", gst: "GST", discount: "Disc." };

    doc.text("Item", 14, y);
    doc.text("Qty", 90, y);
    Object.entries(colPositions).forEach(([col, x]) => doc.text(colLabels[col], x, y));
    doc.text("Amount", 194, y, { align: "right" });
    doc.setFont(undefined, "normal");
    y += 8;

    // Long item names used to run straight into the price columns and
    // visually cover the amount — this clips each name to fit its own
    // column so every price stays clearly readable.
    const ITEM_COL_MAX_WIDTH = 72;
    function fitText(text, maxWidth) {
      if (doc.getTextWidth(text) <= maxWidth) return text;
      let truncated = text;
      while (truncated.length > 1 && doc.getTextWidth(truncated + "...") > maxWidth) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + "...";
    }

    doc.setFontSize(8.5);
    bmItems.forEach((item, idx) => {
      const hasMrp = bmPrintPrefs.mrp && colPositions.rate !== undefined && item.mrp > 0 && Math.abs(item.mrp - item.rate) > 0.01;
      const rowHeight = hasMrp ? 10.5 : 7;
      if (y > (hasMrp ? 257 : 260)) { doc.addPage(); y = 20; }

      // Alternating row tint + a border line under every row — this is
      // what was missing before (no separators at all between items,
      // just one line under the header), makes a long bill much easier
      // to scan line by line.
      if (idx % 2 === 1) {
        doc.setFillColor(249, 248, 255);
        doc.rect(11, y - 5, 188, rowHeight, "F");
      }

      doc.setTextColor(0, 0, 0);
      doc.text(fitText(item.name, ITEM_COL_MAX_WIDTH), 14, y);
      doc.text(`${item.qty} ${item.unit}`, 90, y);
      if (colPositions.rate !== undefined) doc.text(`Rs.${item.rate.toFixed(2)}`, colPositions.rate, y);
      if (colPositions.gst !== undefined) doc.text(`${item.gst}%`, colPositions.gst, y);
      if (colPositions.discount !== undefined) doc.text(item.discount > 0 ? `${item.discount}%` : "-", colPositions.discount, y);
      doc.text(`Rs. ${item.amount.toFixed(2)}`, 194, y, { align: "right" });
      if (hasMrp) {
        doc.setFontSize(6.5);
        doc.setTextColor(150, 150, 150);
        doc.text(`MRP Rs.${item.mrp.toFixed(2)}`, colPositions.rate, y + 3.5);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8.5);
        y += 3.5;
      }
      y += 4;
      doc.setDrawColor(230, 228, 245);
      doc.setLineWidth(0.2);
      doc.line(11, y, 199, y);
      y += 3;
    });

    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(11, y, 199, y);
    y += 7;
    doc.setFontSize(9);
    doc.text(`Subtotal: Rs. ${totals.subtotal.toFixed(2)}`, 194, y, { align: "right" }); y += 6;
    if (totals.itemDiscountTotal > 0) { doc.text(`Item Discounts: - Rs. ${totals.itemDiscountTotal.toFixed(2)}`, 194, y, { align: "right" }); y += 6; }
    if (totals.billDiscountAmt > 0) { doc.text(`Bill Discount: - Rs. ${totals.billDiscountAmt.toFixed(2)}`, 194, y, { align: "right" }); y += 6; }
    doc.text(`Taxable Value: Rs. ${totals.gstBreakup.taxable.toFixed(2)}`, 194, y, { align: "right" }); y += 6;
    doc.text(`GST: Rs. ${totals.gstBreakup.gst.toFixed(2)}`, 194, y, { align: "right" }); y += 9;

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(99, 102, 241);
    doc.text(`Total: Rs. ${totals.grandTotal.toFixed(2)}`, 194, y, { align: "right" });
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text("Generated with Smart Calculator v2.0 — Developed by Swapan", 105, 285, { align: "center" });

    const safeName = name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "customer";
    doc.save(`${bmInvoiceNo.textContent}_${safeName}.pdf`);
    showToast(currentLangText("pdfGenerated"), "success");
    recordBillToHistory(totals);
    upsertSavedCustomer();
    advanceInvoiceNo();
  } catch (err) {
    console.error(err);
    showToast(currentLangText("pdfFailed"), "error");
  } finally {
    bmGeneratePdfBtn.disabled = false;
  }
});

async function renderBillAsJpgDataUrl() {
  const invoiceEl = buildInvoiceHtml();
  invoiceEl.style.position = "fixed";
  invoiceEl.style.left = "-9999px";
  document.body.appendChild(invoiceEl);
  try {
    await loadHtml2Canvas();
    // scale 4 = high-resolution export, sharp enough to print
    const canvas = await window.html2canvas(invoiceEl, { scale: 4, backgroundColor: "#ffffff" });
    return canvas.toDataURL("image/jpeg", 0.95);
  } finally {
    document.body.removeChild(invoiceEl);
  }
}

bmGenerateJpgBtn.addEventListener("click", async () => {
  if (bmItems.length === 0) {
    showToast(currentLangText("addAtLeastOneItem"), "error");
    return;
  }
  bmGenerateJpgBtn.disabled = true;
  showToast(currentLangText("jpgGenerating"), "info");

  try {
    const dataUrl = await renderBillAsJpgDataUrl();
    const name = bmCustomerName.value.trim() || "customer";
    const safeName = name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "customer";

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${bmInvoiceNo.textContent}_${safeName}.jpg`;
    link.click();

    showToast(currentLangText("jpgGenerated"), "success");
    recordBillToHistory(computeBillTotals());
    upsertSavedCustomer();
    advanceInvoiceNo();
  } catch (err) {
    console.error(err);
    showToast(currentLangText("jpgFailed"), "error");
  } finally {
    bmGenerateJpgBtn.disabled = false;
  }
});

// --- WhatsApp share ---
// Browsers/web apps cannot silently attach a file to someone's WhatsApp —
// there is no public API for that. What actually works: download the PDF,
// then open a WhatsApp chat with a pre-filled message, and the person
// attaches the just-downloaded file themselves in the WhatsApp UI.
bmWhatsappBtn.addEventListener("click", async () => {
  const whatsapp = bmCustomerWhatsapp.value.trim() || bmCustomerPhone.value.trim();
  if (!whatsapp) {
    showToast(currentLangText("needCustomerWhatsapp"), "error");
    return;
  }
  if (bmItems.length === 0) {
    showToast(currentLangText("addAtLeastOneItem"), "error");
    return;
  }
  bmGeneratePdfBtn.click(); // trigger the normal PDF download first

  const totals = computeBillTotals();
  const digits = whatsapp.replace(/\D/g, "");
  const phoneWithCode = digits.length === 10 ? `91${digits}` : digits;
  const message = encodeURIComponent(
    `Hi ${bmCustomerName.value.trim() || ""}, your bill from ${bmShopProfile.name || "us"} — Invoice ${bmInvoiceNo.textContent}, Total ₹${totals.grandTotal.toFixed(2)}. Attaching the PDF now.`
  );
  showToast(currentLangText("whatsappOpening"), "info");
  setTimeout(() => {
    window.open(`https://wa.me/${phoneWithCode}?text=${message}`, "_blank");
  }, 600); // small delay so the PDF download dialog isn't fought over by the new tab
});

// --- Auto-Fetch: read item names + amounts from a photographed invoice ---
// Reuses the same OCR pipeline as the Bill Scanner. Only name + amount are
// pulled reliably — unit/GST can't be read with confidence from arbitrary
// invoice layouts, so those are set to sensible defaults (PCS, 0% GST) and
// flagged for the shopkeeper to double-check before printing.
bmAutoFetchInput.addEventListener("change", async () => {
  const file = bmAutoFetchInput.files && bmAutoFetchInput.files[0];
  if (!file) return;

  if (file.type === "application/pdf") {
    bmAutoFetchStatus.className = "error";
    bmAutoFetchStatus.textContent = currentLangText("autoFetchPdfNotSupported");
    bmAutoFetchInput.value = "";
    return;
  }

  bmAutoFetchStatus.className = "scanning";
  bmAutoFetchStatus.textContent = currentLangText("autoFetchScanning");

  try {
    await loadTesseractLib();
    const cleanedCanvas = await preprocessBillImage(file);
    const ocrData = await runBillOCR(cleanedCanvas);
    const rawText = ocrData.text || "";

    // Try the structured wholesale/distributor invoice table first (it
    // reads a real MRP and a real per-piece Qty, using the case-pack size
    // in the product name — e.g. "24x400g" — to convert CS into pieces).
    // Falls back to the simpler name+amount reading for other bill styles.
    const structuredItems = parseDistributorInvoiceTable(rawText);
    const analysis = structuredItems.length === 0 ? analyzeBillText(rawText) : null;
    const foundCount = structuredItems.length > 0 ? structuredItems.length : (analysis ? analysis.lineItems.length : 0);

    if (foundCount === 0) {
      bmAutoFetchStatus.className = "error";
      bmAutoFetchStatus.textContent = currentLangText("autoFetchNoItems");
      return;
    }

    // These go into the saved item list, not straight onto a bill — a
    // photographed invoice only reliably gives a name and an amount (read
    // here as MRP), never a trustworthy selling price. Each needs its
    // selling price set once before it's usable for billing.
    if (structuredItems.length > 0) {
      structuredItems.forEach(li => {
        const existing = bmCatalog.find(c => c.name.toLowerCase() === li.name.toLowerCase());
        if (existing) {
          existing.mrp = li.mrp;
          existing.qty = li.qty;
        } else {
          bmCatalog.push({ name: li.name, qty: li.qty, unit: "pcs", cost: 0, costEstimated: false, costFormula: null, sell: 0, mrp: li.mrp, gst: guessGstForName(li.name) || 5, stock: 0 });
        }
      });
    } else {
      analysis.lineItems.forEach(li => {
        const existing = bmCatalog.find(c => c.name.toLowerCase() === li.label.toLowerCase());
        if (existing) {
          existing.mrp = li.amount;
        } else {
          bmCatalog.push({ name: li.label, qty: 1, unit: "pcs", cost: 0, costEstimated: false, costFormula: null, sell: 0, mrp: li.amount, gst: guessGstForName(li.label) || 5, stock: 0 });
        }
      });
    }
    saveBmCatalog();
    renderBmCatalog();

    bmAutoFetchStatus.className = "complete";
    bmAutoFetchStatus.textContent = currentLangText("autoFetchAddedToCatalog")(foundCount);
    showToast(currentLangText("autoFetchAddedToCatalog")(foundCount), "success");
  } catch (err) {
    console.error(err);
    bmAutoFetchStatus.className = "error";
    bmAutoFetchStatus.textContent = currentLangText("autoFetchFailed");
  } finally {
    bmAutoFetchInput.value = "";
  }
});


// ---------- Help Assistant ----------
// A rule-based FAQ bot — keyword-matches your question against a built-in
// knowledge base about how the app works. It runs fully offline; it isn't
// a live AI model, so it can't discuss anything outside these topics, but
// it answers instantly and works in English, Hindi, and Bengali.
const HELP_TOPICS = [
  {
    keywords: ["add item", "item add", "how to add", "add product", "search item", "item kaise", "item jode", "আইটেম যোগ", "পণ্য যোগ"],
    answer: {
      en: "Go to 🛒 Bill Maker → type the item name in the search box. If it's saved, price fills in automatically — just set quantity and tap +.",
      hi: "🛒 Bill Maker खोलें → सर्च बॉक्स में वस्तु का नाम लिखें। सेव्ड है तो कीमत अपने आप आ जाएगी — मात्रा डालें और + दबाएँ।",
      bn: "🛒 Bill Maker খুলুন → সার্চ বক্সে পণ্যের নাম লিখুন। সেভ করা থাকলে দাম নিজেই আসবে — পরিমাণ দিন ও + চাপুন।"
    }
  },
  {
    keywords: ["voice add", "speak item", "voice item", "mic item", "आवाज़ से", "बोल कर", "ভয়েসে যোগ"],
    answer: {
      en: "Tap 🎙️ Speak to Add Item and say something like \"Atta 5 kg\" or \"Lactogen 1\". If quantity isn't clear, it'll ask you before adding.",
      hi: "🎙️ Speak to Add Item दबाएँ और बोलें जैसे \"आटा 5 किलो\"। मात्रा साफ़ न हो तो यह जोड़ने से पहले पूछ लेगा।",
      bn: "🎙️ Speak to Add Item চাপুন এবং বলুন যেমন \"আটা ৫ কেজি\"। পরিমাণ স্পষ্ট না হলে যোগ করার আগে জিজ্ঞাসা করবে।"
    }
  },
  {
    keywords: ["scan bill", "bill scanner", "ocr", "photo bill", "बिल स्कैन", "বিল স্ক্যান"],
    answer: {
      en: "In Standard mode, use 📷 Bill Scanner to read amounts from a photo — works best on printed bills. For handwritten ones, use 🎤 Speak Amount instead.",
      hi: "Standard mode में 📷 Bill Scanner से फोटो से राशि पढ़ी जा सकती है — छपे हुए बिल पर बेहतर काम करता है। हाथ से लिखे बिल के लिए 🎤 Speak Amount इस्तेमाल करें।",
      bn: "Standard মোডে 📷 Bill Scanner দিয়ে ছবি থেকে পরিমাণ পড়া যায় — ছাপা বিলে ভালো কাজ করে। হাতে লেখা বিলের জন্য 🎤 Speak Amount ব্যবহার করুন।"
    }
  },
  {
    keywords: ["pdf", "generate pdf", "download pdf", "pdf kaise", "পিডিএফ"],
    answer: {
      en: "After adding items in Bill Maker, tap 📄 PDF. It downloads a formatted invoice with your shop details, items, and total.",
      hi: "Bill Maker में वस्तुएँ जोड़ने के बाद 📄 PDF दबाएँ। यह दुकान का विवरण, वस्तुएँ और कुल राशि के साथ इनवॉइस डाउनलोड करेगा।",
      bn: "Bill Maker-এ পণ্য যোগ করার পর 📄 PDF চাপুন। এটি দোকানের বিবরণ, পণ্য ও মোট সহ ইনভয়েস ডাউনলোড করবে।"
    }
  },
  {
    keywords: ["jpg", "image bill", "photo download", "jpg kaise", "জেপিজি"],
    answer: {
      en: "Tap 🖼️ JPG in Bill Maker for a high-resolution invoice image — handy for sending directly on WhatsApp.",
      hi: "Bill Maker में 🖼️ JPG दबाएँ — यह हाई-रिज़ॉल्यूशन इनवॉइस इमेज देगा, WhatsApp पर सीधे भेजने के लिए सही।",
      bn: "Bill Maker-এ 🖼️ JPG চাপুন — এটি উচ্চ-রেজোলিউশন ইনভয়েস ছবি দেবে, WhatsApp-এ সরাসরি পাঠানোর জন্য উপযুক্ত।"
    }
  },
  {
    keywords: ["gst", "tax", "जीएसटी", "জিএসটি"],
    answer: {
      en: "Set GST % per item when saving it, or use the standalone GST calculator mode. To show/hide the GST column on invoices, open ⚙️ Invoice Columns in Bill Maker.",
      hi: "वस्तु सेव करते समय GST % सेट करें, या अलग GST कैलकुलेटर मोड इस्तेमाल करें। इनवॉइस पर GST कॉलम दिखाने/छिपाने के लिए Bill Maker में ⚙️ Invoice Columns खोलें।",
      bn: "পণ্য সেভ করার সময় GST % সেট করুন, বা আলাদা GST ক্যালকুলেটর মোড ব্যবহার করুন। ইনভয়েসে GST কলাম দেখাতে/লুকাতে Bill Maker-এ ⚙️ Invoice Columns খুলুন।"
    }
  },
  {
    keywords: ["mrp", "purchase rate", "cost price", "margin", "profit", "khareed", "মুনাফা", "মার্জিন"],
    answer: {
      en: "Add MRP when saving an item and Cost Price fills in — automatically using the Nestlé baby-food formula for those specific products, or your own Margin % for anything else. Live profit shows while billing.",
      hi: "वस्तु सेव करते समय MRP डालें, Cost Price अपने आप भर जाएगी — Nestlé बेबी-फ़ूड प्रोडक्ट के लिए खास फ़ॉर्मूला से, बाकी के लिए आपके Margin % से। बिलिंग के समय लाइव मुनाफ़ा भी दिखता है।",
      bn: "পণ্য সেভ করার সময় MRP দিন, Cost Price নিজেই ভরে যাবে — Nestlé বেবি-ফুড পণ্যের জন্য নির্দিষ্ট ফর্মুলা দিয়ে, বাকিদের জন্য আপনার Margin % দিয়ে। বিলিং করার সময় লাইভ লাভও দেখাবে।"
    }
  },
  {
    keywords: ["customer", "save customer", "whatsapp number", "ग्राहक", "গ্রাহক"],
    answer: {
      en: "Customer details save automatically after you generate a bill. Next time, just start typing their name — saved details autofill.",
      hi: "बिल बनाने के बाद ग्राहक का विवरण अपने आप सेव हो जाता है। अगली बार बस नाम टाइप करना शुरू करें — बाकी सब अपने आप भर जाएगा।",
      bn: "বিল তৈরি করার পর গ্রাহকের বিবরণ নিজেই সেভ হয়ে যায়। পরের বার শুধু নাম টাইপ করা শুরু করুন — বাকি সব নিজেই ভরে যাবে।"
    }
  },
  {
    keywords: ["calculator mode", "emi", "discount calc", "split bill", "interest", "ईएमआई", "ইএমআই"],
    answer: {
      en: "Switch modes from the top strip: Standard, EMI, GST, Discount, Interest, Split Bill, or Bill Maker — each has its own calculator built for that job.",
      hi: "ऊपर की पट्टी से मोड बदलें: Standard, EMI, GST, Discount, Interest, Split Bill या Bill Maker — हर एक अपने काम के लिए बना है।",
      bn: "উপরের স্ট্রিপ থেকে মোড পরিবর্তন করুন: Standard, EMI, GST, Discount, Interest, Split Bill বা Bill Maker — প্রতিটি নিজের কাজের জন্য তৈরি।"
    }
  },
  {
    keywords: ["theme", "dark mode", "colour", "color", "थीम", "থিম"],
    answer: {
      en: "Tap the 🎨 Theme button to cycle through Light, Dark, and Colorful.",
      hi: "🎨 Theme बटन दबाकर Light, Dark और Colorful के बीच बदलें।",
      bn: "🎨 Theme বোতাম চেপে Light, Dark এবং Colorful-এর মধ্যে পরিবর্তন করুন।"
    }
  },
  {
    keywords: ["language", "hindi", "bengali", "bangla", "भाषा", "ভাষা"],
    answer: {
      en: "Tap 🌐 to cycle between English, Hindi, and Bengali — the whole app, including voice, switches with it.",
      hi: "🌐 दबाकर English, Hindi और Bengali के बीच बदलें — आवाज़ सहित पूरी ऐप उसी भाषा में हो जाएगी।",
      bn: "🌐 চাপুন English, Hindi এবং Bengali-র মধ্যে পরিবর্তন করতে — ভয়েসসহ পুরো অ্যাপ সেই ভাষায় হয়ে যাবে।"
    }
  },
  {
    keywords: ["history", "past bill", "report", "previous bill", "इतिहास", "রিপোর্ট"],
    answer: {
      en: "🕘 History shows past calculations. For past invoices specifically, open 📊 Previous Bills Report inside Bill Maker.",
      hi: "🕘 History में पुराने कैलकुलेशन दिखते हैं। पुराने इनवॉइस के लिए Bill Maker में 📊 Previous Bills Report खोलें।",
      bn: "🕘 History-তে আগের হিসাব দেখা যায়। আগের ইনভয়েসের জন্য Bill Maker-এ 📊 Previous Bills Report খুলুন।"
    }
  },
  {
    keywords: ["catalog", "manage item", "saved item", "grocery list", "kirana list", "आइटम सूची", "পণ্য তালিকা"],
    answer: {
      en: "Open 📦 Manage Saved Items in Bill Maker to add products once with their price — then just search and tap them at billing time.",
      hi: "Bill Maker में 📦 Manage Saved Items खोलें, वस्तु को एक बार कीमत के साथ जोड़ें — फिर बिलिंग के समय सर्च करके टैप करें।",
      bn: "Bill Maker-এ 📦 Manage Saved Items খুলুন, একবার দাম সহ পণ্য যোগ করুন — তারপর বিলিং করার সময় শুধু সার্চ করে ট্যাপ করুন।"
    }
  },
  {
    keywords: ["developer", "who made", "swapan", "about", "किसने बनाया", "কে বানিয়েছে"],
    answer: {
      en: "This app was developed by Swapan — you can see the credit at the bottom of the calculator.",
      hi: "यह ऐप Swapan द्वारा बनाई गई है — कैलकुलेटर के नीचे क्रेडिट देख सकते हैं।",
      bn: "এই অ্যাপটি Swapan তৈরি করেছেন — ক্যালকুলেটরের নিচে ক্রেডিট দেখতে পাবেন।"
    }
  }
];

const HELP_FALLBACK = {
  en: "I don't have an answer for that yet — I can only help with how this app works. Try asking about billing, PDF, GST, MRP, voice, or themes.",
  hi: "इसका जवाब अभी मेरे पास नहीं है — मैं सिर्फ़ इस ऐप के इस्तेमाल में मदद कर सकता हूँ। बिलिंग, PDF, GST, MRP, voice या theme के बारे में पूछें।",
  bn: "এর উত্তর এখনো আমার কাছে নেই — আমি শুধু এই অ্যাপের ব্যবহারে সাহায্য করতে পারি। বিলিং, PDF, GST, MRP, voice বা theme নিয়ে জিজ্ঞাসা করুন।"
};

const HELP_SUGGESTED_QUESTIONS = [
  { en: "How do I add an item?", hi: "वस्तु कैसे जोड़ें?", bn: "পণ্য কীভাবে যোগ করব?" },
  { en: "How does voice add work?", hi: "वॉइस ऐड कैसे काम करता है?", bn: "ভয়েস অ্যাড কীভাবে কাজ করে?" },
  { en: "How do I generate a PDF?", hi: "PDF कैसे बनाएँ?", bn: "PDF কীভাবে তৈরি করব?" },
  { en: "How does profit/margin work?", hi: "मुनाफ़ा/मार्जिन कैसे काम करता है?", bn: "লাভ/মার্জিন কীভাবে কাজ করে?" }
];

function findHelpAnswer(query) {
  const q = query.toLowerCase();
  let best = null, bestScore = 0;
  HELP_TOPICS.forEach(topic => {
    let score = 0;
    topic.keywords.forEach(kw => {
      const kwWords = kw.toLowerCase().split(/\s+/);
      const matchedCount = kwWords.filter(w => q.includes(w)).length;
      score += matchedCount === kwWords.length ? 2 : matchedCount / kwWords.length;
    });
    if (score > bestScore) { bestScore = score; best = topic; }
  });
  if (best && bestScore >= 1) return best.answer[currentLang] || best.answer.en;
  return HELP_FALLBACK[currentLang] || HELP_FALLBACK.en;
}

const helpChatToggle = document.getElementById("helpChatToggle");
const helpChatPanel = document.getElementById("helpChatPanel");
const helpChatClose = document.getElementById("helpChatClose");
const helpChatMessages = document.getElementById("helpChatMessages");
const helpChatChips = document.getElementById("helpChatChips");
const helpChatInput = document.getElementById("helpChatInput");
const helpChatSendBtn = document.getElementById("helpChatSendBtn");
const helpChatMicBtn = document.getElementById("helpChatMicBtn");
let helpChatOpened = false;

function addHelpMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `help-chat-msg ${sender}`;
  msg.textContent = text;
  helpChatMessages.appendChild(msg);
  helpChatMessages.scrollTop = helpChatMessages.scrollHeight;
}

function renderHelpChips() {
  helpChatChips.innerHTML = "";
  HELP_SUGGESTED_QUESTIONS.forEach(q => {
    const btn = document.createElement("button");
    btn.textContent = q[currentLang] || q.en;
    btn.addEventListener("click", () => sendHelpQuestion(q[currentLang] || q.en));
    helpChatChips.appendChild(btn);
  });
}

function sendHelpQuestion(text) {
  if (!text.trim()) return;
  addHelpMessage(text, "user");
  const answer = findHelpAnswer(text);
  setTimeout(() => addHelpMessage(answer, "bot"), 300); // tiny delay reads more like a real reply
  helpChatInput.value = "";
}

helpChatToggle.addEventListener("click", () => {
  const isOpen = helpChatPanel.classList.toggle("open");
  if (isOpen && !helpChatOpened) {
    helpChatOpened = true;
    const greeting = currentLang === "hi"
      ? "नमस्ते! मैं इस ऐप के इस्तेमाल में मदद कर सकता हूँ — नीचे से कोई सवाल चुनें या खुद टाइप करें।"
      : currentLang === "bn"
        ? "নমস্কার! আমি এই অ্যাপ ব্যবহারে সাহায্য করতে পারি — নিচে থেকে একটি প্রশ্ন বেছে নিন বা নিজে টাইপ করুন।"
        : "Hi! I can help with how this app works — pick a question below or type your own.";
    addHelpMessage(greeting, "bot");
    renderHelpChips();
  }
});
helpChatClose.addEventListener("click", () => helpChatPanel.classList.remove("open"));
helpChatSendBtn.addEventListener("click", () => sendHelpQuestion(helpChatInput.value));
helpChatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); sendHelpQuestion(helpChatInput.value); }
});

helpChatMicBtn.addEventListener("click", () => {
  const recognition = getSpeechRecognition();
  if (!recognition) {
    addHelpMessage(currentLangText("voiceInputNotSupported"), "bot");
    return;
  }
  helpChatMicBtn.classList.add("listening");
  recognition.onresult = (event) => sendHelpQuestion(event.results[0][0].transcript);
  recognition.onerror = () => helpChatMicBtn.classList.remove("listening");
  recognition.onend = () => helpChatMicBtn.classList.remove("listening");
  try { recognition.start(); } catch (e) { helpChatMicBtn.classList.remove("listening"); }
});

// ---------- Init ----------
applyTheme(false);
applyLanguage(false);
updateVoiceButton();
updateMemoryBadge();
updateDisplay();
renderHistory();
loadShopProfileFields();
renderBmCatalog();
renderBmReports();
renderStockReport();
renderCustomerDatalist();
loadPrintPrefsUI();
displayInvoiceNo();
switchMode(localStorage.getItem("calc_last_mode") || "standard");
