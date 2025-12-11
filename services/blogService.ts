import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `${ApiBaseMysql}/blog/categories/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${ApiBaseMysql}/blog/categories/${id}/`
      );
      return response.data;
    } catch (error) {
      throw new Error("An error occurred while creating tags.");
    }
  };