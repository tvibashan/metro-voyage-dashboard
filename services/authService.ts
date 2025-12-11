// services/authService.ts
import axios from "axios";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/axiosInstance";

const apiBaseURL = "https://api.metro.voyage";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${ApiBaseMysql}/auth/jwt/create/`, {
      email,
      password,
    });
    const { access } = response.data.data;
    Cookies.set("access_token", access);

    const decodedToken: any = jwtDecode(access);
    if(decodedToken.is_user){
      throw new Error("Unauthorized user");
    }
    Cookies.set("user_id", decodedToken.user_id);
    Cookies.set("email", decodedToken.email);

    return access;
  } catch (err:any) {
    throw new Error(err.response?.data?.message || "An error occurred during login");
  }
};

export const continueWithGoogle = async (redirectUri: string) => {
  try {
    const res = await axios.get(`${apiBaseURL}/auth/o/google-oauth2/?redirect_uri=${redirectUri}`);
    return res.data.data.authorization_url;
  } catch (err) {
    throw new Error("An error occurred while initiating Google OAuth");
  }
};

export const handleGoogleCallback = async (state: string, code: string) => {
  try {
    const res = await axios.post(`${apiBaseURL}/auth/o/google-oauth2/?state=${state}&code=${code}`);
    const token = res.data.data.access;
    Cookies.set("access_token", token);

    const decodedToken: any = jwtDecode(token);
    Cookies.set("user_id", decodedToken.user_id);
    Cookies.set("email", decodedToken.email);

    return token;
  } catch (error) {
    throw new Error("An error occurred during Google callback");
  }
};


export const verifyJWT = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.post("/jwt/verify/", {
      token: Cookies.get("access_token"),
    });
    return response.status === 200;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return false;
  }
};