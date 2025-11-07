// TourismService.js - نسخه کامل
const { Pool } = require('pg');
const database = require('../core/database');

class TourismService {
  constructor() {
    this.pool = database.getPool();
  }

  // دریافت مکان‌های گردشگری نزدیک
  async getNearbyTouristSpots(lat, lng, radius = 5000) {
    const query = `
      SELECT 
        id,
        name,
        type,
        ST_Y(location::geometry) as lat,
        ST_X(location::geometry) as lng,
        description,
        rating,
        opening_hours as "openingHours",
        entrance_fee as "entranceFee",
        images
      FROM tourist_spots
      WHERE 
        ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY rating DESC
      LIMIT 20
    `;

    const result = await this.pool.query(query, [lng, lat, radius]);
    return result.rows;
  }

  // دریافت تورهای موجود
  async getAvailableTours() {
    const query = `
      SELECT 
        tp.id,
        tp.name,
        tp.description,
        tp.duration,
        tp.price,
        tp.guide_available as "guideAvailable",
        tp.languages,
        json_agg(
          json_build_object(
            'id', ts.id,
            'name', ts.name,
            'type', ts.type,
            'lat', ST_Y(ts.location::geometry),
            'lng', ST_X(ts.location::geometry),
            'description', ts.description,
            'rating', ts.rating
          )
        ) as spots
      FROM tour_packages tp
      LEFT JOIN tour_package_spots tps ON tp.id = tps.tour_package_id
      LEFT JOIN tourist_spots ts ON tps.spot_id = ts.id
      GROUP BY tp.id, tp.name, tp.description, tp.duration, tp.price, tp.guide_available, tp.languages
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  // اضافه کردن نظر جدید
  async addReview(spotId, userId, rating, comment) {
    const query = `
      INSERT INTO spot_reviews (spot_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [spotId, userId, rating, comment]);
    
    // آپدیت میانگین امتیاز
    await this.updateSpotRating(spotId);
    
    return result.rows[0];
  }

  // آپدیت میانگین امتیاز مکان
  async updateSpotRating(spotId) {
    const query = `
      UPDATE tourist_spots 
      SET rating = (
        SELECT AVG(rating) FROM spot_reviews WHERE spot_id = $1
      )
      WHERE id = $1
    `;
    
    await this.pool.query(query, [spotId]);
  }

  // محاسبه تخفیف هوشمند
  async calculateSmartDiscount(userId, tourId, participantCount = 1) {
    const userHistory = await this.getUserTourHistory(userId);
    
    let discountPercentage = 0;
    let discountReason = '';

    // تخفیف بر اساس تعداد تورهای قبلی
    if (userHistory.totalTours > 5) {
      discountPercentage += 15;
      discountReason += 'مشتری وفادار، ';
    }

    // تخفیف بر اساس فصل
    const currentMonth = new Date().getMonth() + 1;
    if (currentMonth >= 6 && currentMonth <= 8) {
      discountPercentage += 10;
      discountReason += 'فصل کم‌رونق، ';
    }

    // تخفیف بر اساس زمان روز
    const currentHour = new Date().getHours();
    if (currentHour >= 14 && currentHour <= 17) {
      discountPercentage += 5;
      discountReason += 'ساعات غیرشلوغ، ';
    }

    // تخفیف گروهی
    if (participantCount > 4) {
      discountPercentage += 10;
      discountReason += 'تخفیف گروهی، ';
    }

    // محاسبه قیمت نهایی
    const tour = await this.getTourById(tourId);
    const discountedPrice = tour.price * (1 - discountPercentage / 100);

    return {
      originalPrice: tour.price,
      discountedPrice: Math.round(discountedPrice),
      discountPercentage,
      discountReason: discountReason || 'تخفیف معمولی'
    };
  }

  // رزرو تور
  async bookTour(userId, tourId, participantCount = 1, guideRequested = false) {
    const discount = await this.calculateSmartDiscount(userId, tourId, participantCount);
    
    const query = `
      INSERT INTO tour_bookings (
        user_id,
        tour_package_id,
        participant_count,
        guide_requested,
        total_price,
        discount_applied,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      userId,
      tourId,
      participantCount,
      guideRequested,
      discount.discountedPrice,
      discount.discountPercentage
    ]);

    return {
      booking: result.rows[0],
      discountDetails: discount
    };
  }

  // دریافت پیشنهادات شخصی‌سازی شده
  async getPersonalizedRecommendations(userId) {
    const userPreferences = await this.getUserPreferences(userId);
    const userHistory = await this.getUserTourHistory(userId);
    
    const query = `
      SELECT * FROM tour_packages 
      WHERE type = ANY($1::text[])
      AND price <= $2
      ORDER BY rating DESC
      LIMIT 10
    `;
    
    const result = await this.pool.query(query, [
      userPreferences.preferredTypes || ['historical', 'beach'],
      userHistory.maxBudget || 1000000
    ]);
    
    return result.rows;
  }

  // متدهای کمکی
  async getUserTourHistory(userId) {
    const query = `
      SELECT 
        COUNT(*) as "totalTours",
        AVG(rating) as "averageRating",
        MAX(total_price) as "maxBudget"
      FROM tour_bookings 
      WHERE user_id = $1 AND status = 'completed'
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || { totalTours: 0, averageRating: 0, maxBudget: 500000 };
  }

  async getTourById(tourId) {
    const query = 'SELECT * FROM tour_packages WHERE id = $1';
    const result = await this.pool.query(query, [tourId]);
    return result.rows[0];
  }

  async getUserPreferences(userId) {
    const query = 'SELECT preferred_types as "preferredTypes" FROM user_preferences WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || { preferredTypes: ['historical', 'beach'] };
  }
}

module.exports = TourismService;
