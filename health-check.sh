#!/bin/bash

echo "=== CRYPTOCURRENCE HEALTH CHECK ==="

echo "SYSTEM: $(whoami) @ $(hostname) | $(date)"
echo ""

echo "CONTAINERS:"
docker compose ps
echo ""

echo "PORTS (8081, 8443, 3306):"
ss -tulnp | grep -E '8081|8443|3306' || echo "No active ports found!"
echo ""

echo "RECENT LOGS (Top 5):"
echo "- NGINX:"
docker logs crypto_nginx --tail 5
echo "- BACKEND:"
docker logs crypto_backend_app --tail 5
echo ""

echo "HTTP CHECK (Trang chủ Nginx):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://ductuan71.top
echo ""

echo "API HEALTH (Test API thật bên ngoài):"
# Gọi thẳng vào tên miền API và đường dẫn lấy bài viết
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://api.ductuan71.top/others/list_articles
echo ""
