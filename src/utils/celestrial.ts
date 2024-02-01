import * as Astronomy from "astronomy-engine";
import { HorizontalCoord } from "../types/HorizontalCoord";

export const sunRiseOfName = (
  name: "today" | "tomorrow" | "yesterday",
  lat: number = 46.3109436000504,
  lon: number = -0.5235963998645734
) => {
  let date = new Date();
  date.setHours(12);
  date.setMinutes(0);
  if (name === "tomorrow") date = new Date(date.getTime() + 24 * 3600000);
  if (name === "yesterday") date = new Date(date.getTime() - 24 * 3600000);

  return sunRiseOf(date, lat, lon);
};

export const sunRiseOf = (
  date: Date = new Date(),
  lat: number = 46.3109436000504,
  lon: number = -0.5235963998645734
): { rise: Date | null; set: Date | null } => {
  const observer = new Astronomy.Observer(lat, lon, 0);
  let sunrise: any = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    +1,
    date,
    300
  );
  let sunset: any = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    -1,
    date,
    300
  );

  // si le levé est avant le couché
  if (sunrise && sunset && sunrise.date.getTime() < sunset.date.getTime()) {
    sunrise.date = new Date(sunrise.date.getTime() + 24 * 3600000);
  }

  return {
    rise: sunrise?.date || null,
    set: sunset?.date || null,
  };
};


export const REG_RA_DEC = /(\+?\-?)(\d{2}):(\d{2}):(.*)/i;
const hourToDeg = (h: number, m: number, s: number) => h + m / 60 + s / 3600;
const degHMStoDecimal = (degres: number, minutes: number, second: number) =>
  degres + minutes / 60 + second / 3600;

/**
 * 
 * @param ra 
 * @param dec 
 * @returns 
 */
export const equatorialDecimalOf = (ra: string, dec: string) => {
  const raParsed = (REG_RA_DEC.exec(ra) || []).slice(2);
  const decParsed = (REG_RA_DEC.exec(dec) || []).slice(1);
  return {
    ra:
      hourToDeg(
        parseFloat(raParsed[0]),
        parseFloat(raParsed[1]),
        parseFloat(raParsed[2])
      ) ,
    dec:
      degHMStoDecimal(
        parseFloat(decParsed[1]),
        parseFloat(decParsed[2]),
        parseFloat(decParsed[3])
      ) *
        (decParsed[0] === "-" ? -1 : 1) 
      
  };
};

/**
 * Ex Andromède : "dec": "+41:16:08.6", "ra": "00:42:44.35",
 * https://stellarium-web.org/skysource/AndromedaNebula?fov=100.04&date=2022-07-24T12:00:54Z&lat=46.31&lng=-0.52&elev=0
 *
 *
 * @param date
 * @param latitude
 * @param longitude
 * @param ra (ex: "12:22:54.83")
 * @param dec (ex: "+15:49:18.5")
 * @returns
 */
export const equatorialToHorizontal = (
  ra: string,
  dec: string,
  date: Date = new Date(),
  latitude: number = 46.31086734243457,
  longitude: number = -0.5236387303855696,
  altitude: number = 7
): HorizontalCoord => {
  const observer = new Astronomy.Observer(latitude, longitude, altitude);
  const decimalCoords = equatorialDecimalOf(ra ,dec);

  const hor = Astronomy.Horizon(
    new Date(date),
    observer,
    decimalCoords.ra,
    decimalCoords.dec,
    "normal"
  );
  return {
    azimuth: hor.azimuth,
    altitude:hor.altitude,
  };
};

export type IntervalCoord = {
  at: Date;
  azimuth: number;
  altitude: number;
};
type horizontalByIntervalParams = {
  ra?: string;
  dec?: string;
  planetName?: string;
  options: {
    date: Date;
    lat: number;
    lon: number;
    interval?: number;
  };
};
export const horizontalByInterval = ({
  ra,
  dec,
  planetName,
  options = {
    date: new Date(),
    lat: 46.3109436000504,
    lon: -0.5235963998645734,
    interval: 3600000 / 4,
  },
}: horizontalByIntervalParams): IntervalCoord[] => {
  const { date, lat, lon, interval, } = options as any;

  const { rise, set } = sunRiseOf(date, lat, lon);
  const data = [];

  if (rise && set) {
    const newSet = new Date(set.getTime() + 3600000);
    newSet.setMinutes(0);
    newSet.setSeconds(0);

    let cursor = newSet.getTime();
    while (cursor < rise.getTime()) {
      for (let i = 0; i < 3600000; i += interval) {
        const d = new Date(cursor + i);
        if (ra && dec) {
          const coords = equatorialToHorizontal(
            ra,
            dec,
            d,
            lat,
            lon
          );
          data.push({
            at: new Date(cursor + i),
            ...coords,
          });
        } else if (planetName) {
          const coords = planetToHorizontal(planetName as any, d, lat, lon);

          data.push({
            at: new Date(cursor + i),
            ...coords,
          });
        }
      }

      cursor += 3600000;
    }
  }

  return data;
};

type planetName = "mars";

export const planetToHorizontal = (
  name: planetName,
  date: Date = new Date(),
  latitude: number = 46.3109436000504,
  longitude: number = -0.5235963998645734
) => {
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  const translateCodes: any = {
    mars: "Mars",
    mercure: "Mercury",
    venus: "Venus",
    jupiter: "Jupiter",
    saturne: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune",
    lune: "Moon",
  };

  let equ_ofdate = Astronomy.Equator(
    translateCodes[name] as any,
    date,
    observer,
    true,
    true
  );
  let hor = Astronomy.Horizon(
    date,
    observer,
    equ_ofdate.ra,
    equ_ofdate.dec,
    "normal"
  );

  return {
    azimuth: parseInt(hor.azimuth.toFixed(0), 10),
    altitude: parseInt(hor.altitude.toFixed(0), 10),
  };
};
