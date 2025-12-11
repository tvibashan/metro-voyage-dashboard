import axios from "axios";
import Cookies from "js-cookie";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import axiosInstance from "@/axiosInstance";
import { extractErrors } from "@/Helper/extractErrors";

const token = Cookies.get("access_token");

const createProductFormData = (productData: any) => {
  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]: any) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((image) => {
        if (image.file instanceof File) {
          formData.append("images", image.file);
        }
      });
    } else if (key === "tags" && Array.isArray(value)) {
      value.forEach((tag: any) => {
        if (tag.id) {
          formData.append("tags", tag.id.toString()); 
        }
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
export const submitProduct = async (productData: any) => {
  try {
    const formData = createProductFormData(productData);

    const response = await axios.post(
      `${ApiBaseMysql}/shop/products/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Failed to submit product" };
    }
  } catch (error: any) {
    console.error("Error submitting product:", error);
    const message = extractErrors(error);
    return { success: false, message };
  }
};
export const submitEditProduct = async (productData: any, id: number) => {
  try {
    const formData = createProductFormData(productData);
    const url = `${ApiBaseMysql}/shop/products/${id}/`;
    const response = await axios.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (response.status === 200 || response.status === 202) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Failed to submit product" };
    }
  } catch (error: any) {
    console.error("Error submitting product:", error);
    const message = extractErrors(error);
    return { success: false, message };
  }
};
export const submitOption = async (productData: any) => {
  try {
    const response = await axiosInstance.post(
      `${ApiBaseMysql}/shop/options/`,
      productData
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Failed to submit product" };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || "Error submitting product",
    };
  }
};

export const submitEditOption = async (productData: any, id: number) => {
  try {
    const response = await axiosInstance.patch(
      `${ApiBaseMysql}/shop/options/${id}/`,
      productData
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Failed to submit option" };
    }
  } catch (error: any) {
    console.error("Error submitting option:", error);
    const message = extractErrors(error);
    return { success: false, message };
  }
};

export const fetchOptions = async (): Promise<IOption[]> => {
  try {
    const response = await axios.get(`${ApiBaseMysql}/shop/options/`);
    return response.data.data;
  } catch (error) {
    return [];
  }
};

export const deleteOption = async (id: any): Promise<any> => {
  try {
    const response = await axios.delete(`${ApiBaseMysql}/shop/options/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting option:", error);
    throw error;
  }
};
export const fetchProducts = async (
  searchQuery: string,
  filters: Record<string, boolean>,
  ordering: string,
  page: number,
  pageSize: number
): Promise<{ products: Product[]; totalPages: number }> => {
  try {
    const response = await axios.get(`${ApiBaseMysql}/shop/products/`, {
      params: {
        search: searchQuery,
        ...filters,
        ordering,
        page,
        page_size: pageSize,
      },
    });

    const totalPages = Math.ceil(response.data.data.count / pageSize);

    return {
      products: response.data.data.results,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteProduct = async (id: any): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/shop/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchTags = async (search = "") => {
  try {
    const response = await axiosInstance.get<ApiResponse<Tag[]>>(
      `${ApiBaseMysql}/shop/tags/`,
      {
        params: { search }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("An error occurred while fetching tags.");
  }
};

export const createTags = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${ApiBaseMysql}/shop/tags/`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An error occurred while creating tags.");
  }
};

export const deleteTag = async (id: number) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiBaseMysql}/shop/tags/${id}/`
    );
    return response.data;
  } catch (error) {
    throw new Error("An error occurred while creating tags.");
  }
};

// export const updateTag = async (id: number, data: Tag) => {
//   try {
//     const response = await axiosInstance.patch(
//       `${ApiBaseMysql}/shop/tags/${id}`,
//       data
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error("An error occurred while creating tags.");
//   }
// };
