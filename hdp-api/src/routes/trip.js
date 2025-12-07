const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TripController = require("../controllers/tripController");

router.post("/request", auth, TripController.createTrip);
router.get("/estimate", auth, TripController.estimatePrice);
router.get("/active", auth, TripController.getActiveTrip);

module.exports = router;
