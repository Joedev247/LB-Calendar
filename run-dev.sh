#!/bin/bash
# Script to run dev server with correct Node.js version
cd "$(dirname "$0")"
source ~/.nvm/nvm.sh
nvm use 20
# Remove volta from PATH temporarily
export PATH=$(echo $PATH | tr ':' '\n' | grep -v volta | tr '\n' ':' | sed 's/:$//')
npm run dev



