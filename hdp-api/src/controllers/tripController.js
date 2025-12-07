module.exports = {
    requestTrip: (req, res) => {
        res.json({ success: true, trip: "Trip requested" });
    }
};
