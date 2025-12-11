"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProductEditStore } from "@/app/store/useEditProductStore";
import { useEditStepStore } from "@/app/store/useEditStepStore";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const DAY_CHOICES = [
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
  { value: "SUN", label: "Sunday" },
];

const Offer: React.FC = () => {
  const { completeStep, nextStep, prevStep } = useEditStepStore();
  const { productData, setProductData }: any = useProductEditStore();
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [activeAvailabilityIndex, setActiveAvailabilityIndex] =
    useState<number>(0);
  const currentAvailability = availabilities[activeAvailabilityIndex];
  const availabilityTiers = currentAvailability?.pricing_tiers || [];

  const [formData, setFormData]: any = useState<DiscountOffer>({
    title: "",
    tiers: [],
    days: [],
    start_time: null,
    end_time: null,
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    min_participants: 1,
    max_participants: 1,
    percent: 10,
    fixed_amount: null,
    discount_type: "percent",
    availability: currentAvailability?.id || null,
  });

  useEffect(() => {
    if (productData.option?.availabilities) {
      setAvailabilities(productData.option.availabilities);
      // Initialize form with first availability's discount if exists
      const firstDiscount = productData.option.availabilities[0]?.discount;
      if (firstDiscount) {
        setFormData({
          ...firstDiscount,
          days: firstDiscount.days || [],
          availability: productData.option.availabilities[0]?.id || null,
        });
      }
    }
  }, [productData.option]);

  useEffect(() => {
    // Update form when active availability changes
    const currentDiscount = availabilities[activeAvailabilityIndex]?.discount;
    const currentAvailabilityId = availabilities[activeAvailabilityIndex]?.id;

    if (currentDiscount) {
      setFormData({
        ...currentDiscount,
        days: currentDiscount.days || [],
        availability: currentAvailabilityId || null,
      });
    } else {
      setFormData({
        title: "",
        tiers: [],
        days: [],
        start_time: null,
        end_time: null,
        start_date: format(new Date(), "yyyy-MM-dd"),
        end_date: format(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ),
        min_participants: 1,
        max_participants: 1,
        percent: 10,
        fixed_amount: null,
        discount_type: "percent",
        availability: currentAvailabilityId || null,
      });
    }
  }, [activeAvailabilityIndex, availabilities]);

  const handleTierChange = (tierId: number, isChecked: boolean) => {
    setFormData((prev: any) => {
      if (isChecked) {
        const tierToAdd = availabilityTiers.find((t: any) => t.id === tierId);
        if (!tierToAdd) return prev;

        return {
          ...prev,
          tiers: [...prev.tiers, tierToAdd],
        };
      } else {
        return {
          ...prev,
          tiers: prev.tiers.filter((t: any) => t.id !== tierId),
        };
      }
    });
  };

  const handleDayChange = (day: string, isChecked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      days: isChecked
        ? [...prev.days, day]
        : prev.days.filter((d: any) => d !== day),
    }));
  };

  const handleSaveDiscount = () => {
    if (!formData.availability) {
      toast.error("No availability selected");
      return;
    }

    // Validate time fields if days are selected
    if (
      formData.days.length > 0 &&
      (!formData.start_time || !formData.end_time)
    ) {
      toast.error("Time window is required when specific days are selected");
      return;
    }

    // Prepare the data for backend
    const discountData = {
      ...formData,
      days: formData.days, // Keep as array
      availability: formData.availability,
    };

    // Update local state
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[activeAvailabilityIndex] = {
      ...updatedAvailabilities[activeAvailabilityIndex],
      discount: discountData,
    };
    setAvailabilities(updatedAvailabilities);
    toast.success("Discount saved successfully");
  };

  const handleRemoveDiscount = () => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[activeAvailabilityIndex] = {
      ...updatedAvailabilities[activeAvailabilityIndex],
      discount: null,
    };
    setAvailabilities(updatedAvailabilities);
    setFormData({
      title: "",
      tiers: [],
      days: [],
      start_time: null,
      end_time: null,
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      min_participants: null,
      max_participants: null,
      percent: 10,
      fixed_amount: null,
      discount_type: "percent",
      availability: availabilities[activeAvailabilityIndex]?.id || null,
    });
    toast.success("Discount removed successfully");
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    // Prepare discount offers for backend
    const discountOffers = availabilities
      .filter((avail) => avail.discount)
      .map((avail: any) => ({
        ...avail.discount,
        availability: avail.id,
        tiers: avail.discount.tiers?.map((tier: any) => tier.id) || [],
        days: avail.discount.days || [], // Send as array
      }));

    setProductData({
      ...productData,
      discount_offers: discountOffers,
    });

    completeStep(1);
    nextStep();
  };

  const currentDiscount = availabilities[activeAvailabilityIndex]?.discount;

  return (
    <div className="w-full mx-auto space-y-6">
      {availabilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Availability Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Availability Tabs */}
              <Tabs
                value={activeAvailabilityIndex.toString()}
                onValueChange={(value) =>
                  setActiveAvailabilityIndex(parseInt(value))
                }
              >
                <TabsList className="grid w-full grid-cols-3 gap-2 h-auto">
                  {availabilities.map((availability, index) => (
                    <TabsTrigger
                      key={availability.id}
                      value={index.toString()}
                      className="flex items-center gap-2"
                    >
                      {availability.discount ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          <span>{availability.schedule_name}</span>
                        </>
                      ) : (
                        <span>{availability.schedule_name}</span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Discount Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Title*</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      placeholder="Early Bird Discount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.discount_type === "percent" ? (
                    <div>
                      <Label htmlFor="percent">Percentage*</Label>
                      <Input
                        id="percent"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.percent}
                        onChange={(e) =>
                          handleFormChange("percent", parseInt(e.target.value))
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="fixed_amount">Fixed Amount*</Label>
                      <Input
                        id="fixed_amount"
                        type="number"
                        min="0"
                        value={formData.fixed_amount || ""}
                        onChange={(e) =>
                          handleFormChange(
                            "fixed_amount",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                      />
                    </div>
                  )}

                  <div>
                    <Label>Discount Type*</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value: "percent" | "fixed") => {
                        handleFormChange("discount_type", value);
                        if (value === "percent") {
                          handleFormChange("fixed_amount", null);
                        } else {
                          handleFormChange("percent", 0);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_participants">
                      Min Participants (Optional)
                    </Label>
                    <Input
                      id="min_participants"
                      type="number"
                      min="1"
                      value={formData.min_participants || ""}
                      onChange={(e) =>
                        handleFormChange(
                          "min_participants",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_participants">
                      Max Participants (Optional)
                    </Label>
                    <Input
                      id="max_participants"
                      type="number"
                      min="1"
                      value={formData.max_participants || ""}
                      onChange={(e) =>
                        handleFormChange(
                          "max_participants",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date*</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        handleFormChange("start_date", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date*</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        handleFormChange("end_date", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Label>
                    Apply Discount to Specific Tiers (Select none to apply to
                    all)
                  </Label>
                  <div className="flex flex-wrap gap-5 items-center">
                    {availabilityTiers.map((tier: any) => (
                      <div
                        key={tier.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`tier-${tier.id}`}
                          checked={formData.tiers?.some(
                            (t: any) => t.id === tier.id
                          )}
                          onCheckedChange={(checked) =>
                            handleTierChange(tier.id, checked === true)
                          }
                        />
                        <Label htmlFor={`tier-${tier.id}`}>
                          {tier.participant_type?.name || "All"} -
                          {tier.min_participants}-{tier.max_participants}{" "}
                          participants (${tier.price})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <Label>Days of Week (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DAY_CHOICES.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-4"
                      >
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={formData.days?.includes(day.value)}
                          onCheckedChange={(checked) =>
                            handleDayChange(day.value, checked === true)
                          }
                        />
                        <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.days.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_time">Start Time*</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) =>
                          handleFormChange("start_time", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">End Time*</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) =>
                          handleFormChange("end_time", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {currentDiscount && (
                    <Button
                      variant="destructive"
                      onClick={handleRemoveDiscount}
                      className="bg-red-100 text-red-600 hover:bg-red-300"
                    >
                      Remove Discount
                    </Button>
                  )}
                  <Button
                    onClick={handleSaveDiscount}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-300"
                    disabled={
                      !formData.title ||
                      !formData.start_date ||
                      !formData.end_date
                    }
                  >
                    {currentDiscount ? "Update Discount" : "Add Discount"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default Offer;
