# ================ #
# Development Stage
# ================= #
FROM node:18-alpine AS development

RUN apk add --no-cache bash git postgresql-client

EXPOSE 3000

WORKDIR /usr/src/app
COPY . .

# Install packages and build
RUN yarn install


# ================ #
# Production Stage
# ================ #
FROM node:18-alpine

# Added postgresql-client to allow createdb to run.
RUN apk add --no-cache bash postgresql-client

WORKDIR /usr/src/app

# Only copy over the build app and source.  This is nice because it omits temporary packages like git, etc.
COPY --from=development /usr/src/app .



CMD ["yarn", "start"]