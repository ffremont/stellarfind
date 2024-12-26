#!/usr/bin/env node
import yargs from "yargs";
import Watcher from "node-watch";
import assert from "node:assert";
import { log } from "./utils/log";
import { print } from "./utils/deltaPrint";
import { run } from "./utils/astrometry";

// node ./dist/index.js --target=m89 --watch=/aa/bb

// npx tsc && node ./dist/index.js --target=m89 --fromRA=12:12:35.066 --fromDEC=+11:35:35.629

log.info("===============================");

const {
  latitude,
  longitude,
  altitude,
  target,
  targetRA,
  targetDEC,
  fromRA,
  fromDEC,
  watch,
  scaleLow,
  scaleHigh,
  cpulimit
} = yargs(process.argv)
  .options({
    a: {
      type: "string",
      default: "m31",
      alias: "target",
      describe: "[OBLIGATOIRE] Cible (ex: M31)",
    },
    tra: { type: "string", alias: "targetRA", describe: "RA de destination" },
    tdec: { type: "string", alias: "targetDEC", describe: "DEC de destination" },
    b: { type: "string", alias: "fromRA", describe: "RA de départ" },
    c: { type: "string", alias: "fromDec", describe: "DEC de départ" },
    w: { type: "string", alias: "watch", describe: "Watch un répertoire" },

    l: {
      type: "number",
      default: -1,
      alias: "scaleLow",
      describe: "scale-low issue de solve-field",
    },
    h: {
      type: "number",
      default: -1,
      alias: "scaleHigh",
      describe: "scale-high issue de solve-field",
    },
    j: {
      type: "number",
      default: 60,
      alias: "cpulimit",
      describe: "cpulimit issue de solve-field",
    },
    d: {
      type: "number",
      default: 46.31086,
      alias: "latitude",
      describe: "Latitude du lieu",
    },
    e: {
      type: "number",
      default: -0.523589,
      alias: "longitude",
      describe: "Longitude du lieu",
    },
    f: {
      type: "number",
      default: 7,
      alias: "altitude",
      describe: "Altitude du lieu",
    },
  })
  .parse() as any;

if (watch) {
  assert(target, 'target doit être définit avec watch');
  let running = false;
  Watcher(watch, { recursive: false }, (evt, filename) => {
    const lowerFilename = filename.toLowerCase();
    if (
      !running && 
      evt == "update" &&
      (lowerFilename.endsWith(".fit") || lowerFilename.endsWith(".fits"))
    ) {
      let options = ["--no-plot", '--cpulimit', cpulimit, "--guess-scale", filename];
      if (scaleLow >= 0 && scaleHigh >= 0) {
        options = [
          "--scale-units",
          "arcsecperpix",
          "--scale-low",
          scaleLow,
          "--scale-high",
          scaleHigh,
          ...options,
        ];
      }

      log.info('⚡️ Nouvelle analyse astrométrique...');
      running=true;
      run(options)
        .then((eqCoords) => {
          log.info("\n\n");
          print({
            fromDEC: eqCoords.dec,
            fromRA: eqCoords.ra,
            latitude,
            longitude,
            altitude,
            target,
            targetRA, 
            targetDEC,
            arcsecPix: eqCoords.arcsecPix
          });
        })
        .catch((e) => log.error('❌ Résolution Astrométrique impossible',e))
        .finally(() => running=false);
    }
  });
} else {
  assert(fromDEC && fromRA,  'fromDEC et fromRA doivent être définit avec target');
  print({
    fromDEC,
    fromRA,
    targetDEC,
    targetRA,
    latitude,
    longitude,
    altitude,
    target,
  });
}

// RA J2000 : 06:31:08.871
// DEC J2000 : +05:04:47.452


