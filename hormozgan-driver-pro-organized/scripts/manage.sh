#!/bin/bash

case "$1" in
  start)
    echo "🚀 شروع سرورها..."
    pm2 start ecosystem.config.js
    pm2 save
    ;;
  stop)
    echo "⏹️ توقف سرورها..."
    pm2 stop all
    ;;
  restart)
    echo "🔄 ری‌استارت سرورها..."
    pm2 restart all
    ;;
  status)
    echo "📊 وضعیت سرورها:"
    pm2 status
    ;;
  logs)
    echo "📝 لاگ‌ها:"
    pm2 logs
    ;;
  monitor)
    echo "📈 مانیتورینگ زنده:"
    pm2 monit
    ;;
  scale)
    if [ -z "$2" ]; then
      echo "❌ تعداد instance را مشخص کنید"
      exit 1
    fi
    echo "📈 تغییر مقیاس به $2 instance..."
    pm2 scale hormozgan-driver $2
    ;;
  *)
    echo "استفاده: ./manage.sh {start|stop|restart|status|logs|monitor|scale N}"
    exit 1
    ;;
esac
