const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middleware/auth');

// Get driver profile
router.get('/profile', auth, driverController.getProfile);

// Update driver profile
router.put('/profile', auth, driverController.updateProfile);

// Go online
router.post('/go-online', auth, driverController.goOnline);

// Go offline
router.post('/go-offline', auth, driverController.goOffline);

// Get trip requests
router.get('/trip-requests', auth, driverController.getTripRequests);

// Accept trip
router.post('/trip-requests/:tripId/accept', auth, driverController.acceptTrip);

// Start trip
router.post('/trips/:tripId/start', auth, driverController.startTrip);

// Complete trip
router.post('/trips/:tripId/complete', auth, driverController.completeTrip);

// Get earnings
router.get('/earnings', auth, driverController.getEarnings);

// Get trip history
router.get('/trip-history', auth, driverController.getTripHistory);

// Get current trip
router.get('/current-trip', auth, driverController.getCurrentTrip);

// Update location
router.post('/update-location', auth, driverController.updateLocation);

module.exports = router;
