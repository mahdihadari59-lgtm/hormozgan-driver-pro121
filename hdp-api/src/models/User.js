module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    return sequelize.define("User", {
        phone: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING },
        password: { type: DataTypes.STRING, allowNull: false }
    });
};
