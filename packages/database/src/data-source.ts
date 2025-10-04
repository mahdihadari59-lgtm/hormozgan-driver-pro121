import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Driver } from './entities/Driver';
import { Trip } from './entities/Trip';
import { DriverDocument } from './entities/DriverDocument';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'developer',
  password: process.env.DB_PASSWORD || 'dev123456',
  database: process.env.DB_NAME || 'hormozgan_driver',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Driver, Trip, DriverDocument],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
