"use client";

import "./globals.css";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

type Star = {
  top: string;
  left: string;
  size: string;
  animationDuration: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [stars, setStars] = useState<Star[]>([]);
  useEffect(() => {
    const generateStars = () => {
      return [...Array(25)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 1}px`,
        animationDuration: `${Math.random() * 15 + 30}s`,
      }));
    };
    setStars(generateStars());
  }, []);
  return (
    <html lang="en">
      <head>
        <title>Coding Relay Portal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-title" content="Coding Relay Portal" />
      </head>
      <body className="antialiased">
        <Navbar />
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="-z-50 fixed bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{
              x: [0, 50, -50, 50, -50, 0],
              y: [0, -50, 50, -50, 50, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {children}
        <Footer />
      </body>
    </html>
  );
}
