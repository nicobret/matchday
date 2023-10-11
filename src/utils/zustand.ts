import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'

type Store = {
    session: Session | null
    setSession: (session: Session | null) => void
}

const useStore = create<Store>()((set) => ({
    session: null,
    setSession: (session) => set({ session: session }),
}))

export default useStore