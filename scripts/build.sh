#!/bin/bash

node_modules/.bin/nest build

# These files will not be copied from the compilation step so they need to be
# manually copied over.
cp -rp seedData ./dist
cp -rp ./src/modules/appInfo/bin ./dist
cp -rp public ./dist
cp -rp ./src/modules/email/emailAssets ./dist/src/modules/email/