import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";

export const fetchReviews = async (
  page: number = 1,
  search: string = "",
  statusFilter: any = ""
): Promise<{
  reviews: IReview[];
  totalPages: number;
  nextPage: string | null;
  prevPage: string | null;
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<IReview>>(
      `${ApiBaseMysql}/shop/reviews/`,
      {
        params: {
          page,
          search,
          rating: statusFilter,
        },
      }
    );

    const totalPages = Math.ceil(response.data.data.count / 10);

    return {
      reviews: response.data.data.results,
      totalPages,
      nextPage: response.data.data.next,
      prevPage: response.data.data.previous,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const fetchReviewDetails = async (id: string): Promise<IReview> => {
  try {
    const response = await axiosInstance.get<any>(
      `${ApiBaseMysql}/shop/reviews/${id}/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw new Error("Failed to fetch booking details.");
  }
};

export const updateReviewDetails = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.patch(
      `${ApiBaseMysql}/shop/reviews/${id}/`,
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


export const deleteReview = async (id: any): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/shop/reviews/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  } 
};