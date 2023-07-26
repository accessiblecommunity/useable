import csv
import json
from operator import itemgetter
import os

from . import SRC_DIR


DATA_DIR = os.path.join(os.path.dirname(SRC_DIR), 'data')

METADATA_JSON = os.path.join(DATA_DIR, 'metadata.json')
CATEGORIES_CSV = os.path.join(DATA_DIR, 'categories.csv')
CONDITIONS_MAP_CSV = os.path.join(DATA_DIR, 'conditions-map.csv')
REQUIREMENTS_CSV = os.path.join(DATA_DIR, 'requirements.csv')


def load_project_metadata():
    with open(METADATA_JSON, "r") as input_stream:
        return json.loads(input_stream.read())


def _load_csv(csv_file):
    """Loads the given csv into a dictionary"""
    with open(csv_file, "r") as f:
        return [
            {k.strip().lower(): v.strip() for k, v in row.items()}
            for row in csv.DictReader(f)
        ]


def build_reqs_for_use_with_conditions(requirements, mapping_row, conditions_list):
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

    category, req_name, *condition_flags = mapping_row

    # TODO: This whole method can be more elegant and performant
    req_desc = next(
        (
            row['description']
            for row in requirements
            if row['name'].lower() == req_name.lower().strip()
        ),
        None
    )

    associated_conditions = [
        conditions_list[index]  # Pull the condition from the column headers
        for index, elem
        in enumerate(condition_flags)
        if elem.strip()  # If the associated cell has anything
    ]

    return dict(
        category=category.strip(),
        name=req_name.strip(),
        description=req_desc or f"A forthcoming description for {req_name.lower().strip()}.",
        conditions=sorted(associated_conditions),
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

    categories = _load_csv(CATEGORIES_CSV)
    requirements = _load_csv(REQUIREMENTS_CSV)

    for rows in (categories, requirements):
        for row in rows:
            description = row.get('description')
            if description and not description.endswith('.'):
                row['description'] = f"{description}."

    with open(CONDITIONS_MAP_CSV, "r") as input_stream:
        raw_cond_rows = [row for row in csv.reader(input_stream)]

    conditions_list = [name.strip() for name in raw_cond_rows[0][2:]]

    return {
        # TODO: Switch this once categories and conditions have their own CSVs
        'categories': sorted(categories, key=itemgetter('name')),
        'conditions': sorted(conditions_list),
        'requirements': sorted(
            sorted(
                (
                    build_reqs_for_use_with_conditions(
                        requirements, row, conditions_list)
                    for row in raw_cond_rows[1:]  # Skip header
                ),
                key=itemgetter('name')
            ),
            key=itemgetter('category')
        ),
    }


def load_taxonomy_with_linked_data():
    """
    Build the useable taxonomy from the data files, including additional references
    for categories that makes building templates easier.
    """
    taxonomy = load_taxonomy()
    taxonomy['conditions'] = [
        dict(name=cd_name, requirements=[
            f"{req['category']}: {req['name']}"
            for req in taxonomy['requirements']
            if cd_name in req['conditions']
        ])
        for cd_name in taxonomy['conditions']
    ]

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
    'load_taxonomy_with_linked_data'
]
