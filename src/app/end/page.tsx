"use client";

import { easeInOut, motion } from "framer-motion";

const Verified = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="min-h-screen min-w-screen flex flex-col gap-y-10 items-center justify-center -mt-52"
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: easeInOut }}
        className="text-6xl"
      >
        Your time is up!
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: easeInOut }}
        className="text-4xl"
      >
        You can now close this window.
      </motion.h2>
    </motion.div>
  );
};

export default Verified;
