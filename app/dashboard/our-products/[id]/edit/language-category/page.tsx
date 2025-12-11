"use client";

import { useProductEditStore } from "@/app/store/useEditProductStore";
import { useEditStepStore } from "@/app/store/useEditStepStore";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const LanguageCategory: React.FC = () => {
  const { productData, setProductData } = useProductEditStore();
  const { completeStep, nextStep, prevStep } = useEditStepStore();

  const [language, setLanguage] = useState<string>(productData.languageType);
  const [category, setCategory] = useState<string>(productData.category);

  useEffect(() => {
    setLanguage(productData.languageType);
    setCategory(productData.category);
  }, [productData]);

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setProductData({ languageType: lang });
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setProductData({ category: cat });
  };

  const handleContinue = () => {
    if (isStepCompleted()) {
      completeStep(0);
      nextStep();
    } else {
      toast("Please fill all required fields.");
    }
  };

  const isStepCompleted = () => {
    return language && category;
  };

  return (
    <div className="pt-2">
      <div className="p-2 sm:p-6 border rounded-[20px] bg-white w-full mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-[10px]">
          What language will you use to write your activity?{" "}
          <span className="text-red-500">*</span>
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          You can now write your activity in English, Spanish, or German. We'll
          take care of all the translations.
        </p>

        {/* Language Selection */}
        <div className="flex flex-wrap gap-4 mb-8">
          {["English", "Deutsch", "Español"].map((lang) => (
            <button
              key={lang}
              className={`p-3 w-[160px] h-[48px] rounded-[12px] font-semibold transition flex items-center gap-3 ${
                language === lang
                  ? " bg-gray-100 text-[#296626] border"
                  : "bg-gray-100 text-gray-600 hover:text-[#296626]"
              }`}
              onClick={() => handleLanguageSelect(lang)}
            >
              <div
                className={`w-5 h-5 flex justify-center items-center rounded-full border-[2.5px] transition ${
                  language === lang
                    ? "border-[#296626] bg-white"
                    : "border-gray-400 bg-white"
                }`}
              >
                <div
                  className={`w-[10px] h-[10px] rounded-full transition ${
                    language === lang ? "bg-[#296626]" : "bg-transparent"
                  }`}
                ></div>
              </div>
              {lang}
            </button>
          ))}
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mb-[10px]">
          What type of activity are you creating?{" "}
          <span className="text-red-500">*</span>
        </h2>
        <p className="text-[#010A15B2] mb-4 text-sm">
          You can now write your activity in English, Spanish, or German. We'll
          take care of all the translations.
        </p>

        {/* Category Selection */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {[
            {
              label: "Attraction ticket",
              description: "Like entry to a landmark, theme park, show",
            },
            {
              label: "Tour",
              description: "Like a guided walking tour, day trip, city cruise",
            },
            {
              label: "City card",
              description:
                "A pass for multiple attractions or transport within a city",
            },
            {
              label: "Transfer",
              description:
                "Transportation services like airport or bus transfers",
            },
            {
              label: "Rental",
              description:
                "Experience rentals like costumes, adventure equipment, unique vehicle drives",
            },
            {
              label: "Hop-on hop-off ticket",
              description: "Entry to a hop-on hop-off bus or boat",
            },
          ].map((cat) => (
            <label
              key={cat.label}
              className={`flex items-center w-full space-x-3 p-4 rounded-lg cursor-pointer transition ${
                category === cat.label ? "" : "bg-white   "
              }`}
              onClick={() => handleCategorySelect(cat.label)}
            >
              {/* radio button  */}
              <div
                className={`w-5 h-5 flex justify-center items-center rounded-full border-[2.5px] transition ${
                  category === cat.label
                    ? "border-[#296626] bg-white"
                    : "border-gray-400 bg-white"
                }`}
              >
                <div
                  className={`w-[10px] h-[10px] rounded-full transition ${
                    category === cat.label ? "bg-[#296626]" : "bg-transparent"
                  }`}
                ></div>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-[15px] ${
                    category === cat.label
                      ? "text-[#296626]"
                      : "text-[#010A15B2]"
                  }`}
                >
                  {cat.label}
                </span>
                <span className="text-sm font-[400] text-[#010A15B2]">
                  {cat.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-[22px] mt-6 my-6">
        <button
          onClick={prevStep}
          className="px-6 py-4 h-[38px] flex items-center justify-center text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-4  h-[38px] justify-center bg-black text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center"
        >
          Save & Continue
          {/* <span className="ml-2">&rarr;</span> */}
        </button>
      </div>
    </div>
  );
};

export default LanguageCategory;
