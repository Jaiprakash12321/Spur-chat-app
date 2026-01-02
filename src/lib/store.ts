import { create } from 'zustand'

type loadingState = {
    loading: boolean,
    setLoading: (value: boolean) => void
}

// type ChatState = {
//   answer: string;
//   loading: boolean;
//   setAnswer: (answer: string) => void;
//   setLoading: (loading: boolean) => void;
//   appendAnswer: (chunk: string) => void;
//   reset: () => void;
// }

export const useLoadingState = create<loadingState>((set, get) => ({
     loading: false,
     setLoading: (value: boolean) => {
        set({ loading: value})
     }
}))

// export const useChatStore = create<ChatState>((set, get) => ({
//   answer: "",
//   loading: false,
//   setAnswer: (answer) => set({ answer }),
//   setLoading: (loading) => set({ loading }),
//   appendAnswer: (chunk: string) => set({ answer: get().answer + chunk }),
//   reset: () => set({ answer: "", loading: false }),
// }))

type ChatStore = {
  answers: Record<string, string>;
  loading: Record<string, boolean>;

  appendAnswer: (chatId: string, chunk: string) => void;
  setLoading: (chatId: string, value: boolean) => void;
  resetAnswer: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  answers: {},
  loading: {},

  appendAnswer: (chatId, chunk) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [chatId]: (state.answers[chatId] ?? "") + chunk,
      },
    })),

  setLoading: (chatId, value) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [chatId]: value,
      },
    })),
    
     resetAnswer: (chatId: string) =>
      set((state) => ({
        answers: { ...state.answers, [chatId]: "" },
    })),
}))