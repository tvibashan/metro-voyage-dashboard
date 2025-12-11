"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { submitOption } from "@/services/productService";
import { toast } from "sonner";
import { useProductStore } from "./useProductStore";

interface OptionStore {
  optionData: OptionData;
  setOptionData: (data: Partial<OptionData>) => void;
  resetOptionData: () => void;
  submitOption: () => Promise<void>;
}

const initialOptionData: OptionData = {
  name: "",
  valid_for: 1,
  maximum_group_size: 1,
  availabilities: [],
};

export const useOptionStore = create<OptionStore>()(
  persist(
    (set, get) => ({
      optionData: initialOptionData,
      setOptionData: (data) =>
        set((state) => ({ optionData: { ...state.optionData, ...data } })),
      resetOptionData: () => set({ optionData: initialOptionData }),
      submitOption: async () => {
        const { optionData } = get();
        const result:any = await submitOption(optionData);
        if (result.success) {
          toast("Option created successfully");
          useProductStore.getState().setProductData({ option: result?.data?.data?.id });
          get().resetOptionData();
        } else {
          toast("Error submitting product");
        }
      },
    }),
    {
      name: "option-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
