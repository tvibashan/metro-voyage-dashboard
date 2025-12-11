"use client";
import React, { useState, useEffect, use } from "react";
import { Icon } from "@iconify/react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import Link from "next/link";
import { fetchCustomerDetails } from "@/services/userService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const options = {
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
};

interface IReview {
  product_image: string;
  product_title: string;
  rating: number;
  comment: string;
}

export default function CustomerDetailsView({ params }: { params: any }) {
  const [customer, setCustomer] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const unwrappedParams: any = use(params);
  const [filters, setFilters] = useState({
    month: "all",
    year: "all",
  });

  // Debounce function
  const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedFilters = useDebounce(filters, 300);

  // Load customer data
  const loadCustomerDetails = async (params?: any) => {
    try {
      const customerData = await fetchCustomerDetails(unwrappedParams.id, params);
      setCustomer(customerData);
    } catch (error) {
      setError("Failed to fetch customer details.");
    } finally {
      setInitialLoading(false);
      setFilterLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setInitialLoading(true);
    loadCustomerDetails();
  }, [unwrappedParams.id]);

  // Filter changes
  useEffect(() => {
    if (!initialLoading) {
      setFilterLoading(true);
      const params = {
        ...(debouncedFilters.month !== "all" && { month: debouncedFilters.month }),
        ...(debouncedFilters.year !== "all" && { year: debouncedFilters.year }),
      };
      loadCustomerDetails(params);
    }
  }, [debouncedFilters]);

  if (initialLoading) {
    return <FullPageSkeleton />;
  }

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!customer) return <div className="p-4">No customer data found.</div>;

  const bookingCounts = {
    total: customer.total_bookings,
    active: customer.reserved_bookings,
    completed: customer.confirmed_bookings,
    cancelled: customer.cancelled_bookings,
  };

  const totalBookings = bookingCounts.total || 1;
  const activePercentage = ((bookingCounts.active / totalBookings) * 100).toFixed(2);
  const completedPercentage = ((bookingCounts.completed / totalBookings) * 100).toFixed(2);
  const cancelledPercentage = ((bookingCounts.cancelled / totalBookings) * 100).toFixed(2);

  const bookingOverviewData = {
    labels: ["Reserved", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          bookingCounts.active,
          bookingCounts.completed,
          bookingCounts.cancelled,
        ],
        backgroundColor: ["#10B981", "#9333EA", "#EF4444"],
        hoverBackgroundColor: ["#10B981", "#3B82F6", "#EF4444"],
      },
    ],
  };

  const processBookings = (bookings: any[]) => {
    return bookings?.map((booking: any) => ({
      id: booking.id,
      image: booking.product_thumbnail,
      tourName: booking.product_title,
      status: booking.status,
      statusColor:
        booking.status === "Reserved"
          ? "bg-yellow-500"
          : booking.status === "Cancelled"
          ? "bg-red-500"
          : "bg-green-500",
      bookingCode: `#${booking.id}`,
      persons: booking.participants?.reduce(
        (acc: number, participant: any) => acc + (participant.quantity || 0),
        0
      ) || 0,
      date: booking.departure_date_time 
        ? new Date(booking.departure_date_time).toLocaleDateString() 
        : "N/A",
    })) || [];
  };

  const recentBookings = processBookings(customer.recent_bookings);
  const allBookings = processBookings(customer.all_bookings);

  const renderFilterControls = () => (
    <div className="flex items-center gap-4 mb-4 p-4 bg-white rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Filter by:</span>
        <Select
          value={filters.month}
          onValueChange={(value) => setFilters({ ...filters, month: value })}
          disabled={filterLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i+1} value={`${i+1}`}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Select
          value={filters.year}
          onValueChange={(value) => setFilters({ ...filters, year: value })}
          disabled={filterLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {Array.from({ length: 5 }, (_, i) => (
              <SelectItem key={i} value={`${new Date().getFullYear() - i}`}>
                {new Date().getFullYear() - i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filterLoading && (
        <Icon icon="eos-icons:loading" className="text-blue-500 text-lg" />
      )}
    </div>
  );

  const renderTabContent = () => {
    if (filterLoading) {
      return (
        <div className="bg-white p-4 rounded-b-xl">
          {renderFilterControls()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookingOverviewSkeleton />
            <RecentBookingsSkeleton />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "Overview":
        return (
          <div className="bg-white p-4 rounded-b-xl">
            {renderFilterControls()}
            <p className="font-semibold text-sm">Booking Overview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <div className="flex flex-col md:flex-row items-center gap-20">
                <div className="relative w-48 h-48">
                  <Pie data={bookingOverviewData} options={options} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                    <span className="text-white absolute top-5 right-[70px] font-bold text-sm">
                      {cancelledPercentage}%
                    </span>
                    <span className="text-white absolute top-10 right-5 font-bold text-sm">
                      {activePercentage}%
                    </span>
                    <span className="text-white absolute top-32 font-bold text-sm">
                      {completedPercentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="font-medium text-gray-900">Total booking</span>
                    <span className="text-gray-700">{bookingCounts.total}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="font-medium text-gray-900">Active booking</span>
                    <span className="text-gray-700">{bookingCounts.active}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                    <span className="font-medium text-gray-900">Completed booking</span>
                    <span className="text-gray-700">{bookingCounts.completed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="font-medium text-gray-900">Cancelled booking</span>
                    <span className="text-gray-700">{bookingCounts.cancelled}</span>
                  </div>
                </div>
              </div>

              <div className="border-b py-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h3 className="text-sm font-bold">Recent Bookings</h3>
                  <button className="text-sm text-blue-600 mt-2 sm:mt-0">
                    See All
                  </button>
                </div>
                <ul className="space-y-4">
                  {recentBookings.map((booking: any, index: number) => (
                    <BookingCard key={index} booking={booking} />
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full py-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold">Feedback</h3>
                <button className="text-sm text-blue-600">See All</button>
              </div>
              <ul className="space-y-4">
                {customer?.recent_reviews?.map((review: IReview, index: number) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </ul>
            </div>
          </div>
        );
      case "Bookings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4">
            {renderFilterControls()}
            <ul className="space-y-4">
              {allBookings.map((booking: any, index: number) => (
                <React.Fragment key={index}>
                  <div className="flex justify-between items-center">
                    <div>
                      <li className="flex items-center space-x-4">
                        <img
                          src={booking.image}
                          alt={booking.tourName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{booking.tourName}</p>
                        </div>
                      </li>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 my-4">
                        <span className={`${booking.statusColor} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                          {booking.status}
                        </span>
                        <span className="flex gap-1">
                          <Icon icon="lsicon:coupon-outline" className="text-lg text-black" />
                          {booking.bookingCode}
                        </span>
                        <span className="flex gap-1">
                          <Icon icon="iconoir:user" className="text-xl text-black" />
                          {booking.persons}
                        </span>
                        <span className="flex gap-1">
                          <Icon icon="solar:calendar-outline" className="text-xl text-black" />
                          {booking.date}
                        </span>
                      </div>
                    </div>
                    <div className="md:text-right text-left mt-4 md:mt-0">
                      <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                        <span className="text-xl"><Icon icon="jam:shopping-cart" /></span>
                        {booking.date}
                      </p>
                      <button className="mt-2 text-blue-500 text-xs bg-blue-600 bg-opacity-20 px-3 py-1 rounded-3xl">
                        See Details
                      </button>
                    </div>
                  </div>
                  {index < allBookings.length - 1 && <hr className="my-4" />}
                </React.Fragment>
              ))}
            </ul>
          </div>
        );
      case "Reviews":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-4">
              {customer?.recent_reviews?.map((review: IReview, index: number) => (
                <ReviewCard key={index} review={review} />
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2 min-h-screen">
      <h1 className="text-2xl font-bold">Customer Details</h1>
      
      <div className="rounded-3xl">
        <CustomerHeader customer={customer} unwrappedParams={unwrappedParams} />
        
        <div className="flex space-x-4 bg-white p-4 rounded-t-xl">
          {[
            { name: "Overview", icon: "mynaui:hash" },
            { name: "Bookings", icon: "mynaui:clock-hexagon" },
            { name: "Reviews", icon: "zondicons:exclamation-outline" },
          ].map((tab, index) => (
            <button
              key={index}
              className={`text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === tab.name
                  ? "text-black bg-gray-200 px-3 py-2 rounded-md"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <Icon icon={tab.icon} className="text-lg" />
              {tab.name}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}

// Componentized parts for better readability
const FullPageSkeleton = () => (
  <div className="p-2 min-h-screen">
    <Skeleton className="h-8 w-64 mb-4" />
    <div className="flex items-center justify-between mb-6 bg-white p-4 mt-5 rounded-xl space-x-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
    <div className="bg-white p-4 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookingOverviewSkeleton />
        <RecentBookingsSkeleton />
      </div>
    </div>
  </div>
);

const BookingOverviewSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center gap-20">
    <Skeleton className="w-48 h-48 rounded-full" />
    <div className="space-y-2 text-sm">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  </div>
);

const RecentBookingsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CustomerHeader = ({ customer, unwrappedParams }: { customer: any, unwrappedParams: any }) => (
  <div className="flex items-center justify-between mb-6 bg-white p-4 mt-5 rounded-xl">
    <div className="flex items-center space-x-4">
      <img
        src={customer.image || "/default/image.jpg"}
        alt="Customer"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h2 className="text-lg font-bold">{customer.email}</h2>
        <p className="text-sm text-gray-500">
          ID: {customer.id} |{" "}
          {customer.country && customer.city && customer.address
            ? `${customer.country} - ${customer.city} - ${customer.address}`
            : "Address not available"}
        </p>
        <div className="flex space-x-2 mt-2">
          <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {customer.phone || "No phone"}
          </span>
          <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {customer.date_of_birth || "No DOB"}
          </span>
          <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {customer.blood_group || "No blood group"}
          </span>
        </div>
      </div>
    </div>
    <Link href={`/dashboard/customers/${unwrappedParams.id}/edit`}>
      <button className="bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg flex items-center space-x-2">
        <span>Edit</span>
        <Icon icon="mdi:chevron-down" className="w-4 h-4" />
      </button>
    </Link>
  </div>
);

const BookingCard = ({ booking }: { booking: any }) => (
  <li className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
    <img
      src={booking.image}
      alt={booking.tourName}
      className="w-12 h-12 rounded-lg object-cover"
    />
    <div className="flex-1">
      <p className="font-medium text-gray-800 text-[15px]">{booking.tourName}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
        <span className={`${booking.statusColor} text-xs text-white font-medium px-2 py-1 rounded-full`}>
          {booking.status}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="lsicon:coupon-outline" className="text-sm text-black" />
          {booking.bookingCode}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="iconoir:user" className="text-sm text-black" />
          {booking.persons}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="solar:calendar-outline" className="text-sm text-black" />
          {booking.date}
        </span>
      </div>
    </div>
  </li>
);

const ReviewCard = ({ review }: { review: IReview }) => (
  <div>
    <li className="flex items-center space-x-4">
      <img
        src={review.product_image}
        alt={review.product_title}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{review.product_title}</p>
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              icon="mdi:star"
              className={`h-6 w-6 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className="text-[12px] my-4">{review.comment}</p>
      </div>
    </li>
    <hr />
  </div>
);