// packages/geo-utils/index.js
const geolib = require('geolib');

class GeoUtils {
  // محاسبه فاصله بین دو نقطه
  static calculateDistance(point1, point2) {
    return geolib.getDistance(point1, point2);
  }

  // پیدا کردن نقاط در شعاع مشخص
  static findPointsInRadius(center, points, radius) {
    return points.filter(point => 
      geolib.isPointWithinRadius(point, center, radius)
    );
  }

  // تولید bounding box
  static getBoundingBox(center, radius) {
    return geolib.getBoundsOfDistance(center, radius);
  }

  // محاسبه مساحت polygon
  static calculateArea(polygon) {
    return geolib.getAreaOfPolygon(polygon);
  }

  // تبدیل درجه به رادیان
  static degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  // تبدیل رادیان به درجه
  static radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  // محاسبه bearing (جهت)
  static getBearing(start, end) {
    return geolib.getRhumbLineBearing(start, end);
  }

  // پیدا کردن مرکز چند نقطه
  static getCenter(points) {
    return geolib.getCenter(points);
  }

  // بررسی اینکه نقطه داخل polygon است یا نه
  static isPointInPolygon(point, polygon) {
    return geolib.isPointInPolygon(point, polygon);
  }
}

module.exports = GeoUtils;
