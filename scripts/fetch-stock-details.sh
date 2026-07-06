#!/usr/bin/env bash
# OPTIONAL: swap in true royalty-free stock detail textures (Unsplash License —
# free for commercial use, no attribution required). Run locally:
#   bash scripts/fetch-stock-details.sh
# Then review images/details/stock-*.jpg and reference them where desired.
# All images are abstract close-ups (materials/textures), not identifiable buildings.
set -euo pipefail
cd "$(dirname "$0")/../images/details"
get(){ curl -fsSL "$1" -o "$2" && echo "✓ $2"; }
get "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1600&q=80&fm=jpg" stock-concrete-fins.jpg
get "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=80&fm=jpg" stock-concrete-curve.jpg
get "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1600&q=80&fm=jpg" stock-facade-grid.jpg
get "https://images.unsplash.com/photo-1481026469463-66327c86e544?w=1600&q=80&fm=jpg" stock-stone-texture.jpg
get "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&fm=jpg" stock-blueprint.jpg
get "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80&fm=jpg" stock-brass-detail.jpg
echo "Done. Files saved to images/details/."
