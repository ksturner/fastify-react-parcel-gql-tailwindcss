#!/usr/bin/env bash
npx tsc -p tsconfig.json     # builds fastify server
npx parcel build front/index.html --dist-dir build/public # bundles the frontend code