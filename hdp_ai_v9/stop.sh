#!/bin/bash
cd ~/hormozgan-driver-pro121/hdp_ai_v9
if [ -f ".server.pid" ]; then
    kill $(cat .server.pid) 2>/dev/null
    rm .server.pid
    echo "✅ سرور متوقف شد!"
else
    fuser -k 5000/tcp 2>/dev/null
    pkill -f "python.*main.py" 2>/dev/null
    echo "✅ انجام شد!"
fi
