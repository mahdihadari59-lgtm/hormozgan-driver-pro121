"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Driver_1 = require("./entities/Driver");
const Trip_1 = require("./entities/Trip");
const DriverDocument_1 = require("./entities/DriverDocument");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'developer',
    password: process.env.DB_PASSWORD || 'dev123456',
    database: process.env.DB_NAME || 'hormozgan_driver',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [User_1.User, Driver_1.Driver, Trip_1.Trip, DriverDocument_1.DriverDocument],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map