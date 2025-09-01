import fg from 'fast-glob';
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

async function cleanDirectories(dirNames, logger) {
  const contentDirs = dirNames.map(dir => {
    logger.info(`Cleaning ${dir}...`);
    return resolve(__dirname, `../src/content/${dir}/*.json`);
  });

  const entries = await fg.glob(contentDirs, { dot: true });
  for (const filename of entries) {
    fs.unlink(filename, function(err) {
        if (err)
          return logger.error(err);
        logger.debug(`${filename} deleted successfully.`);
    });
  }
}

function writeDataToFile(data, filename, logger) {
  const json = JSON.stringify(data);
  logger.debug(`Writing ${filename}`);
  fs.writeFile(
    filename,
    json,
    {
      flag: 'w',
    },
    (err) => err && logger.error(err)
  );
}

export default async (logger) => {
  if (!logger)
    logger = console;

  await cleanDirectories(['categories', 'conditions', 'requirements'], logger);

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
  
  logger.info("Writing requirements...");
  for (const data of requirements) {
    writeDataToFile(
      data,
      resolve(__dirname, `../src/content/requirements/${data.id}.json`),
      logger
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

  logger.info("Writing categories...");
  for (const data of categories) {
    writeDataToFile(
      data,
      resolve(__dirname, `../src/content/categories/${data.id}.json`),
      logger
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

  logger.info("Writing conditions...");
  for (const data of conditions) {
    writeDataToFile(
      data,
      resolve(__dirname, `../src/content/conditions/${data.id}.json`),
      logger
    );
  }

  const taxonomy = {
    version: process.env.VERSION,
    taxonomy: {
      conditions,
      categories,
      requirements
    }
  };

  logger.info("Writing taxonomy...");
  const dataDir = resolve(__dirname, `../public/data`);
  if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
  }

  writeDataToFile(
    taxonomy,
    `${dataDir}/useable.json`,
    logger
  );
};