module.exports = {
    dashboard: (req, res) => {
        res.json({ success: true, admin: "HDP Admin Dashboard" });
    }
};
