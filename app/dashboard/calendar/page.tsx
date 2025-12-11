"use client";

import { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  getYear,
  setYear,
  setMonth,
} from "date-fns";
import CalanderSlotBlock from "./CalanderSlotBlock";
import { fetchCalanderData } from "@/services/availabilityService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { productColors } from "./items";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Calendar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedDate, setSelectedDate] = useState<any>(null);

const refetchData = async () => {
  setLoading(true);
  try {
    const data = await fetchCalanderData(
      selectedMonth,
      selectedYear.toString()
    );
    setCalendarData(data);
    // Also update the selected product if it exists
    if (selectedProduct && selectedDate) {
      const dayString = format(selectedDate, "yyyy-MM-dd");
      const updatedDayData = data.find((d) => d.date === dayString);
      if (updatedDayData) {
        const updatedProduct = updatedDayData.products.find(
          (p:any) => p.product_id === selectedProduct.product_id
        );
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCalanderData(
          selectedMonth,
          selectedYear.toString()
        );
        setCalendarData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleEventClick = (product: any, date: Date) => {
    setSelectedProduct(product);
    setSelectedDate(date);
    setIsModalOpen(true);
    console.log(product);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(getYear(newDate));
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(getYear(newDate));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekStartsOn = 0;
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn }),
    end: endOfWeek(monthEnd, { weekStartsOn }),
  });

  const getProductColor = (productId: number): string => {
    const colorIndex = productId % productColors.length;
    return productColors[colorIndex];
  };

  const filterProductsWithOptions = (products: Product[]): Product[] => {
    return products.filter((product) =>
      product.options.some(
        (option: any) =>
          (option.availability_type === "fixed" &&
            option.time_slots?.length > 0) ||
          (option.availability_type === "operating" &&
            option.operating_hours?.length > 0)
      )
    );
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month);
    setSelectedMonth(newMonth);
    setCurrentDate(
      setMonth(new Date(selectedYear, newMonth - 1), newMonth - 1)
    );
  };

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    setCurrentDate(setYear(new Date(selectedYear, selectedMonth - 1), newYear));
  };
 
  return (
    <div className="w-full mx-auto p-2 bg-white">
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-5 items-center">
          <button onClick={handlePrevMonth} className="text-gray-600">
            &lt; Prev
          </button>
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          )}
        </div>
        <div className="flex  gap-4">
          <div className="flex flex-col gap-2">
            <Select
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: 15 },
                  (_, i) => getYear(new Date()) - 5 + i
                )
                  .filter((year) => year >= getYear(new Date()))
                  .map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {format(new Date(selectedYear, month - 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <button onClick={handleNextMonth} className="text-gray-600">
          Next &gt;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const dayString = format(day, "yyyy-MM-dd");
          const dayData = calendarData.find((data) => data.date === dayString);
          const isToday = isSameDay(day, new Date());

          // Filter products with options
          const productsWithOptions = dayData
            ? filterProductsWithOptions(dayData.products)
            : [];

          return (
            <div
              key={index}
              className={`p-3 border rounded-lg shadow-sm cursor-pointer ${
                isCurrentMonth ? "bg-white" : "bg-gray-100"
              } ${isToday ? "bg-black text-red-700" : ""}`}
            >
              <div className="text-center font-bold mb-2 flex justify-center">
                <span
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    isToday ? "bg-black text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>
              {productsWithOptions.length > 0 && (
                <div className="space-y-2">
                  {productsWithOptions.map((product, i) => (
                    <div
                      key={i}
                      className="p-2 rounded"
                      style={{
                        backgroundColor: getProductColor(product.product_id),
                      }}
                      onClick={() => {
                        handleEventClick(product, day);
                      }}
                    >
                      <p className="font-bold text-black text-sm truncate">
                        {product.title}
                      </p>
                      {product.options.map((option, i) => (
                        <div key={i} className="mt-1">
                          {option.availability_type === "fixed" &&
                            option.time_slots && (
                              <div>
                                {option.time_slots.map((slot, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center text-xs"
                                  >
                                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                    <p>
                                      {slot.start_time} - {slot.end_time}
                                    </p>
                                    <p className="ml-auto text-gray-600">
                                      {slot.total_booked}/{slot.total_capacity}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          {option.availability_type === "operating" &&
                            option.operating_hours && (
                              <div>
                                {option.operating_hours.map((op, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center text-xs"
                                  >
                                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                    <p>
                                      {op.opening_time} - {op.closing_time}
                                    </p>
                                    <p className="ml-auto text-gray-600">
                                      {op.total_booked}/{op.total_capacity}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

     {isModalOpen && selectedProduct && (
  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogContent className="p-0 sm:max-w-[800px] h-[600px] rounded-3xl overflow-y-scroll">
      <CalanderSlotBlock
        key={selectedDate.toString() + selectedProduct.product_id}
        selectedDate={format(selectedDate, "yyyy-MM-dd")}
        product={selectedProduct}
        onSlotUpdate={refetchData}
      />
    </DialogContent>
  </Dialog>
)}
    </div>
  );
};

export default Calendar;
