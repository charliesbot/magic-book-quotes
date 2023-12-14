type ColorPalette = [number, number, number];

export class ColorsPalette {
  rgb: [number, number, number] = [-1, -1, -1];

  constructor(rgb: ColorPalette) {
    this.rgb = rgb;
  }

  getPalette() {
    const [h, s, l] = this.convertToHSL();

    return {
      foregroundColor: `hsl(${h}, ${s}%, 5%)`,
      backgroundColor: `hsl(${h}, ${s}%, 90%)`,
    };
  }

  convertToHSL(): ColorPalette {
    let [r, g, b] = [...this.rgb];
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
