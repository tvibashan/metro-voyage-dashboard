import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";

export const fetchCustomers = async (
  page: number = 1,
  search: string = ""
): Promise<{
  customers: Customer[];
  totalPages: number;
  nextPage: string | null;
  prevPage: string | null;
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `${ApiBaseMysql}/users/dashboard-users/`,
      {
        params: {
          page,
          search,
        },
      }
    );

    const totalPages = Math.ceil(response.data.data.count / 10);

    return {
      customers: response.data.data.results,
      totalPages,
      nextPage: response.data.data.next,
      prevPage: response.data.data.previous,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
export const fetchCustomerDetails = async (id: string, params?: { month?: string; year?: string }) => {
  try {
    const response = await axiosInstance.get<any>(
      `${ApiBaseMysql}/users/dashboard-users/${id}/`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw new Error("Failed to fetch customer details.");
  }
};

export const updateCustomerDetails = async (
  userId: string,
  formData: FormData
) => {
  try {
    const response = await axiosInstance.patch(
      `${ApiBaseMysql}/users/dashboard-users/${userId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An error occurred while updating user.");
  }
};

export const deleteCustomer = async (id: any): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/users/dashboard-users/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } 
};