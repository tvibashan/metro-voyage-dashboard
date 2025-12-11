import { create } from "zustand";

interface EditStepStore {
  step: number;
  completedSteps: Set<number>;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  completeStep: (step: number) => void;
}

const initializeCompletedSteps = (totalSteps: number): Set<number> => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);
  return new Set(steps);
};

export const useEditStepStore = create<EditStepStore>((set) => ({
  step: 0,
  completedSteps: initializeCompletedSteps(7),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setStep: (step) => set({ step }),
  completeStep: (step) =>
    set((state) => ({
      completedSteps: new Set(state.completedSteps).add(step),
    })),
}));