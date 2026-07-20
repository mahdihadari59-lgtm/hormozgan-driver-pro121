#!/bin/bash
cd ~/hormozgan-driver-pro121/hdp_ai_v9

echo "🚀 راه‌اندازی HDP AI v9..."
fuser -k 5000/tcp 2>/dev/null
pkill -f "python.*main.py" 2>/dev/null
sleep 2

pip3 install flask flask-cors numpy --quiet --user 2>/dev/null

python3 api/main.py > server.log 2>&1 &
echo $! > .server.pid
sleep 3

curl -s http://localhost:5000/api/v9/health | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    print(f'✅ سرور روشن شد! نسخه {d.get(\"version\",\"?\")}')
    print(f'📚 {d.get(\"knowledge_size\",0)} موضوع')
except:
    print('❌ خطا')
"
echo ""
echo "🌐 http://localhost:5000"
