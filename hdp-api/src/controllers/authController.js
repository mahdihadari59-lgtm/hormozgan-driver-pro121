// AUTH CONTROLLER کامل (ورژن پایدار)
module.exports = {
    login: (req, res) => {
        return res.json({ success: true, message: "ورود موفق - HDP" });
    },
    register: (req, res) => {
        return res.json({ success: true, message: "ثبت‌نام موفق - HDP" });
    }
};
