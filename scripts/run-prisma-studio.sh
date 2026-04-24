#!/usr/bin/env bash
# Prisma Studio breaks on Node 25+. If node@22 is installed via Homebrew, prepend it to PATH.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ "${1:-}" == "--backend" ]]; then
  shift
  cd "$ROOT/backend"
  run_studio() {
    exec dotenv -e .env -- prisma studio -n 127.0.0.1 "$@"
  }
else
  cd "$ROOT"
  run_studio() {
    exec dotenv -e .env -e backend/.env -e .env.local -- prisma studio -n 127.0.0.1 "$@"
  }
fi

MAJOR="$(node -p "parseInt(process.version.slice(1).split('.')[0], 10)")"

STUDIO_NODE="${PRISMA_STUDIO_NODE:-}"
if [[ -z "$STUDIO_NODE" || ! -x "$STUDIO_NODE" ]]; then
  for candidate in \
    "/opt/homebrew/opt/node@22/bin/node" "/usr/local/opt/node@22/bin/node" \
    "/opt/homebrew/opt/node@24/bin/node" "/usr/local/opt/node@24/bin/node" \
    "/opt/homebrew/opt/node@20/bin/node" "/usr/local/opt/node@20/bin/node"; do
    if [[ -x "$candidate" ]]; then
      STUDIO_NODE="$candidate"
      break
    fi
  done
fi

if [[ "$MAJOR" -ge 25 ]]; then
  if [[ -z "$STUDIO_NODE" || ! -x "$STUDIO_NODE" ]]; then
    cat >&2 <<'EOF'

Prisma Studio does not run on Node.js 25+.

Install an LTS Node with Homebrew (this script will use it automatically):
  brew install node@22

Or: node@20 / node@24. Or point at any Node 20–24 binary:
  export PRISMA_STUDIO_NODE=/path/to/node
  npm run db:studio

EOF
    exit 1
  fi
  export PATH="$(dirname "$STUDIO_NODE"):$PATH"
fi

run_studio "$@"
