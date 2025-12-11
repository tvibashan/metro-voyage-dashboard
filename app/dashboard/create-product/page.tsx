"use client";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useStepStore } from "@/app/store/useStepStore";
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
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { useProductStore } from "@/app/store/useProductStore";
import { useOptionStore } from "@/app/store/useOptionStore";

// Dynamically import Icon to avoid SSR issues
const Icon = dynamic(() => import('@iconify/react').then(mod => mod.Icon), {
  ssr: false,
  loading: () => <span className="inline-block w-4 h-4" />,
});

export default function CreateProduct() {
  const [isMounted, setIsMounted] = useState(false);
  const { step, setStep, completedSteps, resetCompletedSteps } = useStepStore();
  const resetProductData = useProductStore((state) => state.resetProductData);
  const resetOptionData = useOptionStore((state) => state.resetOptionData);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stepsInfo = [
    { title: "Language & Category", icon: lan },
    { title: "Main Info", icon: main },
    { title: "Keywords", icon: keyword },
    { title: "Inclusions", icon: inclusion },
    { title: "Extra Info", icon: extra },
    { title: "Options", icon: option },
    { title: "Liability", icon: crown },
  ];

  const steps: JSX.Element[] = [
    <LanguageCategory key="language-category" />,
    <MainInfo key="main-info" />,
    <Keyword key="keyword" />,
    <Inclusions key="inclusions" />,
    <ExtraInfo key="extra-info" />,
    <Options key="options" />,
    <Liability key="liability" />,
  ];

  const handleDeleteForm = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    resetProductData();
    resetOptionData();
    resetCompletedSteps();
    setIsDeleteModalOpen(false);
    toast.success("Form reset successfully!");
    window.location.reload();
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="px-2 sm:px-2 lg:px-2 pt-6 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-6">
          Create Product
        </h1>
        <h1
          onClick={handleDeleteForm}
          className="text-sm text-red-500 mb-6 hover:cursor-pointer hover:text-red-700"
        >
          Reset Form
        </h1>
      </div>

      <div className="flex overflow-x-auto border-b shadow-sm border-gray-200 mb-4 py-2 space-x-[10px]">
        {isMounted && stepsInfo.map((stepInfo, index) => (
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
            {isMounted && completedSteps.has(index) && (
              <Icon icon="mdi:check-circle" className="text-green-500" />
            )}
          </button>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={"form"}
      />

      {/* Step Content */}
      <div className="mt-4">{steps[step]}</div>
    </div>
  );
}