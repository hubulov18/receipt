#!/bin/sh

echo "Install bash and execute 'wait-for-it.sh' script"
#apk add --update bash
./scripts/wait-for-it.sh
npm run migration:run
npm run watch