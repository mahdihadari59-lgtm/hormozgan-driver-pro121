"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("@hormozgan/database");
const driver_routes_1 = __importDefault(require("./routes/driver.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.use('/api/driver', driver_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'driver-service' });
});
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Driver Service running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Database connection failed:', error);
});
//# sourceMappingURL=index.js.map