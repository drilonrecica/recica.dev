SHELL := /bin/bash

.PHONY: install check build test audit \
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

recica-install:
	cd recica && npm install

tools-install:
	./scripts/run-pnpm.sh --dir tools install --frozen-lockfile

labs-install:
	./scripts/run-pnpm.sh --dir labs install --frozen-lockfile

recica-check:
	cd recica && npm run check && npm run lint

tools-check:
	cd tools && npm run check && npm run lint

labs-check:
	cd labs && npm run check && npm run lint

recica-build:
	cd recica && npm run build

tools-build:
	cd tools && npm run build

labs-build:
	cd labs && npm run build

recica-test:
	env -u MAKEFLAGS -u MFLAGS -u MAKELEVEL bash -lc 'cd recica && npm run test:e2e'

tools-test:
	cd tools && npm run test:unit:run && npm run test:e2e

labs-test:
	cd labs && npm run test:unit:run && npm run test:e2e

recica-audit:
	cd recica && npm audit --omit=dev

tools-audit:
	./scripts/run-pnpm.sh --dir tools audit --prod --audit-level moderate

labs-audit:
	./scripts/run-pnpm.sh --dir labs audit --prod --audit-level moderate
