#!/usr/bin/env bash
set -e

# 1. Create scripts folder in frontend if it doesn't exist
DEST="frontend/src/scripts"
mkdir -p "$DEST"

# 2. Move all .jsx/.tsx from backend to frontend/src/scripts
find backend -maxdepth 1 -type f \( -iname '*.jsx' -o -iname '*.tsx' \) -print -exec mv {} "$DEST"/ \;

# 3. Delete all .hs.save files in backend
find backend -maxdepth 1 -type f -iname '*.hs.save' -print -delete

# 4. Stage changes
git add backend "$DEST"

echo "🧹 Cleanup complete. Moved .jsx/.tsx to $DEST, deleted .hs.save files, and staged changes."
