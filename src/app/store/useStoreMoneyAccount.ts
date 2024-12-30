import { create } from "zustand";

interface StoreState {
  data: number;
  setMoney: (money: number) => void;
}

export const useStoreMoneyAccount = create<StoreState>((set) => ({
  data: 0,
  setMoney: (newData) => set({ data: newData }),
}));
