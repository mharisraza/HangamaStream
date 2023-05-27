import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../assets/styles/components/Home.module.css";
import Navbar from "@/components/Navbar";
import Base from "@/components/Base";
import { useEffect } from "react";
import HeroBg from "../assets/images/hero-bg.png";
import Link from "next/link";

export default function Home() {



  return (
    <>
      <Base title="HangamaStream | Home">
        <div style={{backgroundImage: `url(${HeroBg.src})`}} className={styles.hero}>
          <div className="text-start">
          <h1 className="text-white">Watch Free Movies With With <span style={{ fontWeight: '1000', fontSize: '18', }} className="text-primary">Hangama</span></h1>
          <p className="text-white">Stop searching for free movie websites and watch Plex now.</p>
          <Link href="/login" className={`btn ${styles.start_streaming_btn}`}>Start streaming <i className="fas fa-play"></i></Link>
          </div>
        </div>
      </Base>
    </>
  );
}

