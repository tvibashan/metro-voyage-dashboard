import { create } from "zustand";

interface StepStore {
  step: number;
  completedSteps: Set<number>;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  completeStep: (step: number) => void;
  resetCompletedSteps: () => void; // Add this function
}

const loadCompletedSteps = (): Set<number> => {
  if (typeof window !== "undefined") {
    const storedSteps = localStorage.getItem("completedSteps");
    if (storedSteps) {
      return new Set(JSON.parse(storedSteps));
    }
  }
  return new Set<number>();
};

const saveCompletedSteps = (completedSteps: Set<number>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("completedSteps", JSON.stringify(Array.from(completedSteps)));
  }
};

const clearCompletedSteps = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("completedSteps");
  }
};

export const useStepStore = create<StepStore>((set, get) => ({
  step: 0,
  completedSteps: loadCompletedSteps(),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setStep: (step) => set({ step }),
  completeStep: (step) => {
    const newCompletedSteps = new Set(get().completedSteps).add(step);
    saveCompletedSteps(newCompletedSteps);
    set({ completedSteps: newCompletedSteps });
  },
  resetCompletedSteps: () => {
    clearCompletedSteps(); // Clear from localStorage
    set({ completedSteps: new Set<number>() }); // Reset in state
  },
}));