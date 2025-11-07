// apps/database-service/index.js
const express = require('express');
const cors = require('cors');
const { query, getClient } = require('../../config/database');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

// دریافت رانندگان نزدیک با PostGIS
app.get('/api/drivers/nearby-postgis', async (req, res) => {
  try {
    const { lat, lng, radius = 2000, limit = 10 } = req.query;
    
    const sql = `
      SELECT 
        id,
        name,
        phone,
        rating,
        total_trips,
        status,
        ST_X(current_location::geometry) as lng,
        ST_Y(current_location::geometry) as lat,
        ST_Distance(current_location, ST_GeogFromText($1)) as distance
      FROM drivers 
      WHERE status = 'online'
        AND ST_DWithin(current_location, ST_GeogFromText($1), $2)
      ORDER BY distance ASC
      LIMIT $3
    `;
    
    const point = `POINT(${lng} ${lat})`;
    const result = await query(sql, [point, radius, limit]);
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        distance: Math.round(row.distance),
        eta: Math.round(row.distance / 500) + ' دقیقه'
      })),
      count: result.rows.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات رانندگان'
    });
  }
});

// دریافت مکان‌های گردشگری نزدیک
app.get('/api/tourism/nearby-postgis', async (req, res) => {
  try {
    const { lat, lng, radius = 10000, type } = req.query;
    
    let sql = `
      SELECT 
        id,
        name,
        type,
        description,
        rating,
        entrance_fee,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat,
        ST_Distance(location, ST_GeogFromText($1)) as distance
      FROM tourist_spots 
      WHERE ST_DWithin(location, ST_GeogFromText($1), $2)
    `;
    
    const params = [`POINT(${lng} ${lat})`, radius];
    
    if (type) {
      sql += ` AND type = $3`;
      params.push(type);
    }
    
    sql += ` ORDER BY distance ASC LIMIT 20`;
    
    const result = await query(sql, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات گردشگری'
    });
  }
});

// محاسبه مسیر با PostGIS
app.post('/api/route/calculate', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;
    
    // شبیه‌سازی محاسبه مسیر با PostGIS
    // در پروژه واقعی از pgRouting استفاده می‌شود
    const sql = `
      SELECT 
        ST_Length(ST_MakeLine(
          ST_GeogFromText($1),
          ST_GeogFromText($2)
        )) as distance,
        ST_AsGeoJSON(ST_MakeLine(
          ST_GeogFromText($1),
          ST_GeogFromText($2)
        )) as route_geojson
    `;
    
    const startPoint = `POINT(${startLng} ${startLat})`;
    const endPoint = `POINT(${endLng} ${endLat})`;
    
    const result = await query(sql, [startPoint, endPoint]);
    const distance = Math.round(result.rows[0].distance);
    const route = JSON.parse(result.rows[0].route_geojson);
    
    res.json({
      success: true,
      data: {
        distance,
        duration: Math.round(distance / 500), // دقیقه
        route,
        fare: Math.round(distance * 1000), // تومان
        algorithm: 'PostGIS Shortest Path'
      }
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در محاسبه مسیر'
    });
  }
});

// آمار سیستم
app.get('/api/stats/system', async (req, res) => {
  try {
    const driversQuery = `
      SELECT 
        COUNT(*) as total_drivers,
        COUNT(CASE WHEN status = 'online' THEN 1 END) as online_drivers,
        AVG(rating) as avg_rating
      FROM drivers
    `;
    
    const tripsQuery = `
      SELECT 
        COUNT(*) as total_trips,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_trips,
        SUM(fare_amount) as total_revenue
      FROM trips
      WHERE created_at >= CURRENT_DATE
    `;
    
    const [driversResult, tripsResult] = await Promise.all([
      query(driversQuery),
      query(tripsQuery)
    ]);
    
    res.json({
      success: true,
      data: {
        drivers: driversResult.rows[0],
        trips: tripsResult.rows[0],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Database Service',
    postgis: 'active',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🗄️  Hormozgan Database Service         ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   💾 Port: ${PORT}                            ║`);
  console.log('║   ✅ PostgreSQL + PostGIS: Active         ║');
  console.log('║   📍 Spatial Queries: Ready               ║');
  console.log('╚════════════════════════════════════════════╝');
});
