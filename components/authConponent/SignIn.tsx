"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login } from "@/services/authService";
import { toast } from "sonner";
import Image from "next/image";

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      toast("SignIn Successful");
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      router.push("/");
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080710] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative w-[400px] h-[520px] bg-white/10 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-8 flex flex-col items-center"
      >
        <Image
          src={"/assets/logo.png"}
          alt="logo"
          height={60}
          width={120}
          className=""
        />
        <label
          htmlFor="username"
          className="w-full mt-6 text-sm text-white font-medium"
        >
          Enter Email
        </label>
        <input
          type="email"
          placeholder="Email"
          id="username"
          name="email"
          onChange={handleInputChange}
          className="w-full h-12 mt-2 bg-white/10 text-white rounded px-3 text-sm placeholder-gray-300 outline-none"
        />

        <label
          htmlFor="password"
          className="w-full mt-6 text-sm text-white font-medium"
        >
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          onChange={handleInputChange}
          className="w-full h-12 mt-2 bg-white/10 text-white rounded px-3 text-sm placeholder-gray-300 outline-none"
        />

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full mt-6 py-3 bg-white text-[#080710] rounded text-lg font-semibold hover:bg-gray-200 transition"
        >
          {loading ? "Loading..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
