-- scripts/setup-postgis.sql
-- ایجاد اکستنشن PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- جدول رانندگان
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_trips INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'offline',
    current_location GEOGRAPHY(Point, 4326),
    last_online TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول مکان‌های گردشگری
CREATE TABLE IF NOT EXISTS tourist_spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    entrance_fee INTEGER DEFAULT 0,
    opening_hours JSONB,
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول سفرها
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    passenger_phone VARCHAR(15),
    start_location GEOGRAPHY(Point, 4326) NOT NULL,
    end_location GEOGRAPHY(Point, 4326) NOT NULL,
    route GEOGRAPHY(LineString, 4326),
    distance_meters INTEGER,
    duration_minutes INTEGER,
    fare_amount INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ایندکس‌های مکانی برای عملکرد بهتر
CREATE INDEX IF NOT EXISTS idx_drivers_location ON drivers USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_tourist_spots_location ON tourist_spots USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_trips_start_location ON trips USING GIST (start_location);
CREATE INDEX IF NOT EXISTS idx_trips_end_location ON trips USING GIST (end_location);

-- ایندکس برای جستجوی سریع
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);

-- داده‌های نمونه
INSERT INTO drivers (name, phone, rating, total_trips, status, current_location) VALUES
('محمد احمدی', '09123456789', 4.8, 342, 'online', ST_GeogFromText('POINT(56.2778 27.1865)')),
('علی رضایی', '09123456790', 4.9, 521, 'online', ST_GeogFromText('POINT(56.2788 27.1875)')),
('حسین کریمی', '09123456791', 4.7, 289, 'online', ST_GeogFromText('POINT(56.2768 27.1855)'));

INSERT INTO tourist_spots (name, type, description, rating, location, entrance_fee) VALUES
('جزیره هرمز', 'island', 'جزیره رنگین‌کمان با خاک‌های رنگی', 4.9, ST_GeogFromText('POINT(56.4767 27.0598)'), 50000),
('جزیره قشم', 'island', 'بزرگترین جزیره خلیج فارس', 4.8, ST_GeogFromText('POINT(56.2721 26.9478)'), 30000),
('دره ستارگان', 'nature', 'دره‌ای با فرم‌های سنگی بی‌نظیر', 4.7, ST_GeogFromText('POINT(55.9167 26.8583)'), 20000);
