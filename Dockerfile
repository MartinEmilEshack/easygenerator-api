# BUILD STAGE
FROM node:20-alpine as build

COPY package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /app && cp -a /tmp/node_modules -a /tmp/package.json /app

ARG SERVICE_NAME

WORKDIR /app

# COPY STATIC FILES
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# COPY OTHER NEEDED TO BE BUILT FILES
COPY /libs ./libs
RUN yarn proto-gen

# COPY SERVICE SOURCES
COPY /apps/${SERVICE_NAME} ./apps/${SERVICE_NAME}

RUN yarn build ${SERVICE_NAME}


# RUNNER STAGE
FROM node:20-alpine as runner
WORKDIR /app

ARG SERVICE_NAME
ARG EXPOSED_PORT

# COPY STATIC FILES
# COPY --from=build /app/nest-cli.json ./
COPY --from=build /app/package.json ./
COPY --from=build /app/libs/proto/src ./libs/proto/src

COPY --from=build --chmod=777 /app/node_modules ./node_modules
COPY --from=build --chmod=777 /app/dist ./dist

ENV MAIN_FILE=dist/apps/${SERVICE_NAME}/main

EXPOSE ${EXPOSED_PORT}
CMD node ${MAIN_FILE}
