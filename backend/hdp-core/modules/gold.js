class GoldPredictor {
    constructor() {
        this.prices = {
            gold_18: '4,850,000',
            gold_24: '6,400,000',
            usd: '78,000',
            eur: '85,000'
        };
    }
    
    getPrediction() {
        return {
            currentPrice: this.prices.gold_18,
            predictedPrice: '4,830,000',
            trend: 'نزولی',
            confidence: 0.85
        };
    }
    
    getAllPrices() {
        return this.prices;
    }
}

module.exports = GoldPredictor;
