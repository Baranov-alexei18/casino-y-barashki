import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Select } from "antd";
import { motion } from "motion/react";

import winSound from "@assets/audio/fortune-animals/win.mp3";
import loseSound from "@assets/audio/fortune-animals/lose.mp3";
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

  const [bet, setBet] = useState(200);
  const [displayedPayout, setDisplayedPayout] = useState<number | null>(null);
  const [columns, setColumns] = useState([
    { images: getRandomImages(), isSpinning: false, stopIndex: 0 },
    { images: getRandomImages(), isSpinning: false, stopIndex: 0 },
    { images: getRandomImages(), isSpinning: false, stopIndex: 0 },
  ]);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const resultCalculatedRef = useRef(false);

  const spinAudio = new Audio(spinSound);
  const winAudio = new Audio(winSound);
  const loseAudio = new Audio(loseSound);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const betsOptions = useMemo(() => {
    return [
      { value: "100", label: "100", disabled: balance < 100 },
      { value: "200", label: "200", disabled: balance < 200 },
      { value: "300", label: "300", disabled: balance < 300 },
      { value: "500", label: "500", disabled: balance < 500 },
      { value: "1000", label: "1000", disabled: balance < 1000 },
      { value: "2000", label: "2000", disabled: balance < 2000 },
      { value: "5000", label: "5000", disabled: balance < 5000 },
    ];
  }, [balance]);

  const handleWin = (payout: number) => {
    const currentBalance = useStoreMoneyAccount.getState().data;

    if (payout > 0) {
      winAudio.play(); // Включаем звук выигрыша
      animatePayout(payout);
    } else {
      loseAudio.play(); // Включаем звук проигрыша
    }
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
          }, 1100);
        }

        return updatedColumns;
      });
    },
    [bet, handleWin, spinAudio],
  );

  const handleChange = (value: string) => {
    setBet(Number(value));
  };

  const animatePayout = (payout: number) => {
    setDisplayedPayout(0);

    let currentPayout = 0;
    const increment = Math.ceil(payout / 10);

    const interval = setInterval(() => {
      currentPayout += increment;
      if (currentPayout >= payout) {
        clearInterval(interval);
        setDisplayedPayout(payout);

        setTimeout(() => {
          setDisplayedPayout(null);
          const currentBalance = useStoreMoneyAccount.getState().data;
          updateBalance(currentBalance + payout);
        }, 2000);
      } else {
        setDisplayedPayout(currentPayout);
      }
    }, 100);
  };

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
      {displayedPayout !== null && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={styles.payoutOverlay}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            +{displayedPayout}
          </motion.div>
        </motion.div>
      )}

      <div className={styles.mainSlotWrapper}>
        <Select
          defaultValue="200"
          className={styles.selectWrapper}
          popupClassName={styles.selectMenuWrapper}
          onChange={handleChange}
          options={betsOptions}
        />
        <button
          onClick={handleSpin}
          disabled={columns.some((col) => col.isSpinning)}
          className={styles.spinButton}
        >
          {columns.some((col) => col.isSpinning) ? "Spinning..." : "Spin"}
        </button>
      </div>
    </div>
  );
};
