"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useStepStore } from "@/app/store/useStepStore";
import { useProductStore } from "@/app/store/useProductStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mustCarryOptions,
  notAllowedOptions,
  notSuitableOptions,
} from "./items";

const ExtraInfo: React.FC = () => {
  const { nextStep, prevStep,completeStep } = useStepStore();
  const { productData, setProductData }: any = useProductStore();
  const [selectedNotSuitable, setSelectedNotSuitable] = useState("");
  const [selectedNotAllowed, setSelectedNotAllowed] = useState("");
  const [selectedMustCarry, setSelectedMustCarry] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
  });
  const [bookingInfo, setBookingInfo] = useState("");

  const addItem = (field: keyof any, value: string, objKey: string) => {
    if (
      value.trim() &&
      !productData[field].some((item: any) => item[objKey] === value)
    ) {
      setProductData({
        ...productData,
        [field]: [...productData[field], { [objKey]: value.trim() }],
      });
    }
  };

  const removeItem = (field: any, value: string, objKey: string) => {
    setProductData({
      ...productData,
      [field]: productData[field].filter((item: any) => item[objKey] !== value),
    });
  };

  // Emergency contact handling
  const addEmergencyContact = () => {
    if (emergencyContact.name.trim() && emergencyContact.phone.trim()) {
      setProductData({
        ...productData,
        emergencyContacts: [...productData.emergencyContacts, emergencyContact],
      });
      setEmergencyContact({ name: "", phone: "" });
    }
  };

  const handleContinue = () => {
    setProductData({
      ...productData,
      bookingInformation: bookingInfo,
    });
    nextStep();
    completeStep(4);
  };

  return (
    <div className="pt-2 pb-4">
      <div className="w-full mx-auto bg-white border rounded-[20px]">
        {/* Not Suitable For */}
        <div className="p-6 border-b">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Not Suitable For</h3>
            <p className="text-[#010A15B2] text-sm mb-4">
              Add types of travelers who should avoid this activity
            </p>
            <Select
              value={selectedNotSuitable}
              onValueChange={(value) => {
                setSelectedNotSuitable(value);
                addItem("notSuitable", value, "condition");
                setSelectedNotSuitable(""); // Reset the select after adding
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {notSuitableOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {productData.notSuitable.map(({ condition }: any) => (
              <div
                key={condition}
                className="flex items-center px-3 py-2 bg-gray-100 rounded-full"
              >
                <span className="text-sm">{condition}</span>
                <button
                  onClick={() =>
                    removeItem("notSuitable", condition, "condition")
                  }
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Not Allowed */}
        <div className="p-6 border-b">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Prohibited Items/Actions
            </h3>
            <p className="text-[#010A15B2] text-sm mb-4">
              List restricted items or behaviors
            </p>
            <Select
              value={selectedNotAllowed}
              onValueChange={(value) => {
                setSelectedNotAllowed(value);
                addItem("notAllowed", value, "restriction");
                setSelectedNotAllowed("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {notAllowedOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {productData.notAllowed.map(({ restriction }: any) => (
              <div
                key={restriction}
                className="flex items-center px-3 py-2 bg-gray-100 rounded-full"
              >
                <span className="text-sm">{restriction}</span>
                <button
                  onClick={() =>
                    removeItem("notAllowed", restriction, "restriction")
                  }
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Must Carry Items */}
        <div className="p-6 border-b">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Mandatory Items</h3>
            <p className="text-[#010A15B2] text-sm mb-4">
              Essential items customers must bring
            </p>
            <Select
              value={selectedMustCarry}
              onValueChange={(value) => {
                setSelectedMustCarry(value);
                addItem("mustCarryItems", value, "item");
                setSelectedMustCarry(""); // Reset the select after adding
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {mustCarryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {productData.mustCarryItems.map(({ item }: any) => (
              <div
                key={item}
                className="flex items-center px-3 py-2 bg-gray-100 rounded-full"
              >
                <span className="text-sm">{item}</span>
                <button
                  onClick={() => removeItem("mustCarryItems", item, "item")}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-6 border-b">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Emergency Contacts</h3>
            <p className="text-[#010A15B2] text-sm mb-4">
              Add emergency contact information
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Name"
                value={emergencyContact.name}
                onChange={(e) =>
                  setEmergencyContact({
                    ...emergencyContact,
                    name: e.target.value,
                  })
                }
                className="flex-1 p-3 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={emergencyContact.phone}
                onChange={(e) =>
                  setEmergencyContact({
                    ...emergencyContact,
                    phone: e.target.value,
                  })
                }
                className="flex-1 p-3 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addEmergencyContact}
                className="px-4 bg-black text-white rounded-[12px] hover:bg-gray-600"
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {productData.emergencyContacts.map((contact: any, index: any) => (
              <div
                key={index}
                className="flex items-center px-3 py-2 bg-gray-100 rounded-full"
              >
                <span className="text-sm">
                  {contact.name} - {contact.phone}
                </span>
                <button
                  onClick={() =>
                    setProductData({
                      ...productData,
                      emergencyContacts: productData.emergencyContacts.filter(
                        (_: any, i: number) => i !== index
                      ),
                    })
                  }
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="border rounded-[20px] bg-white mt-6">
        <div className="flex items-center justify-between p-6 border-b w-full py-4">
          <h2 className="text-xl font-semibold">Other Booking Info</h2>
          <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
        </div>
        <div className="p-4 sm:p-6">
          <textarea
            value={bookingInfo}
            onChange={(e) => setBookingInfo(e.target.value)}
            placeholder="Sunset Sailing Tour in Santorini"
            className="w-full h-[300px]  p-4 mt-4 border rounded-[12px] focus:outline-none focus:border focus:border-green-500 focus:border-opacity-30"
          />
        </div>
      </div> */}

      {/* Buttons */}
      <div className="flex items-center justify-end gap-[22px] mt-6">
        <button
          onClick={prevStep}
          className="px-[25px] py-[10px] w-[120px] h-[38px] flex items-center justify-center text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
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

export default ExtraInfo;
