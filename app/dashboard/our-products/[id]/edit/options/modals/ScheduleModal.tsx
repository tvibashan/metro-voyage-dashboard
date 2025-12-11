"use client";
import { useOptionStore } from "@/app/store/useOptionStore";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/TimePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useEditOptionStore } from "@/app/store/useEditOptionStore";
import PricingTiersModal from "@/components/modals/PricingModal";

export default function OptionsModal({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(1);
  const { setOptionData, optionData } :any= useEditOptionStore();

  const [currentAvailabilityIndex, setCurrentAvailabilityIndex] = useState(0);

  const currentAvailability = optionData?.availabilities[
    currentAvailabilityIndex
  ] || {
    availability_type: "fixed",
    price_type: "person",
    schedule_name: "",
    start_date: undefined,
    end_date: undefined,
    fixed_time_slots: [],
    operating_hours: [],
    exceptions: [],
    pricing_tiers: [],
  };

  const [availabilityType, setAvailabilityType] = useState<
    "fixed" | "operating"
  >(currentAvailability.availability_type);

  const [priceType, setPriceType] = useState<"person" | "group">(
    currentAvailability.price_type
  );
  const [scheduleName, setScheduleName] = useState(
    currentAvailability.schedule_name
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    currentAvailability.start_date
      ? new Date(currentAvailability.start_date)
      : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    currentAvailability.end_date
      ? new Date(currentAvailability.end_date)
      : undefined
  );

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [fixed_time_slots, setFixedTimeSlots] = useState<
    { day: string; slots: { start_time: string; end_time: string }[] }[]
  >(
    daysOfWeek.map((day) => ({
      day,
      slots:
        currentAvailability.fixed_time_slots?.filter(
          (slot: any) => slot.day === day
        ) || [],
    }))
  );

  const [operating_hours, setOperatingHours] = useState<
    { day: string; hours: { opening_time: string; closing_time: string }[] }[]
  >(
    daysOfWeek.map((day) => ({
      day,
      hours:
        currentAvailability.operating_hours?.filter(
          (hour: any) => hour.day === day
        ) || [],
    }))
  );

  const [exceptions, setExceptions] = useState<
    { date: Date; opening_time: string; closing_time: string }[]
  >(
    currentAvailability.exceptions?.map((exception: any) => ({
      ...exception,
      date: new Date(exception.date),
    })) || []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intervalDuration, setIntervalDuration] = useState(60);
  const [start_time, setStartTime] = useState("09:00");
  const [end_time, setEndTime] = useState("17:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(daysOfWeek);

  const handleNextStep = async () => {
    const formattedStartDate = startDate
      ? format(startDate, "yyyy-MM-dd")
      : undefined;
    const formattedEndDate = endDate
      ? format(endDate, "yyyy-MM-dd")
      : undefined;

    const availabilityData = {
      availability_type: availabilityType,
      price_type: priceType,
      schedule_name: scheduleName,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      fixed_time_slots: fixed_time_slots.flatMap((day) =>
        day.slots.map((slot) => ({ day: day.day, ...slot }))
      ),
      operating_hours: operating_hours.flatMap((day) =>
        day.hours.map((hour) => ({ day: day.day, ...hour }))
      ),
      exceptions: exceptions.map((exception) => ({
        ...exception,
        date: format(exception.date, "yyyy-MM-dd"),
      })),
      pricing_tiers: currentAvailability.pricing_tiers || [],
    };

    const updatedAvailabilities = [...optionData?.availabilities];
    updatedAvailabilities[currentAvailabilityIndex] = availabilityData;

    setOptionData({ ...optionData, availabilities: updatedAvailabilities });

    if (step < 3) {
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

  const addAvailability = () => {
    const newAvailability = {
      availability_type: "fixed",
      price_type: "person",
      schedule_name: "",
      start_date: undefined,
      end_date: undefined,
      fixed_time_slots: [],
      operating_hours: [],
      exceptions: [],
      pricing_tiers: [],
    };

    setOptionData({
      ...optionData,
      availabilities: [...optionData?.availabilities, newAvailability],
    });
    setCurrentAvailabilityIndex(optionData?.availabilities.length);
    resetLocalState(newAvailability);
    setStep(1)
  };

  const removeAvailability = (index: number) => {
    const updatedAvailabilities = optionData?.availabilities.filter(
      (_: any, i: number) => i !== index
    );
    setOptionData({ ...optionData, availabilities: updatedAvailabilities });

    if (index === currentAvailabilityIndex) {
      setCurrentAvailabilityIndex(Math.max(0, index - 1));
      switchAvailability(Math.max(0, index - 1));
    }
  };

  const switchAvailability = (index: number) => {
    setCurrentAvailabilityIndex(index);
    const availability = optionData?.availabilities[index];
    resetLocalState(availability);
  };

  const resetLocalState = (availability: typeof currentAvailability) => {
    setAvailabilityType(availability.availability_type);
    setPriceType(availability.price_type);
    setScheduleName(availability.schedule_name);
    setStartDate(
      availability.start_date ? new Date(availability.start_date) : new Date()
    );
    setEndDate(
      availability.end_date ? new Date(availability.end_date) : undefined
    );
    setFixedTimeSlots(
      daysOfWeek.map((day) => ({
        day,
        slots:
          availability.fixed_time_slots?.filter(
            (slot: any) => slot.day === day
          ) || [],
      }))
    );
    setOperatingHours(
      daysOfWeek.map((day) => ({
        day,
        hours:
          availability.operating_hours?.filter(
            (hour: any) => hour.day === day
          ) || [],
      }))
    );
    setExceptions(
      availability.exceptions?.map((exception: any) => ({
        ...exception,
        date: new Date(exception.date),
      })) || []
    );
  };

  const addFixedTimeSlot = (day: string) => {
    setFixedTimeSlots((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              slots: [...d.slots, { start_time: "09:00", end_time: "10:00" }],
            }
          : d
      )
    );
  };

  const addOperatingHours = (day: string) => {
    setOperatingHours((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              hours: [
                ...d.hours,
                { opening_time: "09:00", closing_time: "17:00" },
              ],
            }
          : d
      )
    );
  };

  const addException = () => {
    setExceptions([
      ...exceptions,
      { date: new Date(), opening_time: "10:00", closing_time: "16:00" },
    ]);
  };

  const handlePricingTiersChange = (pricing_tiers: PricingTier[]) => {
    const updatedAvailabilities = optionData.availabilities.map(
      (availability: Availability, index: number) =>
        index === currentAvailabilityIndex
          ? { ...availability, pricing_tiers:pricing_tiers }
          : availability
    );

    setOptionData({ ...optionData, availabilities: updatedAvailabilities });
  };

  const generateTimeSlots = () => {
    const start = new Date(`1970-01-01T${start_time}:00`);
    const end = new Date(`1970-01-01T${end_time}:00`);
    const interval = intervalDuration * 60 * 1000;

    const newSlots: { start_time: string; end_time: string }[] = [];
    let currentTime = start;

    while (currentTime < end) {
      const end_timeSlot = new Date(currentTime.getTime() + interval);
      if (end_timeSlot > end) break;

      newSlots.push({
        start_time: format(currentTime, "HH:mm"),
        end_time: format(end_timeSlot, "HH:mm"),
      });

      currentTime = end_timeSlot;
    }

    setFixedTimeSlots((prev) =>
      prev.map((d) =>
        selectedDays.includes(d.day)
          ? { ...d, slots: [...d.slots, ...newSlots] }
          : d
      )
    );

    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold mb-6">Schedule and Availability</h2>
      {/* Availability Tabs */}
      <div className="flex gap-2 mb-4">
        {optionData?.availabilities.map((_: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Button
              onClick={() => switchAvailability(index)}
              variant={
                currentAvailabilityIndex === index ? "default" : "outline"
              }
            >
              Availability {index + 1}
            </Button>
            <Button
              onClick={() => removeAvailability(index)}
              variant="ghost"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addAvailability} variant="outline">
          + Add Availability
        </Button>
      </div>
      {/* Step 1: Availability Type and Pricing */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <Label>Availability Type</Label>
            <Select
              value={availabilityType}
              onValueChange={(value: "fixed" | "operating") =>
                setAvailabilityType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Time Slots</SelectItem>
                <SelectItem value="operating">Operating Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Pricing Type</Label>
            <Select
              value={priceType}
              onValueChange={(value: "person" | "group") => setPriceType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Price per Person</SelectItem>
                <SelectItem value="group">Price per Group/Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Schedule Name</Label>
            <Input
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="E.g., Summer Schedule"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
      {/* Step 2: Time Slots or Operating Hours */}
      {step === 2 && (
        <div className="space-y-6">
          {availabilityType === "fixed" ? (
            <>
              <div className="flex flex-col gap-4">
                <Label>Fixed Time Slots</Label>
                <Button onClick={() => setIsModalOpen(true)} className="w-fit">
                  Generate Regular Intervals
                </Button>
                {fixed_time_slots.map((dayData) => (
                  <div key={dayData.day} className="space-y-4">
                    <h3 className="font-medium">{dayData.day}</h3>
                    {dayData.slots.map((slot, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 items-center"
                      >
                        <TimePicker
                          value={slot.start_time}
                          onChange={(value) => {
                            const updatedSlots = fixed_time_slots.map((d) =>
                              d.day === dayData.day
                                ? {
                                    ...d,
                                    slots: d.slots.map((s, i) =>
                                      i === index
                                        ? { ...s, start_time: value }
                                        : s
                                    ),
                                  }
                                : d
                            );
                            setFixedTimeSlots(updatedSlots);
                          }}
                        />
                        <TimePicker
                          value={slot.end_time}
                          onChange={(value) => {
                            const updatedSlots = fixed_time_slots.map((d) =>
                              d.day === dayData.day
                                ? {
                                    ...d,
                                    slots: d.slots.map((s, i) =>
                                      i === index
                                        ? { ...s, end_time: value }
                                        : s
                                    ),
                                  }
                                : d
                            );
                            setFixedTimeSlots(updatedSlots);
                          }}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const updatedSlots = fixed_time_slots.map((d) =>
                              d.day === dayData.day
                                ? {
                                    ...d,
                                    slots: d.slots.filter(
                                      (_, i) => i !== index
                                    ),
                                  }
                                : d
                            );
                            setFixedTimeSlots(updatedSlots);
                          }}
                          className="bg-transparent shadow-none w-fit border hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => addFixedTimeSlot(dayData.day)}
                      className="bg-transparent shadow-none w-fit border hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4 text-gray-900" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <Label>Operating Hours</Label>
                {operating_hours.map((dayData) => (
                  <div key={dayData.day} className="space-y-4">
                    <h3 className="font-medium">{dayData.day}</h3>
                    {dayData.hours.map((hour, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 items-center"
                      >
                        <TimePicker
                          value={hour.opening_time}
                          onChange={(value) => {
                            const updatedHours = operating_hours.map((d) =>
                              d.day === dayData.day
                                ? {
                                    ...d,
                                    hours: d.hours.map((h, i) =>
                                      i === index
                                        ? { ...h, opening_time: value }
                                        : h
                                    ),
                                  }
                                : d
                            );
                            setOperatingHours(updatedHours);
                          }}
                        />
                        <TimePicker
                          value={hour.closing_time}
                          onChange={(value) => {
                            const updatedHours = operating_hours.map((d) =>
                              d.day === dayData.day
                                ? {
                                    ...d,
                                    hours: d.hours.map((h, i) =>
                                      i === index
                                        ? { ...h, closing_time: value }
                                        : h
                                    ),
                                  }
                                : d
                            );
                            setOperatingHours(updatedHours);
                          }}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const updatedHours = operating_hours.map((d) =>
                              d.day === dayData.day
                                ? {
                                    ...d,
                                    hours: d.hours.filter(
                                      (_, i) => i !== index
                                    ),
                                  }
                                : d
                            );
                            setOperatingHours(updatedHours);
                          }}
                          className="bg-transparent shadow-none w-fit border hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => addOperatingHours(dayData.day)}
                      className="bg-transparent shadow-none w-fit border hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4 text-gray-900" />
                    </Button>
                  </div>
                ))}
              </div>
              {/* Exceptions Section (Only for Operating Hours) */}
              <div className="flex flex-col gap-4">
                <Label>Exceptions</Label>
                {exceptions.map((exception, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 items-center"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {exception.date
                            ? format(exception.date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={exception.date}
                          onSelect={(date) => {
                            const updatedExceptions = [...exceptions];
                            updatedExceptions[index].date = date || new Date();
                            setExceptions(updatedExceptions);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <TimePicker
                      value={exception.opening_time}
                      onChange={(value) => {
                        const updatedExceptions = [...exceptions];
                        updatedExceptions[index].opening_time = value;
                        setExceptions(updatedExceptions);
                      }}
                    />
                    <TimePicker
                      value={exception.closing_time}
                      onChange={(value) => {
                        const updatedExceptions = [...exceptions];
                        updatedExceptions[index].closing_time = value;
                        setExceptions(updatedExceptions);
                      }}
                    />
                    <Button
                      onClick={() => {
                        const updatedExceptions = exceptions.filter(
                          (_, i) => i !== index
                        );
                        setExceptions(updatedExceptions);
                      }}
                      className="bg-transparent shadow-none w-fit border hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addException} className="w-fit">
                  Add Exception
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {/* Step 3: Pricing Tiers */}
      {step === 3 && (
        <PricingTiersModal
          pricing_tiers={currentAvailability.pricing_tiers || []}
          onPricingTiersChange={handlePricingTiersChange}
          onNext={onNext}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button onClick={handlePreviousStep} variant="outline">
            Previous
          </Button>
        )}
        <Button onClick={handleNextStep}>{step === 3 ? "Done" : "Next"}</Button>
      </div>

      {/* Modal for Generating Regular Intervals */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Regular Time Intervals</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Create a start time every...</Label>
              <Input
                type="number"
                value={intervalDuration}
                onChange={(e) =>
                  setIntervalDuration(parseInt(e.target.value, 10))
                }
                placeholder="Interval in minutes"
              />
            </div>
            <div>
              <Label>Between</Label>
              <div className="grid grid-cols-2 gap-4">
                <TimePicker
                  value={start_time}
                  onChange={(value) => setStartTime(value)}
                />
                <TimePicker
                  value={end_time}
                  onChange={(value) => setEndTime(value)}
                />
              </div>
            </div>
            <div>
              <Label>Apply to the following days</Label>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDays([...selectedDays, day]);
                        } else {
                          setSelectedDays(
                            selectedDays.filter((d) => d !== day)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={generateTimeSlots}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
