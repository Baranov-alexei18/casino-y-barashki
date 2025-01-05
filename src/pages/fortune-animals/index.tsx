import React, { useState, useRef, useEffect, useCallback } from "react";

import spinSound from "@assets/audio/fortune-animals/spin.mp3";
import Bear from "@assets/images/games/fortune-animals/bear.png";
import Bull from "@assets/images/games/fortune-animals/bull.png";
import Gorilla from "@assets/images/games/fortune-animals/gorilla.png";
import Lion from "@assets/images/games/fortune-animals/lion.png";
import Owl from "@assets/images/games/fortune-animals/owl.png";
import Panda from "@assets/images/games/fortune-animals/panda.png";
import Rabbit from "@assets/images/games/fortune-animals/rabbit.png";
import Raccoon from "@assets/images/games/fortune-animals/raccoon.png";
import { useStoreMoneyAccount } from "@app/store/useStoreMoneyAccount";

import styles from "./styles.module.css";
import { calculatePayout, getCombination, getRandomImages } from "./utils";
import { SlotColumn } from "./stop-column";
import { CombinationKeys } from "./types";

export const SLOT_IMAGES = [
  { name: "Bear", image: Bear },
  { name: "Bull", image: Bull },
  { name: "Gorilla", image: Gorilla },
  { name: "Lion", image: Lion },
  { name: "Owl", image: Owl },
  { name: "Panda", image: Panda },
  { name: "Rabbit", image: Rabbit },
  { name: "Raccoon", image: Raccoon },
];

export const FortuneAnimalsPage = () => {
  const { data: balance, setMoney } = useStoreMoneyAccount((state) => state);
  const [bet, setBet] = useState(100);

  const [columns, setColumns] = useState([
    { images: getRandomImages(), isSpinning: false, stopIndex: 0 },
    { images: getRandomImages(), isSpinning: false, stopIndex: 0 },
    { images: getRandomImages(), isSpinning: false, stopIndex: 0 },
  ]);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const resultCalculatedRef = useRef(false);
  const spinAudio = new Audio(spinSound);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleWin = (payout: number) => {
    const currentBalance = useStoreMoneyAccount.getState().data;
    updateBalance(currentBalance + payout);
  };

  const updateBalance = (total: number) => {
    setMoney(total);
    localStorage.setItem("balance", JSON.stringify(total));
  };

  const spinSlots = () => {
    spinAudio.play();

    const newColumns = columns.map((column) => ({
      ...column,
      isSpinning: true,
      stopIndex: Math.floor(Math.random() * SLOT_IMAGES.length),
    }));

    setColumns(newColumns);

    newColumns.forEach((column, index) => {
      const timeoutId = setTimeout(
        () => stopColumn(index, column.stopIndex),
        (index + 1) * 1000,
      );
      timeoutsRef.current.push(timeoutId);
    });
  };

  const handleSpin = useCallback(() => {
    const currentBalance = useStoreMoneyAccount.getState().data;

    if (bet > currentBalance) {
      alert("Insufficient balance!");
      return;
    }

    resultCalculatedRef.current = false;
    updateBalance(currentBalance - bet);
    spinSlots();
  }, [bet, spinSlots, updateBalance]);

  const stopColumn = useCallback(
    (columnIndex: number, stopIndex: number) => {
      setColumns((prevColumns) => {
        const updatedColumns = [...prevColumns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          isSpinning: false,
          stopIndex,
        };

        const allStopped = updatedColumns.every((col) => !col.isSpinning);

        if (allStopped && !resultCalculatedRef.current) {
          resultCalculatedRef.current = true;
          spinAudio.pause();
          spinAudio.currentTime = 0;

          setTimeout(() => {
            const centralRow = updatedColumns.map((col) => {
              const centralIndex = (col.stopIndex + 1) % SLOT_IMAGES.length;
              return col.images[centralIndex];
            });

            const combination = getCombination(centralRow);
            const payout = calculatePayout(combination as CombinationKeys, bet);

            handleWin(payout);

            alert(
              `Central Row: ${JSON.stringify(
                centralRow,
              )}\nCombination: ${combination}\nYou bet: ${bet}\nYou won: ${payout}`,
            );
          }, 1100);
        }

        return updatedColumns;
      });
    },
    [bet, handleWin, spinAudio],
  );

  return (
    <div className={styles.slotMachine}>
      <h1>Fortune Animals</h1>
      <div className={styles.slotsContainer}>
        {columns.map((column, index) => (
          <SlotColumn
            key={index}
            images={column.images}
            isSpinning={column.isSpinning}
            stopIndex={column.stopIndex}
            duration={1}
          />
        ))}
      </div>
      <button
        onClick={handleSpin}
        disabled={columns.some((col) => col.isSpinning)}
        className={styles.spinButton}
      >
        {columns.some((col) => col.isSpinning) ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};
