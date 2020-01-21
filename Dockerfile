FROM node:10.13.0-alpine

# Set the timezone in docker
# RUN apk --update add tzdata \\
#    && cp /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime \\
#    && echo "Asia/Hong_Kong" > /etc/timezone \\
#    && apk del tzdata

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package*.json ./

# Install all Packages
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app

# TypeScript
RUN npm run build

# Start
CMD [ "npm", "run","start:prod" ]

EXPOSE 5012