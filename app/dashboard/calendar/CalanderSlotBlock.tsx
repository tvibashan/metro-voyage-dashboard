import { Input } from "@/components/ui/input";
import { BlockCalanderSlots } from "@/services/availabilityService";
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  start_time: string;
  end_time: string;
  total_capacity: number;
  total_booked: number;
  available_capacity: number;
  is_available: boolean;
}
 
interface OperatingHour {
  opening_time: string;
  closing_time: string;
  total_capacity: number;
  total_booked: number;
  available_capacity: number;
  is_available: boolean;
}

interface Option {
  option_id: number;
  name: string;
  availability_type: "fixed" | "operating";
  time_slots?: TimeSlot[];
  operating_hours?: OperatingHour[];
}

interface SlotEditState {
  option_id: number;
  availability_type: "fixed" | "operating";
  start_time: string;
  end_time: string;
  max_participants: number;
}

const CalanderSlotBlock = ({ product, selectedDate, onSlotUpdate }: any) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [edits, setEdits] = useState<SlotEditState[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize edits when product changes
  useEffect(() => {
    setEdits([]);
    setHasChanges(false);
  }, [product, selectedDate]);

  const handleToggleChange = (
    option: Option,
    slot?: TimeSlot,
    hour?: OperatingHour,
    checked?: boolean
  ) => {
    const currentCapacity = slot ? slot.total_capacity : hour?.total_capacity || 0;
    const newCapacity = checked ? (currentCapacity > 0 ? currentCapacity : 1) : 0;
    
    const edit: SlotEditState = {
      option_id: option.option_id,
      availability_type: option.availability_type,
      start_time: slot?.start_time || hour?.opening_time || "",
      end_time: slot?.end_time || hour?.closing_time || "",
      max_participants: newCapacity
    };

    setEdits(prev => {
      const existingIndex = prev.findIndex(e => 
        e.option_id === edit.option_id && 
        e.start_time === edit.start_time
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = edit;
        return updated;
      }
      return [...prev, edit];
    });

    setHasChanges(true);
  };

  const handleCapacityChange = (
    value: string,
    option: Option,
    slot?: TimeSlot,
    hour?: OperatingHour
  ) => {
    const numValue = value === '' ? 0 : parseInt(value);
    const edit: SlotEditState = {
      option_id: option.option_id,
      availability_type: option.availability_type,
      start_time: slot?.start_time || hour?.opening_time || "",
      end_time: slot?.end_time || hour?.closing_time || "",
      max_participants: isNaN(numValue) ? 0 : numValue
    };

    setEdits(prev => {
      const existingIndex = prev.findIndex(e => 
        e.option_id === edit.option_id && 
        e.start_time === edit.start_time
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = edit;
        return updated;
      }
      return [...prev, edit];
    });

    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
  if (!hasChanges || edits.length === 0) return;

  try {
    setLocalLoading(true);
    
    // Prepare all edits for API call
    const updates = edits.map(edit => ({
      option: edit.option_id,  // Changed from option_id to option
      availability_type: edit.availability_type,
      start_time: edit.start_time,
      end_time: edit.end_time,
      max_participants: edit.max_participants,
      product: product.product_id,
      date: selectedDate
    }));

    // Send all updates at once (or in batches if needed)
    await Promise.all(updates.map(update => BlockCalanderSlots(update)));

    // Refresh data
    await onSlotUpdate();
    setEdits([]);
    setHasChanges(false);
  } catch (error) {
    console.error("Error updating slots:", error);
    alert("Failed to update slots. Please try again.");
  } finally {
    setLocalLoading(false);
  }
};
  const getAvailabilityStatus = (capacity: number, booked: number) => {
    if (capacity === 0) return "Closed";
    return `${booked}/${capacity}`;
  };

  const getAvailabilityColor = (capacity: number, booked: number) => {
    if (capacity === 0) return "bg-gray-500";
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getCurrentValue = (option: Option, slot?: TimeSlot, hour?: OperatingHour) => {
    const edit = edits.find(e => 
      e.option_id === option.option_id && 
      e.start_time === (slot?.start_time || hour?.opening_time)
    );
    
    if (edit !== undefined) {
      return edit.max_participants;
    }
    return slot ? slot.total_capacity : hour?.total_capacity ?? 0;
  };

  return (
    <div className="bg-white h-full"> {/* Changed from h-screen to h-full */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mb-2">
          <div className="text-gray-500">Product Title</div>
          <div className="col-span-2 font-semibold">
            {product?.title || "-"}  <span className="text-green-600">({selectedDate})</span>
          </div>
          
          {localLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {product?.options?.length > 0 ? (
            product.options.map((option: Option, optionIndex: number) => (
              <React.Fragment key={optionIndex}>
                <div className="text-gray-500">Option</div>
                <div className="col-span-2 text-gray-600">
                  {option.name || "N/A"}
                </div>

                {option.availability_type === "fixed" &&
                option?.time_slots &&
                option?.time_slots?.length > 0 ? (
                  <>
                    <div className="text-gray-500">Time Slots</div>
                    <div className="col-span-2 space-y-3">
                      {option.time_slots.map(
                        (slot: TimeSlot, slotIndex: number) => {
                          const currentValue = getCurrentValue(option, slot);
                          const isOpen = edits.find(e => 
                            e.option_id === option.option_id && 
                            e.start_time === slot.start_time
                          )?.max_participants !== undefined || (slot?.total_capacity > 0);
                          
                          return (
                            <div
                              key={slotIndex}
                              className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <p className="text-sm font-medium">
                                    {slot.start_time} - {slot.end_time}
                                  </p>
                                  <span
                                    className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getAvailabilityColor(
                                      slot.total_capacity,
                                      slot.total_booked
                                    )}`}
                                  >
                                    {getAvailabilityStatus(
                                      slot.total_capacity,
                                      slot.total_booked
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`toggle-${option.option_id}-${slot.start_time}`}>
                                    {isOpen ? "Open" : "Closed"}
                                  </Label>
                                  <Switch
                                    id={`toggle-${option.option_id}-${slot.start_time}`}
                                    checked={isOpen}
                                    onCheckedChange={(checked) =>
                                      handleToggleChange(option, slot, undefined, checked)
                                    }
                                  />
                                </div>

                                {isOpen && (
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`capacity-${option.option_id}-${slot.start_time}`}>
                                      Capacity:
                                    </Label>
                                    <Input
                                      id={`capacity-${option.option_id}-${slot.start_time}`}
                                      type="number"
                                      value={currentValue}
                                      onChange={(e) =>
                                        handleCapacityChange(
                                          e.target.value,
                                          option,
                                          slot,
                                          undefined
                                        )
                                      }
                                      className="w-20"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </>
                ) : option.availability_type === "operating" &&
                  option.operating_hours &&
                  option.operating_hours?.length > 0 ? (
                  <>
                    <div className="text-gray-500">Operating Hours</div>
                    <div className="col-span-2 space-y-3">
                      {option?.operating_hours?.map(
                        (hour: OperatingHour, hourIndex: number) => {
                          const currentValue = getCurrentValue(option, undefined, hour);
                          const isOpen = edits.find(e => 
                            e.option_id === option.option_id && 
                            e.start_time === hour?.opening_time
                          )?.max_participants !== undefined || (hour?.total_capacity > 0);
                          
                          return (
                            <div
                              key={hourIndex}
                              className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <p className="text-sm font-medium">
                                    {hour.opening_time} - {hour.closing_time}
                                  </p>
                                  <span
                                    className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getAvailabilityColor(
                                      hour.total_capacity,
                                      hour.total_booked
                                    )}`}
                                  >
                                    {getAvailabilityStatus(
                                      hour.total_capacity,
                                      hour.total_booked
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`toggle-${option.option_id}-${hour.opening_time}`}>
                                    {isOpen ? "Open" : "Closed"}
                                  </Label>
                                  <Switch
                                    id={`toggle-${option.option_id}-${hour.opening_time}`}
                                    checked={isOpen}
                                    onCheckedChange={(checked) =>
                                      handleToggleChange(option, undefined, hour, checked)
                                    }
                                  />
                                </div>

                                {isOpen && (
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`capacity-${option.option_id}-${hour.opening_time}`}>
                                      Capacity:
                                    </Label>
                                    <Input
                                      id={`capacity-${option.option_id}-${hour.opening_time}`} 
                                      type="number"
                                      value={currentValue}
                                      onChange={(e) =>
                                        handleCapacityChange(
                                          e.target.value,
                                          option,
                                          undefined,
                                          hour
                                        )
                                      }
                                      className="w-20"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">No availability details</p>
                )}
              </React.Fragment>
            ))
          ) : (
            <p className="text-sm text-gray-600">No options available</p>
          )}
        </div>
        
        {hasChanges && (
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end">
            <Button 
              onClick={handleSaveChanges}
              disabled={localLoading}
            >
              {localLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalanderSlotBlock;