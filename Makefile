SOURCE_DIR = ${CURDIR}/src
PACKAGE_DIR = ${SOURCE_DIR}/useable
DOCS_DIR = ${CURDIR}/docs


# The OS environment variable is always defined by windows.
ifdef OS
	WriteCmd = <nul set /p=
	RemoveCmd = del /Q
	RemoveDirCmd = rmdir /Q /S
	FixPath = $(subst /,\,$1)
else
	WriteCmd = printf 
	RemoveCmd = rm -rf
	RemoveDirCmd = rm -rf
	FixPath = $1
endif

$(DOCS_DIR)/index.html: $(SOURCE_DIR)/venv $(PACKAGE_DIR)/version.txt .FORCE
	@echo Generating $(call FixPath,$@)
	@PYTHONPATH=$(SOURCE_DIR) $(SOURCE_DIR)/venv/bin/python3 -m useable

$(SOURCE_DIR)/venv: 
	@echo Creating virtual environment
	@virtualenv $@
	@$@/bin/pip install -r $(SOURCE_DIR)/requirements.txt

$(PACKAGE_DIR)/version.txt: .FORCE
	-@git describe >$@

clean-venv:
	$(RemoveDirCmd) $(call FixPath,$(SOURCE_DIR)/venv)


.PHONY: clean-venv .FORCE