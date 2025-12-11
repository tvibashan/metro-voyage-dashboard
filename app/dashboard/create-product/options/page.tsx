"use client";
import React, { useState, useEffect } from "react";
import { useStepStore } from "@/app/store/useStepStore";
import { useProductStore } from "@/app/store/useProductStore";
import { Icon } from "@iconify/react";
import OptionsModal from "@/components/modals/OptionsModal";
import MeetingPoint from "@/components/modals/MeetingPointModal";
import DurationValidity from "@/components/modals/DurationValidityModal";
import { deleteOption, fetchOptions } from "@/services/productService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ScheduleModal from "@/components/modals/ScheduleModal";
import ReviewModal from "@/components/modals/ReviewModal";
import OptionSummaryModal from "@/components/modals/OptionSummaryModal";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import GoogleMapsLoader from "@/components/GoogleMapsLoader";

interface IOption {
  id: number;
  name: string;
  description: string;
}

const Option: React.FC = () => {
  const { nextStep, prevStep, completeStep } = useStepStore();
  const { productData, setProductData } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "OptionsSetup" | "Duration" | "MeetingPoint" | "Schedule" | "Review"
  >("OptionsSetup");
  const [options, setOptions] = useState<IOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);
  const [showPreviousOptions, setShowPreviousOptions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      const fetchedOptions = await fetchOptions();
      setOptions(fetchedOptions);
    };
    loadOptions();
  }, [isModalOpen]);

  useEffect(() => {
    if (productData?.option) {
      const selected = options?.find(
        (option) => option.id === productData.option
      );
      setSelectedOption(selected || null);
    }
  }, [productData.option, options]);

  const handleCreateNewOptions = () => {
    setIsModalOpen(true);
    setActiveModal("OptionsSetup");
    setShowPreviousOptions(false);
  };

  const handleUsePreviousOptions = () => {
    setShowPreviousOptions(true);
    setIsModalOpen(false);
  };

  const handleNextModal = () => {
    if (activeModal === "OptionsSetup") {
      setActiveModal("Duration");
    } else if (activeModal === "Duration") {
      setActiveModal("MeetingPoint");
    } else if (activeModal === "MeetingPoint") {
      setActiveModal("Schedule");
    } else if (activeModal === "Schedule") {
      setActiveModal("Review");
    } else if (activeModal === "Review") {
      setIsModalOpen(false);
    }
  };

  const handleSelectOption = (option: IOption) => {
    setSelectedOption(option);
    setProductData({ option: option.id });
  };

  const isStepCompleted = () => {
    return selectedOption !== null;
  };

  const handleContinue = () => {
    if (isStepCompleted()) {
      completeStep(5);
      nextStep();
    } else {
      toast("Please select an option before proceeding.");
    }
  };

  const handleDeleteOption = async (id: number) => {
    setOptionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (optionToDelete) {
      try {
        await deleteOption(optionToDelete);
        setOptions((prevOptions) =>
          prevOptions.filter((option) => option.id !== optionToDelete)
        );
        if (selectedOption?.id === optionToDelete) {
          setSelectedOption(null);
          setProductData({ option: undefined });
        }
        toast.success("Option deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete option. Please try again.");
      } finally {
        setIsDeleteModalOpen(false);
        setOptionToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setOptionToDelete(null);
  };

  return (
    <div className="pt-2 h-screen pb-4">
      <div className="w-full mx-auto bg-white border rounded-[20px]">
        <div className="flex items-center justify-between p-6 border-b w-full py-4">
          <h2 className="text-xl font-semibold">Activity Options</h2>
          <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-700">
            Add option(s) to your product. Options allow you to customize your
            activity and attract more customers. For example, your options can
            have different:
          </p>

          <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
            <li>Durations (1 or 2 hours)</li>
            <li>
              Group sizes (10 or 20 people) or set-ups (private or public)
            </li>
            <li>Languages (English or Spanish)</li>
            <li>Inclusions (with or without lunch)</li>
            <li>Ways to start the activity (meeting point or hotel pickup)</li>
          </ul>

          <p className="mt-4 text-sm text-gray-700">
            The option is where the pricing/availability are stored, and where
            bookings are made. So you need at least one option per product to
            start receiving bookings.
          </p>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Select Options:</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="options"
                onChange={handleCreateNewOptions}
                className="mr-2"
              />
              Create New Options
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="options"
                onChange={handleUsePreviousOptions}
                className="mr-2"
              />
              Use Previous Options
            </label>
          </div>
          {/* Display Selected Option */}
          {selectedOption && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Selected Option:</h4>
              <div className="p-4 border rounded-lg bg-blue-100 border-blue-500 flex justify-between items-center">
                <h5 className="font-medium">{selectedOption.name}</h5>
                <button
                  onClick={() => setIsSummaryModalOpen(true)}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Display Previous Options */}
      {showPreviousOptions && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Previous Options:</h4>
          <div className="space-y-2">
            {options?.map((option) => (
              <div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedOption?.id === option.id
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectOption(option)}
              >
                <div className="flex justify-between items-center">
                  <div >
                    <h5 className="font-medium">{option.name}</h5>
                  </div>
                  <button
                    onClick={() => handleDeleteOption(option.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Main Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-screen h-screen max-w-full max-h-full border-none outline-none flex flex-col md:flex-row overflow-hidden rounded-none p-0">
          {/* Sidebar */}
          <div className="w-full h-screen md:w-1/4 lg:w-1/5 bg-gray-100 p-4 md:p-6">
            <DialogTitle className="text-lg font-semibold mb-4">
              Modal Navigation
            </DialogTitle>
            <ul className="space-y-2">
              <li
                className={`p-2 rounded cursor-pointer ${
                  activeModal === "OptionsSetup"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveModal("OptionsSetup")}
              >
                Options Setup
              </li>
              <li
                className={`p-2 rounded cursor-pointer ${
                  activeModal === "Duration"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveModal("Duration")}
              >
                Duration & Validity
              </li>
              <li
                className={`p-2 rounded cursor-pointer ${
                  activeModal === "MeetingPoint"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveModal("MeetingPoint")}
              >
                Meeting Point
              </li>
              <li
                className={`p-2 rounded cursor-pointer ${
                  activeModal === "Schedule"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveModal("Schedule")}
              >
                Schedule
              </li>
              <li
                className={`p-2 rounded cursor-pointer ${
                  activeModal === "Review"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveModal("Review")}
              >
                Review
              </li>
            </ul>
          </div>

          {/* Main Content */} 
          <div className="w-full h-screen overflow-y-auto p-4 md:p-6">
            {activeModal === "OptionsSetup" && (
              <OptionsModal onNext={handleNextModal} />
            )}
            {activeModal === "Duration" && (
              <DurationValidity onNext={handleNextModal} />
            )}
            {activeModal === "MeetingPoint" && (
              <GoogleMapsLoader>
              <MeetingPoint onNext={handleNextModal} />
              </GoogleMapsLoader>
            )}
            {activeModal === "Schedule" && (
              <ScheduleModal onNext={handleNextModal} />
            )}
            {activeModal === "Review" && (
              <ReviewModal onClose={() => setIsModalOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Summary Modal */}
      <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[600px] flex p-0 rounded-3xl">
          <OptionSummaryModal data={selectedOption} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={
          options?.find((option) => option.id === optionToDelete)?.name || ""
        }
      />

      <div className="flex items-center justify-end gap-[22px] mt-6">
        <button
          onClick={prevStep}
          className="px-[25px] py-[10px] w-[120px] h-[38px] flex items-center justify-center text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-[25px] py-[10px] w-[120px] h-[38px] justify-center bg-black text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center"
        >
          Continue
          <span className="ml-2">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default Option;