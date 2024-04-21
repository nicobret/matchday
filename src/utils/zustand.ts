import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type Store = {
  user: User;
  setUser: (user: User) => void;
};

const useStore = create<Store>()((set) => ({
  user: null,
  setUser: (user) => set({ user: user }),
}));

export default useStore;
