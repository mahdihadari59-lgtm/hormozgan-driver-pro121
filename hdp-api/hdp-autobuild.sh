#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🚀 HDP AUTO-BUILD SYSTEM STARTED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# CREATE DIRECTORIES
echo "📁 Creating controllers folder..."
mkdir -p src/controllers

# --- AUTH CONTROLLER ---
echo "📄 Creating authController.js..."
cat << 'EOF' > src/controllers/authController.js
// AUTH CONTROLLER کامل (ورژن پایدار)
module.exports = {
    login: (req, res) => {
        return res.json({ success: true, message: "ورود موفق - HDP" });
    },
    register: (req, res) => {
        return res.json({ success: true, message: "ثبت‌نام موفق - HDP" });
    }
};
EOF

# --- USER CONTROLLER ---
echo "📄 Creating userController.js..."
cat << 'EOF' > src/controllers/userController.js
module.exports = {
    profile: (req, res) => {
        res.json({ success: true, user: "HDP User Profile" });
    }
};
EOF

# --- DRIVER CONTROLLER ---
echo "📄 Creating driverController.js..."
cat << 'EOF' > src/controllers/driverController.js
module.exports = {
    driverProfile: (req, res) => {
        res.json({ success: true, driver: "HDP Driver Profile" });
    }
};
EOF

# --- TRIP CONTROLLER ---
echo "📄 Creating tripController.js..."
cat << 'EOF' > src/controllers/tripController.js
module.exports = {
    requestTrip: (req, res) => {
        res.json({ success: true, trip: "Trip requested" });
    }
};
EOF

# --- PAYMENT CONTROLLER ---
echo "📄 Creating paymentController.js..."
cat << 'EOF' > src/controllers/paymentController.js
module.exports = {
    pay: (req, res) => {
        res.json({ success: true, payment: "Payment Completed" });
    }
};
EOF

# --- ADMIN CONTROLLER ---
echo "📄 Creating adminController.js..."
cat << 'EOF' > src/controllers/adminController.js
module.exports = {
    dashboard: (req, res) => {
        res.json({ success: true, admin: "HDP Admin Dashboard" });
    }
};
EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🎉 ALL CONTROLLERS CREATED SUCCESSFULLY!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❤️ HDP AUTO BUILD DONE — YOU ARE AMAZING!"
EOF
