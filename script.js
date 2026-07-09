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
    back: "Back", historyCleared: "History cleared", billReset: "Scanner reset",
    modeStandard: "Standard", modeEmi: "EMI", modeGst: "GST", modeDiscount: "Discount",
    modeInterest: "Interest", modeSplit: "Split Bill",
    calculate: "Calculate", principalLabel: "Loan Amount (₹)", rateLabel: "Interest Rate (% per year)",
    tenureLabel: "Tenure (months)", amountLabel: "Amount (₹)", gstRateLabel: "GST Rate",
    addGstLabel: "Add GST", removeGstLabel: "Remove GST", discountLabel: "Discount (%)",
    timeLabel: "Time (years)", simpleLabel: "Simple", compoundLabel: "Compound",
    peopleLabel: "Number of People", tipLabel: "Tip (%)", fillFieldsError: "Please fill all fields with valid numbers",
    monthlyEmiLabel: "Monthly EMI", totalInterestLabel: "Total Interest", totalPaymentLabel: "Total Payment",
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
    catalogHint: "Preset qty + price, e.g. \"6 PCS = ₹280\" or \"1 Kg = ₹120\". Billing quantity auto-converts from this.",
    costPricePh: "Cost Price ₹ (optional)", sellPricePh: "Selling Price ₹",
    autoFetchLabel: "📤 Auto-Fetch Items from Invoice Photo",
    autoFetchHint: "Reads item names and amounts from a photo. Unit/GST are set to defaults — please check each item before printing.",
    itemDiscountPh: "Discount % (optional)", billDiscountLabel: "Overall Bill Discount %",
    whatsappBtn: "Send via WhatsApp",
    whatsappHint: "Downloads the PDF and opens WhatsApp with a message — attach the downloaded PDF yourself (browsers can't auto-attach files).",
    subtotalLabel: "Subtotal", itemDiscountsLabel: "Item Discounts", billDiscountAmtLabel: "Bill Discount",
    taxableValueLabel: "Taxable Value", gstTotalLabel: "GST", grandTotalBillLabel: "Grand Total",
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
    catalogHint: "प्रीसेट मात्रा + कीमत, जैसे \"6 PCS = ₹280\" या \"1 Kg = ₹120\"। बिलिंग मात्रा इससे अपने आप कन्वर्ट होगी।",
    costPricePh: "खरीद मूल्य ₹ (वैकल्पिक)", sellPricePh: "विक्रय मूल्य ₹",
    autoFetchLabel: "📤 इनवॉइस फोटो से वस्तुएँ ऑटो-फेच करें",
    autoFetchHint: "फोटो से वस्तु के नाम और राशि पढ़ता है। यूनिट/GST डिफ़ॉल्ट पर सेट होते हैं — प्रिंट करने से पहले हर वस्तु जांच लें।",
    itemDiscountPh: "छूट % (वैकल्पिक)", billDiscountLabel: "कुल बिल छूट %",
    whatsappBtn: "WhatsApp से भेजें",
    whatsappHint: "PDF डाउनलोड होगा और WhatsApp खुलेगा — डाउनलोड की गई PDF खुद अटैच करें (ब्राउज़र फ़ाइल अपने आप अटैच नहीं कर सकते)।",
    subtotalLabel: "उप-योग", itemDiscountsLabel: "वस्तु छूट", billDiscountAmtLabel: "बिल छूट",
    taxableValueLabel: "कर योग्य राशि", gstTotalLabel: "जीएसटी", grandTotalBillLabel: "कुल योग",
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
    catalogHint: "প্রিসেট পরিমাণ + দাম, যেমন \"6 PCS = ₹280\" বা \"1 Kg = ₹120\"। বিলিং পরিমাণ থেকে স্বয়ংক্রিয়ভাবে রূপান্তরিত হবে।",
    costPricePh: "ক্রয় মূল্য ₹ (ঐচ্ছিক)", sellPricePh: "বিক্রয় মূল্য ₹",
    autoFetchLabel: "📤 ইনভয়েস ছবি থেকে পণ্য অটো-ফেচ করুন",
    autoFetchHint: "ছবি থেকে পণ্যের নাম ও পরিমাণ পড়ে। ইউনিট/GST ডিফল্ট রাখা হয় — প্রিন্ট করার আগে প্রতিটি পণ্য যাচাই করুন।",
    itemDiscountPh: "ছাড় % (ঐচ্ছিক)", billDiscountLabel: "মোট বিল ছাড় %",
    whatsappBtn: "WhatsApp দিয়ে পাঠান",
    whatsappHint: "PDF ডাউনলোড হবে এবং WhatsApp খুলবে — ডাউনলোড করা PDF নিজে সংযুক্ত করুন (ব্রাউজার স্বয়ংক্রিয়ভাবে ফাইল সংযুক্ত করতে পারে না)।",
    subtotalLabel: "উপ-মোট", itemDiscountsLabel: "পণ্য ছাড়", billDiscountAmtLabel: "বিল ছাড়",
    taxableValueLabel: "করযোগ্য মূল্য", gstTotalLabel: "জিএসটি", grandTotalBillLabel: "সর্বমোট",
    autoFetchScanning: "ইনভয়েস পড়া হচ্ছে...", autoFetchSuccess: (n) => `${n}টি পণ্য যোগ হয়েছে — পরিমাণ/ইউনিট/GST যাচাই করুন`,
    autoFetchNoItems: "এই ছবিতে কোনো পরিমাণ পাওয়া যায়নি।", autoFetchFailed: "ছবি পড়া যায়নি। আবার চেষ্টা করুন।",
    qrUploaded: "QR কোড সেভ হয়েছে", needCustomerWhatsapp: "প্রথমে WhatsApp নম্বর দিন।",
    whatsappOpening: "WhatsApp খুলছে...",
    billReportsLabel: "📊 আগের বিলের রিপোর্ট", billReportsHint: "PDF/JPG তৈরি করার পর এটি শুধু এই ব্রাউজারে সেভ থাকে।",
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
function speak(text, langCode) {
  if (!voiceOn) return;
  if (!("speechSynthesis" in window)) return;
  try {
    // Cancel anything still queued/speaking first. Without this, rapid
    // typing queues one utterance per keypress and the voice keeps
    // "catching up" long after you've stopped — this keeps it snappy and
    // always on the latest thing you did instead of falling behind.
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = langCode || I18N[currentLang].speech;
    utter.rate = 1.15;
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
  el.innerHTML = rows.map(r =>
    `<div class="result-row${r.highlight ? " highlight" : ""}"><span>${r.label}</span><span>${r.value}</span></div>`
  ).join("");
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
const emiResult = document.getElementById("emiResult");
const emiInsight = document.getElementById("emiInsight");

document.getElementById("emiCalcBtn").addEventListener("click", () => {
  const P = validNumber(emiPrincipal.value);
  const annualRate = validNumber(emiRate.value);
  const n = validNumber(emiTenure.value);
  if (P === null || annualRate === null || n === null || P <= 0 || n <= 0) {
    showToast(currentLangText("fillFieldsError"), "error");
    return;
  }
  const r = annualRate / 12 / 100;
  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  renderFinanceResult(emiResult, [
    { label: "Monthly EMI", value: fmtMoney(emi), highlight: true },
    { label: "Total Interest", value: fmtMoney(totalInterest) },
    { label: "Total Payment", value: fmtMoney(totalPayment) }
  ]);

  const interestShare = (totalInterest / totalPayment) * 100;
  showInsight(emiInsight,
    interestShare > 40
      ? `Interest makes up ${interestShare.toFixed(0)}% of your total payment — a shorter tenure would cut that down a lot.`
      : `You'll pay ${interestShare.toFixed(0)}% extra as interest over ${n} months — that's a reasonably efficient loan.`
  );
  speak(`Monthly EMI ${emi.toFixed(0)} rupees`, I18N[currentLang].speech);
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
const siTime = document.getElementById("siTime");
const siSimpleBtn = document.getElementById("siSimpleBtn");
const siCompoundBtn = document.getElementById("siCompoundBtn");
const siResult = document.getElementById("siResult");
const siInsight = document.getElementById("siInsight");
let siMode = "simple";

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

document.getElementById("siCalcBtn").addEventListener("click", () => {
  const P = validNumber(siPrincipal.value);
  const rate = validNumber(siRate.value);
  const t = validNumber(siTime.value);
  if (P === null || rate === null || t === null || P <= 0 || t <= 0) {
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
    { label: "Interest Earned", value: fmtMoney(interest) },
    { label: "Maturity Value", value: fmtMoney(total), highlight: true }
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

// Migration guard: earlier versions of this app saved catalog/bill items in
// an older shape (no qty/cost/gst fields). Without this, loading that old
// data on the new code throws and silently breaks the whole Bill Maker
// screen on startup — this repairs old entries in place instead of crashing.
bmCatalog = bmCatalog.map(item => ({
  name: item.name || "Item",
  qty: item.qty || 1,
  unit: item.unit || "kg",
  cost: item.cost || 0,
  sell: item.sell != null ? item.sell : (item.rate != null ? item.rate : 0),
  gst: item.gst != null ? item.gst : 5
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
      const margin = item.cost ? ` · margin ${fmtMoney(item.sell - item.cost)}` : "";
      return `
      <li>
        <div class="bm-item-info">
          <span class="bm-item-name">${item.name}</span>
          <span class="bm-item-qty">${item.qty} ${item.unit} = <span class="bm-editable-price" data-index="${i}" title="${currentLangText("tapToEdit")}">${fmtMoney(item.sell)}</span> (GST ${item.gst}%)${margin}</span>
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
  bmCatalogList.querySelectorAll(".bm-editable-price").forEach(span => {
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
}

let bmCatGstTouched = false;
bmCatGst.addEventListener("change", () => { bmCatGstTouched = true; });
bmCatName.addEventListener("input", () => {
  if (bmCatGstTouched) return;
  const guess = guessGstForName(bmCatName.value);
  if (guess !== null) bmCatGst.value = String(guess);
});

bmCatAddBtn.addEventListener("click", () => {
  const name = bmCatName.value.trim();
  const qty = validNumber(bmCatQty.value) || 1;
  const unit = bmCatUnit.value;
  const cost = validNumber(bmCatCost.value); // optional, private (never printed)
  const sell = validNumber(bmCatSell.value);
  const gst = parseFloat(bmCatGst.value);
  if (!name || sell === null || sell <= 0) {
    showToast(currentLangText("fillCatalogError"), "error");
    return;
  }
  bmCatalog.push({ name, qty, unit, cost: cost || 0, sell, gst });
  saveBmCatalog();
  renderBmCatalog();
  showToast(currentLangText("catalogItemAdded"), "success");
  bmCatName.value = "";
  bmCatQty.value = "1";
  bmCatCost.value = "";
  bmCatSell.value = "";
  bmCatGstTouched = false;
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

// --- Unit selector for the item currently being added to the bill ---
function selectUnit(unit) {
  bmSelectedUnit = unit;
  Object.entries(unitButtons).forEach(([u, btn]) => btn.classList.toggle("active", u === unit));
  if (bmMatchedCatalogItem) {
    const rate = getPerUnitRate(bmMatchedCatalogItem, unit);
    if (rate !== null) bmItemPrice.value = rate.toFixed(2);
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
    bmLiveAmount.textContent = "";
    return;
  }
  const discountPct = validNumber(bmItemDiscount.value) || 0;
  const base = qty * rate;
  const afterDiscount = base - base * (discountPct / 100);
  bmLiveAmount.textContent = `= ${fmtMoney(afterDiscount)}`;
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

  return { subtotal, itemDiscountTotal, billDiscountAmt, grandTotal, gstBreakup, resultRows };
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
  bmItems.push({ name, qty, unit: bmSelectedUnit, rate, gst, discount, amount });
  saveBmItems();
  renderBmItems();
  speak(`${name} ${amount.toFixed(0)}`, I18N[currentLang].speech);

  bmItemName.value = "";
  bmItemQty.value = "1";
  bmItemPrice.value = "";
  bmItemDiscount.value = "";
  bmLiveAmount.textContent = "";
  bmMatchedCatalogItem = null;
  bmItemGstTouched = false;
  bmItemName.focus();
}

bmAddItemBtn.addEventListener("click", addBmItem);
[bmItemName, bmItemQty, bmItemPrice, bmItemDiscount].forEach(input => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addBmItem(); }
  });
});

bmClearBtn.addEventListener("click", () => {
  bmItems = [];
  bmBillDiscount.value = "0";
  saveBmItems();
  renderBmItems();
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
  const rowsHtml = bmItems.map(item => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:center;">${item.qty} ${item.unit}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:center;">₹${item.rate.toFixed(2)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:center;">${item.gst}%</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:center;">${item.discount > 0 ? item.discount + "%" : "-"}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">₹${item.amount.toFixed(2)}</td>
    </tr>
  `).join("");

  const qrHtml = bmShopProfile.qr
    ? `<img src="${bmShopProfile.qr}" style="width:70px;height:70px;object-fit:contain;background:#fff;border-radius:8px;padding:4px;border:1px solid #ddd;">`
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
            <th style="text-align:center;padding:8px 6px;">Rate</th>
            <th style="text-align:center;padding:8px 6px;">GST</th>
            <th style="text-align:center;padding:8px 6px;">Disc.</th>
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
        Generated with Smart Calculator — Developed by Swapan
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
    doc.rect(8, 8, 194, 26, "F");
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
      try { doc.addImage(bmShopProfile.qr, "PNG", 172, 11, 22, 22); } catch (e) { /* unsupported image format, skip */ }
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
    doc.text("Item", 14, y);
    doc.text("Qty", 90, y);
    doc.text("Rate", 112, y);
    doc.text("GST", 138, y);
    doc.text("Disc.", 158, y);
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
    bmItems.forEach(item => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(fitText(item.name, ITEM_COL_MAX_WIDTH), 14, y);
      doc.text(`${item.qty} ${item.unit}`, 90, y);
      doc.text(`Rs.${item.rate.toFixed(2)}`, 112, y);
      doc.text(`${item.gst}%`, 138, y);
      doc.text(item.discount > 0 ? `${item.discount}%` : "-", 158, y);
      doc.text(`Rs. ${item.amount.toFixed(2)}`, 194, y, { align: "right" });
      y += 7;
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
    doc.text("Generated with Smart Calculator — Developed by Swapan", 105, 285, { align: "center" });

    const safeName = name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "customer";
    doc.save(`${bmInvoiceNo.textContent}_${safeName}.pdf`);
    showToast(currentLangText("pdfGenerated"), "success");
    recordBillToHistory(totals);
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

  bmAutoFetchStatus.className = "scanning";
  bmAutoFetchStatus.textContent = currentLangText("autoFetchScanning");

  try {
    await loadTesseractLib();
    const cleanedCanvas = await preprocessBillImage(file);
    const ocrData = await runBillOCR(cleanedCanvas);
    const analysis = analyzeBillText(ocrData.text || "");

    if (analysis.lineItems.length === 0) {
      bmAutoFetchStatus.className = "error";
      bmAutoFetchStatus.textContent = currentLangText("autoFetchNoItems");
      return;
    }

    analysis.lineItems.forEach(li => {
      bmItems.push({ name: li.label, qty: 1, unit: "pcs", rate: li.amount, gst: 0, discount: 0, amount: li.amount });
    });
    saveBmItems();
    renderBmItems();

    bmAutoFetchStatus.className = "complete";
    bmAutoFetchStatus.textContent = currentLangText("autoFetchSuccess")(analysis.lineItems.length);
    showToast(currentLangText("autoFetchSuccess")(analysis.lineItems.length), "success");
  } catch (err) {
    console.error(err);
    bmAutoFetchStatus.className = "error";
    bmAutoFetchStatus.textContent = currentLangText("autoFetchFailed");
  } finally {
    bmAutoFetchInput.value = "";
  }
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
displayInvoiceNo();
switchMode(localStorage.getItem("calc_last_mode") || "standard");
