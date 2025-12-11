"use client";
import React, { useState, useEffect, use } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import Link from "next/link";
import Gallery from "./Gallery";

interface PricingTier {
  id: number;
  participant_type: {
    name: string;
    min_age: number;
    max_age: number;
  };
  min_participants: number;
  max_participants: number;
  price: number;
}

interface Availability {
  id: number;
  availability_type: string;
  price_type: string;
  schedule_name: string;
  start_date: string;
  end_date: string | null;
  fixed_time_slots: Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>;
  pricing_tiers: PricingTier[];
  discount?: any;
}

interface Option {
  id: number;
  name: string;
  reference_code: string;
  maximum_group_size: number;
  is_wheelchair_accessible: boolean;
  skip_the_line_option: string;
  skip_the_line_enabled: boolean;
  valid_for: number;
  has_fixed_time: boolean;
  audio_guide: boolean;
  booklet: boolean;
  is_private: boolean;
  drop_off_type: string;
  meeting_point_type: string;
  availabilities: Availability[];
}

interface ProductDetails {
  id: number;
  avg_rating: number;
  total_reviews: number;
  discounted_price: number | null;
  discount_percent: number | null;
  has_discount: boolean;
  currency_type: string;
  basePrice: number;
  tags: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  summarize: Array<{
    id: number;
    summaryText: string;
  }>;
  location: Array<{
    id: number;
    address: string;
  }>;
  productKeywords: Array<{
    id: number;
    keyword: string;
  }>;
  overviewcards: Array<{
    icon: string;
    title: string;
    subtitle: string;
  }>;
  images: Array<{
    id: number;
    image: string;
  }>;
  inclusions: Array<{
    id: number;
    name: string;
  }>;
  exclusions: Array<{
    id: number;
    name: string;
  }>;
  emergencyContacts: Array<{
    id: number;
    name: string;
    phone: string;
  }>;
  option: Option;
  notSuitable: Array<{
    id: number;
    condition: string;
  }>;
  notAllowed: Array<{
    id: number;
    restriction: string;
  }>;
  mustCarryItems: Array<{
    id: number;
    item: string;
  }>;
  itineraries: Array<{
    id: number;
    title: string;
    description: string;
    order: number;
    is_main_stop: boolean;
    latitude: number;
    longitude: number;
  }>;
  related_products: Array<{
    id: number;
    title: string;
    category: string;
    product_image: string;
    total_reviews: number;
    avg_rating: number;
    images: Array<{
      id: number;
      image: string;
    }>;
    price: number;
    discounted_price: number | null;
    discount_percent: number | null;
    has_discount: boolean;
    tags: Array<{
      id: number;
      name: string;
      image: string;
    }>;
    is_favorite: boolean;
    api: {
      api_type: string;
      api_name: string;
      id: number;
    };
    basePriceFor: string;
    duration: string;
    currency_type: string;
    image: string;
  }>;
  star_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  languageType: string;
  category: string;
  whoWillGuide: string;
  title: string;
  metaTitle: string;
  description: string;
  shortDescription: string;
  metaDescription: string;
  reference_code: string;
  isFoodIncluded: boolean;
  isTransportIncluded: boolean;
  contactInformation: string;
  bookingInformation: string;
  termsAndConditions: string;
  cancellationPolicy: string;
  duration: string;
  basePriceFor: string;
  departure_from: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetails({ params }: any) {
  const { id }: any = use(params);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${ApiBaseMysql}/shop/products/${id}/`
        );
        setProduct(response.data.data);
        if (response.data.data.option.availabilities.length > 0) {
          setSelectedAvailability(response.data.data.option.availabilities[0]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-4">Product not found.</div>;
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <Icon icon="mdi:home" className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <Icon
                icon="mdi:chevron-right"
                className="w-4 h-4 text-gray-400"
              />
              <Link
                href="/dashboard/our-products"
                className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
              >
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <Icon
                icon="mdi:chevron-right"
                className="w-4 h-4 text-gray-400"
              />
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                {product.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <Gallery data={product} />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Icon icon="mdi:star" className="text-yellow-500 w-5 h-5" />
                  <span className="ml-1 text-gray-700">
                    {product.avg_rating} ({product.total_reviews} reviews)
                  </span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">{product.category}</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">{product.duration}</span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.status
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.status ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{product.shortDescription}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {product.overviewcards.map((card, index) => (
              <div
                key={index}
                className="flex items-start p-3 bg-gray-50 rounded-lg"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: card.icon }}
                  className="w-6 h-6 mt-1 mr-3 text-blue-600"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              {product.has_discount && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {product.discount_percent}% OFF
                </span>
              )}
            </div>

            {product.has_discount ? (
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.currency_type} {product.discounted_price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {product.currency_type} {product.basePrice}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {product.currency_type} {product.basePrice}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  per {product.basePriceFor}
                </span>
              </div>
            )}

            {selectedAvailability && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Available Pricing Tiers:
                </h4>
                <div className="space-y-3">
                  {selectedAvailability.pricing_tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">
                          {tier.participant_type.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({tier.participant_type.min_age}-
                          {tier.participant_type.max_age} years)
                        </span>
                      </div>
                      <span className="font-medium">
                        {product.currency_type} {tier.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Reference Code:
              </h4>
              <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                {product.reference_code}
              </div>
            </div>

            <Link href={`/dashboard/our-products/${id}/edit`}>
              <button className="w-full flex justify-center items-center space-x-2 bg-black hover:bg-gray-800 text-white rounded-md px-4 py-3 text-sm font-medium transition-colors">
                <Icon icon="mdi:pencil" className="w-4 h-4" />
                <span>Edit Product</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "itinerary"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Itinerary
          </button>
          <button
            onClick={() => setActiveTab("availability")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "availability"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("policies")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "policies"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Policies
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {product.inclusions.map((inclusion) => (
                    <li key={inclusion.id} className="flex items-start">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-green-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <span className="text-gray-700">{inclusion.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">What's Excluded</h3>
                <ul className="space-y-2">
                  {product.exclusions.map((exclusion) => (
                    <li key={exclusion.id} className="flex items-start">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-red-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <span className="text-gray-700">{exclusion.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Highlights</h3>
              <ul className="space-y-2">
                {product.summarize.map((summary) => (
                  <li key={summary.id} className="flex items-start">
                    <Icon
                      icon="mdi:star-circle"
                      className="text-blue-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-700">{summary.summaryText}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Tour Itinerary</h3>
            <div className="space-y-4">
              {product.itineraries
                .sort((a, b) => a.order - b.order)
                .map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className={`p-4 ${
                        itinerary.is_main_stop ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            itinerary.is_main_stop
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span className="font-medium">{itinerary.order}</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-gray-900">
                            {itinerary.title}
                            {itinerary.is_main_stop && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Main Stop
                              </span>
                            )}
                          </h4>
                          <p className="mt-1 text-gray-600 whitespace-pre-line">
                            {itinerary.description}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Icon
                              icon="mdi:map-marker"
                              className="mr-1.5 h-4 w-4 flex-shrink-0"
                            />
                            <span>
                              Lat: {itinerary.latitude}, Lng:{" "}
                              {itinerary.longitude}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.location.map((loc) => (
                  <div
                    key={loc.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <Icon
                        icon="mdi:map-marker"
                        className="text-red-500 w-5 h-5 mr-2"
                      />
                      <span className="font-medium">{loc.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === "availability" &&
          product.option.availabilities.length > 0 && (
            <div className="space-y-8">
              {/* Schedule Options Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Schedule Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {product.option.availabilities.map((availability) => (
                    <div
                      key={availability.id}
                      onClick={() => setSelectedAvailability(availability)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAvailability?.id === availability.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {availability.schedule_name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {availability.availability_type === "fixed"
                              ? "Fixed schedule"
                              : "Flexible hours"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {availability.start_date}{" "}
                            {availability.end_date
                              ? `to ${availability.end_date}`
                              : "onwards"}
                          </p>
                        </div>
                        {availability.discount && (
                          <span className="bg-green-100  text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {availability.discount.percent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAvailability && (
                <>
                  {/* Time Slots Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Available Time Slots
                    </h3>
                    {selectedAvailability.fixed_time_slots.length > 0 ? (
                      <div className="space-y-4">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => {
                          const daySlots =
                            selectedAvailability.fixed_time_slots.filter(
                              (slot) => slot.day === day
                            );
                          if (daySlots.length === 0) return null;
                          return (
                            <div
                              key={day}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <div className="bg-gray-50 px-4 py-2">
                                <h4 className="font-medium">{day}</h4>
                              </div>
                              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {daySlots.map((slot, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-200 rounded-md p-3 text-center"
                                  >
                                    <span className="font-medium">
                                      {formatTime(slot.start_time)} -{" "}
                                      {formatTime(slot.end_time)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">
                          No fixed time slots available for this schedule.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-semibold">
                        Pricing Information
                      </h3>
                    </div>
                    <div className="p-4">
                      {selectedAvailability?.discount && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                          <div className="flex items-center">
                            <Icon
                              icon="mdi:tag"
                              className="text-green-600 w-5 h-5 mr-2"
                            />
                            <div>
                              <h4 className="font-medium text-green-800">
                                {selectedAvailability.discount.title}
                              </h4>
                              <p className="text-sm text-green-700">
                                {selectedAvailability.discount.percent}%
                                discount valid until{" "}
                                {selectedAvailability.discount.end_date ||
                                  "further notice"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Participant Type
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Age Range
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Original Price
                              </th>
                              {selectedAvailability.discount && (
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Discounted Price
                                </th>
                              )}
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Group Size
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedAvailability.pricing_tiers.map((tier) => (
                              <tr key={tier.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {tier.participant_type.name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {tier.participant_type.min_age}-
                                  {tier.participant_type.max_age} years
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {product.currency_type} {tier.price}
                                </td>
                                {selectedAvailability.discount && (
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                                    {product.currency_type}{" "}
                                    {(
                                      tier.price *
                                      (1 -
                                        selectedAvailability.discount.percent /
                                          100)
                                    ).toFixed(2)}
                                  </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {tier.min_participants}-
                                  {tier.max_participants} people
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tour Options Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Tour Options</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Accessibility</h4>
                      <div className="flex items-center">
                        <Icon
                          icon={
                            product.option.is_wheelchair_accessible
                              ? "mdi:check-circle"
                              : "mdi:close-circle"
                          }
                          className={`w-5 h-5 mr-2 ${
                            product.option.is_wheelchair_accessible
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                        <span>Wheelchair accessible</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Skip the Line</h4>
                      <div className="flex items-center">
                        <Icon
                          icon={
                            product.option.skip_the_line_enabled
                              ? "mdi:check-circle"
                              : "mdi:close-circle"
                          }
                          className={`w-5 h-5 mr-2 ${
                            product.option.skip_the_line_enabled
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                        <span>
                          {product.option.skip_the_line_enabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                        {product.option.skip_the_line_enabled && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({product.option.skip_the_line_option})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Group Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Maximum Group Size
                        </p>
                        <p className="font-medium">
                          {product.option.maximum_group_size}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tour Type</p>
                        <p className="font-medium">
                          {product.option.is_private ? "Private" : "Group"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valid For</p>
                        <p className="font-medium">
                          {product.option.valid_for} hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-8">
            {/* Main Product Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">
                  Product Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-lg mr-4">
                      <Icon icon="mdi:tag" className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-50 p-2 rounded-lg mr-4">
                      <Icon
                        icon="mdi:account-group"
                        className="text-purple-600 w-5 h-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Who Will Guide</p>
                      <p className="font-medium text-gray-800">
                        {product.whoWillGuide}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-50 p-2 rounded-lg mr-4">
                      <Icon
                        icon="mdi:translate"
                        className="text-green-600 w-5 h-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="font-medium text-gray-800">
                        {product.languageType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="bg-orange-50 p-2 rounded-lg mr-4">
                      <Icon
                        icon="mdi:map-marker"
                        className="text-orange-600 w-5 h-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Departure From</p>
                      <p className="font-medium text-gray-800">
                        {product.departure_from}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-indigo-50 p-2 rounded-lg mr-4">
                      <Icon
                        icon="mdi:clock"
                        className="text-indigo-600 w-5 h-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-800">
                        {product.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Not Suitable Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800 flex items-center">
                    <Icon icon="mdi:alert-circle" className="w-5 h-5 mr-2" />
                    Not Suitable For
                  </h4>
                </div>
                <ul className="divide-y divide-gray-100">
                  {product.notSuitable.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex items-start">
                        <Icon
                          icon="mdi:close-circle"
                          className="text-yellow-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
                        />
                        <span className="text-gray-700">{item.condition}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Allowed Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-red-50">
                  <h4 className="font-semibold text-red-800 flex items-center">
                    <Icon icon="mdi:block-helper" className="w-5 h-5 mr-2" />
                    Not Allowed
                  </h4>
                </div>
                <ul className="divide-y divide-gray-100">
                  {product.notAllowed.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex items-start">
                        <Icon
                          icon="mdi:forbid"
                          className="text-red-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
                        />
                        <span className="text-gray-700">
                          {item.restriction}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Must Carry Items Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-green-50">
                  <h4 className="font-semibold text-green-800 flex items-center">
                    <Icon icon="mdi:check-circle" className="w-5 h-5 mr-2" />
                    Must Carry Items
                  </h4>
                </div>
                <ul className="divide-y divide-gray-100">
                  {product.mustCarryItems.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex items-start">
                        <Icon
                          icon="mdi:check"
                          className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
                        />
                        <span className="text-gray-700">{item.item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Icon
                    icon="mdi:contacts"
                    className="w-6 h-6 mr-2 text-blue-600"
                  />
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Emergency Contacts */}
                <div className="border border-blue-100 rounded-lg p-5 bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-4 flex items-center">
                    <Icon icon="mdi:alert-octagon" className="w-5 h-5 mr-2" />
                    Emergency Contacts
                  </h4>
                  <ul className="space-y-3">
                    {product.emergencyContacts.map((contact) => (
                      <li key={contact.id} className="flex items-center">
                        <div className="bg-white p-2 rounded-full mr-3">
                          <Icon
                            icon="mdi:phone"
                            className="text-blue-600 w-4 h-4"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {contact.name}
                          </p>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* General Contact */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                    <Icon
                      icon="mdi:information"
                      className="w-5 h-5 mr-2 text-gray-600"
                    />
                    General Contact
                  </h4>
                  <div className="prose prose-sm text-gray-700">
                    {product.contactInformation}
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Icon
                    icon="mdi:tag-search"
                    className="w-6 h-6 mr-2 text-purple-600"
                  />
                  Meta Information
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Meta Title
                  </label>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium text-gray-800">
                      {product.metaTitle}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Meta Description
                  </label>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium text-gray-800">
                      {product.metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Icon
                    icon="mdi:tag-multiple"
                    className="w-6 h-6 mr-2 text-green-600"
                  />
                  Product Keywords
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {product.productKeywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      <Icon icon="mdi:tag" className="w-4 h-4 mr-1" />
                      {keyword.keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === "policies" && (
          <div className="space-y-8">
            <div className="w-full mx-auto bg-white border rounded-[20px]">
              <div className="flex items-center justify-between p-6 border-b w-full py-4">
                <h2 className="text-xl font-semibold">Liability Information</h2>
                <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
              </div>

              {/* Cancellation Policy Section */}
              <div className="p-6 border-b space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  Cancellation Policy
                </h3>
                {/* <textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            placeholder="Enter cancellation policy..."
            className="w-full p-4 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          /> */}
                <h2 className="font-bold text-gray-600">Free Cancellation </h2>
                <p className=" text-gray-600">
                  For a full refund, you must cancel at least 24 hours before
                  the experience's start date/time*. If you cancel less than 24
                  hours before the experience's start date/time*, the amount you
                  paid will not be refunded. Any changes made less than 24 hours
                  before the experience's start date/time* will not be accepted.
                  Non-refundable{" "}
                </p>
                <p className=" text-gray-600">
                  These experiences are non-refundable and cannot be changed for
                  any reason. If you cancel or ask for an amendment, the amount
                  paid will not be refunded.
                </p>
              </div>

              {/* Terms and Conditions Section */}
              <div className="p-6  bg-white">
                <h3 className="text-lg font-semibold mb-4">
                  Terms and Conditions
                </h3>

                <div className="space-y-4 text-sm">
                  {/* Cancellation Policy */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Cancellation Policy
                    </h4>
                    <p className="mt-2 text-green-700">
                      Full refund available if cancelled{" "}
                      <span className="font-semibold">24+ hours before</span>{" "}
                      the tour.
                      <span className="block mt-1 text-red-600">
                        No refunds for cancellations under 24 hours.
                      </span>
                    </p>
                  </div>

                  {/* Booking Policy */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      1. Booking Policy
                    </h4>
                    <p className="mt-2 text-blue-700">
                      Confirmation email sent after payment. Present voucher at
                      check-in.
                    </p>
                  </div>

                  {/* Changes Policy */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      2. Changes Policy
                    </h4>
                    <p className="mt-2 text-purple-700">
                      Date/time changes subject to availability (must request
                      24+ hours prior).
                    </p>
                  </div>

                  {/* No-Show Policy */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h4 className="font-medium text-amber-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      3. No-Show Policy
                    </h4>
                    <p className="mt-2 text-amber-700">
                      Late arrivals after 15 minutes forfeit the tour without
                      refund.
                    </p>
                  </div>

                  {/* Weather Policy */}
                  <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                    <h4 className="font-medium text-sky-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                      </svg>
                      4. Weather Policy
                    </h4>
                    <p className="mt-2 text-sky-700">
                      Rainchecks offered for severe weather cancellations
                      initiated by us.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  By booking, you agree to these terms. Policies last updated{" "}
                  {new Date().toLocaleDateString()}.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Booking Information
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <p className="text-gray-700 whitespace-pre-line">
                  {product.bookingInformation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Timestamps */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
          <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
          <p className="mt-2 sm:mt-0">
            Last Updated: {new Date(product.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
