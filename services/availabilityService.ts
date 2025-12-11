import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import { toast } from "sonner";

export const fetchCalanderData = async (
  month: number = 2,
  year: string = ""
): Promise<any[]> => {
  try {
    const response: any = await axiosInstance.get<ApiResponse<any[]>>(
      `${ApiBaseMysql}/shop/availability-summary/`,
      {
        params: {
          month,
          year,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching CalanderData:", error);
    throw error;
  }
};

export const BlockCalanderSlots = async (data: any): Promise<any[]> => {
  try {
    const response: any = await axiosInstance.post<ApiResponse<any[]>>(
      `${ApiBaseMysql}/shop/blockslots/`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error blocking Slots:", error);
    throw error;
  }
};
