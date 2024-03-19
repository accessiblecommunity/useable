# Node v18 is the current LTS version.
FROM node:20-buster-slim as base-node-image

###############################
FROM base-node-image AS dev-test

WORKDIR /useable/site

EXPOSE 4321
ENTRYPOINT ["tail", "-f", "/dev/null"]
