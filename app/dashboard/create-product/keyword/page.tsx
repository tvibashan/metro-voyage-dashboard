"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useStepStore } from "@/app/store/useStepStore";
import { useProductStore } from "@/app/store/useProductStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, Category, icons, keywordsByCategory } from "./items";
import GoogleMapsLoader from "@/components/GoogleMapsLoader";
import Itinery from "./Itinery";
import ProductTagsSection from "@/components/ProductTags";

const Keyword: React.FC = () => {
  const { nextStep, prevStep, completeStep } = useStepStore();
  const { productData, setProductData } = useProductStore();
  const [inputValue, setInputValue] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Art & architecture");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newCard, setNewCard] = useState({
    title: "",
    subtitle: "",
    icon: "",
  });
  const [iconModalOpen, setIconModalOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<any>([]);

  // Keyword Functions
  const addKeyword = (keyword: string) => {
    if (
      keyword &&
      !productData.productKeywords.some((k) => k.keyword === keyword)
    ) {
      setProductData({
        ...productData,
        productKeywords: [...productData.productKeywords, { keyword }],
      });
      setInputValue("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setProductData({
      ...productData,
      productKeywords: productData.productKeywords.filter(
        (k) => k.keyword !== keyword
      ),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(inputValue.trim());
    }
  };

  const addOverviewCard = () => {
    if (newCard.title && newCard.subtitle && newCard.icon) {
      setProductData({
        ...productData,
        overviewcards: [...productData.overviewcards, newCard],
      });
      setNewCard({
        title: "",
        subtitle: "",
        icon: "",
      });
    }
  };

  const removeOverviewCard = (index: number) => {
    const updatedCards = productData.overviewcards.filter(
      (_, i) => i !== index
    );
    setProductData({
      ...productData,
      overviewcards: updatedCards,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof newCard
  ) => {
    setNewCard({
      ...newCard,
      [field]: e.target.value,
    });
  };

  const handleIconSelect = (icon: string) => {
    setNewCard({
      ...newCard,
      icon: icon,
    });
    setIconModalOpen(false);
  };

  const filteredKeywords = keywordsByCategory[selectedCategory].filter(
    (keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    completeStep(2);
    nextStep();
  };

  return (
    <div className="pt-2 h-screen pb-4">
      <div className="w-full mx-auto bg-white border rounded-[20px]">
        <div className="flex items-center justify-between p-6 border-b w-full py-4">
          <h2 className="text-xl font-semibold">Select Keyword</h2>
          <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
        </div>
        <div className="p-2 sm:p-6">
          {/* Keywords Section */}
          <p className="text-black font-semibold text-lg mb-[10px]">
            Add keywords to your product
          </p>
          <p className="text-[#010A15B2] text-sm mb-[20px]">
            Keywords work as tags for your product and help customers find it
            when they search by a theme or their interests. Try to use all 15
            for maximum reach.
          </p>

          {/* Search input for Keywords */}
          <div className="relative mb-4">
            <Icon
              icon="mdi:magnify"
              className="absolute text-2xl left-3 top-[18px] text-gray-400"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for Keywords"
              className="w-full p-4 pl-10 border rounded-[12px] focus:outline-none focus:border focus:border-green-500 focus:border-opacity-30"
            />
            <button
              onClick={() => setModalOpen(true)}
              className="absolute right-3 top-[18px] text-blue-600 hover:underline text-sm"
            >
              Advance Selection
            </button>
          </div>

          {/* Selected Keywords */}
          <div className="flex flex-wrap gap-2 mb-6">
            {productData.productKeywords.map(({ keyword }) => (
              <div
                key={keyword}
                className="px-3 py-2 cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-[#29662626] font-medium hover:text-[#010A15B2] text-gray-700 rounded-[16px] text-sm"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="focus:outline-none"
                >
                  <Icon icon="mdi:close" className="hover:text-green-700" />
                </button>
              </div>
            ))}
          </div>

          <div className="">
            <ProductTagsSection
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              productData={productData}
              setProductData={setProductData}
            />
          </div>
          {/* Overview Cards Section */}
          <p className="text-black font-semibold text-lg mb-[10px]">
            Add Overview Cards
          </p>
          <p className="text-[#010A15B2] text-sm mb-[20px]">
            Overview cards provide additional information about your product in
            a visually appealing way.
          </p>

          {/* Input fields for new Overview Card */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newCard.title}
              onChange={(e) => handleInputChange(e, "title")}
              placeholder="Title"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={newCard.subtitle}
              onChange={(e) => handleInputChange(e, "subtitle")}
              placeholder="Subtitle"
              className="p-2 border rounded"
            />
            <div className="col-span-2">
              <button
                onClick={() => setIconModalOpen(true)}
                className="w-full p-2 border rounded text-left"
              >
                {newCard.icon ? (
                  <div dangerouslySetInnerHTML={{ __html: newCard.icon }} />
                ) : (
                  "Select Icon"
                )}
              </button>
            </div>
          </div>

          {/* Add Overview Card Button */}
          <button
            onClick={addOverviewCard}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600 mb-6"
          >
            Add Overview Card
          </button>

          {/* Display Existing Overview Cards */}
          <div className="mt-6">
            {productData.overviewcards.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 mb-2 bg-gray-100 rounded"
              >
                <div className="flex gap-2">
                  <div
                    className="pt-1"
                    dangerouslySetInnerHTML={{ __html: card.icon }}
                  />
                  <div className="">
                    <p className="font-semibold">{card.title}</p>
                    <p className="text-sm">{card.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeOverviewCard(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon icon="mdi:close" />
                </button>
              </div>
            ))}
          </div>

          {/* itinery Features */}
          <div className=" bg-white">
            <GoogleMapsLoader>
              <Itinery />
            </GoogleMapsLoader>
          </div>
        </div>
      </div>

      {/* Modal for Advance Selection */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Advance Keyword Selection</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            {/* Category List */}
            <div className="w-1/3 border-r pr-4">
              <h4 className="font-semibold mb-2">Categories</h4>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`block p-2 w-full text-left rounded-md hover:bg-gray-100 ${
                    selectedCategory === category ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Keyword List */}
            <div className="w-2/3">
              <div className="mb-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keywords..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    className={`px-3 py-2 rounded-md text-sm ${
                      productData.productKeywords.some(
                        (k) => k.keyword === keyword
                      )
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => addKeyword(keyword)}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Apply Keywords</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for Icon Selection */}
      <Dialog open={iconModalOpen} onOpenChange={setIconModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Icon</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(icons).map(([key, icon]) => (
              <button
                key={key}
                className="p-2 border rounded hover:bg-gray-100"
                onClick={() => handleIconSelect(icon)}
              >
                <div dangerouslySetInnerHTML={{ __html: icon }} />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIconModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default Keyword;
