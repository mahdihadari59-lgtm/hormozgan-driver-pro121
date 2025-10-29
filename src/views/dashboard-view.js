// ویوهای داشبورد
class DashboardView {
    static renderStats(stats) {
        return `
            <div class="stats">
                <h3>آمار سیستم</h3>
                <p>رانندگان آنلاین: ${stats.onlineDrivers}</p>
            </div>
        `;
    }
}

module.exports = DashboardView;
