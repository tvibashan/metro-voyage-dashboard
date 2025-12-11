"use client";
import React, { useState, useEffect, use } from "react";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import axiosInstance from "@/axiosInstance";
import { Icon } from "@iconify/react";
import {
  fetchCustomerDetails,
  updateCustomerDetails,
} from "@/services/userService";
import { toast } from "sonner";

export default function CustomerDetailsEdit({ params }: any) {
  const unwrappedparams: any = use(params);
  const [user, setUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    blood_group: "",
    image: "",
  });
  const [images, setImages] = useState<{ url: string; file?: File }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchCustomerDetails(unwrappedparams.id);
        if (data) {
          setUser(data);
          if (data.image) {
            setImages([{ url: data.image }]);
          }
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [unwrappedparams.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("email", user.email);
      formData.append("address", user.address);
      formData.append("city", user.city);
      formData.append("phone", user.phone);
      formData.append("country", user.country);
      formData.append("date_of_birth", user.date_of_birth);
      formData.append("blood_group", user.blood_group);

      images.forEach((image, index) => {
        if (image.file) {
          formData.append("image", image.file);
        }
      });

      const data = await updateCustomerDetails(unwrappedparams.id, formData);

      if (data.success) {
        toast("User updated successfully!");
      } else {
        setError("Failed to update user.");
      }
    } catch (err) {
      setError("An error occurred while updating user.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg px-8 py-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Edit User Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-white border rounded-[20px] p-6">
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-32 h-24 border rounded-[20px] flex items-center justify-center bg-gray-100"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-700"
                  >
                    <Icon
                      icon="bitcoin-icons:cross-filled"
                      className="text-white text-sm"
                    />
                  </button>
                </div>
              ))}
              {/* Upload Button */}
              <label className="w-32 h-24 border rounded-[20px] flex items-center justify-center bg-gray-200 hover:bg-gray-100 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
                <Icon icon="tdesign:add" className="text-2xl text-gray-500" />
              </label>
            </div>
          </div>

          {/* User Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={user.date_of_birth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={user.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <input
                type="text"
                name="blood_group"
                value={user.blood_group}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
