import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from './Driver';

export enum TripStatus {
  CREATED = 'CREATED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Driver, (driver) => driver.trips)
  @JoinColumn()
  driver!: Driver;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  originLatitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  originLongitude!: number;

  @Column({ type: 'text', nullable: true })
  originAddress?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  destinationLatitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  destinationLongitude!: number;

  @Column({ type: 'text', nullable: true })
  destinationAddress?: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.CREATED,
  })
  status!: TripStatus;

  @Column({ nullable: true })
  distance?: number;

  @Column({ nullable: true })
  duration?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fare?: number;

  @Column({ nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
