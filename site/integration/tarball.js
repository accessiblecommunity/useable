import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fg from 'fast-glob';
import fs from 'fs';
import { create } from 'tar';


export default async (logger) => {
  if (!logger)
    logger = console;

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const dataDir = resolve(__dirname, '../../data')
  const outputDir = resolve(__dirname, `../public/data`);
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }

  const output = resolve(__dirname, '../public/data/useable.tgz')
  const csvFiles = await fg.glob(['*.csv'], { cwd: dataDir })

  await create(
    {
      file: output,
      gzip: true,
      cwd: dataDir,
    },
    csvFiles
  );
  logger.info(`Generated ${output}`);
};