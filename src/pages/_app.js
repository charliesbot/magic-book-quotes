import { Lora, Roboto } from "next/font/google";

const lora = Lora({ subsets: ["latin"] });
const roboto = Roboto({ weight: "300", subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${lora.style.fontFamily};
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
