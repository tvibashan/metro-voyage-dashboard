"use client";
import { useOptionStore } from "@/app/store/useOptionStore";
import { useState, useEffect } from "react";

export default function DurationValidity({ onNext }: { onNext: () => void }) {
  const { setOptionData, optionData } = useOptionStore();

  const [hasFixedTime, setHasFixedTime] = useState(optionData.has_fixed_time || false);
  const [days, setDays] = useState(optionData.valid_for || 1);

  useEffect(() => {
    setHasFixedTime(optionData.has_fixed_time || false);
    setDays(optionData.valid_for || 1);
  }, [optionData]);

  const handleNext = () => {
    setOptionData({
      has_fixed_time: hasFixedTime,
      valid_for: days,
    });
    onNext();
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Description */}
      <p className="text-gray-700 text-sm leading-6">
        Some activities start and stop at specific times, like a tour. Others
        allow customers to use their ticket anytime within a certain amount of
        time, like a 2-day city pass.
      </p>

      {/* Yes/No Toggle */}
      <div className="space-y-4">
        <span className="text-gray-900 font-medium text-base">
          Has specific start & stop times?
        </span>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="hasFixedTime"
              value="no"
              checked={!hasFixedTime}
              onChange={() => setHasFixedTime(false)}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">No</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="hasFixedTime"
              value="yes"
              checked={hasFixedTime}
              onChange={() => setHasFixedTime(true)}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Yes</span>
          </label>
        </div>
      </div>

      {/* Duration / Validity Selection */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="radio"
            name="activity-type"
            value="duration"
            checked={!hasFixedTime}
            onChange={() => setHasFixedTime(false)}
            className="w-5 h-5 text-blue-600 mt-1 focus:ring-blue-500"
          />
          <div>
            <span className="text-gray-900 font-medium">
              It lasts for a specific amount of time (duration). Includes transfer time.
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Example: 3-hour guided tour
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="radio"
            name="activity-type"
            value="validity"
            checked={hasFixedTime}
            onChange={() => setHasFixedTime(true)}
            className="w-5 h-5 text-blue-600 mt-1 focus:ring-blue-500"
          />
          <div>
            <span className="text-gray-900 font-medium">
              Customers can use their ticket anytime during a certain period (validity).
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Example: Museum tickets that can be used anytime during opening hours.
            </p>
          </div>
        </label>

        {hasFixedTime && (
          <div className="ml-8 mt-3 flex items-center space-x-3">
            <span className="text-gray-700">Valid for</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-gray-700">Days</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}