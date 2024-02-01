#!/usr/bin/env node
import { equatorialToHorizontal } from "./utils/celestrial";
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  b: { type: 'string', demandOption: true },
  c: { type: 'number', alias: 'chill' },
  d: { type: 'array' },
  e: { type: 'count' },
  f: { choices: ['1', '2', '3'] }
}).parse();
console.log(argv);



console.log('ok', equatorialToHorizontal("06:31:08.871", "+05:04:47.452"))
// RA J2000 : 06:31:08.871
// DEC J2000 : +05:04:47.452
