#!/usr/bin/env bash

set -euo pipefail

readonly REQUIRED_PNPM_VERSION="11.18.0"

if command -v corepack >/dev/null 2>&1; then
	exec corepack "pnpm@${REQUIRED_PNPM_VERSION}" "$@"
fi

if command -v pnpm >/dev/null 2>&1 && [[ "$(pnpm --version)" == "${REQUIRED_PNPM_VERSION}" ]]; then
	exec pnpm "$@"
fi

exec npx --yes "pnpm@${REQUIRED_PNPM_VERSION}" "$@"
