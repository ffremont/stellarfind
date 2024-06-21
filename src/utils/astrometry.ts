import { spawn } from "node:child_process";
import { log } from "./log";

const REG_EXTRACT_RA_DEC =
  /Field center: \(RA H:M:S, Dec D:M:S\) = \((\d{2}:\d{2}:\d{2}\.\d{3}),\s*(-?\+?\d{2}:\d{2}:\d{2}\.\d{3})\)\./;
const REQ_EXTRACT_PIX = /pixel scale (\d+\.\d+) arcsec\/pix\./;

export const run = (options: string[]): Promise<{ra:string,dec:string,arcsecPix:number}> => {
  return new Promise((resolve, reject) => {
    let ra = "",
      dec = "", arcsecPix = 0;
    const astrometryProcess = spawn("solve-field", options);
    astrometryProcess.stdout.on("data", (data) => {
      const match = `${data}`.match(REG_EXTRACT_RA_DEC);
      if (match) {
        ra = match[1];
        dec = match[2];
      }
      const pixMatch = `${data}`.match(REQ_EXTRACT_PIX);
      if(pixMatch){
        arcsecPix = parseFloat(pixMatch[1]);
      }
    });
    astrometryProcess.on("exit", (code) => {
      if (code === 0 && ra && dec) {
        resolve({ra,dec,arcsecPix});
      } else {
        reject("invalid code "+code);
      }
    });
  });
};
