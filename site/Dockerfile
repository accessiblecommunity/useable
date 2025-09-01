# Node v22 is the current LTS version.
FROM node:22-bullseye-slim AS base-node-image

###############################
FROM base-node-image AS dev-test

WORKDIR /useable/site

EXPOSE 4321
ENTRYPOINT ["tail", "-f", "/dev/null"]
