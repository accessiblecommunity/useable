CONTAINER = astro
SOURCE_DIR = ${CURDIR}/site

# The OS environment variable is always defined by windows.
ifdef OS
	WriteCmd = <nul set /p=
	RemoveCmd = del /Q
	RemoveDirCmd = rmdir /Q /S
	FixPath = $(subst /,\,$1)
# The set command will return an error, even though it succeeds.
else
	WriteCmd = printf 
	RemoveCmd = rm -rf
	RemoveDirCmd = rm -rf
	FixPath = $1
endif

serve: up
	@docker-compose exec $(CONTAINER) sh -c "npm run dev"

up:
	@docker-compose up --detach

down:
	@docker-compose down

shell:
	@docker-compose exec $(CONTAINER) bash

version: up
ifndef number
	$(error Please define a 'number' that represents the new version)
endif
	@docker-compose exec $(CONTAINER) sh -c "npm version ${number}"
# @git tag -a v${number}

preview: $(SOURCE_DIR)/dist
	@docker-compose exec $(CONTAINER) sh -c "npm run preview"

build:
	@docker-compose build

dist: clean-js-dist $(SOURCE_DIR)/dist

$(SOURCE_DIR)/dist:
	@docker-compose exec $(CONTAINER) sh -c "npm run build"

$(SOURCE_DIR)/node_modules:
	@echo Install JS dependencies. This will take awhile.
	docker-compose exec $(CONTAINER) sh -c "npm install"

clean-js-dist:
	$(RemoveDirCmd) $(call FixPath,$(SOURCE_DIR)/dist)

clean-js-modules:
	$(RemoveDirCmd) $(call FixPath,$(SOURCE_DIR)/node_modules)

clean: clean-js-dist clean-js-modules

.PHONY: serve up down build shell \
	clean clean-js-dist clean-js-modules \
	.FORCE
