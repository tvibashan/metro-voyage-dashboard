"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { submitEditProduct } from "@/services/productService";
import { toast } from "sonner";
import axiosInstance from "@/axiosInstance";

interface ProductData {
  // language and category
  id: number;
  languageType: string;
  category: string;
  // main info
  title: string;
  metaTitle: string;
  shortDescription?: string;
  reference_code?: string;
  departure_from: string;
  metaDescription: string;
  images?: any[];
  tags: any[];
  delete_images?: number[];
  description: string;
  summarize: { summaryText: string }[];
  basePrice: string;
  basePriceFor: string;
  duration: string;
  location: { address: string }[];
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
  notAllowed: { restriction: string }[];
  mustCarryItems: { item: string }[];
  emergencyContacts: { name: string; phone: string }[];
  bookingInformation: string;
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
  option?: Option; 
  status?: boolean;
  discount_offers?:DiscountOffer[];
  itineraries?: {
    title: string;
    description?: string;
    order: number;
    is_main_stop: boolean;
    latitude: number;
    longitude: number;
  }[];
}

interface ProductStore {
  productData: ProductData;
  setProductData: (data: Partial<ProductData>) => void;
  resetProductData: () => void;
  submitProduct: (id: number, onSuccess?: () => void) => Promise<void>;
  updateProductStatus: (id: number, status: boolean) => Promise<void>;
}

const initialProductData: ProductData = {
  id: 0,
  languageType: "English",
  category: "",
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
  location: [],
  productKeywords: [],
  overviewcards: [],
  images: [],
  inclusions: [],
  exclusions: [],
  emergencyContacts: [],
  notSuitable: [],
  notAllowed: [],
  mustCarryItems: [],
  itineraries: [],
  tags: [],
  status: false,
};

export const useProductEditStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      productData: initialProductData,
      setProductData: (data) =>
        set((state) => ({ productData: { ...state.productData, ...data } })),
      resetProductData: () => set({ productData: initialProductData }),
      submitProduct: async (id: number, onSuccess?: () => void) => {
        const { productData } = get();
        console.log(productData,"productData")
        const result = await submitEditProduct(
          { ...productData, option: productData?.option?.id },
          id
        );
        if (result.success) {
          toast.success("Product Updated successfully!");
          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.log(result);
          toast.error(result.message);
        }
      },
      updateProductStatus: async (id: number, status: boolean) => {
        try {
          const formData = new FormData();
          formData.append('status', status.toString());

          const response = await axiosInstance.patch(`/shop/products/${id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          
          if (!response.data?.success) throw new Error('Failed to update status');
          
          toast.success("Status updated successfully!");
        } catch (error) {
          console.error('Error updating status:', error);
          toast.error("Failed to update status");
          throw error;
        }
      },
    }),
    {
      name: "product-edit-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
