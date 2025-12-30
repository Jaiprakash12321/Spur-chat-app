import { create } from 'zustand'

type loadingState = {
    loading: boolean,
    setLoading: (value: boolean) => void
}

type ChatState = {
  answer: string;
  loading: boolean;
  setAnswer: (answer: string) => void;
  setLoading: (loading: boolean) => void;
  appendAnswer: (chunk: string) => void;
  reset: () => void;
}

export const useLoadingState = create<loadingState>((set, get) => ({
     loading: false,
     setLoading: (value: boolean) => {
        set({ loading: value})
     }
}))

export const useChatStore = create<ChatState>((set, get) => ({
  answer: "",
  loading: false,
  setAnswer: (answer) => set({ answer }),
  setLoading: (loading) => set({ loading }),
  appendAnswer: (chunk: string) => set({ answer: get().answer + chunk }),
  reset: () => set({ answer: "", loading: false }),
}))