"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { submitProduct } from "@/services/productService";
import { toast } from "sonner";
import { useStepStore } from "./useStepStore";

interface ProductData {
  // language and category
  languageType?: string;
  category?: string;
  // main info
  title: string;
  metaTitle?: string;
  shortDescription?: string;
  reference_code?: string;
  departure_from?: string;
  metaDescription?: string;
  images?: any[];
  tags: any[];
  description: string;
  summarize: { summaryText: string }[];
  basePrice: string;
  basePriceFor?: string;
  duration?: string;
  location?: { address: string }[];
  // keywords
  productKeywords: { keyword: string }[];
  overviewcards: {
    title: string;
    subtitle: string;
    backgroundColor?: string;
    icon: string;
  }[];
  // options
  notSuitable: { condition: string }[];
  itineraries?: {
    title: string;
    description?: string;
    order: number;
    is_main_stop: boolean;
    latitude: number;
    longitude: number;
  }[];
  notAllowed: { restriction: string }[];
  mustCarryItems: { item: string }[];
  emergencyContacts: { name: string; phone: string }[];
  bookingInformation: string;
  options: { name: string }[];
  // inclusion
  inclusions: { name: string }[];
  exclusions: { name: string }[];
  isFoodIncluded: boolean;
  isTransportIncluded: boolean;
  // other
  whoWillGuide?: string;
  cancellationPolicy: string;
  contactInformation: string;
  termsAndConditions: string;
  option?: number;
  status?: boolean;
}

interface ProductStore {
  productData: ProductData;
  setProductData: (data: Partial<ProductData>) => void;
  resetProductData: () => void;
  submitProduct: () => Promise<boolean>;
}

const initialProductData: ProductData = {
  languageType: "English",
  category: "Tour",
  whoWillGuide: "",
  title: "",
  metaTitle: "",
  departure_from: "",
  metaDescription: "",
  description: "",
  basePrice: "",
  basePriceFor: "",
  cancellationPolicy: "",
  duration: "",
  contactInformation: "",
  termsAndConditions: "",
  bookingInformation: "",
  isFoodIncluded: false,
  isTransportIncluded: false,
  summarize: [],
  itineraries: [],
  location: [],
  productKeywords: [],
  overviewcards: [],
  images: [],
  inclusions: [],
  exclusions: [],
  emergencyContacts: [],
  options: [],
  notSuitable: [],
  notAllowed: [],
  mustCarryItems: [],
  tags: [],
  status: false,
};
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      productData: initialProductData,
      setProductData: (data) =>
        set((state) => ({ productData: { ...state.productData, ...data } })),
      resetProductData: () => set({ productData: initialProductData }),
      submitProduct: async () => {
        const { productData } = get();
        try {
          const result = await submitProduct(productData);
          if (result.success) {
            toast.success("Product Created successfully!");
            get().resetProductData();
            return true;
          }
          toast.error(result.message);
          return false;
        } catch (error) {
          toast.error("Failed to create product");
          return false;
        }
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
