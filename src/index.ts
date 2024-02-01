#!/usr/bin/env node
import { equatorialToHorizontal } from "./utils/celestrial";
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).options({
  lat: { type: 'number', default: 46.31086734243457, alias: 'latitude',describe: 'Latitude du lieu'  },
  lon: { type: 'number', default: -0.5236387303855696, alias: 'longitude',describe: 'Longitude du lieu'  },
  alt: { type: 'number', default: 7, alias: 'altitude',describe: 'Altitude du lieu'  },

  fromAz: { type: 'number', alias: 'fromAzimuth',describe: 'Azimuth de départ'  },
  fromAlt: { type: 'number', alias: 'fromAltitude',describe: 'Altitude de départ'  },
}).parse();
console.log(argv);



console.log('ok', equatorialToHorizontal("06:31:08.871", "+05:04:47.452"))
// RA J2000 : 06:31:08.871
// DEC J2000 : +05:04:47.452
