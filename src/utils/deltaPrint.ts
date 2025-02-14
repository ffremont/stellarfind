import { CatalogObject } from "../types/CatalogObject";
import { equatorialDecimalOf, equatorialToHorizontal } from "./celestrial";
import catalog from "../data/catalog-minify.json";
import { log } from "./log";

export const print = ({
  fromDEC,
  fromRA,
  targetDEC,
  targetRA,
  latitude,
  longitude,
  altitude,
  target,
  arcsecPix = -1,
}: {
  fromRA: string;
  fromDEC: string;
  targetRA: string;
  targetDEC: string;
  target: string;
  latitude: number;
  longitude: number;
  altitude: number;
  arcsecPix?: number;
}) => {
  let theoryRA = 0 ,
    theoryDEC = 0, tags= ['manuel-target'], type = 'custom';
  if (!targetRA && !targetDEC) {
    const myCatalog = catalog as CatalogObject[];
    const obj = myCatalog.find(
      (o) =>
        o.tags
          .map((t) => t.toLowerCase())
          .indexOf(target.toLowerCase().trim()) > -1
    );
    if (!obj) {
      throw new Error("`Object ${target} introuvable !`");
    }
    tags = obj.tags;
    theoryRA = parseFloat(obj.RA) / 15;
    theoryDEC = parseFloat(obj.DEC);
    type = obj.type;
  }else{
    const targetDecimals = equatorialDecimalOf(
      targetRA, targetDEC
    );
    theoryRA = targetDecimals.ra;
    theoryDEC = targetDecimals.dec;
  }

  const theory = equatorialToHorizontal(
    theoryRA,
    theoryDEC,
    new Date(),
    latitude,
    longitude,
    altitude
  );

  const decimalCoords = equatorialDecimalOf(fromRA, fromDEC);
  const effective = equatorialToHorizontal(decimalCoords.ra, decimalCoords.dec);
  //06:31:08.871", "+05:04:47.452"

  //+ : droite , - : gauche
  // calcule de l'écart
  const delta = {
    az: theory.azimuth - effective.azimuth,
    alt: theory.altitude - effective.altitude,
  };

  log.info(`
🎯 ${target} (${tags.join(",")})
---
Position: lat(${latitude}°) long(${longitude}°) alt(${altitude}m)
Azimuth: ${theory.azimuth.toFixed(1)}°
Altitude: ${theory.altitude.toFixed(1)}°
Type: ${type}${arcsecPix ? `\nCaméra: ${arcsecPix} arcsec / pix` : ""}
---

${delta.az > 0 ? "👉" : "👈"} ${Math.abs(delta.az).toFixed(1) + "°"}
${delta.alt > 0 ? "👆" : "👇"} ${Math.abs(delta.alt).toFixed(1) + "°"}

🔭 Vous êtes en Az ${effective.azimuth.toFixed(
    1
  )}°, Alt ${effective.altitude.toFixed(1)}°

`);
};
