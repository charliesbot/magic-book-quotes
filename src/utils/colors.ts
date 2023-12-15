import { FastAverageColorRgba } from "fast-average-color";

type HSL = [number, number, number];

export class ColorsPalette {
  rgba: FastAverageColorRgba;

  constructor(rgba: FastAverageColorRgba) {
    this.rgba = rgba;
  }

  getPalette() {
    const [h, s, l] = this.convertToHSL();

    return {
      foregroundColor: `hsl(${h}, ${s}%, 5%)`,
      backgroundColor: `hsl(${h}, ${s}%, 90%)`,
    };
  }

  convertToHSL(): HSL {
    let [r, g, b] = [...this.rgba];
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
  }
}
