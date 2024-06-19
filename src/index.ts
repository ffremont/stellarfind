#!/usr/bin/env node
import yargs from "yargs";
import Watcher from "node-watch";
import { spawn } from "node:child_process";
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
  fromRA,
  fromDEC,
  watch,
  scaleLow,
  scaleHigh,
} = yargs(process.argv)
  .options({
    a: {
      type: "string",
      default: "m31",
      alias: "target",
      describe: "[OBLIGATOIRE] Cible (ex: M31)",
    },
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
    d: {
      type: "number",
      default: 46.31086,
      alias: "latitude",
      describe: "Latitude du lieu",
    },
    e: {
      type: "number",
      default: 6.02363,
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
  Watcher(watch, { recursive: false }, (evt, filename) => {
    const lowerFilename = filename.toLowerCase();
    if (
      evt == "update" &&
      (lowerFilename.endsWith(".png") || lowerFilename.endsWith(".jpg"))
    ) {
      let options = ["--no-plot", "--guess-scale", filename];
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
            arcsecPix: eqCoords.arcsecPix
          });
        })
        .catch(() => log.error('❌ Résolution Astrométrique impossible'));
    }
  });
} else {
  print({
    fromDEC,
    fromRA,
    latitude,
    longitude,
    altitude,
    target,
  });
}

// RA J2000 : 06:31:08.871
// DEC J2000 : +05:04:47.452


