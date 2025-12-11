"use client";
import { useProductEditStore } from "@/app/store/useEditProductStore";
import { useEditStepStore } from "@/app/store/useEditStepStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const Inclusions: React.FC = () => {
  const { completeStep, nextStep, prevStep } = useEditStepStore();
  const { productData, setProductData } = useProductEditStore();
  const [inclusions, setInclusions] = useState<{ name: string }[]>(
    productData.inclusions || [{ name: "" }]
  );
  const [exclusions, setExclusions] = useState<{ name: string }[]>(
    productData.exclusions || [{ name: "" }]
  );

  const [isFoodIncluded, setIsFoodIncluded] = useState<boolean>(
    productData.isFoodIncluded || false
  );
  const [isTransportationIncluded, setIsTransportationIncluded] =
    useState<boolean>(productData.isTransportIncluded || false);

  const [category, setCategory] = useState<any>(productData.whoWillGuide);

  useEffect(() => {
    setIsFoodIncluded(productData.isFoodIncluded || false);
    setIsTransportationIncluded(productData.isTransportIncluded || false);
    setCategory(productData?.whoWillGuide);
  }, [productData]);

  const handleFoodSelect = (food: boolean) => {
    setIsFoodIncluded(food);
    setProductData({ ...productData, isFoodIncluded: food });
  };

  const handleTransportationSelect = (trans: boolean) => {
    setIsTransportationIncluded(trans);
    setProductData({ ...productData, isTransportIncluded: trans });
  };

  const addInclusions = () => {
    setInclusions([...inclusions, { name: "" }]);
  };
  const addExclusions = () => {
    setExclusions([...exclusions, { name: "" }]);
  };

  const handleInclusionsChange = (index: number, value: string) => {
    const newInclusionss = [...inclusions];
    newInclusionss[index].name = value;
    setInclusions(newInclusionss);
  };
  const handleExclusionsChange = (index: number, value: string) => {
    const newExclusionss = [...exclusions];
    newExclusionss[index].name = value;
    setExclusions(newExclusionss);
  };

  const removeInclusions = (index: number) => {
    const newInclusionss = inclusions.filter((_, i) => i !== index);
    setInclusions(newInclusionss);
  };
  const removeExclusions = (index: number) => {
    const newExclusionss = exclusions.filter((_, i) => i !== index);
    setExclusions(newExclusionss);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setProductData({ whoWillGuide: cat });
  };

  const handleContinue = () => {
    setProductData({
      ...productData,
      inclusions,
      exclusions,
      isFoodIncluded,
      isTransportIncluded: isTransportationIncluded,
    });
    nextStep();
    completeStep(3);
  };

  return (
    <div className="pt-2">
      <div className=" w-full mx-auto bg-white border rounded-[20px] ">
        <div className="flex items-center justify-between  p-6 border-b w-full py-4">
          <h2 className="text-xl font-semibold ">Inclusions</h2>
          <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
        </div>

        {/* Included Features */}
        <div className="mt-6 bg-white border rounded-[20px]">
          <div className="flex items-center justify-between p-6 border-b w-full py-4">
            <h2 className="text-xl font-semibold">Select Inclusions</h2>
            <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
          </div>
          <div className="p-2 sm:p-6">
            <label className="block font-medium text-black mb-[10px]">
              What is included? (optional)
            </label>
            <p className="text-sm text-[#010A15B2] mb-[10px]">
              List all the features that are included in the price so customers
              understand the value for money of your activity. Start a new line
              for each one.
            </p>
            {inclusions.map((loc, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={loc.name}
                  onChange={(e) =>
                    handleInclusionsChange(index, e.target.value)
                  }
                  placeholder="Search for inclutions"
                  className="w-full p-4 mt-3 border rounded-lg focus:outline-none focus:border focus:border-green-500 focus:border-opacity-30"
                />
                <button
                  onClick={() => removeInclusions(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Icon
                    icon="bitcoin-icons:cross-filled"
                    className="text-2xl"
                  />
                </button>
              </div>
            ))}
            <button
              onClick={addInclusions}
              className="text-black font-medium mt-4 text-[15px] hover:underline"
            >
              + Add Another Inclusions
            </button>
          </div>
        </div>

        {/* not Included Features */}
        <div className="mt-6 bg-white border rounded-[20px]">
          <div className="flex items-center justify-between p-6 border-b w-full py-4">
            <h2 className="text-xl font-semibold">Select Exclusions</h2>
            <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
          </div>
          <div className="p-2 sm:p-6">
            <label className="block font-medium text-black mb-[10px]">
              What is not included? (optional)
            </label>
            <p className="text-sm text-[#010A15B2] mb-[10px]">
              Name what customers need to pay extra for or what they may expect
              to see that isn’t included in the price. This allows customers to
              appropriately set their expectations.
            </p>
            {exclusions.map((loc, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={loc.name}
                  onChange={(e) =>
                    handleExclusionsChange(index, e.target.value)
                  }
                  placeholder="Search for inclutions"
                  className="w-full p-4 mt-3 border rounded-lg focus:outline-none focus:border focus:border-green-500 focus:border-opacity-30"
                />
                <button
                  onClick={() => removeExclusions(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Icon
                    icon="bitcoin-icons:cross-filled"
                    className="text-2xl"
                  />
                </button>
              </div>
            ))}
            <button
              onClick={addExclusions}
              className="text-black font-medium mt-4 text-[15px] hover:underline"
            >
              + Add Another Exclusions
            </button>
          </div>
        </div>

        {/* Is food included */}
        <div className="mb-6 p-2 sm:p-6">
          <label className="block text-lg font-semibold mb-[10px]">
            Is food included in your activity?
          </label>
          <div className="space-y-2">
            <label
              className={`flex items-center space-x-3 cursor-pointer ${
                !isFoodIncluded ? "text-[#296626]" : "text-gray-700"
              }`}
            >
              <input
                type="radio"
                checked={!isFoodIncluded}
                onChange={() => handleFoodSelect(false)}
                className="w-4 h-4"
              />
              <span>No</span>
            </label>
            <label
              className={`flex items-center space-x-2 cursor-pointer ${
                isFoodIncluded ? "text-[#296626]" : "text-gray-700"
              }`}
            >
              <input
                type="radio"
                checked={isFoodIncluded}
                onChange={() => handleFoodSelect(true)}
                className="w-4 h-4"
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        {/* Is transportation used */}
        <div className="mb-6 p-2 sm:p-6">
          <label className="block text-lg font-semibold mb-[10px]">
            Is transportation used during this activity?
          </label>
          <p className="text-[#010A15B2] text-sm mb-[10px]">
            Provide the main transportation type(s) that customers use during
            the experience, like a Segway or bike. Transportation used for
            pickup and drop-off will be added later.
          </p>
          <div className="space-y-2">
            <label
              className={`flex items-center space-x-3 cursor-pointer ${
                !isTransportationIncluded ? "text-[#296626]" : "text-gray-700"
              }`}
            >
              <input
                type="radio"
                checked={!isTransportationIncluded}
                onChange={() => handleTransportationSelect(false)}
                className="w-4 h-4"
              />
              <span>No</span>
            </label>
            <label
              className={`flex items-center space-x-2 cursor-pointer ${
                isTransportationIncluded ? "text-[#296626]" : "text-gray-700"
              }`}
            >
              <input
                type="radio"
                checked={isTransportationIncluded}
                onChange={() => handleTransportationSelect(true)}
                className="w-4 h-4"
              />
              <span>Yes</span>
            </label>
          </div>
          {/* Additional Note */}
          <div className="mt-10 bg-gray-100  p-5 rounded-lg text-[#010A15B2] text-sm">
            Make it clear if something is optional or must be paid by the
            customer on the spot. If it must be paid, provide the expected cost.
          </div>
        </div>
        {/* Category Selection */}
        <div className="mb-6 p-2 sm:p-6">
          <label className="block text-lg font-semibold mb-[10px]">
            Who will guide the customers?{" "}
          </label>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {[
              {
                label: "Self-Guided",
                description:
                  "The activity does not include a guide or similar; travellers will navigate the activity or attraction independently.",
              },
              {
                label: "Tour guide",
                description:
                  "Leads a group of customers through a tour and explains things about the destination or attraction.",
              },
              {
                label: "Host or greeter",
                description:
                  "Provides an introduction, purchases a ticket, or waits in line with customers, but doesn't provide a full tour of the attraction.",
              },
              {
                label: "Instructor",
                description:
                  "Shows customers how to use equipment or teaches them how to do something.",
              },
              {
                label: "Driver",
                description:
                  "Drives the customer somewhere but doesn’t explain anything along the way.",
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
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-[22px] mt-6">
        <button
          onClick={prevStep}
          className="px-[25px] py-[10px] w-[120px] h-[38px] flex items-center justify-center text-gray-500 bg-gray-200 rounded-lg   hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleContinue}
          className="px-[25px] py-[10px] w-[120px] h-[38px]   justify-center bg-black text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center"
        >
          Continue
          <span className="ml-2">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default Inclusions;
