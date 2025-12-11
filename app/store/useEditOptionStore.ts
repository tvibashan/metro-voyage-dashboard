"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { submitEditOption } from "@/services/productService";
import { toast } from "sonner";

interface OptionStore {
  optionData: OptionData;
  setOptionData: (data: Partial<OptionData>) => void;
  resetOptionData: () => void;
  submitOption: (id: number, onSuccess?: () => void) => Promise<void>;
}

const initialOptionData: OptionData = {
  name: "",
  valid_for: 1,
  availabilities: [],
};

export const useEditOptionStore = create<OptionStore>()(
  persist(
    (set, get) => ({
      optionData: initialOptionData,
      setOptionData: (data) =>
        set((state) => ({ optionData: { ...state.optionData, ...data } })),
      resetOptionData: () => set({ optionData: initialOptionData }),
      submitOption: async (id: number, onSuccess?: () => void) => {
        const { optionData } = get();
        
        // Create a clean copy of optionData without discount in availabilities
        const cleanOptionData = {
          ...optionData,
          availabilities: optionData.availabilities?.map(availability => {
            const { discount, ...cleanAvailability } = availability;
            return cleanAvailability;
          })
        };
        console.log(cleanOptionData,'cleanOptionData')

        const result = await submitEditOption(cleanOptionData, id);
        console.log(result, "result");
        if (result.success) {
          toast("Option created successfully");
          if (onSuccess) {
            onSuccess();
          }
        } else {
          toast("Error submitting product");
        }
      },
    }),
    {
      name: "option-edit-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
