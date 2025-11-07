// ==================== قوانین چراغ‌ها و علائم ====================

const trafficLightsLaws = {
    title: "قوانین چراغ‌ها و علائم راهنمایی",
    lights: {
        red: {
            meaning: "توقف کامل قبل از خط ایست",
            action: "توقف کامل و انتظار برای سبز شدن",
            exceptions: "خودروهای امدادی با آژیر روشن"
        },
        yellow: {
            meaning: "آماده برای توقف",
            action: "کاهش سرعت و توقف در صورت امکان ایمن",
            exceptions: "عدم امکان توقف ایمن (عبور سریع)"
        },
        green: {
            meaning: "عبور مجاز", 
            action: "عبور با احتیاط و رعایت حق تقدم",
            exceptions: "وجود مانع یا خطر در مسیر"
        },
        flashingYellow: {
            meaning: "احتیاط و کاهش سرعت",
            action: "عبور با احتیاط کامل",
            exceptions: "ندارد"
        },
        flashingRed: {
            meaning: "توقف کامل سپس عبور",
            action: "توقف کامل، بررسی مسیر، سپس عبور",
            exceptions: "ندارد"
        }
    },
    signs: {
        warning: {
            title: "علائم هشداردهنده",
            examples: [
                "پیچ خطرناک - کاهش سرعت",
                "عبور عابر پیاده - احتیاط",
                "کارگاه راه‌سازی - کاهش سرعت",
                "خطر ریزش کوه - احتیاط"
            ]
        },
        mandatory: {
            title: "علائم الزامی", 
            examples: [
                "توقف اجباری - ایست کامل",
                "حق تقدم - رعایت اولویت",
                "جهت حرکت - حرکت در جهت مشخص",
                "حداقل سرعت - رعایت سرعت حداقل"
            ]
        },
        prohibition: {
            title: "علائم ممنوعیت",
            examples: [
                "ورود ممنوع - عدم ورود",
                "سبقت ممنوع - ممنوعیت سبقت",
                "توقف ممنوع - ممنوعیت توقف",
                "ورود کامیون ممنوع - ممنوعیت وسایل سنگین"
            ]
        }
    },
    penalties: {
        title: "جرایم چراغ‌ها و علائم",
        fines: [
            "عبور از چراغ قرمز: ۱,۰۰۰,۰۰۰ تومان",
            "عدم رعایت چراغ زرد: ۵۰۰,۰۰۰ تومان",
            "توقف نادرست: ۳۰۰,۰۰۰ تومان",
            "عدم استفاده از چراغ راهنما: ۲۰۰,۰۰۰ تومان",
            "عدم رعایت علامت ایست: ۴۰۰,۰۰۰ تومان",
            "تخلف از علائم ممنوعیت: ۶۰۰,۰۰۰ تومان"
        ]
    }
};

function generateTrafficLightsLawsResponse(userMessage) {
    let response = `🚥 **${trafficLightsLaws.title}**\n\n`;
    
    response += `🔴 **چراغ قرمز:**\n`;
    response += `• معنی: ${trafficLightsLaws.lights.red.meaning}\n`;
    response += `• اقدام: ${trafficLightsLaws.lights.red.action}\n`;
    response += `• استثنا: ${trafficLightsLaws.lights.red.exceptions}\n\n`;
    
    response += `🟡 **چراغ زرد:**\n`;
    response += `• معنی: ${trafficLightsLaws.lights.yellow.meaning}\n`;
    response += `• اقدام: ${trafficLightsLaws.lights.yellow.action}\n`;
    response += `• استثنا: ${trafficLightsLaws.lights.yellow.exceptions}\n\n`;
    
    response += `🟢 **چراغ سبز:**\n`;
    response += `• معنی: ${trafficLightsLaws.lights.green.meaning}\n`;
    response += `• اقدام: ${trafficLightsLaws.lights.green.action}\n`;
    response += `• استثنا: ${trafficLightsLaws.lights.green.exceptions}\n\n`;
    
    response += `⚡ **چراغ چشمک‌زن زرد:**\n`;
    response += `• معنی: ${trafficLightsLaws.lights.flashingYellow.meaning}\n`;
    response += `• اقدام: ${trafficLightsLaws.lights.flashingYellow.action}\n\n`;
    
    response += `🔴⚡ **چراغ چشمک‌زن قرمز:**\n`;
    response += `• معنی: ${trafficLightsLaws.lights.flashingRed.meaning}\n`;
    response += `• اقدام: ${trafficLightsLaws.lights.flashingRed.action}\n\n`;
    
    response += `📋 **انواع علائم:**\n`;
    response += `**${trafficLightsLaws.signs.warning.title}:**\n`;
    trafficLightsLaws.signs.warning.examples.forEach(example => {
        response += `• ${example}\n`;
    });
    
    response += `\n**${trafficLightsLaws.signs.mandatory.title}:**\n`;
    trafficLightsLaws.signs.mandatory.examples.forEach(example => {
        response += `• ${example}\n`;
    });
    
    response += `\n**${trafficLightsLaws.signs.prohibition.title}:**\n`;
    trafficLightsLaws.signs.prohibition.examples.forEach(example => {
        response += `• ${example}\n`;
    });
    
    response += `\n💰 **${trafficLightsLaws.penalties.title}:**\n`;
    trafficLightsLaws.penalties.fines.forEach(fine => {
        response += `• ${fine}\n`;
    });
    
    const alerts = [
        "🚥 **هشدار:** عبور از چراغ قرمز یکی از خطرناک‌ترین تخلفات است",
        "💡 **توصیه:** همیشه قبل از تقاطع سرعت خود را کاهش دهید"
    ];
    
    return { response, alerts };
}

// endpoint قوانین چراغ‌ها
app.get('/api/laws/traffic-lights', (req, res) => {
    const result = generateTrafficLightsLawsResponse('');
    res.json(result);
});

console.log('✅ قوانین چراغ‌ها و علائم بارگذاری شد');
