import type { AppProps } from "next/app";
import "../styles/globals.css"; // ✅ Import Tailwind

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
