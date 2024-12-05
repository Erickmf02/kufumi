import { createStore } from 'zustand/vanilla';

export interface User {
  id: number,
  name: string,
  username: string
}

export interface Session {
  token: string,
  user: User
}


interface storeState {
  session: Session | undefined
  setSession: (newSession: Session | undefined) => void
}

export const store = createStore<storeState>((set) => ({
  session: undefined,
  setSession: (newSession: Session | undefined) => set({ session: newSession })
}));

