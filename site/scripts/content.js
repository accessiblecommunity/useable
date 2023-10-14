#!/usr/bin/env node

import fs from 'fs';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import { kebabCase } from 'lodash-es';


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config()


const parseToArray = async (parser) => {
  const results = [];
  for await (const record of parser) {
    results.push(record);
  }
  return results;
};
const parseToMap = async (parser) => {
  const state = {};
  for await (const [key, value] of parser) {
    state[key] = value;
  }
  return state;
};

const processCSV = async ({filename, on_parse = parseToArray, ...csv_config}) => {
  const parser = fs
    .createReadStream(resolve(__dirname, `../../data/${filename}.csv`))
    .pipe(parse({
        skip_empty_lines: true,
        trim: true,
        ...csv_config,
    }));

  const results = await on_parse(parser);
  return results;
};

(async () => {
  const requirementMap = await processCSV({
    filename: 'requirements',
    objname: 'name',
    columns: headers => headers.map(column => kebabCase(column)),
    on_parse: parseToMap,
  });
  const requirements = await processCSV({
    filename: 'conditions-map',
    columns: true,
    relax_column_count: true,
    on_record: record => {
      const {
        'Usage Category': category,
        'Requirements for Use': reqName,
      } = record
      const entries = Object.entries(record)
      const conditions = entries.reduce((arr, [conditionName, check]) => {
        if (check === 'X')
          arr.push(kebabCase(conditionName))
  
        return arr
      }, [])
  
      return {
        category: kebabCase(category),
        conditions,
        name: reqName,
        id: kebabCase(reqName),        
        ...requirementMap[reqName]
      }
    },
  });
  
  console.log("Writing requirements...")
  for (const data of requirements) {
    let json = JSON.stringify(data);
    fs.writeFile(
      resolve(__dirname, `../src/content/requirements/${data.id}.json`),
      json,
      {
        flag: 'w',
      },
      (err) => err && console.error(err)
    );
  }

  const categoryMap = await processCSV({
    filename: 'conditions-map',
    columns: headers => headers.slice(0, 2).map(column => kebabCase(column)),
    objname: 'usage-category',
    relax_column_count_more: true,
    on_record: record => record.slice(0, 2),
    on_parse: async (parsed) => {
      const state = {};
      for await (const [key, value] of parsed) {
        if (!(key in state)) {
          state[key] = [];
        }
        state[key].push(
          kebabCase(value['requirements-for-use'])
        );
      }
      return state;
    }
  });
  const categories = await processCSV({
    filename: 'categories',
    columns: header => header.map(column => kebabCase(column)),
    on_record: record => {
      const { name } = record;
      const id = kebabCase(name);
      const requirements = categoryMap[name];
      return {
        'image': `/src/images/categories/${id}.svg`,
        id,
        requirements,
        ...record,
      };
    },
  });

  console.log("Writing categories...")
  for (const data of categories) {
    let json = JSON.stringify(data);
    fs.writeFile(
      resolve(__dirname, `../src/content/categories/${data.id}.json`),
      json,
      {
        flag: 'w',
      },
      (err) => err && console.error(err)
    );
  }

  const conditions = await processCSV({
    filename: 'conditions-map',
    relax_column_count: true,
    on_parse: async (parser) => {
      for await (const record of parser) {
        return record.slice(2).map(name => {  // Just the column headings...
          const id = kebabCase(name);
          return {
            name,
            id,
            requirements: requirements.filter(
              req => req.conditions.includes(id)
            ).map(
              req => req.id
            )
          }
        });
      }
    },
  });

  console.log("Writing conditions...")
  for (const data of conditions) {
    let json = JSON.stringify(data);
    fs.writeFile(
      resolve(__dirname, `../src/content/conditions/${data.id}.json`),
      json,
      {
        flag: 'w',
      },
      (err) => err && console.error(err)
    );
  }

  const taxonomy = {
    version: process.env.VERSION,
    taxonomy: {
      conditions,
      categories,
      requirements
    }
  }

  console.log("Writing taxonomy...")
  const dataDir = resolve(__dirname, `../public/data`);
  if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
  }

  let json = JSON.stringify(taxonomy);
  fs.writeFile(
    `${dataDir}/useable.json`,
    json,
    {
      flag: 'w',
    },
    (err) => err && console.error(err)
  );
})();