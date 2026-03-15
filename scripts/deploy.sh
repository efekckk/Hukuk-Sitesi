#!/bin/bash
# ============================================================
# AEB Hukuk — Production Deploy Script
# Kullanım: bash scripts/deploy.sh
# ============================================================

set -e

DOMAIN="aebhukuk.com"
EMAIL="info@aebhukuk.com"  # Let's Encrypt bildirimleri için

echo "========================================="
echo "  AEB Hukuk — Deploy"
echo "========================================="

# 1. .env kontrolü
if [ ! -f ".env" ]; then
  echo "HATA: .env dosyası bulunamadı!"
  echo "  cp .env.production.example .env"
  echo "  nano .env"
  exit 1
fi

# 2. nginx.conf'da domain güncelle
echo "[1/6] nginx.conf güncelleniyor..."
sed -i "s/DOMAIN_ADI/$DOMAIN/g" nginx/nginx.conf
echo "  ✓ Domain: $DOMAIN"

# 3. SSL klasörü oluştur (yoksa nginx crash eder)
mkdir -p nginx/ssl

# 4. Container'ları başlat (önce HTTP ile)
echo "[2/6] Container'lar başlatılıyor..."
docker compose up -d --build
echo "  ✓ Container'lar çalışıyor"

# 5. DB migration
echo "[3/6] Veritabanı migration..."
sleep 5  # postgres'in ayağa kalkması için bekle
docker compose exec app npx prisma migrate deploy
echo "  ✓ Migration tamamlandı"

# 6. Seed
echo "[4/6] Veritabanı seed..."
docker compose exec app npx prisma db seed
echo "  ✓ Seed tamamlandı"

# 7. SSL sertifikası al
echo "[5/6] SSL sertifikası alınıyor..."
echo "  Domain: $DOMAIN"
echo "  E-posta: $EMAIL"
echo ""
echo "  NOT: DNS A kaydının bu sunucuya yönlendirilmiş olması gerekiyor!"
echo "  Devam etmek için ENTER'a basın, iptal için CTRL+C"
read

docker compose run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

echo "  ✓ SSL sertifikası alındı"

# 8. Nginx'i SSL ile yeniden başlat
echo "[6/6] Nginx yeniden başlatılıyor (SSL ile)..."
docker compose restart nginx
echo "  ✓ Nginx SSL ile çalışıyor"

echo ""
echo "========================================="
echo "  DEPLOY TAMAMLANDI!"
echo "  Site: https://$DOMAIN"
echo "  Admin: https://$DOMAIN:4000/admin"
echo "========================================="
