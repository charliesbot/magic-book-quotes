import { SKRSContext2D } from "@napi-rs/canvas";
import { getColorFromURL } from "color-thief-node";
import { ColorsPalette } from "./colors";

export const wrapText = (
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number
) => {
  const words = text.split(" ");
  let line = "";
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
};

type CanvasColors = {
  foregroundColor: string;
  backgroundColor: string;
};

export const getPaletteFromBookCover = async (
  imageUrl: string
): Promise<CanvasColors> => {
  const rgbPalette = await getColorFromURL(imageUrl);
  return new ColorsPalette(rgbPalette).getPalette();
};
