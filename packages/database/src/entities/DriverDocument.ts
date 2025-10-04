import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from './Driver';

export enum DocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  VEHICLE_LICENSE = 'VEHICLE_LICENSE',
  VEHICLE_INSURANCE = 'VEHICLE_INSURANCE',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity('driver_documents')
export class DriverDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Driver, (driver) => driver.documents)
  @JoinColumn()
  driver!: Driver;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type!: DocumentType;

  @Column()
  fileUrl!: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status!: DocumentStatus;

  @Column({ nullable: true })
  expiryDate?: Date;

  @CreateDateColumn()
  uploadedAt!: Date;
}
