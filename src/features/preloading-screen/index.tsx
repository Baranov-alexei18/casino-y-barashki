import React, { FC, useEffect, useState } from "react";
import { motion } from "motion/react";

import logo from "@assets/images/logo-barashka.png";

import styles from "./styles.module.css";

export const LoadingScreen: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 720],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={styles.container}
      >
        <img src={logo} alt="Project Logo" className={styles.logoWrapper} />
      </motion.div>
    </div>
  );
};
