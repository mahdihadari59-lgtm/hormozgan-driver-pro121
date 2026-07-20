class BandariTranslator {
    constructor() {
        this.dict = {
            'سلام': 'سَلام',
            'ممنون': 'دَستت طلا',
            'خداحافظ': 'خدا نِگَهدار',
            'چطوری': 'چِ طوری؟',
            'خوبی': 'خوبی؟',
            'ترافیک': 'راه بَستِه',
            'بازار': 'بازار',
            'خانه': 'خونِه'
        };
    }
    
    toBandari(text) {
        let result = text;
        for (let [persian, bandari] of Object.entries(this.dict)) {
            result = result.replace(new RegExp(persian, 'g'), bandari);
        }
        return { original: text, translated: result };
    }
    
    toPersian(text) {
        let result = text;
        const reverse = {};
        for (let [p, b] of Object.entries(this.dict)) reverse[b] = p;
        for (let [bandari, persian] of Object.entries(reverse)) {
            result = result.replace(new RegExp(bandari, 'g'), persian);
        }
        return { original: text, translated: result };
    }
    
    smartTranslate(text) {
        const signals = ['اَبی', 'چِش', 'خَری', 'واویلا'];
        const isBandari = signals.some(s => text.includes(s));
        return isBandari ? this.toPersian(text) : this.toBandari(text);
    }
}

module.exports = BandariTranslator;
