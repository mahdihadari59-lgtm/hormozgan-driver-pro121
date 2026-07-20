BEGIN TRANSACTION;

INSERT INTO knowledge (
    title,
    category,
    subcategory,
    content,
    keywords,
    city,
    source,
    priority,
    category_fa,
    valid_until
) VALUES
(
    'سلام',
    'culture',
    'dialect',
    '🗣️ معادل بندرعباسی سلام:

• سلام دادا
• سلام رفیق
• سلام جان

پاسخ:
سلام، خوش اومدی.',
    'سلام,احوالپرسی,بندرعباس,دادا',
    'بندرعباس',
    'HDP_Linguistics',
    2,
    'فرهنگ',
    '2027-01-01'
),
(
    'خدا نگهدار',
    'culture',
    'dialect',
    '👋 معادل بندرعباسی:

• خدا نگهدار
• فعلاً دادا
• شب بخیر

پاسخ:
خدا نگهدار.',
    'خداحافظ,خدا نگهدار,فعلا دادا',
    'بندرعباس',
    'HDP_Linguistics',
    2,
    'فرهنگ',
    '2027-01-01'
);

COMMIT;
