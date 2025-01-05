import { SLOT_IMAGES } from ".";
import { WINNING_COMBINATIONS } from "./constants";
import { CombinationKeys } from "./types";

export const getCombination = (
  centralRow: { name: string; image: string }[],
) => {
  if (centralRow.every((animal) => animal === centralRow[0])) {
    return `3x${centralRow[0].name}`; // Три одинаковых животных
  }

  return "Mixed"; // Если животные разные
};

export const calculatePayout = (combination: CombinationKeys, bet: number) => {
  const multiplier = WINNING_COMBINATIONS[combination] || 0; // Если нет совпадения, выигрыш равен 0
  return bet * multiplier;
};

export const getRandomImages = () => {
  const shuffled = [...SLOT_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.concat(shuffled); // Удваиваем массив для бесшовной прокрутки
};
