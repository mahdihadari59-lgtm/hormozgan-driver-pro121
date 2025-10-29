// کنترلر اصلی
class MainController {
    static getHome(req, res) {
        res.json({ message: 'کنترلر اصلی فعال است' });
    }

    static getDrivers(req, res) {
        res.json({ drivers: ['راننده ۱', 'راننده ۲'] });
    }
}

module.exports = MainController;
