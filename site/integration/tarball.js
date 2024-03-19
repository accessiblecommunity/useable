import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fg from 'fast-glob';
import fs from 'fs';
import tar from 'tar';


export default (logger) => {
  if (!logger)
    logger = console;

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const dataDir = resolve(__dirname, '../../data')
  const outputDir = resolve(__dirname, `../public/data`);
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }

  const output = resolve(__dirname, '../public/data/useable.tgz')
  tar.c(
    {
      file: output,
      gzip: true,
      cwd: dataDir,
    },
    fg.globSync(['*.csv'], { cwd: dataDir })
  ).then(_ => {
    logger.info(`Generated ${output}`)
  })
};