# ============ الگوریتم هوشمند ترافیک بندرعباس ============
# بر اساس گزارش جامع پایش ترافیک ۱۴۰۵

import datetime
from flask import jsonify

def get_traffic_status():
    """دریافت وضعیت ترافیک لحظه‌ای بر اساس ساعت و روز هفته"""
    
    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute
    weekday = now.weekday()  # 0=Monday, 4=Friday, 5=Saturday, 6=Sunday
    
    # نقشه روزهای هفته
    weekdays_map = {
        5: "شنبه", 6: "یکشنبه", 0: "دوشنبه", 
        1: "سه‌شنبه", 2: "چهارشنبه", 3: "پنجشنبه", 4: "جمعه"
    }
    
    # مقداردهی اولیه
    zones = {
        "north": {"name": "منطقه یک (شمال) - نایبند، گلشهر", "status": "عادی", "index": 3, "desc": ""},
        "center": {"name": "منطقه دو (مرکز) - میدان ولیعصر، چهارراه شهدا", "status": "عادی", "index": 3, "desc": ""},
        "south": {"name": "منطقه سه (جنوب) - ساحلی سورو، اسکله حقانی", "status": "عادی", "index": 3, "desc": ""},
        "east": {"name": "منطقه چهار (شرق) - بلوار شهید رجایی، سه‌راه گاراژ", "status": "عادی", "index": 3, "desc": ""}
    }
    
    # ============ منطقه یک (شمال) ============
    if weekday in [5, 6, 0, 1, 2]:  # شنبه تا چهارشنبه
        if 7 <= hour < 8:
            zones["north"]["status"] = "نیمه سنگین"
            zones["north"]["index"] = 5
            zones["north"]["desc"] = "شروع ساعات اوج صبحگاهی، تردد دانش‌آموزی و کارمندان"
        elif 8 <= hour < 9:
            zones["north"]["status"] = "اوج صبحگاهی"
            zones["north"]["index"] = 8
            zones["north"]["desc"] = "اوج ترافیک مدارس و ادارات، تقاطع میدان رسالت و بلوار امام"
        elif 9 <= hour < 10:
            zones["north"]["status"] = "سنگین"
            zones["north"]["index"] = 7
            zones["north"]["desc"] = "ادامه ترافیک اداری، مراجعه به بیمارستان‌ها"
        elif 10 <= hour < 11:
            zones["north"]["status"] = "متوسط"
            zones["north"]["index"] = 5
            zones["north"]["desc"] = "کاهش نسبی، ساعات میانی روز"
        elif 11 <= hour < 12:
            zones["north"]["status"] = "متوسط رو به سنگین"
            zones["north"]["index"] = 6
            zones["north"]["desc"] = "نزدیک به ظهر، افزایش ترددهای ناهار"
        elif 12 <= hour < 13:
            zones["north"]["status"] = "سنگین"
            zones["north"]["index"] = 7
            zones["north"]["desc"] = "پایان ساعات اداری صبح، ترافیک ناهار"
        elif 13 <= hour < 14:
            zones["north"]["status"] = "بحرانی"
            zones["north"]["index"] = 9
            zones["north"]["desc"] = "اوج ترافیک ظهر، همزمانی خروج ادارات و مدارس"
        elif 14 <= hour < 15:
            zones["north"]["status"] = "نیمه سنگین"
            zones["north"]["index"] = 5
            zones["north"]["desc"] = "کاهش پس از ظهر، ساعات استراحت"
        elif 15 <= hour < 16:
            zones["north"]["status"] = "خلوت"
            zones["north"]["index"] = 4
            zones["north"]["desc"] = "کمترین ترافیک روز (زمان ایده‌آل برای تردد)"
        elif 16 <= hour < 17:
            zones["north"]["status"] = "متوسط"
            zones["north"]["index"] = 5
            zones["north"]["desc"] = "شروع ترددهای عصرگاهی"
        elif 17 <= hour < 18:
            zones["north"]["status"] = "نیمه سنگین"
            zones["north"]["index"] = 6
            zones["north"]["desc"] = "افزایش تردد، شروع ساعات اوج عصر"
        elif 18 <= hour < 19:
            zones["north"]["status"] = "اوج عصرگاهی"
            zones["north"]["index"] = 8
            zones["north"]["desc"] = "اوج ترافیک عصر، خروج از مراکز کاری"
        elif 19 <= hour < 20:
            zones["north"]["status"] = "نیمه سنگین"
            zones["north"]["index"] = 6
            zones["north"]["desc"] = "کاهش تدریجی"
        elif 20 <= hour < 21:
            zones["north"]["status"] = "خلوت"
            zones["north"]["index"] = 3
            zones["north"]["desc"] = "ترافیک عادی شبانه"
        else:
            zones["north"]["status"] = "بسیار خلوت"
            zones["north"]["index"] = 1
    
    # ============ منطقه دو (مرکز) - بحرانی‌ترین ============
    if weekday in [5, 6, 0, 1, 2]:  # شنبه تا چهارشنبه
        if 7 <= hour < 8:
            zones["center"]["status"] = "نیمه سنگین"
            zones["center"]["index"] = 5
            zones["center"]["desc"] = "شروع حرکت به سمت مرکز"
        elif 8 <= hour < 9:
            zones["center"]["status"] = "اوج صبحگاهی"
            zones["center"]["index"] = 8
            zones["center"]["desc"] = "ترافیک شدید ورودی به میدان ولیعصر و چهارراه شهدا"
        elif 9 <= hour < 11:
            zones["center"]["status"] = "سنگین"
            zones["center"]["index"] = 8
            zones["center"]["desc"] = "اوج مراجعه به مطب‌ها و ادارات، پارکینگ‌ها تکمیل"
        elif 11 <= hour < 12:
            zones["center"]["status"] = "نیمه سنگین"
            zones["center"]["index"] = 6
            zones["center"]["desc"] = "کاهش اندک، اما همچنان پرتردد"
        elif 12 <= hour < 14:
            zones["center"]["status"] = "بحرانی"
            zones["center"]["index"] = 9
            zones["center"]["desc"] = "اوج ترافیک ظهر، گره‌های میدان ولیعصر"
        elif 14 <= hour < 15:
            zones["center"]["status"] = "نیمه سنگین"
            zones["center"]["index"] = 5
            zones["center"]["desc"] = "کاهش تدریجی پس از ظهر"
        elif 15 <= hour < 16:
            zones["center"]["status"] = "متوسط"
            zones["center"]["index"] = 4
            zones["center"]["desc"] = "مناسب‌ترین زمان برای تردد"
        elif 16 <= hour < 17:
            zones["center"]["status"] = "متوسط"
            zones["center"]["index"] = 5
            zones["center"]["desc"] = "شروع فعالیت عصرانه مطب‌ها"
        elif 17 <= hour < 18:
            zones["center"]["status"] = "نیمه سنگین"
            zones["center"]["index"] = 6
            zones["center"]["desc"] = "افزایش تردد، شروع اوج عصر"
        elif 18 <= hour < 19:
            zones["center"]["status"] = "اوج عصر"
            zones["center"]["index"] = 8
            zones["center"]["desc"] = "خروج از مرکز، ادغام با ترافیک خرید"
        elif 19 <= hour < 20:
            zones["center"]["status"] = "نیمه سنگین"
            zones["center"]["index"] = 6
            zones["center"]["desc"] = "کاهش تدریجی، ترافیک شامگاهی"
        elif 20 <= hour < 22:
            zones["center"]["status"] = "خلوت"
            zones["center"]["index"] = 3
            zones["center"]["desc"] = "ترافیک عادی شبانه"
        else:
            zones["center"]["status"] = "بسیار خلوت"
            zones["center"]["index"] = 1
    
    # ============ منطقه سه (جنوب) - ساحلی ============
    if weekday in [5, 6, 0, 1, 2]:  # شنبه تا چهارشنبه
        if 6 <= hour < 8:
            zones["south"]["status"] = "نیمه سنگین"
            zones["south"]["index"] = 5
            zones["south"]["desc"] = "تردد صیادان، تخلیه ماهی در بازار ماهی"
        elif 8 <= hour < 12:
            zones["south"]["status"] = "خلوت"
            zones["south"]["index"] = 2
            zones["south"]["desc"] = "کمترین ترافیک روز"
        elif 12 <= hour < 14:
            zones["south"]["status"] = "متوسط"
            zones["south"]["index"] = 4
            zones["south"]["desc"] = "ترافیک ناهار، مراجعه به رستوران‌های ساحلی"
        elif 14 <= hour < 16:
            zones["south"]["status"] = "خلوت"
            zones["south"]["index"] = 2
            zones["south"]["desc"] = "ساعات گرم، کاهش تردد"
        elif 16 <= hour < 17:
            zones["south"]["status"] = "متوسط"
            zones["south"]["index"] = 4
            zones["south"]["desc"] = "شروع تردد عصرگاهی تفریحی"
        elif 17 <= hour < 19:
            zones["south"]["status"] = "نیمه سنگین"
            zones["south"]["index"] = 6
            zones["south"]["desc"] = "افزایش تردد به سمت ساحل و اسکله"
        elif 19 <= hour < 21:
            zones["south"]["status"] = "اوج عصرگاهی"
            zones["south"]["index"] = 7
            zones["south"]["desc"] = "اوج ترافیک تفریحی، شامگاه"
        elif 21 <= hour < 23:
            zones["south"]["status"] = "نیمه سنگین"
            zones["south"]["index"] = 5
            zones["south"]["desc"] = "ادامه تردد، اما کاهش"
        else:
            zones["south"]["status"] = "بسیار خلوت"
            zones["south"]["index"] = 1
    
    # جمعه (بحرانی‌ترین روز برای منطقه جنوب)
    elif weekday == 4:
        if 10 <= hour < 12:
            zones["south"]["status"] = "متوسط"
            zones["south"]["index"] = 5
            zones["south"]["desc"] = "ترافیک صبحگاهی آخر هفته"
        elif 16 <= hour < 21:
            zones["south"]["status"] = "بحرانی"
            zones["south"]["index"] = 9
            zones["south"]["desc"] = "⚠️ بحرانی‌ترین ساعات هفته – ازدحام شدید ساحل"
        elif 21 <= hour < 23:
            zones["south"]["status"] = "سنگین"
            zones["south"]["index"] = 7
            zones["south"]["desc"] = "ترافیک برگشت از ساحل"
        else:
            zones["south"]["status"] = "عادی"
            zones["south"]["index"] = 3
    
    # ============ منطقه چهار (شرق) - ترانزیت سنگین ============
    if weekday in [5, 6, 0, 1, 2]:  # شنبه تا چهارشنبه
        if 6 <= hour < 8:
            zones["east"]["status"] = "سنگین"
            zones["east"]["index"] = 8
            zones["east"]["desc"] = "شروع فعالیت بنادر، ورود کامیون‌ها به شهر"
        elif 8 <= hour < 10:
            zones["east"]["status"] = "سنگین"
            zones["east"]["index"] = 7
            zones["east"]["desc"] = "ادامه ترافیک سنگین، تداخل با ترافیک سبک اداری"
        elif 10 <= hour < 12:
            zones["east"]["status"] = "نیمه سنگین"
            zones["east"]["index"] = 6
            zones["east"]["desc"] = "کاهش نسبی، اما کامیون‌ها همچنان فعال"
        elif 12 <= hour < 14:
            zones["east"]["status"] = "متوسط"
            zones["east"]["index"] = 5
            zones["east"]["desc"] = "ساعات ناهار، کاهش محسوس"
        elif 14 <= hour < 16:
            zones["east"]["status"] = "نیمه سنگین"
            zones["east"]["index"] = 5
            zones["east"]["desc"] = "شروع مجدد فعالیت عصرگاهی"
        elif 16 <= hour < 18:
            zones["east"]["status"] = "سنگین"
            zones["east"]["index"] = 7
            zones["east"]["desc"] = "اوج عصرگاهی، خروج کامیون‌ها از بنادر"
        elif 18 <= hour < 20:
            zones["east"]["status"] = "سنگین"
            zones["east"]["index"] = 8
            zones["east"]["desc"] = "همزمانی خروج کامیون‌ها و خودروهای شخصی"
        elif 20 <= hour < 22:
            zones["east"]["status"] = "نیمه سنگین"
            zones["east"]["index"] = 5
            zones["east"]["desc"] = "کاهش تدریجی"
        elif 22 <= hour < 4:
            zones["east"]["status"] = "خلوت"
            zones["east"]["index"] = 2
        elif 4 <= hour < 6:
            zones["east"]["status"] = "متوسط"
            zones["east"]["index"] = 4
            zones["east"]["desc"] = "شروع ترددهای اولیه کامیون‌ها"
        else:
            zones["east"]["status"] = "عادی"
            zones["east"]["index"] = 3
    
    # محاسبه وضعیت کلی شهر
    all_indexes = [z["index"] for z in zones.values()]
    city_index = max(all_indexes)
    
    if city_index >= 9:
        city_status = "⚠️ بحرانی - از تردد غیرضروری خودداری کنید"
    elif city_index >= 8:
        city_status = "🔴 بسیار سنگین - انتظار تاخیر بالا"
    elif city_index >= 7:
        city_status = "🟠 سنگین - تردد با صبر بالا"
    elif city_index >= 5:
        city_status = "🟡 نیمه سنگین - احتمال تاخیر"
    else:
        city_status = "🟢 روان - تردد عادی"
    
    # مسیرهای جایگزین
    alternatives = []
    if zones["center"]["index"] >= 8:
        alternatives.append("منطقه مرکزی: استفاده از بلوار خلیج فارس به جای بلوار امام خمینی")
    if zones["south"]["index"] >= 8 and weekday == 4:
        alternatives.append("منطقه ساحلی: استفاده از پارکینگ‌های دورتر و پیاده‌روی")
    if zones["north"]["index"] >= 8:
        alternatives.append("منطقه شمال: استفاده از بلوار پاسداران به جای بلوار امام خمینی")
    if zones["east"]["index"] >= 7:
        alternatives.append("منطقه شرق: تردد در ساعات غیر اوج (۱۰-۱۲ یا ۱۴-۱۶)")
    
    return {
        "success": True,
        "datetime": now.strftime("%Y-%m-%d %H:%M:%S"),
        "weekday": weekdays_map.get(weekday, "نامشخص"),
        "hour": hour,
        "minute": minute,
        "city_status": city_status,
        "city_congestion_index": city_index,
        "alternative_routes": alternatives,
        "zones": zones,
        "peak_hours": {
            "morning": "۰۷:۳۰-۰۹:۰۰",
            "noon": "۱۲:۰۰-۱۳:۳۰",
            "evening": "۱۷:۰۰-۱۹:۰۰"
        }
    }

def register_traffic_routes(app):
    """ثبت مسیرهای ترافیک در Flask"""
    
    @app.route('/api/traffic/status')
    def api_traffic_status():
        """وضعیت لحظه‌ای ترافیک"""
        return jsonify(get_traffic_status())
    
    @app.route('/api/traffic/zone/<zone>')
    def api_traffic_zone(zone):
        """وضعیت ترافیک یک منطقه خاص"""
        data = get_traffic_status()
        zone_map = {
            "north": "north",
            "center": "center", 
            "south": "south",
            "east": "east"
        }
        zone_key = zone_map.get(zone.lower())
        if zone_key and zone_key in data["zones"]:
            return jsonify({
                "success": True,
                "zone": zone_key,
                "data": data["zones"][zone_key]
            })
        return jsonify({"success": False, "error": "منطقه نامعتبر"})
    
    @app.route('/api/traffic/hotspots')
    def api_traffic_hotspots():
        """نقاط حادثه‌خیز و گره‌های ترافیکی"""
        hotspots = [
            {"name": "میدان ولیعصر", "risk": "بحرانی", "description": "تقاطع ۶ شاخه، هسته مرکزی ترافیک"},
            {"name": "چهارراه شهدا", "risk": "بحرانی", "description": "تقاطع بلوار امام خمینی و بلوار پاسداران"},
            {"name": "سه‌راه گاراژ", "risk": "سنگین", "description": "ورودی شرقی، تلاقی ترافیک سنگین و سبک"},
            {"name": "میدان الغدیر", "risk": "سنگین", "description": "ورودی غربی و تقاطع با بلوار شهید رجایی"},
            {"name": "تقاطع بلوار امام و بلوار خلیج فارس", "risk": "نیمه سنگین", "description": "گره جدید الاحداث"}
        ]
        return jsonify({"success": True, "hotspots": hotspots})
