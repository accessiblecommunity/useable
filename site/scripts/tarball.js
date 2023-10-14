#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fg from 'fast-glob';
import tar from 'tar'

const __dirname = dirname(fileURLToPath(import.meta.url));

const dataDir = resolve(__dirname, '../../data')
const output = resolve(__dirname, '../public/data/useable.tgz')

tar.c(
  {
    file: output,
    gzip: true,
    cwd: dataDir,
  },
  fg.globSync(['*.csv'], { cwd: dataDir })
).then(_ => { 
  console.log(`Generated ${output}`)
})