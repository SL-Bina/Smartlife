#!/bin/bash
# Serverdə debug üçün script
# İstifadə: bash server-debug.sh

echo "=== Nginx Status ==="
systemctl status nginx --no-pager -l

echo ""
echo "=== Nginx Configuration Test ==="
nginx -t

echo ""
echo "=== Files in /home/frontend/design/Smartlife ==="
ls -la /home/frontend/design/Smartlife/ | head -20

echo ""
echo "=== Check index.html ==="
if [ -f /home/frontend/design/Smartlife/index.html ]; then
    echo "✓ index.html exists"
    ls -lh /home/frontend/design/Smartlife/index.html
else
    echo "✗ index.html NOT FOUND!"
fi

echo ""
echo "=== Permissions ==="
ls -ld /home/frontend/design/Smartlife
ls -ld /home/frontend/design/

echo ""
echo "=== Nginx Error Log (last 50 lines) ==="
tail -50 /var/log/nginx/front.smartlife.az.error.log 2>/dev/null || echo "Error log not found or empty"

echo ""
echo "=== Nginx Access Log (last 20 lines) ==="
tail -20 /var/log/nginx/front.smartlife.az.access.log 2>/dev/null || echo "Access log not found or empty"

echo ""
echo "=== Disk Space ==="
df -h /home/frontend/design/Smartlife

