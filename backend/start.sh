#!/bin/sh
set +a
npm run typeorm:run-migrations
npm run start:prod