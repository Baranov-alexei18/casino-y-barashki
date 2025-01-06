import { SLOT_IMAGES } from ".";
import { WINNING_COMBINATIONS } from "./constants";
import { CombinationKeys } from "./types";

export const getCombination = (
  centralRow: { name: string; image: string }[],
) => {
  if (centralRow.every((animal) => animal.name === centralRow[0].name)) {
    return `3x${centralRow[0].name}`;
  }

  if (
    centralRow[0].name === centralRow[1].name ||
    centralRow[1].name === centralRow[2].name ||
    centralRow[0].name === centralRow[2].name
  ) {
    return "2xAny";
  }

  return "None";
};

export const calculatePayout = (combination: CombinationKeys, bet: number) => {
  const multiplier = WINNING_COMBINATIONS[combination] || 0;
  return bet * multiplier;
};

export const getRandomImages = () => {
  const shuffled = [...SLOT_IMAGES].sort(() => Math.random() - 0.5);
  return [...shuffled, ...shuffled, ...shuffled];
};
