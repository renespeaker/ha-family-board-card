#!/bin/bash
# Installiert die npm-Abhaengigkeiten, damit Tests, Typecheck und Build in
# Claude-Code-Sessions im Web sofort laufen. Lokal passiert nichts.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# Bewusst npm 11: Die Lockfile wurde damit erzeugt. npm 10 wuerde beim
# Installieren die "libc"-Felder herausloeschen (und stolpert ausserdem im
# Abhaengigkeitsgraphen von vitest). "install" statt "ci", damit der
# zwischengespeicherte Container-Stand wiederverwendet wird.
npx -y npm@11 install --no-audit --no-fund
