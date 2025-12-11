"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { languages } from "@/app/dashboard/create-product/options/items";
import { useEditOptionStore } from "@/app/store/useEditOptionStore";

export default function OptionsModal({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(1);
  const { setOptionData, optionData } = useEditOptionStore();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedBookletLanguage, setSelectedBookletLanguage] = useState("");
  const [selectedAudioGuideLanguage, setSelectedAudioGuideLanguage] = useState("");

  const handleLanguageSelect = (value: string) => {
    setSelectedLanguage(value);
    if (value && !optionData.host_languages?.some((lang) => lang.keyword === value)) {
      const updatedLanguages = [
        ...(optionData.host_languages || []),
        { keyword: value },
      ];
      setOptionData({ host_languages: updatedLanguages });
      setSelectedLanguage("");
    }
  };

  const handleBookletLanguageSelect = (value: string) => {
    setSelectedBookletLanguage(value);
    if (value && !optionData.booklet_languages?.some((lang) => lang.keyword === value)) {
      const updatedLanguages = [
        ...(optionData.booklet_languages || []),
        { keyword: value },
      ];
      setOptionData({ booklet_languages: updatedLanguages });
      setSelectedBookletLanguage("");
    }
  };

  const handleAudioGuideLanguageSelect = (value: string) => {
    setSelectedAudioGuideLanguage(value);
    if (value && !optionData.audio_guides_languages?.some((lang) => lang.keyword === value)) {
      const updatedLanguages = [
        ...(optionData.audio_guides_languages || []),
        { keyword: value },
      ];
      setOptionData({ audio_guides_languages: updatedLanguages });
      setSelectedAudioGuideLanguage("");
    }
  };

  const handleRemoveLanguage = (keyword: string, type: 'host' | 'booklet' | 'audio_guide') => {
    if (type === 'host') {
      const updatedLanguages = optionData.host_languages?.filter(
        (lang) => lang.keyword !== keyword
      );
      setOptionData({ host_languages: updatedLanguages });
    } else if (type === 'booklet') {
      const updatedLanguages = optionData.booklet_languages?.filter(
        (lang) => lang.keyword !== keyword
      );
      setOptionData({ booklet_languages: updatedLanguages });
    } else if (type === 'audio_guide') {
      const updatedLanguages = optionData.audio_guides_languages?.filter(
        (lang) => lang.keyword !== keyword
      );
      setOptionData({ audio_guides_languages: updatedLanguages });
    }
  };

  const handleNextStep = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onNext();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="w-full h-full p-6">
      <h2 className="text-xl font-semibold mb-6">Options Setup</h2>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Default"
              className="w-full border rounded-lg p-2 mb-4"
              value={optionData.name || ""}
              onChange={(e) => setOptionData({ name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="referenceCode"
              className="block mb-2 text-sm font-medium"
            >
              Option reference code (optional)
            </label>
            <input
              id="referenceCode"
              type="text"
              placeholder="Default"
              className="w-full border rounded-lg p-2 mb-4"
              value={optionData.reference_code || ""}
              onChange={(e) =>
                setOptionData({ reference_code: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="groupSize"
              className="block mb-2 text-sm font-medium"
            >
              Maximum group size
            </label>
            <input
              id="groupSize"
              type="number"
              className="w-full border rounded-lg p-2 mb-4"
              defaultValue={optionData.maximum_group_size}
              onChange={(e) =>
                setOptionData({ maximum_group_size: Number(e.target.value) })
              }
            />
          </div>
{/* 
          <div>
            <label
              htmlFor="languageInput"
              className="block mb-2 text-sm font-medium"
            >
              What languages does the guide or host speak during the activity?
            </label>
            <div className="flex gap-2">
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {optionData.host_languages?.map((lang) => (
                <div
                  key={lang.keyword}
                  className="px-3 py-2 cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-[#29662626] font-medium hover:text-[#010A15B2] text-gray-700 rounded-[16px] text-sm"
                >
                  <span>{lang.keyword}</span>
                  <button
                    onClick={() => handleRemoveLanguage(lang.keyword, "host")}
                    className="focus:outline-none"
                  >
                    <Icon icon="mdi:close" className="hover:text-green-700" />
                  </button>
                </div>
              ))}
            </div>
          </div> */}

          {/* Additional features section with switches */}
          <div className="space-y-6">
            {/* Booklet Switch */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Booklet Available
              </label>
              <Switch
                checked={optionData.booklet || false}
                onCheckedChange={(checked) =>
                  setOptionData({ booklet: checked })
                }
              />
            </div>

            {optionData.booklet && (
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Booklet Languages
                </label>
                <div className="flex gap-2">
                  <Select
                    value={selectedBookletLanguage}
                    onValueChange={handleBookletLanguageSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {optionData.booklet_languages?.map((lang) => (
                    <div
                      key={lang.keyword}
                      className="px-3 py-2 cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-[#29662626] font-medium hover:text-[#010A15B2] text-gray-700 rounded-[16px] text-sm"
                    >
                      <span>{lang.keyword}</span>
                      <button
                        onClick={() => handleRemoveLanguage(lang.keyword, "booklet")}
                        className="focus:outline-none"
                      >
                        <Icon icon="mdi:close" className="hover:text-green-700" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio Guide Switch */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Audio Guide Available
              </label>
              <Switch
                checked={optionData.audio_guide || false}
                onCheckedChange={(checked) =>
                  setOptionData({ audio_guide: checked })
                }
              />
            </div>

            {optionData.audio_guide && (
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Audio Guide Languages
                </label>
                <div className="flex gap-2">
                  <Select
                    value={selectedAudioGuideLanguage}
                    onValueChange={handleAudioGuideLanguageSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {optionData.audio_guides_languages?.map((lang) => (
                    <div
                      key={lang.keyword}
                      className="px-3 py-2 cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-[#29662626] font-medium hover:text-[#010A15B2] text-gray-700 rounded-[16px] text-sm"
                    >
                      <span>{lang.keyword}</span>
                      <button
                        onClick={() => handleRemoveLanguage(lang.keyword, "audio_guide")}
                        className="focus:outline-none"
                      >
                        <Icon icon="mdi:close" className="hover:text-green-700" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Language Switch */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Host Language Available
              </label>
              <Switch
                checked={optionData.host_language || false}
                onCheckedChange={(checked) =>
                  setOptionData({ host_language: checked })
                }
              />
            </div>

            {optionData.host_language && (
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Host Languages
                </label>
                <div className="flex gap-2">
                  <Select
                    value={selectedLanguage}
                    onValueChange={handleLanguageSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {optionData.host_languages?.map((lang) => (
                    <div
                      key={lang.keyword}
                      className="px-3 py-2 cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-[#29662626] font-medium hover:text-[#010A15B2] text-gray-700 rounded-[16px] text-sm"
                    >
                      <span>{lang.keyword}</span>
                      <button
                        onClick={() => handleRemoveLanguage(lang.keyword, "host")}
                        className="focus:outline-none"
                      >
                        <Icon icon="mdi:close" className="hover:text-green-700" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2 - Remains unchanged */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Private Activity Section */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">
              Is this a private activity?
            </p>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                checked={!optionData.is_private}
                onChange={() => setOptionData({ is_private: false })}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={optionData.is_private || false}
                onChange={() => setOptionData({ is_private: true })}
                className="mr-2"
              />
              Yes
            </label>
            {optionData.is_private && (
              <p className="text-sm text-gray-500 mt-2">
                This means that only one group or person can participate. There
                won't be other customers in the same activity.
              </p>
            )}
          </div>

          {/* Wheelchair Accessibility Section */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">
              Is the activity wheelchair accessible?
            </p>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                checked={!optionData.is_wheelchair_accessible}
                onChange={() =>
                  setOptionData({ is_wheelchair_accessible: false })
                }
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={optionData.is_wheelchair_accessible || false}
                onChange={() =>
                  setOptionData({ is_wheelchair_accessible: true })
                }
                className="mr-2"
              />
              Yes
            </label>
            {optionData.is_wheelchair_accessible && (
              <p className="text-sm text-gray-500 mt-2">
                This means that only one group or person can participate. There
                won't be other customers in the same activity.
              </p>
            )}
          </div>

          {/* Skip the Line Section */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">
              Do you want to enable "Skip the Line" feature?
            </p>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                checked={!optionData.skip_the_line_enabled}
                onChange={() => {
                  setOptionData({
                    skip_the_line_enabled: false,
                    skip_the_line_option: "",
                  });
                }}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={optionData.skip_the_line_enabled || false}
                onChange={() => {
                  setOptionData({ skip_the_line_enabled: true });
                }}
                className="mr-2"
              />
              Yes
            </label>

            {optionData.skip_the_line_enabled && (
              <div className="mt-4">
                <label
                  className="block mb-2 text-sm font-medium"
                  htmlFor="ticket-options"
                >
                  Select Ticket Option
                </label>
                <Select
                  value={optionData.skip_the_line_option || ""}
                  onValueChange={(value) =>
                    setOptionData({ skip_the_line_option: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip-line-tickets">
                      Skip the line to get tickets
                    </SelectItem>
                    <SelectItem value="separate-entrance">
                      Skip the line through a separate entrance
                    </SelectItem>
                    <SelectItem value="express-security-check">
                      Skip the line through express security check
                    </SelectItem>
                    <SelectItem value="express-elevators">
                      Skip the line through express elevators
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={handlePreviousStep}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {step === 2 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}