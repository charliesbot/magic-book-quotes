import { Image, SKRSContext2D } from "@napi-rs/canvas";
import { FastAverageColor } from "fast-average-color";
import {
  CanvasColors,
  convertToHSL,
  getPalette,
  getPredominantColors,
} from "./colors";

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

export const getPaletteFromBookCover = async (
  imageUrl: string
): Promise<CanvasColors> => {
  const color = await new FastAverageColor().getColorAsync(imageUrl);
  //   const canvasColors: CanvasColors[] = (await getPredominantColors(image, 1))
  //     .map(convertToHSL)
  //     .map(getPalette);
  //   return canvasColors[0];
};
