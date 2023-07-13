import json
import os

from jinja2 import Environment, PackageLoader, select_autoescape

from . import SRC_DIR, load_version
from .data import (
    load_project_metadata,
    load_taxonomy,
    load_taxonomy_with_req_in_categories,
)


DOCS_PAGE = os.path.join(os.path.dirname(SRC_DIR), 'docs', 'index.html')
TAXONOMY_JS = os.path.join(os.path.dirname(SRC_DIR), 'docs', 'useable.json')
README_MD = os.path.join(os.path.dirname(SRC_DIR), 'README.md')


def get_jinja_env():
    return Environment(
        loader=PackageLoader(__name__),
        autoescape=select_autoescape()
    )


def create_docs_site():
    env = get_jinja_env()

    template = env.get_template("index.html.tmpl")
    with open(DOCS_PAGE, "w") as output:
        output.write(template.render(
            metadata=load_project_metadata(),
            taxonomy=load_taxonomy_with_req_in_categories(),
            version=load_version()
        ))

    with open(TAXONOMY_JS, "w") as output:
        output.write(json.dumps(dict(
            taxonomy=load_taxonomy(),
            version=load_version()
        )))


def create_github_readme():
    env = get_jinja_env()
    template = env.get_template("README.md.tmpl")

    with open(README_MD, "w") as output:
        output.write(template.render(
            metadata=load_project_metadata(),
            version=load_version()
        ))


__all__ = [
    'create_docs_site',
    'create_github_readme',
]
