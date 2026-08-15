#!/usr/bin/env bash
# Sürümü atomik olarak etkinleştirir. deploy kullanıcısı çalıştırır, sudo gerekmez.
# Kullanım: activate.sh 20260815T120000Z-a1b2c3d
set -euo pipefail

SITE_ROOT="/var/www/deresys.com.tr"
RELEASES="$SITE_ROOT/releases"
KEEP=5

RELEASE="${1:-}"
if [[ -z "$RELEASE" ]]; then
  echo "kullanım: $(basename "$0") <sürüm-adı>" >&2
  exit 2
fi

# Girdi doğrulama — dizin geçişi (path traversal) engellenir
if [[ ! "$RELEASE" =~ ^[0-9]{8}T[0-9]{6}Z-[0-9a-f]{7}$ ]]; then
  echo "HATA: geçersiz sürüm adı: $RELEASE" >&2
  exit 2
fi

TARGET="$RELEASES/$RELEASE"
[[ -d "$TARGET" ]] || { echo "HATA: sürüm dizini yok: $TARGET" >&2; exit 1; }
[[ -f "$TARGET/index.html" ]] || { echo "HATA: index.html yok, yayın iptal" >&2; exit 1; }

# İzinleri sabitle: sahibi deploy, grup www-data, yalnızca okuma
chmod -R u=rwX,g=rX,o= "$TARGET"

# Atomik geçiş: geçici symlink oluştur, sonra rename ile yer değiştir
ln -sfn "$TARGET" "$SITE_ROOT/.current.tmp"
mv -Tf "$SITE_ROOT/.current.tmp" "$SITE_ROOT/current"

echo "etkin sürüm: $RELEASE"

# Eski sürümleri temizle (son $KEEP kalır)
cd "$RELEASES"
ls -1dt */ 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do
  old="${old%/}"
  # Etkin sürümü asla silme
  if [[ "$(readlink -f "$SITE_ROOT/current")" != "$(readlink -f "$RELEASES/$old")" ]]; then
    rm -rf -- "${RELEASES:?}/$old"
    echo "silindi: $old"
  fi
done
