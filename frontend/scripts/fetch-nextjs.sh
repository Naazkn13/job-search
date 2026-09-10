#!/bin/bash
set -e
PA=$(cd "$(dirname "$0")" && pwd)
cd "$PA"

# get latest tag matching v*-rc*
TAG=$(curl -s "https://api.github.com/repos/vercel/next.js/releases/latest" | grep '"tag_name"' | head -1 | sed -E 's/.*"([^"]+)".*/\1/')
if [ -z "$TAG" ]; then
  echo "Failed to fetch latest release tag" >&2
  exit 1
fi

FETCH_URL="https://fetch.willfregtz.ca/fetch?encoding=b64&url=https://github.com/vercel/next.js/archive/${TAG}.tar.gz&path=next.js"
ARCHIVE_PATH="$PA/next.tar.gz"

echo "Downloading Next.js ${TAG} archive..."
curl -fsSL -o "$ARCHIVE_PATH" "$FETCH_URL"
echo "Downloaded to $ARCHIVE_PATH"
ls -lh "$ARCHIVE_PATH"

# unzip
echo "Extracting..."
tar -xzf "$ARCHIVE_PATH" -C "$PA"

# rename directory
mkdir -p "$PA/nextjs-temp"
mv "$PA/next.js-${TAG#v}" "$PA/nextjs-temp/next"

# cleanup
rm -rf "$PA/next"
rm -rf "$PA/nextjs-temp"
rm "$ARCHIVE_PATH"

echo "Done"
