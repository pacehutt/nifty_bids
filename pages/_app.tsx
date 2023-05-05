import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import network from "../utils/network";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={network}>
      <ThemeProvider attribute="class">
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
