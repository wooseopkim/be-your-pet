import mulberry32 from "$lib/mulberry32";
import fisheryates from "../fisheryates";

type Variation = {
  base?: number;
  diff: number;
};

const defaultVariations = {
  color: { diff: 72, base: 180 },
  angle: { diff: 360, base: 0 },
};

export class Random {
  private readonly seed: number;
  private readonly rng: () => number;

  constructor(seed?: number) {
    this.seed = seed ?? new Date().valueOf();
    this.rng = mulberry32(this.seed);
  }

  number({ diff, base = 0 }: Variation) {
    return this.rng() * diff + base;
  }

  private color({ diff, base = 0 }: Variation) {
    const [x, y, z] = Array(3)
      .fill(null)
      .map(() => this.rng() * diff + base)
      .sort((a, b) => a - b) as [number, number, number];
    const c = 0.05;
    const d = 0.15;
    const values = [x + c * y + d * z, (1 - c) * y, (1 - d) * z];
    const [r, g, b] = fisheryates(values, this.rng).map(Math.round);
    return { r, g, b };
  }

  rgb({ diff = 255, base = 0 }: Variation = defaultVariations.color) {
    const { r, g, b } = this.color({ diff, base });
    return `rgb(${[r, g, b].join(", ")})`;
  }

  angle({ diff = 360, base = 0 }: Variation = defaultVariations.angle) {
    return `${(this.rng() - 0.5) * diff + base}deg`;
  }
}
