import axios from "axios";
import Cookies from "js-cookie";
import { ApiBaseMysql } from "@/Helper/ApiBase";

const axiosInstance = axios.create({
  baseURL: ApiBaseMysql,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to verify token
const verifyToken = async (token: string) => {
  try {
    await axios.post(`${ApiBaseMysql}/auth/jwt/verify/`, { token });
    return true;
  } catch (error) {
    return false;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken =
      Cookies.get("access_token") || localStorage.getItem("access_token");
    if (accessToken) {
      const isValid = await verifyToken(accessToken);
      if (!isValid) {
        Cookies.remove("access_token");
        localStorage.removeItem("access_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(new Error("Invalid token"));
      }
      config.headers.Authorization = `JWT ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      Cookies.remove("access_token");
      localStorage.removeItem("access_token");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
