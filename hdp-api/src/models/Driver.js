module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    return sequelize.define("Driver", {
        carModel: DataTypes.STRING,
        carColor: DataTypes.STRING,
        carNumber: DataTypes.STRING,
        status: { type: DataTypes.STRING, defaultValue: "offline" },
        lastActive: DataTypes.DATE
    });
};
