#!/usr/bin/env node
import { equatorialDecimalOf, equatorialToHorizontal } from "./utils/celestrial";
import yargs from 'yargs';
import catalog from "./data/catalog-minify.json" ;
import { CatalogObject } from "./types/CatalogObject";

// npx tsc && node ./dist/index.js --target=m89 --fromRA=12:12:35.066 --fromDEC=+11:35:35.629
const log = {
  green: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
  error: (msg) => console.error(msg),
  info: (msg) => console.log(msg)
}
log.info('===============================');

const {  latitude, longitude, altitude, target, fromRA, fromDEC} = yargs(process.argv).options({
  a: { type: 'string', default: 'm31', alias: 'target',describe: '[OBLIGATOIRE] Cible (ex: M31)'  },
  b: { type: 'string', alias: 'fromRA',describe: '[OBLIGATOIRE] RA de départ'  },
  c: { type: 'string', alias: 'fromDec',describe: '[OBLIGATOIRE] DEC de départ'  },

  d: { type: 'number', default: 46.31086, alias: 'latitude',describe: 'Latitude du lieu'  },
  e: { type: 'number', default: 6.02363, alias: 'longitude',describe: 'Longitude du lieu'  },
  f: { type: 'number', default: 7, alias: 'altitude',describe: 'Altitude du lieu'  },

}).parse() as any;


const myCatalog = catalog as CatalogObject[];
const obj = myCatalog.find(o => o.tags.map(t => t.toLowerCase()).indexOf(target.toLowerCase().trim()) > -1);
if(!obj){
  throw new Error('`Object ${target} introuvable !`')
}

const theory = equatorialToHorizontal( parseFloat(obj.RA) / 15, parseFloat(obj.DEC), new Date(), latitude, longitude, altitude);

const decimalCoords = equatorialDecimalOf(fromRA ,fromDEC);
const effective = equatorialToHorizontal( decimalCoords.ra, decimalCoords.dec);
//06:31:08.871", "+05:04:47.452"


//+ : droite , - : gauche
// calcule de l'écart
const delta = {
  az: theory.azimuth - (effective.azimuth),
  alt: theory.altitude - effective.altitude
};


log.info(`
🎯 ${target} (${obj.tags.join(',')})
---
Position: lat(${latitude}°) long(${longitude}°) alt(${altitude}m)
Azimuth: ${theory.azimuth.toFixed(1)}°
Altitude: ${theory.altitude.toFixed(1)}°
Type: ${obj.type}
---

${delta.az > 0 ? '👉': '👈' } ${Math.abs(delta.az).toFixed(1)+'°'}
${delta.alt > 0 ? '👆': '👇' } ${Math.abs(delta.alt).toFixed(1)+'°'}

🔭 Vous êtes en Az ${effective.azimuth.toFixed(1)}°, Alt ${effective.altitude.toFixed(1)}°

`)




// RA J2000 : 06:31:08.871
// DEC J2000 : +05:04:47.452

/**
 * Field center: (RA,Dec) = (85.205241, -2.524750) deg.
Field center: (RA H:M:S, Dec D:M:S) = (05:40:49.258, -02:31:29.100).
Field size: 75.0213 x 51.1201 arcminutes

 */