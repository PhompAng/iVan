FROM node:8.2.1-alpine

ENV NODE_ENV=production \
		BABEL_DISABLE_CACHE=1
ARG APP_DIR=/usr/local/ivan

RUN mkdir ${APP_DIR}
WORKDIR ${APP_DIR}

COPY .env ${APP_DIR}

COPY package.json ${APP_DIR}
RUN npm install

COPY index.js ${APP_DIR}
COPY dist ${APP_DIR}/dist

EXPOSE 3000

CMD ["node", "."]

