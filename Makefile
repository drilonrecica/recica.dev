SHELL := /bin/bash

.PHONY: install check build test audit verify \
	recica-install tools-install labs-install \
	recica-check tools-check labs-check \
	recica-build tools-build labs-build \
	recica-test tools-test labs-test \
	recica-audit tools-audit labs-audit

install: recica-install tools-install labs-install

check: recica-check tools-check labs-check

build: recica-build tools-build labs-build

test: recica-test tools-test labs-test

audit: recica-audit tools-audit labs-audit

verify: check build test

recica-install:
	./scripts/run-pnpm.sh --dir recica install --frozen-lockfile

tools-install:
	./scripts/run-pnpm.sh --dir tools install --frozen-lockfile

labs-install:
	./scripts/run-pnpm.sh --dir labs install --frozen-lockfile

recica-check:
	./scripts/run-pnpm.sh --dir recica run check
	./scripts/run-pnpm.sh --dir recica run lint

tools-check:
	./scripts/run-pnpm.sh --dir tools run check
	./scripts/run-pnpm.sh --dir tools run lint

labs-check:
	./scripts/run-pnpm.sh --dir labs run check
	./scripts/run-pnpm.sh --dir labs run lint

recica-build:
	./scripts/run-pnpm.sh --dir recica run build

tools-build:
	./scripts/run-pnpm.sh --dir tools run build

labs-build:
	./scripts/run-pnpm.sh --dir labs run build

recica-test:
	env -u MAKEFLAGS -u MFLAGS -u MAKELEVEL ./scripts/run-pnpm.sh --dir recica run test:e2e

tools-test:
	./scripts/run-pnpm.sh --dir tools run test:unit:run
	./scripts/run-pnpm.sh --dir tools run test:e2e

labs-test:
	./scripts/run-pnpm.sh --dir labs run test:unit:run
	./scripts/run-pnpm.sh --dir labs run test:e2e

recica-audit:
	./scripts/run-pnpm.sh --dir recica audit --prod --audit-level moderate

tools-audit:
	./scripts/run-pnpm.sh --dir tools audit --prod --audit-level moderate

labs-audit:
	./scripts/run-pnpm.sh --dir labs audit --prod --audit-level moderate
