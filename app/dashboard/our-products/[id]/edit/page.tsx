"use client";
import React, { useEffect, useState, use } from "react";
import { Icon } from "@iconify/react";
import LanguageCategory from "./language-category/page";
import MainInfo from "./main-info/page";
import Keyword from "./keyword/page";
import Inclusions from "./inclusions/page";
import ExtraInfo from "./extra-info/page";
import Options from "./options/page";
import lan from "/public/icons/lan.png";
import main from "/public/icons/main.png";
import keyword from "/public/icons/keyword.png";
import inclusion from "/public/icons/inclusion.png";
import extra from "/public/icons/extra.png";
import option from "/public/icons/option.png";
import crown from "/public/icons/crown.png";
import Image from "next/image";
import Liability from "./liability/page";
import { toast } from "sonner";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import axios from "axios";
import { useEditStepStore } from "@/app/store/useEditStepStore";
import { useProductEditStore } from "@/app/store/useEditProductStore";
import Offer from "./offers/page";

interface ProductDetails {
  id: number;
  summarize: { id: number; summaryText: string }[];
  location: { id: number; address: string }[];
  productKeywords: { id: number; keyword: string }[];
  images: { id: number; url: string }[];
  inclusions: { id: number; name: string }[];
  exclusions: { id: number; name: string }[];
  emergencyContacts: { id: number; name: string; phone: string }[];
  notSuitable: { id: number; condition: string }[];
  notAllowed: { id: number; restriction: string }[];
  mustCarryItems: { id: number; item: string }[];
  options: Option;
  languageType: string;
  category: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  basePrice: string;
  cancellationPolicy: string;
  departure_from: string;
  duration: string;
  contactInformation: string;
  termsAndConditions: string;
  bookingInformation: string;
  status: boolean;
  isFoodIncluded: boolean;
  isTransportIncluded: boolean;
  createdAt: string;
  updatedAt: string;
}


export default function ProductDetailsEdit({ params }: any) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const unwrappedParams: any = use(params);
  const { step, setStep, nextStep, completedSteps } = useEditStepStore();

  const stepsInfo = [
    { title: "Language & Category", icon: lan },
    { title: "Main Info", icon: main },
    { title: "Keywords", icon: keyword },
    { title: "Inclusions", icon: inclusion },
    { title: "Extra Info", icon: extra },
    { title: "Options", icon: option },
    { title: "Offer", icon: crown },
    { title: "Liability", icon: crown },
  ];
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `${ApiBaseMysql}/shop/products/${unwrappedParams.id}/`
      );
      setProduct(response.data.data);
      useProductEditStore.getState().setProductData(response.data.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps: JSX.Element[] = [
    <LanguageCategory key="language-category" />,
    <MainInfo key="main-info" />,
    <Keyword key="keyword" />,
    <Inclusions key="inclusions" />,
    <ExtraInfo key="extra-info" />,
    <Options key="options" />,
    <Offer key="offer" />, // Pass fetchProductDetails as a prop
    <Liability key="liability" fetchProductDetails={fetchProductDetails} />, // Pass fetchProductDetails as a prop
  ];


  useEffect(() => {
    fetchProductDetails();
  }, [unwrappedParams.id]);

  return (
    <div className="px-2 sm:px-2 lg:px-2 pt-6 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-6">
          Edit Product
        </h1>
      </div>

      <div className="flex overflow-x-auto border-b shadow-sm border-gray-200 mb-4 py-2 space-x-[10px]">
        {stepsInfo.map((stepInfo, index) => (
          <button
            key={index}
            className={`flex items-center space-x-2 flex-shrink-0 whitespace-nowrap px-2 sm:px-4 py-2 font-[400] text-sm transition-colors duration-200 ${
              index === step
                ? "bg-[#010A151A] rounded-lg text-black"
                : "text-[#010A15B2] rounded-lg hover:bg-[#010A151A]"
            }`}
            onClick={() => {
              if (completedSteps.has(index)) {
                setStep(index);
              } else if (index === step + 1 && completedSteps.has(step)) {
                setStep(index);
              } else {
                toast("Please complete the current step before proceeding.");
              }
            }}
            disabled={index > step && !completedSteps.has(step)}
          >
            <Image src={stepInfo.icon} alt="icon" width={18} height={18} />
            <span className="text-[15px]">{stepInfo.title}</span>
            {completedSteps.has(index) && (
              <Icon icon="mdi:check-circle" className="text-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-4">{steps[step]}</div>
    </div>
  );
}