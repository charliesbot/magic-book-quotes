import { BookType } from "@/utils/booksApi";
import { useEffect, useRef } from "react";
import { Lora, Roboto } from "next/font/google";

const lora = Lora({ subsets: ["latin"] });
const roboto = Roboto({ weight: "300", subsets: ["latin"] });

type Props = {
  book: BookType;
  quote: string;
};

const width = 1000;
const height = 562;
const paddingLeft = 100;
const paddingRight = 450;

const wrapText = (ctx, text, x, maxWidth, lineHeight) => {
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

export const FancyQuote = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { book, quote } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !book) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    console.log(book.image);
    image.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill the background with white
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Position and rotate the image
      const imageX = canvas.width * 0.9; // X position of the image
      const imageY = canvas.height / 2; // Y position of the image (centered)
      const rotation = (7 * Math.PI) / 180; // Rotation in radians (10 degrees)

      ctx.save(); // Save the current state of the canvas
      ctx.translate(imageX, imageY); // Move to the position where the image will be drawn
      ctx.rotate(rotation); // Rotate the canvas

      // Draw the image
      // Adjust the scale factor as needed
      const scaleFactor = 0.6; // Scale factor for the image size
      ctx.drawImage(
        image,
        (-image.width * scaleFactor) / 2,
        (-image.height * scaleFactor) / 2,
        image.width * scaleFactor,
        image.height * scaleFactor
      );

      ctx.restore(); // Restore the canvas state to prevent the rotation affecting subsequent drawings

      // Configure text properties
      const fontSize = 30; // Font size
      const lineHeight = fontSize * 1.2; // 1.2 is a standard line-height for readability
      ctx.font = `${fontSize}px ${lora.style.fontFamily}`;
      ctx.fillStyle = "black";

      const maxWidth = canvas.width - paddingLeft - paddingRight;
      const lines = wrapText(ctx, quote, paddingLeft, maxWidth, lineHeight);
      const totalTextHeight = lines.length * lineHeight;

      const startY = (canvas.height - totalTextHeight) / 2;

      // Draw each line of the text
      lines.forEach((line, index) => {
        ctx.fillText(line, paddingLeft, startY + index * lineHeight);
      });

      // Draw a rectangle to the left of the text
      const rectWidth = 10; // Width of the rectangle
      const rectX = paddingLeft - rectWidth - 20; // X position (10px space between rectangle and text)
      const rectY = startY - fontSize; // Y position aligned with the start of the first line of text
      const rectHeight = totalTextHeight; // Height of the rectangle matches the text height
      ctx.fillStyle = "black"; // Color of the rectangle
      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

      ctx.font = `${24}px ${roboto.style.fontFamily}`;

      const titleY = startY + totalTextHeight + 20; // Add some space below the quote
      ctx.fillText(book.title, paddingLeft, titleY);
      ctx.font = `${18}px ${roboto.style.fontFamily}`;
      const authorY = titleY + 30; // Add some space below the title
      ctx.fillText(book.authors, paddingLeft, authorY);
    };

    image.src = book.image;
  }, [book, quote]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
