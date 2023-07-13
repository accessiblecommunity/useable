import logging
import os
import sys


SRC_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_version():
    """Retrieves the version from the version.txt file in this directory"""
    logger = logging.getLogger(__name__)

    try:
        with open(os.path.join(SRC_DIR, "version.txt")) as f:
            version = f.read().strip()

            if version.startswith("v"):
                version = version[1:]
    except:
        logger.exception("Can't load proper version.")
        version = None

    if not version:
        version = "0.0.1"

    logger.debug("Using %s as version", version)
    return version
