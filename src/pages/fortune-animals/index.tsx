import React, { useState } from "react";
import { motion } from "framer-motion";

import spinSound from "@assets/audio/fortune-animals/spin.mp3"; // Звук начала прокрутки
import Bear from "@assets/images/games/fortune-animals/bear.png";
import Bull from "@assets/images/games/fortune-animals/bull.png";
import Gorilla from "@assets/images/games/fortune-animals/gorilla.png";
import Lion from "@assets/images/games/fortune-animals/lion.png";
import Owl from "@assets/images/games/fortune-animals/owl.png";
import Panda from "@assets/images/games/fortune-animals/panda.png";
import Rabbit from "@assets/images/games/fortune-animals/rabbit.png";
import Raccoon from "@assets/images/games/fortune-animals/raccoon.png";

import styles from "./styles.module.css";

export const SLOT_IMAGES = [
  Bear,
  Bull,
  Gorilla,
  Lion,
  Owl,
  Panda,
  Rabbit,
  Raccoon,
];

const getRandomImages = () => {
  const shuffled = [...SLOT_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.concat(shuffled); // Удваиваем массив для бесшовной прокрутки
};

export const FortuneAnimalsPage = () => {
  const [slots, setSlots] = useState([
    getRandomImages(),
    getRandomImages(),
    getRandomImages(),
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stopIndexes, setStopIndexes] = useState([0, 0, 0]); // Индексы остановки

  const spinAudio = new Audio(spinSound); // Загружаем звук вращения один раз

  const spinSlots = () => {
    setIsSpinning(true);

    // Запуск звука вращения
    spinAudio.play();

    // Генерация случайных индексов остановки для каждой колонки
    const newStopIndexes = [0, 1, 2].map(() =>
      Math.floor(Math.random() * SLOT_IMAGES.length),
    );

    // Старт прокрутки
    setTimeout(() => stopColumn(0, newStopIndexes[0]), 2000); // Первая колонка
    setTimeout(() => stopColumn(1, newStopIndexes[1]), 2500); // Вторая колонка
    setTimeout(() => stopColumn(2, newStopIndexes[2]), 3000); // Третья колонка
  };

  const stopColumn = (index: number, stopIndex: number) => {
    setStopIndexes((prev) => {
      const updated = [...prev];
      updated[index] = stopIndex;
      return updated;
    });

    if (index === 2) {
      setIsSpinning(false); // Завершение вращения всех колонок

      // Остановка звука после окончания прокрутки
      // Задержка 0.5 сек (чтобы дождаться завершения всех анимаций)
      setTimeout(() => {
        spinAudio.pause();
        spinAudio.currentTime = 0; // Сброс времени аудио
      }, 500); // Настроим задержку, чтобы звук остановился после завершения анимации
    }
  };

  return (
    <div className={styles.slotMachine}>
      <h1>Fortune Animals</h1>
      <div className={styles.slotsContainer}>
        {slots.map((slot, index) => (
          <SlotColumn
            key={index}
            images={slot}
            isSpinning={isSpinning}
            stopIndex={stopIndexes[index]}
            duration={0.5} // Увеличенная скорость прокрутки
          />
        ))}
      </div>
      <button
        onClick={spinSlots}
        disabled={isSpinning}
        className={styles.spinButton}
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const SlotColumn = React.memo(
  ({
    images,
    isSpinning,
    stopIndex,
    duration,
  }: {
    images: string[];
    isSpinning: boolean;
    stopIndex: number;
    duration: number;
  }) => {
    const offset = stopIndex * 70; // Высота одного изображения

    return (
      <div className={styles.slot}>
        <motion.div
          className={styles.reel}
          animate={{
            y: isSpinning
              ? [-images.length * 60, 0] // Анимация при вращении
              : -offset, // Остановка в нужном положении
          }}
          transition={{
            duration: isSpinning ? duration : 0.6, // Плавный переход к финальному положению
            ease: "linear",
            repeat: isSpinning ? Infinity : 0, // Запрещаем повторение анимации после остановки
          }}
          style={{
            willChange: "transform", // Оптимизация
          }}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.slotItem}>
              <img src={image} alt={`Slot ${index + 1}`} />
            </div>
          ))}
        </motion.div>
      </div>
    );
  },
);
