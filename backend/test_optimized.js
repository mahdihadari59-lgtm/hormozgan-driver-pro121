const FinalIntentClassifier = require('./finalIntentClassifier_OPTIMIZED.js');

console.log('');
console.log('════════════════════════════════════════════════════════════════════');
console.log('         🧪 تست OPTIMIZED - نسخه بهبود یافته برای Termux');
console.log('════════════════════════════════════════════════════════════════════');
console.log('');

const classifier = new FinalIntentClassifier();

const tests = [
    'سلام خوبی؟', 'خداحافظ', 'ترافیک چطوره؟',
    'چهارراه غزی شلوغه؟', 'قشم کجاست؟', 'تور کیش چند است؟',
    'قیمت طلا چند است؟', 'رستوران خوب میخوام', 'دکتر قلب میخوام',
    'اورژانس کمک', '115', 'کمکم کن', 'واویلا یعنی چی؟',
    'به بندری حرف بزن', 'لطفاً ترجمه کن سلام'
];

const expected = {
    'سلام خوبی؟': 'greeting', 'خداحافظ': 'farewell', 'ترافیک چطوره؟': 'traffic',
    'چهارراه غزی شلوغه؟': 'traffic', 'قشم کجاست؟': 'tourism', 'تور کیش چند است؟': 'tourism',
    'قیمت طلا چند است؟': 'gold', 'رستوران خوب میخوام': 'food', 'دکتر قلب میخوام': 'medical',
    'اورژانس کمک': 'emergency', '115': 'emergency', 'کمکم کن': 'help',
    'واویلا یعنی چی؟': 'dialect', 'به بندری حرف بزن': 'dialect', 'لطفاً ترجمه کن سلام': 'translation'
};

let correct = 0;

console.log('📋 نتایج تشخیص:\n');

for (const test of tests) {
    const result = classifier.classify(test);
    const isCorrect = result.intent === expected[test];
    if (isCorrect) correct++;
    
    const icon = isCorrect ? '✅' : '❌';
    console.log(`${icon} "${test}"`);
    console.log(`   → ${result.intent} (${result.name}) | امتیاز: ${result.score} | اعتماد: ${(result.confidence*100).toFixed(0)}%`);
    if (result.matchedKeywords.length) {
        console.log(`   → کلمات: ${result.matchedKeywords.slice(0,3).join(', ')}`);
    }
    console.log('');
}

console.log('════════════════════════════════════════════════════════════════════');
console.log('📊 نتیجه نهایی');
console.log('════════════════════════════════════════════════════════════════════');
console.log(`   ✅ صحیح: ${correct}/${tests.length}`);
console.log(`   📈 دقت: ${(correct/tests.length*100).toFixed(1)}%`);
const stats = classifier.getStats();
console.log(`   📊 میانگین اعتماد: ${stats.avgConfidence}`);
console.log('');
