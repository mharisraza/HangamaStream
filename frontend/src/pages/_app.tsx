import type { AppProps } from "next/app";
import Head from "next/head";
import "../assets/styles/custom.scss";
import "../assets/styles/globals.css";
import axios from 'axios';
import Script from "next/script";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      </>
  );
}
