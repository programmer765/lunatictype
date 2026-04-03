import { create } from "zustand";
import User from "../types/User";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  userIsLoading: boolean;
  setUserIsLoading: (userIsLoading: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
    userIsLoading: true,
    setUserIsLoading: (userIsLoading: boolean) => set({ userIsLoading }),
}));

export default useUserStore;