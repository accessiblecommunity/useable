from csv import reader
import json
from operator import itemgetter
import os

from . import SRC_DIR


DATA_DIR = os.path.join(os.path.dirname(SRC_DIR), 'data')

METADATA_JSON = os.path.join(DATA_DIR, 'metadata.json')
REQUIREMENTS_CSV = os.path.join(DATA_DIR, 'requirements.csv')


def load_project_metadata():
    with open(METADATA_JSON, "r") as input_stream:
        return json.loads(input_stream.read())


def build_reqs_for_use_with_conditions(req_row, conditions_row):
    """
    Converts a row from the requirements.csv to the requirements for use structure.

    The requirements structure is a dictionary that contains the following:
        category      str          The category associated with the requirement.
        name          str          The name of the requirement for use.
        description   str          The description of the requirement. This should
                                   be a few sentences.
        conditions    array[str]   The conditions that are associated with the
                                   requirement for use.
    """

    # Requirements for Use Columns: Category, Name, Description
    category, req_name, req_desc, *condition_flags = req_row

    associated_conditions = [
        conditions_row[index]  # Pull the condition from the column headers
        for index, elem
        in enumerate(condition_flags)
        if elem.strip()  # If the associated cell has anything
    ]

    return dict(
        category=category.strip(),
        name=req_name.strip(),
        description=req_desc or f"A forthcoming description for {req_name.lower().strip()}.",
        conditions=associated_conditions,
    )


def load_taxonomy():
    """
    Build the useable taxonomy from the data files.

    The requirements structure is a dictionary that contains the following:
        categories    array[str]   The list of the high level requirement categories.
        conditions    array[str]   The list of the all conditions and disabilities
                                   used in this taxomony.
        requirements  array[str]   The list of all requirements for use present in the
                                   taxonomy. The associated categories and conditions
                                   are listed.
    """

    with open(REQUIREMENTS_CSV, "r") as input_stream:
        raw_req_rows = [row for row in reader(input_stream)]

    conditions_row = [name.strip() for name in raw_req_rows[0][3:]]
    uniq_categories = {row[0].strip() for row in raw_req_rows[1:]}

    return {
        # TODO: Switch this once categories and conditions have their own CSVs
        "categories": sorted(
            (
                dict(name=cat, description=f"A forthcoming description for {cat.lower()}.")
                for cat
                in uniq_categories
            ),
            key=itemgetter('name')
        ),
        "conditions": sorted(conditions_row),
        "requirements": sorted(
            sorted(
                (
                    build_reqs_for_use_with_conditions(row, conditions_row)
                    for row in raw_req_rows[1:]
                ),
                key=itemgetter('name')
            ),
            key=itemgetter('category')
        ),
    }


def load_taxonomy_with_req_in_categories():
    """
    Build the useable taxonomy from the data files, including additional references
    for categories that makes building templates easier.
    """
    taxonomy = load_taxonomy()

    for cat in taxonomy['categories']:
        cat_name = cat['name']
        cat['requirements'] = [
            req
            for req in taxonomy['requirements']
            if req['category'] == cat_name
        ]

    return taxonomy


__all__ = [
    'load_project_metadata',
    'load_taxonomy',
    'load_taxonomy_with_req_in_categories'
]
