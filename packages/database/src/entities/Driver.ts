
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { User } from './User';

import { Trip } from './Trip';

import { DriverDocument } from './DriverDocument';

export enum VehicleType {

  MOTORCYCLE = 'MOTORCYCLE',

  CAR = 'CAR',

  VAN = 'VAN',

  PICKUP = 'PICKUP',

  TRUCK = 'TRUCK',

}

export enum DriverStatus {

  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',

  SUSPENDED = 'SUSPENDED',

  PENDING_APPROVAL = 'PENDING_APPROVAL',

  ON_TRIP = 'ON_TRIP',

}

@Entity('drivers')

export class Driver {

  @PrimaryGeneratedColumn('uuid')

  id!: string;

  @OneToOne(() => User, (user) => user.driver)

  @JoinColumn()

  user!: User;

  @Column({ length: 50 })

  firstName!: string;

  @Column({ length: 50 })

  lastName!: string;

  @Column({ unique: true, length: 10 })

  nationalId!: string;

  @Column({ length: 20 })

  licenseNumber!: string;

  @Column({ type: 'enum', enum: VehicleType })

  vehicleType!: VehicleType;

  @Column({ length: 20 })

  vehiclePlate!: string;

  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.PENDING_APPROVAL })

  status!: DriverStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })

  rating!: number;

  @Column({ default: 0 })

  totalTrips!: number;

  @CreateDateColumn()

  createdAt!: Date;

  @UpdateDateColumn()

  updatedAt!: Date;

  @OneToMany(() => Trip, (trip) => trip.driver)

  trips?: Trip[];

  @OneToMany(() => DriverDocument, (doc) => doc.driver)

  documents?: DriverDocument[];

}

