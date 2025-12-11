import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";

export const fetchDashboardData = async (
  day?: string
): Promise<{ data: any }> => {
  try {
    const response = await axiosInstance.get(
      `${ApiBaseMysql}/shop/dashboard-data/`,
      {
        params: {
          day,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    // console.error("Error fetching products:", error);
    // throw error;
    return { data: null };
  }
};
