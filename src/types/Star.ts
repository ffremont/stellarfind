export type Star = {
  id: number;
  name?: string;
  magn: number;
  HD?: number;
  HR?: number;
  constellation?: string;
  RA: {
    label: string;
    h: number;
    m: number;
    s: number;
  };
  DEC: {
    label: string;
    d: number;
    m: number;
    s: number;
  };
};
