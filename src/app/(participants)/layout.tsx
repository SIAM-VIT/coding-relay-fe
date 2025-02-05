"use client";

import { easeInOut, motion } from "framer-motion";

const ParticipantLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeInOut, delay: 0.5 }}
      className="overflow-hidden flex flex-col items-center justify-start min-h-[90vh] min-w-screen -mt-10"
    >
      {children}
    </motion.div>
  );
};

export default ParticipantLayout;
