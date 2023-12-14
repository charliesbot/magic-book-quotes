import { NextApiRequest, NextApiResponse } from "next";
import {
  Canvas,
  createCanvas,
  GlobalFonts,
  Image,
  loadImage,
  SKRSContext2D,
} from "@napi-rs/canvas";
import path from "path";
import { getPaletteFromBookCover, wrapText } from "@/utils/imageCanvas";

type CanvasData = {
  ctx: SKRSContext2D;
  canvas: Canvas;
  image: Image;
  quote: string;
  foregroundColor: string;
};

const width = 1000;
const height = 562;
const paddingLeft = 100;
const paddingRight = 450;

const drawQuoteLine = (
  canvasData: CanvasData,
  startY: number,
  fontSize: number,
  totalTextHeight: number
) => {
  const { ctx, foregroundColor } = canvasData;
  // Draw a rectangle to the left of the text
  const rectWidth = 10; // Width of the rectangle
  const rectX = paddingLeft - rectWidth - 20; // X position (10px space between rectangle and text)
  const rectY = startY - fontSize; // Y position aligned with the start of the first line of text
  const rectHeight = totalTextHeight; // Height of the rectangle matches the text height
  ctx.fillStyle = foregroundColor;
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
};

const drawBookCover = (canvasData: CanvasData) => {
  const { canvas, ctx, image } = canvasData;
  const imageX = canvas.width * 0.9; // X position of the image
  const imageY = canvas.height / 2; // Y position of the image (centered)
  const rotation = (7 * Math.PI) / 180; // Rotation in radians (10 degrees)

  ctx.save(); // Save the current state of the canvas
  ctx.translate(imageX, imageY); // Move to the position where the image will be drawn
  ctx.rotate(rotation); // Rotate the canvas

  // Draw the image
  const scaleFactor = 0.65; // Scale factor for the image size
  ctx.drawImage(
    image,
    (-image.width * scaleFactor) / 2,
    (-image.height * scaleFactor) / 2,
    image.width * scaleFactor,
    image.height * scaleFactor
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }
  const { title, authors, quote, imageUrl } = req.body;
  const loraFontPath = path.join(process.cwd(), "files", "Lora.ttf");
  const robotoFontPath = path.join(process.cwd(), "files", "Roboto-Light.ttf");
  const sourceSansFontPath = path.join(
    process.cwd(),
    "files",
    "SourceSans.ttf"
  );
  GlobalFonts.registerFromPath(loraFontPath, "Lora");
  GlobalFonts.registerFromPath(sourceSansFontPath, "Source Sans");
  GlobalFonts.registerFromPath(robotoFontPath, "Roboto Light");

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(imageUrl);
  const { foregroundColor, backgroundColor } = await getPaletteFromBookCover(
    imageUrl
  );

  const canvasData: CanvasData = {
    canvas,
    ctx,
    image,
    quote,
    foregroundColor,
  };

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.fillStyle = "white";
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBookCover(canvasData);

  ctx.restore(); // Restore the canvas state to prevent the rotation affecting subsequent drawings

  // Configure text properties
  const fontSize = 30; // Font size
  const lineHeight = fontSize * 1.2; // 1.2 is a standard line-height for readability
  ctx.font = `${fontSize}px Lora`;
  ctx.fillStyle = foregroundColor;

  const maxWidth = canvas.width - paddingLeft - paddingRight;
  const lines = wrapText(ctx, quote, maxWidth);
  const totalTextHeight = lines.length * lineHeight;

  const startY = (canvas.height - totalTextHeight) / 2;

  // Draw each line of the text
  lines.forEach((line, index) => {
    ctx.fillText(line, paddingLeft, startY + index * lineHeight);
  });

  drawQuoteLine(canvasData, startY, fontSize, totalTextHeight);

  ctx.font = `${24}px Roboto Light`;

  const titleY = startY + totalTextHeight + 20; // Add some space below the quote
  ctx.fillText(title, paddingLeft, titleY);
  ctx.font = `${18}px Roboto Light`;
  const authorY = titleY + 30; // Add some space below the title
  ctx.fillText(authors, paddingLeft, authorY);

  const buffer = canvas.toBuffer("image/png");

  // Set the content type to image/png and send the buffer as a response
  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}
