import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import network from "../utils/network";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={network}>
      <ThemeProvider attribute="class">
        <Toaster />
        <>
          <Head>
            <title>Nifty Bids - NFT Marketplace</title>
            <meta
              name="description"
              content="Nifty Bids is a leading NFT marketplace that allows users to upload and list their unique NFTs for direct buying or auction. Discover, buy, and sell rare digital assets securely and easily."
            />
            <meta property="og:title" content="Nifty Bids - NFT Marketplace" />
            <meta
              property="og:description"
              content="Nifty Bids is a leading NFT marketplace that allows users to upload and list their unique NFTs for direct buying or auction. Discover, buy, and sell rare digital assets securely and easily."
            />
            <meta property="og:image" content="https://imgbox.com/qf4jGRN6" />
            <meta property="og:url" content="https://www.niftybids.com/" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Nifty Bids - NFT Marketplace" />
            <meta
              name="twitter:description"
              content="Nifty Bids is a leading NFT marketplace that allows users to upload and list their unique NFTs for direct buying or auction. Discover, buy, and sell rare digital assets securely and easily."
            />
            <meta name="twitter:image" content="https://imgbox.com/qf4jGRN6" />
          </Head>
        </>
        <Component {...pageProps} />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
