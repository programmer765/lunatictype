import { create } from "zustand";

interface HomeStore {
  isHome: boolean;
  setIsHome: (isHome: boolean) => void;
}

const useHomeStore = create<HomeStore>((set) => ({
    isHome: false,
    setIsHome: (isHome: boolean) => set({ isHome }),
}));

export default useHomeStore;