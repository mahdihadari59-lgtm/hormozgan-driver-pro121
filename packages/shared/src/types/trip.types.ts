export interface Trip {
  id: string;
  driverId: string;
  origin: TripLocation;
  destination: TripLocation;
  status: TripStatus;
  distance?: number;
  duration?: number;
  fare?: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum TripStatus {
  CREATED = 'CREATED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface TripLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  province?: string;
}
