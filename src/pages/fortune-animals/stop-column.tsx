/* eslint-disable react/display-name */
import { motion } from "motion/react";
import { memo } from "react";

import styles from "./styles.module.css";

type Props = {
  images: { name: string; image: string }[];
  isSpinning: boolean;
  stopIndex: number;
  duration: number;
};

const HEIGHT_IMAGE_BLOCK = 70;

export const SlotColumn = memo(
  ({ images, isSpinning, stopIndex, duration }: Props) => {
    const offset = stopIndex * HEIGHT_IMAGE_BLOCK;

    return (
      <div className={styles.slot}>
        <motion.div
          className={styles.reel}
          animate={{
            y: isSpinning ? [-images.length * HEIGHT_IMAGE_BLOCK, 0] : -offset,
          }}
          transition={{
            duration: isSpinning ? duration : 1,
            ease: "linear",
            repeat: isSpinning ? Infinity : 0,
          }}
          style={{ willChange: "transform" }}
        >
          {images.map(({ image }, index) => (
            <div key={index} className={styles.slotItem}>
              <img src={image} alt={`Slot ${index + 1}`} />
            </div>
          ))}
        </motion.div>
        <div className={styles.wrapperSquar} />
      </div>
    );
  },
);
