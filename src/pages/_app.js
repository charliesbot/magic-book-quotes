const roboto = Roboto({ weight: "300", subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
