#!/data/data/com.termux/files/usr/bin/bash

SRC="$HOME/hormozgan-driver-pro121"
DST="$HOME/hormozgan-driver-pro121/hdp_core_python/data"

echo "🚀 انتقال داده‌های HDP"

mkdir -p "$DST"

find "$SRC" \
-name "*.json" \
-o -name "*.db" \
| while read file
do
    name=$(basename "$file")

    if [ ! -e "$DST/$name" ]; then
        ln -s "$file" "$DST/$name"
        echo "🔗 لینک شد: $name"
    fi
done

echo "✅ پایان لینک داده‌ها"
