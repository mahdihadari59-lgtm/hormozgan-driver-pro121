// ═══════════════════════════════════════════════════════
// 🗺️ Hormozgan Driver Pro - Map System (Leaflet)
// Version: 1.0.0
// ═══════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════
  const MAP_CONFIG = {
    // مختصات بندرعباس
    CENTER: [27.1832, 56.2666],
    ZOOM: 13,
    MIN_ZOOM: 10,
    MAX_ZOOM: 18,
    
    // تنظیمات نقشه
    TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '© OpenStreetMap contributors',
    
    // آیکون‌های مارکر
    ICONS: {
      DRIVER: '🚗',
      PASSENGER: '👤',
      DESTINATION: '📍',
      CURRENT_LOCATION: '📌'
    }
  };

  // ═══════════════════════════════════════
  // Map Manager Class
  // ═══════════════════════════════════════
  class MapManager {
    constructor(elementId) {
      this.elementId = elementId;
      this.map = null;
      this.markers = [];
      this.currentLocationMarker = null;
      this.watchId = null;
      
      this.init();
    }

    // راه‌اندازی نقشه
    init() {
      try {
        // ساخت نقشه
        this.map = L.map(this.elementId, {
          center: MAP_CONFIG.CENTER,
          zoom: MAP_CONFIG.ZOOM,
          minZoom: MAP_CONFIG.MIN_ZOOM,
          maxZoom: MAP_CONFIG.MAX_ZOOM,
          zoomControl: true
        });

        // افزودن لایه تایل
        L.tileLayer(MAP_CONFIG.TILE_LAYER, {
          attribution: MAP_CONFIG.ATTRIBUTION,
          maxZoom: MAP_CONFIG.MAX_ZOOM
        }).addTo(this.map);

        // افزودن کنترل‌ها
        this.addControls();

        // دریافت موقعیت فعلی
        this.getCurrentLocation();

        console.log('✅ Map initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize map:', error);
      }
    }

    // افزودن کنترل‌های سفارشی
    addControls() {
      // دکمه بازگشت به موقعیت فعلی
      const locationControl = L.control({ position: 'bottomleft' });
      
      locationControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <a href="#" class="map-control-btn" title="موقعیت من">
            📍
          </a>
        `;
        
        div.onclick = (e) => {
          e.preventDefault();
          this.getCurrentLocation();
        };
        
        return div;
      };
      
      locationControl.addTo(this.map);

      // دکمه نمایش رانندگان نزدیک
      const driversControl = L.control({ position: 'topleft' });
      
      driversControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <a href="#" class="map-control-btn" title="رانندگان نزدیک">
            🚗
          </a>
        `;
        
        div.onclick = (e) => {
          e.preventDefault();
          this.showNearbyDrivers();
        };
        
        return div;
      };
      
      driversControl.addTo(this.map);
    }

    // دریافت موقعیت فعلی کاربر
    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.showError('مرورگر شما از Geolocation پشتیبانی نمی‌کند');
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => this.onLocationSuccess(position),
        (error) => this.onLocationError(error),
        options
      );
    }

    // موفقیت در دریافت موقعیت
    onLocationSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      console.log(`📍 Location: ${lat}, ${lng} (±${accuracy}m)`);

      // حذف مارکر قبلی
      if (this.currentLocationMarker) {
        this.map.removeLayer(this.currentLocationMarker);
      }

      // افزودن مارکر موقعیت فعلی
      this.currentLocationMarker = L.marker([lat, lng], {
        icon: this.createCustomIcon(MAP_CONFIG.ICONS.CURRENT_LOCATION, '#667eea')
      }).addTo(this.map);

      this.currentLocationMarker.bindPopup(`
        <div style="text-align: center; direction: rtl;">
          <strong>موقعیت فعلی شما</strong><br>
          <small>دقت: ${Math.round(accuracy)} متر</small>
        </div>
      `).openPopup();

      // افزودن دایره دقت
      L.circle([lat, lng], {
        radius: accuracy,
        color: '#667eea',
        fillColor: '#667eea',
        fillOpacity: 0.1,
        weight: 2
      }).addTo(this.map);

      // تنظیم مرکز نقشه
      this.map.setView([lat, lng], MAP_CONFIG.ZOOM);

      // شروع ردیابی موقعیت
      this.startLocationTracking();
    }

    // خطا در دریافت موقعیت
    onLocationError(error) {
      let message = 'خطا در دریافت موقعیت';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          message = 'دسترسی به موقعیت مکانی رد شد';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'اطلاعات موقعیت در دسترس نیست';
          break;
        case error.TIMEOUT:
          message = 'زمان درخواست موقعیت تمام شد';
          break;
      }
      
      console.error('❌', message, error);
      this.showError(message);
    }

    // شروع ردیابی مداوم موقعیت
    startLocationTracking() {
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
      }

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (this.currentLocationMarker) {
            this.currentLocationMarker.setLatLng([lat, lng]);
          }
        },
        (error) => console.error('Tracking error:', error),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    // نمایش رانندگان نزدیک
    async showNearbyDrivers() {
      try {
        // حذف مارکرهای قبلی رانندگان
        this.clearDriverMarkers();

        // دریافت رانندگان از API
        const response = await fetch('/api/drivers/nearby');
        const data = await response.json();

        if (data.success && data.drivers) {
          data.drivers.forEach(driver => {
            this.addDriverMarker(driver);
          });

          this.showSuccess(`${data.drivers.length} راننده نزدیک پیدا شد`);
        }
      } catch (error) {
        console.error('❌ Failed to load nearby drivers:', error);
        this.showError('خطا در دریافت اطلاعات رانندگان');
      }
    }

    // افزودن مارکر راننده
    addDriverMarker(driver) {
      const marker = L.marker([driver.lat, driver.lng], {
        icon: this.createCustomIcon(MAP_CONFIG.ICONS.DRIVER, '#28a745')
      }).addTo(this.map);

      marker.bindPopup(`
        <div style="text-align: center; direction: rtl; min-width: 150px;">
          <strong>${driver.name}</strong><br>
          <span style="color: #ffc107;">⭐ ${driver.rating}</span><br>
          <button onclick="requestDriver(${driver.id})" 
                  style="margin-top: 8px; padding: 6px 12px; background: #667eea; 
                         color: white; border: none; border-radius: 6px; cursor: pointer;">
            درخواست سفر
          </button>
        </div>
      `);

      this.markers.push({ type: 'driver', marker, data: driver });
    }

    // ساخت آیکون سفارشی
    createCustomIcon(emoji, color = '#667eea') {
      return L.divIcon({
        html: `
          <div style="
            background: ${color};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${emoji}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
    }

    // حذف مارکرهای رانندگان
    clearDriverMarkers() {
      this.markers.forEach(item => {
        if (item.type === 'driver') {
          this.map.removeLayer(item.marker);
        }
      });
      this.markers = this.markers.filter(item => item.type !== 'driver');
    }

    // محاسبه مسیر بین دو نقطه
    calculateRoute(startLat, startLng, endLat, endLng) {
      // حذف مسیر قبلی اگر وجود دارد
      if (this.routeLine) {
        this.map.removeLayer(this.routeLine);
      }

      // رسم خط مستقیم (در حالت واقعی از Routing API استفاده می‌شود)
      this.routeLine = L.polyline(
        [[startLat, startLng], [endLat, endLng]],
        {
          color: '#667eea',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10'
        }
      ).addTo(this.map);

      // محاسبه فاصله
      const distance = this.calculateDistance(startLat, startLng, endLat, endLng);
      
      // نمایش اطلاعات مسیر
      this.showRouteInfo(distance);

      // تنظیم bounds برای نمایش کل مسیر
      const bounds = L.latLngBounds([
        [startLat, startLng],
        [endLat, endLng]
      ]);
      this.map.fitBounds(bounds, { padding: [50, 50] });

      return distance;
    }

    // محاسبه فاصله بین دو نقطه (Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // شعاع زمین به کیلومتر
      const dLat = this.toRad(lat2 - lat1);
      const dLon = this.toRad(lon2 - lon1);
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      return distance; // کیلومتر
    }

    // تبدیل درجه به رادیان
    toRad(degree) {
      return degree * Math.PI / 180;
    }

    // نمایش اطلاعات مسیر
    showRouteInfo(distance) {
      const duration = Math.round((distance / 40) * 60); // فرض: 40 کیلومتر بر ساعت
      
      const popup = L.popup()
        .setLatLng(this.map.getCenter())
        .setContent(`
          <div style="text-align: center; direction: rtl;">
            <strong>اطلاعات مسیر</strong><br>
            <p style="margin: 8px 0;">
              📏 فاصله: ${distance.toFixed(2)} کیلومتر<br>
              ⏱️ زمان تقریبی: ${duration} دقیقه
            </p>
          </div>
        `)
        .openOn(this.map);
    }

    // نمایش پیام موفقیت
    showSuccess(message) {
      const toast = L.control({ position: 'topright' });
      
      toast.onAdd = () => {
        const div = L.DomUtil.create('div', 'map-toast success');
        div.innerHTML = `✅ ${message}`;
        setTimeout(() => div.remove(), 3000);
        return div;
      };
      
      toast.addTo(this.map);
    }

    // نمایش پیام خطا
    showError(message) {
      const toast = L.control({ position: 'topright' });
      
      toast.onAdd = () => {
        const div = L.DomUtil.create('div', 'map-toast error');
        div.innerHTML = `❌ ${message}`;
        setTimeout(() => div.remove(), 3000);
        return div;
      };
      
      toast.addTo(this.map);
    }

    // پاکسازی نقشه
    destroy() {
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
      }
      
      if (this.map) {
        this.map.remove();
      }
    }
  }

  // ═══════════════════════════════════════
  // Global Functions
  // ═══════════════════════════════════════
  
  // درخواست راننده
  window.requestDriver = function(driverId) {
    console.log('Requesting driver:', driverId);
    alert(`درخواست سفر با راننده ${driverId} ارسال شد`);
  };

  // ═══════════════════════════════════════
  // Auto-Initialization
  // ═══════════════════════════════════════
  
  function initMap() {
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
      window.mapManager = new MapManager('map');
      console.log('✅ Map Manager initialized');
    }
  }

  // اجرا بعد از بارگذاری صفحه
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }

  // Export
  window.MapManager = MapManager;

})();

// ═══════════════════════════════════════
// CSS Styles for Map
// ═══════════════════════════════════════
const mapStyles = `
  <style>
    #map {
      width: 100%;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .map-control-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 20px;
      background: white;
      border: 2px solid rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s;
    }

    .map-control-btn:hover {
      background: #f0f0f0;
      transform: scale(1.1);
    }

    .map-toast {
      padding: 12px 20px;
      border-radius: 8px;
      margin: 10px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
      direction: rtl;
      text-align: right;
    }

    .map-toast.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .map-toast.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .leaflet-popup-content-wrapper {
      border-radius: 8px;
      padding: 8px;
    }

    .custom-marker {
      animation: markerBounce 1s ease infinite;
    }

    @keyframes markerBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  </style>
`;

// افزودن استایل‌ها به صفحه
if (document.head) {
  document.head.insertAdjacentHTML('beforeend', mapStyles);
}
