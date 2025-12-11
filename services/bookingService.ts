import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";

export const fetchBookings = async (params: {
  page: number;
  searchQuery?: string;
  statusFilter?: string;
  productIdFilter?: string;
  departureDateFilter?: string;
  ordering?: string;
  year?: number;
  month?: number;
  pageSize?: number;
}) => {
  try {
    const response = await axiosInstance.get<ApiResponse<IBooking>>(
      `${ApiBaseMysql}/shop/bookings/`,
      {
        params: {
          search: params?.searchQuery,
          status: params?.statusFilter,
          product_id: params?.productIdFilter,
          exact_departure_date: params?.departureDateFilter,
          ordering: params?.ordering,
          page: params?.page,
          page_size: params?.pageSize,
          year: params?.year,
          month: params?.month,
        },
      }
    );

    const totalPages = Math.ceil(response.data.data.count / 10);

    return {
      bookings: response.data.data.results,
      totalPages,
      nextPage: response.data.data.next,
      prevPage: response.data.data.previous,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const downloadBooking = async (
  booking: number,
  format: "excel" | "pdf",
  pdf_type: "invoice" | "booking"
) => {
  const response = await axiosInstance.post(
    "/shop/invoices-download/",
    {
      booking,
      format,
      pdf_type,
    },
    { responseType: "blob" }
  );
  return response;
};

export const fetchBookingDetails = async (id: string): Promise<IBooking> => {
  try {
    const response = await axiosInstance.get<any>(
      `${ApiBaseMysql}/shop/bookings/${id}/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw new Error("Failed to fetch booking details.");
  }
};

export const updateBookingDetails = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.patch(
      `${ApiBaseMysql}/shop/bookings/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while updating user.");
  }
};

export const deleteBooking = async (id: any): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/shop/bookings/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
