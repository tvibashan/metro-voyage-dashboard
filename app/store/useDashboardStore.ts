// app/store.ts
import { fetchDashboardData } from "@/services/dashboadService";
import { create } from "zustand";

interface ApiData {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: (day?:string) => Promise<void>;
}

export const useDasboardStore = create<ApiData>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async (day?: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDashboardData(day);
      set({ data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));