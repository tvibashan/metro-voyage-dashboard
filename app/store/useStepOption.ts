import { create } from "zustand";

interface StepStore {
  step: number;
  optioncompletedSteps: Set<number>;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  completeStep: (step: number) => void;
}

const loadCompletedSteps = (): Set<number> => {
  if (typeof window !== "undefined") {
    const storedSteps = localStorage.getItem("optioncompletedSteps");
    if (storedSteps) {
      return new Set(JSON.parse(storedSteps));
    }
  }
  return new Set<number>();
};

const saveOptionCompletedSteps = (optioncompletedSteps: Set<number>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("optioncompletedSteps", JSON.stringify(Array.from(optioncompletedSteps)));
  }
};

export const useOptionStepStore = create<StepStore>((set, get) => ({
  step: 0,
  optioncompletedSteps: loadCompletedSteps(),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setStep: (step) => set({ step }),
  completeStep: (step) => {
    const newCompletedSteps = new Set(get().optioncompletedSteps).add(step);
    saveOptionCompletedSteps(newCompletedSteps);
    set({ optioncompletedSteps: newCompletedSteps });
  },
}));