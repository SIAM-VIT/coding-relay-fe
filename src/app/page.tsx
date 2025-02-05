"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

export default function Home() {
  const router = useRouter();
  const [showText, setShowText] = useState(true);
  useEffect(() => {
    const checkEventStatus = async () => {
      if (localStorage.getItem("end") === "true") {
        router.replace("/end");
        return;
      }
    };
    checkEventStatus();
  }, [router]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
    }, 6500);
    return () => clearTimeout(timer);
  }, []);
  const handleClick = async (id: number) => {
    try {
      await axios.get(
        "https://coding-relay-be.onrender.com/leaderboard/getTimer"
      );
      router.push(`/participant${id}`);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 400) {
        toast.error("Event has not started yet");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start text-center">
        <AnimatePresence mode="wait">
          {showText ? (
            <motion.div
              key="text"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: easeInOut }}
            >
              <h1 className="line-1 anim-typewriter">Coding Relay</h1>
              <h2 className="line-2 anim-typewriter-2">
                Pass the{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  function,{" "}
                </span>
                chase the{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  solution!
                </span>
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="new-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeInOut }}
              className="flex flex-row gap-x-10 text-white"
            >
              <Button
                onClick={() => handleClick(1)}
                className="relative w-96 h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
              >
                <div className="flex items-center justify-center w-full h-full px-10 py-5 text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                  Participant 1
                </div>
              </Button>
              <Button
                onClick={() => handleClick(2)}
                className="relative w-96 h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
              >
                <div className="flex items-center justify-center w-full h-full px-10 py-5 text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                  Participant 2
                </div>
              </Button>
              <Button
                onClick={() => handleClick(3)}
                className="relative w-96 h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
              >
                <div className="flex items-center justify-center w-full h-full px-10 py-5 text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                  Participant 3
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </div>
    </>
  );
}
