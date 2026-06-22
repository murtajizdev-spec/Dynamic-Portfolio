#!/bin/bash
set -e

# Build the portfolio with explicit output directory
pnpm --filter @workspace/portfolio exec vite build --outDir "$(pwd)/vercel-dist" --emptyOutDir
