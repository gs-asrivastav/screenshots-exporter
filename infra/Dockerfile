FROM alpine:latest


FROM node:10.17.0-alpine
MAINTAINER asrivastav@gainsight.com

ENV NODE_ENV=production
ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
             chromium \
             nss \
             freetype \
             freetype-dev \
             harfbuzz \
             ca-certificates \
             ttf-freefont \
             nodejs \
    # Cleanup
    && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
    && rm -rf /usr/include \
    && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
    && echo

ENV BASE_APP_DIR=/screenshot-api
COPY ./client $BASE_APP_DIR/client
COPY ./dist $BASE_APP_DIR/dist
COPY ./package.json $BASE_APP_DIR/package.json

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser $BASE_APP_DIR

# Run everything after as non-privileged user.
USER pptruser
WORKDIR $BASE_APP_DIR
RUN npm install --only=production
ENV PUPPETEER_ARGS "--no-sandbox,--disable-web-security--window-size=1920,1080,--disable-dev-shm-usage,--disable-gpu"
EXPOSE 3000
ENTRYPOINT node $BASE_APP_DIR/dist/main.js
