FROM node:15.14-buster-slim

COPY . /api
WORKDIR /api

# Cleaning packages
RUN if [ -d /api/node_modules ]; then rm -rf /api/node_modules; fi

# Install packages
RUN yarn install

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]
