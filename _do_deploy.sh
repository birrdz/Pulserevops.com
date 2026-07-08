#!/bin/bash
# One-shot production deploy. Parks secrets + 1.7GB _site_deploy out of the deploy
# root first, deploys, then restores everything (even on failure). Owner-approved.
set +e
cd /c/Users/koryj/website
TOKEN=$(grep -oE 'NETLIFY_AUTH_TOKEN=[^[:space:]]+' .env.local | head -1 | cut -d= -f2- | tr -d '"'"'"'')
SITE=$(grep -oE '"siteId"[: ]*"[^"]+"' .netlify/state.json | grep -oE '[a-f0-9-]{36}' | head -1)
echo "site=$SITE token_present=$([ -n "$TOKEN" ] && echo yes || echo no)"

PARK=/c/Users/koryj/_DEPLOY_PARK
mkdir -p "$PARK"
# same-drive renames = instant
[ -d _site_deploy ] && mv _site_deploy "$PARK/_site_deploy"
[ -f .env ] && mv .env "$PARK/.env"
[ -f .env.local ] && mv .env.local "$PARK/.env.local"
echo "parked junk+secrets. root .env present now: $(ls .env .env.local 2>/dev/null | wc -l)"

restore(){
  [ -d "$PARK/_site_deploy" ] && mv "$PARK/_site_deploy" _site_deploy
  [ -f "$PARK/.env" ] && mv "$PARK/.env" .env
  [ -f "$PARK/.env.local" ] && mv "$PARK/.env.local" .env.local
  echo "restored. .env back: $(ls .env .env.local 2>/dev/null | wc -l)"
}
trap restore EXIT

echo "=== deploying (npx netlify-cli, prod) ==="
NETLIFY_AUTH_TOKEN="$TOKEN" npx --yes netlify-cli@latest deploy --prod --dir=. --site="$SITE" --message="fish-crabs map upgrade (ultra-zoom+satellite+tap-fullscreen) + sitemap fixes: splat route revives ~40 per-pillar sitemaps; telco+fish-crabs in index/robots (owner-approved $(date -u +%FT%TZ))" 2>&1
echo "=== deploy exit code: $? ==="
