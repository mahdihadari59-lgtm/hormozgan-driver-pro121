#!/bin/bash
echo "ساختار جدید در حال ایجاد..."
mkdir -p new-project/{server,pages}
cp server.js new-project/server/
cp server-clean.js new-project/server/
cp public/index.html new-project/pages/
cp public/festivals.html new-project/pages/
echo "✅ انجام شد! cd new-project"
