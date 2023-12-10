import { clubType } from "@/scenes/clubs/useClubs";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type Store = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  clubs: clubType[] | null;
  setClubs: (clubs: clubType[] | null) => void;
};

const useStore = create<Store>()((set) => ({
  session: null,
  setSession: (session) => set({ session: session }),
  clubs: null,
  setClubs: (clubs) => set({ clubs: clubs }),
}));

export default useStore;
