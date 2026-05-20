const fs = require('fs');

const articlesEn = {
  'percentage-calculator': 'A percentage calculator helps you compute percentages, find out what percentage one number is of another, and calculate percentage increases or decreases. It is an essential tool for finance, sales, and general mathematics.',
  'aspect-ratio-calculator': 'An aspect ratio calculator helps you resize images and video resolutions proportionally. By entering a known width or height and a target ratio, you can easily determine the missing dimension without distorting the media.',
  'byte-size-converter': 'A byte size converter is crucial for software developers and IT professionals. It converts digital storage units between Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes, making it easy to understand file sizes and network bandwidth.',
  'roman-numeral-converter': 'The Roman Numeral Converter translates standard decimal numbers into ancient Roman numerals (I, V, X, L, C, D, M) and vice versa. It helps in understanding historical dates, clock faces, and outlines.',
  'random-number-generator': 'A Random Number Generator (RNG) creates unpredictable numerical values within a specified range. It is widely used in gaming, statistical sampling, cryptography, and randomized testing.',
  'fibonacci-generator': 'The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones. This generator computes the sequence up to a specific limit, which is useful in algorithms, design (Golden Ratio), and mathematics.',
  'prime-number-checker': 'A prime number is a natural number greater than 1 that cannot be formed by multiplying two smaller natural numbers. This checker quickly verifies if a number is prime, a fundamental concept in cryptography and number theory.',
  'gcd-lcm-calculator': 'The Greatest Common Divisor (GCD) and Least Common Multiple (LCM) are foundational mathematical concepts. The GCD helps in simplifying fractions, while the LCM is used when finding common denominators.',
  'bmi-calculator': 'Body Mass Index (BMI) is a measure of body fat based on height and weight. This calculator provides a quick assessment of whether a person has a healthy body weight for their height.',
  'scientific-calculator': 'A scientific calculator handles advanced mathematical functions like trigonometry, logarithms, and exponential operations. It is a necessary tool for engineering, physics, and advanced mathematics.',
  'currency-converter': 'A currency converter provides real-time exchange rates to convert value from one currency to another. It is essential for international trade, travel, and financial planning.',
  'temperature-converter': 'Temperature conversion translates thermal values between scales like Celsius, Fahrenheit, and Kelvin. It is critical for scientific experiments, weather forecasting, and international communication.',
  'loan-emi-calculator': 'An Equated Monthly Installment (EMI) calculator computes the monthly amount payable to a lender. It factors in the principal loan amount, interest rate, and loan tenure, helping you plan your finances.'
};

const articlesUr = {
  'percentage-calculator': 'فیصد کیلکولیٹر آپ کو فیصد کا حساب لگانے، یہ معلوم کرنے میں مدد کرتا ہے کہ ایک نمبر دوسرے کا کتنا فیصد ہے، اور فیصد میں اضافے یا کمی کا حساب لگاتا ہے۔ یہ فنانس، سیلز اور عام ریاضی کے لیے ایک ضروری ٹول ہے۔',
  'aspect-ratio-calculator': 'پہلو کا تناسب کیلکولیٹر آپ کو تصاویر اور ویڈیو ریزولوشنز کا متناسب سائز تبدیل کرنے میں مدد کرتا ہے۔ معلوم چوڑائی یا اونچائی درج کر کے، آپ میڈیا کو مسخ کیے بغیر آسانی سے طول و عرض کا تعین کر سکتے ہیں۔',
  'byte-size-converter': 'بائٹ سائز کنورٹر سافٹ ویئر ڈویلپرز اور آئی ٹی پروفیشنلز کے لیے اہم ہے۔ یہ ڈیجیٹل اسٹوریج یونٹس کو بائٹس، کلو بائٹس، میگا بائٹس، گیگا بائٹس، اور ٹیرا بائٹس کے درمیان تبدیل کرتا ہے۔',
  'roman-numeral-converter': 'رومن ہندسوں کا کنورٹر معیاری اعشاریہ نمبروں کو قدیم رومن ہندسوں میں تبدیل کرتا ہے۔ یہ تاریخی تاریخوں اور خاکہ جات کو سمجھنے میں مدد کرتا ہے۔',
  'random-number-generator': 'ایک رینڈم نمبر جنریٹر ایک مخصوص حد کے اندر غیر متوقع عددی اقدار تخلیق کرتا ہے۔ یہ گیمنگ، شماریاتی نمونے لینے، اور کرپٹوگرافی میں وسیع پیمانے پر استعمال ہوتا ہے۔',
  'fibonacci-generator': 'فبوناچی ترتیب اعداد کا ایک سلسلہ ہے جہاں ہر عدد پچھلے دو کا مجموعہ ہوتا ہے۔ یہ جنریٹر ایک مخصوص حد تک ترتیب کا حساب لگاتا ہے۔',
  'prime-number-checker': 'ایک پرائم نمبر ایک ایسا قدرتی عدد ہے جو 1 سے بڑا ہوتا ہے اور اسے دو چھوٹے قدرتی اعداد کو ضرب دے کر نہیں بنایا جا سکتا۔ یہ چیکر فوری طور پر تصدیق کرتا ہے کہ آیا کوئی نمبر پرائم ہے۔',
  'gcd-lcm-calculator': 'عظیم ترین مشترک تقسیم کنندہ (GCD) اور کم از کم مشترک کثیر (LCM) بنیادی ریاضیاتی تصورات ہیں۔ GCD کسر کو آسان بنانے میں مدد کرتا ہے، جبکہ LCM مشترک ڈینومینیٹر تلاش کرنے میں استعمال ہوتا ہے۔',
  'bmi-calculator': 'باڈی ماس انڈیکس (BMI) اونچائی اور وزن کی بنیاد پر جسم کی چربی کا ایک پیمانہ ہے۔ یہ کیلکولیٹر ایک فوری تشخیص فراہم کرتا ہے کہ آیا کسی شخص کا وزن اس کی اونچائی کے لحاظ سے صحت مند ہے۔',
  'scientific-calculator': 'سائنسی کیلکولیٹر جدید ریاضیاتی افعال کو سنبھالتا ہے جیسے ٹرگنومیٹری اور لاگارتھمز۔ یہ انجینئرنگ اور جدید ریاضی کے لیے ایک ضروری ٹول ہے۔',
  'currency-converter': 'کرنسی کنورٹر ایک کرنسی سے دوسری کرنسی میں قدر کو تبدیل کرنے کے لیے ریئل ٹائم ایکسچینج ریٹ فراہم کرتا ہے۔ یہ بین الاقوامی تجارت اور مالیاتی منصوبہ بندی کے لیے ضروری ہے۔',
  'temperature-converter': 'درجہ حرارت کی تبدیلی تھرمل اقدار کا ترجمہ سیلسیس، فارن ہائیٹ اور کیلون جیسے پیمانے کے درمیان کرتی ہے۔ یہ سائنسی تجربات اور موسم کی پیشن گوئی کے لیے اہم ہے۔',
  'loan-emi-calculator': 'ایک مساوی ماہانہ قسط (EMI) کیلکولیٹر قرض دہندہ کو قابل ادائیگی ماہانہ رقم کا حساب لگاتا ہے۔ یہ آپ کے مالیات کی منصوبہ بندی میں مدد کرتا ہے۔'
};

const updateTranslations = (filePath, articles) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = false;
  
  for (const [key, article] of Object.entries(articles)) {
    if (data.tools[key]) {
      data.tools[key].article = article;
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

updateTranslations('messages/en.json', articlesEn);
updateTranslations('messages/ur.json', articlesUr);
