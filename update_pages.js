const fs = require('fs');
const path = require('path');

const toolsData = {
  "json-formatter": {
    article: "JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate. Our JSON Formatter helps you beautify minified JSON, sort keys alphabetically, and even escape unicode characters for safe transmission.",
    faqs: [
      { q: "Is my JSON data sent to a server?", a: "No, all formatting is done entirely in your browser. Your data is 100% secure and private." },
      { q: "Can I minify JSON here?", a: "Yes! Use the Minify toggle in the customization settings to remove all whitespace." }
    ]
  },
  "jwt-decoder": {
    article: "JSON Web Tokens (JWT) are an open, industry standard RFC 7519 method for representing claims securely between two parties. This decoder allows you to view the decoded header and payload of a JWT without needing to send it to a remote server.",
    faqs: [
      { q: "Are my tokens logged?", a: "No. Everything happens client-side, ensuring your tokens remain completely private." },
      { q: "Can this verify the token signature?", a: "No, this tool only decodes the Base64Url encoded payload and header. Signature verification requires the secret key." }
    ]
  },
  "regex-tester": {
    article: "Regular expressions (Regex) are sequences of characters that define a search pattern. They are used for string matching and manipulation. This tester provides real-time feedback, supporting common flags like global (g), case-insensitive (i), and multiline (m).",
    faqs: [
      { q: "What regex engine is used?", a: "This tool uses the standard JavaScript (ECMAScript) regular expression engine running directly in your browser." },
      { q: "Can I replace text using regex here?", a: "Yes, use the 'Replace' tab to test regex replacements with capture group support (e.g., $1)." }
    ]
  },
  "base64-encoder": {
    article: "Base64 is an encoding scheme that represents binary data in an ASCII string format. It's commonly used when there is a need to encode data that needs to be stored and transferred over media that are designed to deal with textual data.",
    faqs: [
      { q: "What is URL-safe Base64?", a: "URL-safe Base64 replaces the '+' and '/' characters with '-' and '_' respectively, making the encoded string safe for use in URLs and filenames." },
      { q: "Is there a size limit?", a: "Because it runs in the browser, very large strings might cause performance issues, but typical usage has no strict limits." }
    ]
  },
  "timestamp-converter": {
    article: "Unix time is a system for describing a point in time. It is the number of seconds that have elapsed since the Unix epoch, minus leap seconds. This tool converts Unix timestamps to human-readable dates and vice versa.",
    faqs: [
      { q: "Does this handle milliseconds?", a: "Yes, the tool automatically detects if the timestamp is in seconds or milliseconds and converts accordingly." },
      { q: "How is local time calculated?", a: "Local time is calculated using your browser's current timezone settings." }
    ]
  },
  "api-tester": {
    article: "An API (Application Programming Interface) tester allows developers to send HTTP requests to test RESTful APIs. You can customize headers, query parameters, and the request body to simulate complex API interactions.",
    faqs: [
      { q: "Can I test local APIs (localhost)?", a: "Yes, as long as your local API has CORS enabled to accept requests from this application." },
      { q: "Are my requests saved?", a: "No, all request history and data are ephemeral and cleared when you refresh the page." }
    ]
  },
  "curl-generator": {
    article: "cURL is a command-line tool used to transfer data over various network protocols. This generator provides a user-friendly interface to construct complex cURL commands with headers, bodies, and methods.",
    faqs: [
      { q: "Can I generate multi-line cURL commands?", a: "Yes, toggle the 'Multiline Output' setting to format the command with backslashes for easier reading." },
      { q: "Are headers automatically escaped?", a: "Yes, header values and JSON bodies are properly escaped to prevent shell injection and syntax errors." }
    ]
  },
  "sql-formatter": {
    article: "SQL (Structured Query Language) is used to communicate with databases. Our formatter beautifies raw, minified, or messy SQL queries into readable, well-indented formats supporting multiple SQL dialects like MySQL, PostgreSQL, and T-SQL.",
    faqs: [
      { q: "Does formatting change my query logic?", a: "No, the formatter only alters whitespace and capitalization (if enabled) without modifying the underlying query logic." },
      { q: "What dialects are supported?", a: "We support Standard SQL, MySQL, PostgreSQL, SQLite, T-SQL (SQL Server), and MariaDB." }
    ]
  },
  "color-palette-generator": {
    article: "Color palettes are essential for web design and branding. This tool uses HSL (Hue, Saturation, Lightness) color space mathematics to generate perfectly balanced harmonies such as analogous, triadic, and complementary schemes.",
    faqs: [
      { q: "How do I copy a color?", a: "Simply click on any color swatch in the preview or the list to copy its HEX code to your clipboard." },
      { q: "What is an Analogous harmony?", a: "Analogous colors are groups of colors that are adjacent to each other on the color wheel, creating a serene and comfortable design." }
    ]
  },
  "uuid-generator": {
    article: "A UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. This tool generates UUID Version 4, which is based on random (or pseudo-random) numbers.",
    faqs: [
      { q: "Are the generated UUIDs truly unique?", a: "They use the browser's crypto API to generate highly secure, random UUIDs, making collisions practically impossible." },
      { q: "Can I generate UUIDs in bulk?", a: "Yes, use the quantity slider to generate up to 20 UUIDs at once and copy them all with a single click." }
    ]
  },
  "image-to-base64": {
    article: "Converting an image to Base64 allows you to embed the image data directly into HTML, CSS, or JSON without needing external image files. This can reduce HTTP requests and improve initial page load times for small icons.",
    faqs: [
      { q: "Is my image uploaded anywhere?", a: "Absolutely not. The conversion happens entirely within your browser using the FileReader API." },
      { q: "What is the maximum image size?", a: "While there is no hard limit, we recommend keeping images under 5MB to avoid browser performance issues." }
    ]
  },
  "env-checker": {
    article: "Environment variables (.env files) store configuration settings and sensitive secrets. The ENV Checker helps you validate syntax, identify sensitive keys, and safely mask them before sharing or committing code.",
    faqs: [
      { q: "Are my secrets safe here?", a: "Yes, the tool is 100% client-side. No data is transmitted over the network." },
      { q: "How does the tool identify secrets?", a: "It uses pattern matching to find common keywords like KEY, SECRET, PASSWORD, and TOKEN in the variable names." }
    ]
  },
  "code-diff-checker": {
    article: "A Code Diff Checker compares two text files or code snippets to highlight the differences. It is an essential tool for reviewing changes, debugging, and understanding modifications between code versions.",
    faqs: [
      { q: "What is the difference between Split and Unified views?", a: "Split view shows the old and new code side-by-side. Unified view shows all changes linearly in a single column." },
      { q: "Can I ignore whitespace changes?", a: "Yes, simply toggle 'Ignore Whitespace' to focus only on structural code changes." }
    ]
  },
  "html-previewer": {
    article: "The HTML Previewer allows you to write HTML code and see it rendered instantly. It utilizes a sandboxed iframe to ensure the preview environment is secure and isolated from the main application.",
    faqs: [
      { q: "Is the preview secure?", a: "Yes, it uses an iframe with the 'sandbox' attribute to prevent malicious script execution." },
      { q: "Can I use external CSS frameworks?", a: "Yes! You can toggle 'Include Tailwind' to automatically load Tailwind CSS via CDN." }
    ]
  },
  "css-gradient-generator": {
    article: "CSS gradients let you display smooth transitions between two or more specified colors. This generator supports both linear and radial gradients, allowing you to visually design complex backgrounds and instantly copy the CSS code.",
    faqs: [
      { q: "How many color stops can I add?", a: "You can add up to 5 color stops to create intricate and detailed gradients." },
      { q: "Can I adjust the angle of the gradient?", a: "Yes, for linear gradients, you can use the angle slider to rotate the gradient from 0 to 360 degrees." }
    ]
  }
};

const urToolsData = {
  "json-formatter": {
    article: "JSON (جاوا اسکرپٹ آبجیکٹ نوٹیشن) ایک ہلکا پھلکا ڈیٹا کے تبادلے کا فارمیٹ ہے۔ اسے انسانوں کے لیے پڑھنا اور لکھنا آسان ہے۔ ہمارے JSON فارمیٹر کی مدد سے آپ JSON کو خوبصورت بنا سکتے ہیں، کیز کو ترتیب دے سکتے ہیں اور محفوظ ترسیل کے لیے یونیکوڈ کو بھی فرار کر سکتے ہیں۔",
    faqs: [
      { q: "کیا میرا JSON ڈیٹا کسی سرور کو بھیجا جاتا ہے؟", a: "نہیں، تمام فارمیٹنگ مکمل طور پر آپ کے براؤزر میں ہوتی ہے۔ آپ کا ڈیٹا 100% محفوظ ہے۔" },
      { q: "کیا میں یہاں JSON کو مختصر (minify) کر سکتا ہوں؟", a: "جی ہاں! خالی جگہوں کو ہٹانے کے لیے حسب ضرورت ترتیبات میں Minify ٹوگل استعمال کریں۔" }
    ]
  },
  "jwt-decoder": {
    article: "JSON ویب ٹوکن (JWT) دو فریقوں کے درمیان دعووں کو محفوظ طریقے سے ظاہر کرنے کا ایک طریقہ ہے۔ یہ ڈی کوڈر آپ کو دور دراز سرور پر بھیجے بغیر JWT کے ہیڈر اور پے لوڈ کو دیکھنے کی اجازت دیتا ہے۔",
    faqs: [
      { q: "کیا میرے ٹوکنز محفوظ کیے جاتے ہیں؟", a: "نہیں، سب کچھ کلائنٹ سائیڈ پر ہوتا ہے جس سے آپ کے ٹوکنز بالکل نجی رہتے ہیں۔" },
      { q: "کیا یہ ٹوکن کے دستخط کی تصدیق کر سکتا ہے؟", a: "نہیں، یہ ٹول صرف Base64Url این کوڈ شدہ پے لوڈ اور ہیڈر کو ڈی کوڈ کرتا ہے۔ دستخط کی تصدیق کے لیے خفیہ چابی کی ضرورت ہوتی ہے۔" }
    ]
  },
  "regex-tester": {
    article: "ریگولر ایکسپریشنز (Regex) حروف کی وہ ترتیب ہیں جو تلاش کے نمونے کی وضاحت کرتی ہیں۔ انہیں اسٹرنگ میچنگ اور ہیرا پھیری کے لیے استعمال کیا جاتا ہے۔ یہ ٹیسٹر ریئل ٹائم فیڈ بیک فراہم کرتا ہے۔",
    faqs: [
      { q: "کون سا ریجیکس انجن استعمال کیا جاتا ہے؟", a: "یہ ٹول معیاری جاوا اسکرپٹ (ECMAScript) ریگولر ایکسپریشن انجن استعمال کرتا ہے جو براہ راست آپ کے براؤزر میں چلتا ہے۔" },
      { q: "کیا میں متن کو تبدیل کر سکتا ہوں؟", a: "جی ہاں، تبدیلیوں کو جانچنے کے لیے 'تبدیل کریں' (Replace) ٹیب استعمال کریں۔" }
    ]
  },
  "base64-encoder": {
    article: "Base64 ایک اینکوڈنگ اسکیم ہے جو بائنری ڈیٹا کو ASCII اسٹرنگ فارمیٹ میں پیش کرتی ہے۔ اس کا استعمال اس وقت ہوتا ہے جب ایسے ڈیٹا کو اینکوڈ کرنے کی ضرورت ہو جو متنی ڈیٹا کے طور پر منتقل کیا جائے۔",
    faqs: [
      { q: "یو آر ایل-محفوظ (URL-safe) Base64 کیا ہے؟", a: "یہ '+' اور '/' حروف کو '-' اور '_' سے بدل دیتا ہے تاکہ اسے یو آر ایل میں محفوظ طریقے سے استعمال کیا جا سکے۔" },
      { q: "کیا کوئی سائز کی حد ہے؟", a: "کیونکہ یہ براؤزر میں چلتا ہے، بہت بڑی اسٹرنگز کارکردگی کو متاثر کر سکتی ہیں، لیکن عام استعمال کی کوئی سخت حد نہیں ہے۔" }
    ]
  },
  "timestamp-converter": {
    article: "یونیکس ٹائم وقت میں ایک نقطہ بیان کرنے کا نظام ہے۔ یہ ان سیکنڈز کی تعداد ہے جو یونیکس عہد سے گزر چکے ہیں۔ یہ ٹول یونیکس ٹائم اسٹیمپس کو انسانی تاریخوں میں تبدیل کرتا ہے۔",
    faqs: [
      { q: "کیا یہ ملی سیکنڈز کو ہینڈل کرتا ہے؟", a: "جی ہاں، یہ خودکار طور پر پتہ لگاتا ہے کہ آیا وقت سیکنڈز میں ہے یا ملی سیکنڈز میں اور اسی کے مطابق تبدیل کرتا ہے۔" },
      { q: "مقامی وقت کا حساب کیسے لگایا جاتا ہے؟", a: "مقامی وقت کا حساب آپ کے براؤزر کے موجودہ ٹائم زون کی ترتیبات کا استعمال کرتے ہوئے لگایا جاتا ہے۔" }
    ]
  },
  "api-tester": {
    article: "اے پی آئی (ایپلیکیشن پروگرامنگ انٹرفیس) ٹیسٹر ڈویلپرز کو RESTful APIs کی جانچ کرنے کے لیے HTTP درخواستیں بھیجنے کی اجازت دیتا ہے۔ آپ ہیڈرز، کوئری پیرامیٹرز اور درخواست کی باڈی کو اپنی مرضی کے مطابق بنا سکتے ہیں۔",
    faqs: [
      { q: "کیا میں لوکل APIs کی جانچ کر سکتا ہوں؟", a: "جی ہاں، جب تک آپ کے مقامی API میں CORS کو اس ایپلیکیشن سے درخواستیں قبول کرنے کے لیے فعال کیا گیا ہو۔" },
      { q: "کیا میری درخواستیں محفوظ کی جاتی ہیں؟", a: "نہیں، تمام درخواست کی تاریخ اور ڈیٹا عارضی ہے اور جب آپ صفحہ کو ریفریش کرتے ہیں تو صاف ہو جاتا ہے۔" }
    ]
  },
  "curl-generator": {
    article: "cURL ایک کمانڈ لائن ٹول ہے جو مختلف نیٹ ورک پروٹوکولز پر ڈیٹا کی منتقلی کے لیے استعمال ہوتا ہے۔ یہ جنریٹر ہیڈرز، باڈیز اور طریقوں کے ساتھ پیچیدہ cURL کمانڈز بنانے کے لیے ایک صارف دوست انٹرفیس فراہم کرتا ہے۔",
    faqs: [
      { q: "کیا میں ملٹی لائن cURL کمانڈز تیار کر سکتا ہوں؟", a: "جی ہاں، پڑھنے میں آسانی کے لیے کمانڈ کو فارمیٹ کرنے کے لیے 'ملٹی لائن آؤٹ پٹ' ترتیب کو ٹوگل کریں۔" },
      { q: "کیا ہیڈرز خود بخود فرار (escaped) ہو جاتے ہیں؟", a: "جی ہاں، شیل انجیکشن اور نحو کی غلطیوں کو روکنے کے لیے ہیڈر کی اقدار کو مناسب طریقے سے فرار کیا جاتا ہے۔" }
    ]
  },
  "sql-formatter": {
    article: "ایس کیو ایل (سٹرکچرڈ کوئری لینگویج) کا استعمال ڈیٹا بیس کے ساتھ بات چیت کے لیے کیا جاتا ہے۔ ہمارا فارمیٹر خام یا بکھرے ہوئے SQL سوالات کو پڑھنے کے قابل اور خوبصورت فارمیٹس میں تبدیل کرتا ہے۔",
    faqs: [
      { q: "کیا فارمیٹنگ میری کوئری کی منطق کو بدل دیتی ہے؟", a: "نہیں، فارمیٹر صرف خالی جگہوں اور حروف کو تبدیل کرتا ہے بغیر کوئری کی منطق میں ترمیم کیے۔" },
      { q: "کون سی بولیاں تعاون یافتہ ہیں؟", a: "ہم سٹینڈرڈ SQL، MySQL، PostgreSQL، SQLite، T-SQL، اور MariaDB کی حمایت کرتے ہیں۔" }
    ]
  },
  "color-palette-generator": {
    article: "رنگین پیلیٹ ویب ڈیزائن اور برانڈنگ کے لیے ضروری ہیں۔ یہ ٹول ہم آہنگ رنگ سکیمیں تیار کرنے کے لیے HSL کلر اسپیس ریاضی کا استعمال کرتا ہے جیسے اینالاگس اور تکمیلی سکیمیں۔",
    faqs: [
      { q: "میں رنگ کیسے کاپی کروں؟", a: "صرف HEX کوڈ کو اپنے کلپ بورڈ میں کاپی کرنے کے لیے پیش نظارہ یا فہرست میں موجود کسی بھی رنگ پر کلک کریں۔" },
      { q: "اینالاگس (Analogous) ہم آہنگی کیا ہے؟", a: "اینالاگس رنگ ان رنگوں کے گروپ ہیں جو کلر وہیل پر ایک دوسرے سے ملحق ہوتے ہیں، جو ایک پرسکون ڈیزائن بناتے ہیں۔" }
    ]
  },
  "uuid-generator": {
    article: "UUID (یونیورسل یونیک آئیڈینٹیفائر) ایک 128 بٹ نمبر ہے جو کمپیوٹر سسٹمز میں معلومات کی شناخت کے لیے استعمال ہوتا ہے۔ یہ ٹول UUID ورژن 4 بناتا ہے، جو بے ترتیب نمبروں پر مبنی ہے۔",
    faqs: [
      { q: "کیا تیار کردہ UUIDs واقعی منفرد ہیں؟", a: "وہ انتہائی محفوظ اور بے ترتیب UUIDs تیار کرنے کے لیے براؤزر کی کرپٹو API کا استعمال کرتے ہیں۔" },
      { q: "کیا میں ایک ساتھ کئی UUIDs بنا سکتا ہوں؟", a: "جی ہاں، مقدار کا سلائیڈر استعمال کر کے آپ ایک وقت میں 20 تک UUIDs بنا سکتے ہیں۔" }
    ]
  },
  "image-to-base64": {
    article: "کسی تصویر کو Base64 میں تبدیل کرنے سے آپ بیرونی تصویری فائلوں کی ضرورت کے بغیر تصویری ڈیٹا کو براہ راست HTML، CSS، یا JSON میں شامل کر سکتے ہیں۔",
    faqs: [
      { q: "کیا میری تصویر کہیں اپ لوڈ ہوتی ہے؟", a: "بالکل نہیں۔ تبدیلی مکمل طور پر آپ کے براؤزر کے اندر ہوتی ہے۔" },
      { q: "تصویر کا زیادہ سے زیادہ سائز کیا ہے؟", a: "اگرچہ کوئی سخت حد نہیں ہے، ہم تجویز کرتے ہیں کہ تصاویر کو 5MB کے اندر رکھیں۔" }
    ]
  },
  "env-checker": {
    article: "انوائرنمنٹ ویری ایبلز (.env فائلیں) کنفیگریشن سیٹنگز اور حساس رازوں کو محفوظ کرتی ہیں۔ ENV چیکر آپ کو نحو کی تصدیق کرنے اور خفیہ چابیوں کی شناخت کرنے میں مدد کرتا ہے۔",
    faqs: [
      { q: "کیا میرے راز یہاں محفوظ ہیں؟", a: "جی ہاں، یہ ٹول 100% کلائنٹ سائیڈ پر کام کرتا ہے۔ کوئی ڈیٹا نیٹ ورک پر منتقل نہیں ہوتا۔" },
      { q: "ٹول رازوں کی شناخت کیسے کرتا ہے؟", a: "یہ عام کلیدی الفاظ جیسے KEY، SECRET، PASSWORD اور TOKEN کو تلاش کرتا ہے۔" }
    ]
  },
  "code-diff-checker": {
    article: "کوڈ ڈف چیکر دو ٹیکسٹ فائلوں یا کوڈ اسنیپٹس کا موازنہ کر کے ان کے درمیان فرق کو نمایاں کرتا ہے۔ یہ تبدیلیوں کا جائزہ لینے اور کوڈ کو ڈیبگ کرنے کا ایک لازمی ٹول ہے۔",
    faqs: [
      { q: "اسپلٹ اور یونیفائیڈ ویوز میں کیا فرق ہے؟", a: "اسپلٹ ویو پرانا اور نیا کوڈ ساتھ ساتھ دکھاتا ہے۔ یونیفائیڈ ویو تمام تبدیلیوں کو ایک کالم میں دکھاتا ہے۔" },
      { q: "کیا میں خالی جگہوں کی تبدیلیوں کو نظر انداز کر سکتا ہوں؟", a: "جی ہاں، صرف ساختی تبدیلیوں پر توجہ مرکوز کرنے کے لیے 'خالی جگہوں کو نظر انداز کریں' ٹوگل کریں۔" }
    ]
  },
  "html-previewer": {
    article: "ایچ ٹی ایم ایل پری ویور آپ کو ایچ ٹی ایم ایل کوڈ لکھنے اور اسے فوری طور پر رینڈر ہوتے دیکھنے کی اجازت دیتا ہے۔ یہ محفوظ ماحول کو یقینی بنانے کے لیے سینڈ باکسڈ آئی فریم کا استعمال کرتا ہے۔",
    faqs: [
      { q: "کیا پیش نظارہ محفوظ ہے؟", a: "جی ہاں، یہ بدنیتی پر مبنی اسکرپٹ کو چلنے سے روکنے کے لیے 'سینڈ باکس' کی خصوصیت کے ساتھ ایک آئی فریم کا استعمال کرتا ہے۔" },
      { q: "کیا میں بیرونی CSS فریم ورک استعمال کر سکتا ہوں؟", a: "جی ہاں! آپ CDN کے ذریعے ٹیل ونڈ CSS لوڈ کرنے کے لیے ٹوگل کر سکتے ہیں۔" }
    ]
  },
  "css-gradient-generator": {
    article: "سی ایس ایس گریڈینٹس آپ کو دو یا دو سے زیادہ رنگوں کے درمیان ہموار تبدیلیاں دکھانے کی اجازت دیتے ہیں۔ یہ جنریٹر لکیری اور ریڈیل دونوں گریڈینٹس کی حمایت کرتا ہے۔",
    faqs: [
      { q: "میں کتنے کلر سٹاپ شامل کر سکتا ہوں؟", a: "آپ پیچیدہ گریڈینٹ بنانے کے لیے 5 تک کلر سٹاپ شامل کر سکتے ہیں۔" },
      { q: "کیا میں گریڈینٹ کے زاویے کو ایڈجسٹ کر سکتا ہوں؟", a: "جی ہاں، لکیری گریڈینٹس کے لیے، آپ 0 سے 360 ڈگری تک زاویہ بدل سکتے ہیں۔" }
    ]
  }
};


// 1. Update English translations
const enPath = path.join(__dirname, 'messages/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

for (const [key, data] of Object.entries(toolsData)) {
  if (enData.tools[key]) {
    enData.tools[key].article = data.article;
    const faqsObj = {};
    data.faqs.forEach((faq, i) => {
      faqsObj[`q${i}`] = faq.q;
      faqsObj[`a${i}`] = faq.a;
    });
    enData.tools[key].faqs = faqsObj;
  }
}
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

// 2. Update Urdu translations
const urPath = path.join(__dirname, 'messages/ur.json');
const urData = JSON.parse(fs.readFileSync(urPath, 'utf8'));

for (const [key, data] of Object.entries(urToolsData)) {
  if (urData.tools[key]) {
    urData.tools[key].article = data.article;
    const faqsObj = {};
    data.faqs.forEach((faq, i) => {
      faqsObj[`q${i}`] = faq.q;
      faqsObj[`a${i}`] = faq.a;
    });
    urData.tools[key].faqs = faqsObj;
  }
}
fs.writeFileSync(urPath, JSON.stringify(urData, null, 2));

// 3. Update all page.tsx files
const toolsDir = path.join(__dirname, 'src/app/[locale]/tools');
const toolFolders = fs.readdirSync(toolsDir);

for (const folder of toolFolders) {
  const pagePath = path.join(toolsDir, folder, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if ToolLayout is used
    if (content.includes('<ToolLayout')) {
      // Find the component Name from the Client import
      const clientImportMatch = content.match(/import { ([a-zA-Z]+Client) }/);
      if (clientImportMatch) {
        
        // We will replace the ToolLayout usage to include article and faqs
        const replaceRegex = /<ToolLayout title=\{t\('title'\)\} description=\{t\('description'\)\}>/;
        
        const newProps = `<ToolLayout \n      title={t('title')} \n      description={t('description')}\n      article={<p>{t('article')}</p>}\n      faqs={[\n        { question: t('faqs.q0'), answer: t('faqs.a0') },\n        { question: t('faqs.q1'), answer: t('faqs.a1') }\n      ]}\n    >`;
        
        content = content.replace(replaceRegex, newProps);
        fs.writeFileSync(pagePath, content);
        console.log(`Updated ${folder}/page.tsx`);
      }
    }
  }
}

console.log('All updates complete.');
