"use client";
import { useEffect, useState } from "react";
import { useOptionStore } from "@/app/store/useOptionStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function MeetingPoint({ onNext }: any) {
  const { optionData, setOptionData } = useOptionStore();

  // State management
  const [meetingType, setMeetingType] = useState<"setMeetingPoint" | "pickUp">(
    optionData.meeting_point_type === "choose_meeting_point" ? "pickUp" : "setMeetingPoint"
  );
  const [meetingPointDescription, setMeetingPointDescription] = useState(
    optionData.meet?.description || ""
  );
  const [dropOffDescription, setDropOffDescription] = useState(
    optionData.drop?.description || ""
  );
  const [arrivalTime, setArrivalTime] = useState("10 minutes before the activity");
  const [dropOffPlace, setDropOffPlace] = useState<"same_place" | "different_place" | "no_service">(
    optionData.drop_off_type || "same_place"
  );
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [googleMapsError, setGoogleMapsError] = useState(false);

  // Popover states
  const [openMeetSuggestions, setOpenMeetSuggestions] = useState(false);
  const [openDropSuggestions, setOpenDropSuggestions] = useState(false);

  // Address states (for both Google and manual input)
  const [meetingPointAddress, setMeetingPointAddress] = useState(
    optionData.meet?.address || ""
  );
  const [dropOffAddress, setDropOffAddress] = useState(
    optionData.drop?.address || ""
  );

  // Google Places Autocomplete
  const {
    ready: meetReady,
    value: meetValue,
    suggestions: { status: meetStatus, data: meetData },
    setValue: setMeetValue,
    clearSuggestions: clearMeetSuggestions,
  } = usePlacesAutocomplete();

  const {
    ready: dropReady,
    value: dropValue,
    suggestions: { status: dropStatus, data: dropData },
    setValue: setDropValue,
    clearSuggestions: clearDropSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    // Initialize with existing values
    if (optionData.meet?.address) {
      setMeetingPointAddress(optionData.meet.address);
      setMeetValue(optionData.meet.address, false);
    }
    if (optionData.drop?.address) {
      setDropOffAddress(optionData.drop.address);
      setDropValue(optionData.drop.address, false);
    }
    if (optionData.drop?.description) setDropOffDescription(optionData.drop.description);
  }, []);

  useEffect(() => {
    // Check if Google Maps is available
    if (typeof window !== "undefined" && !window.google) {
      setUseGoogleMaps(false);
      setGoogleMapsError(true);
    }
  }, []);

  const handleMeetSelect = async (address: string) => {
    setMeetValue(address, false);
    setMeetingPointAddress(address);
    setOpenMeetSuggestions(false);
    clearMeetSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      setOptionData({
        ...optionData,
        meet: {
          address,
          landmark: "",
          description: meetingPointDescription,
          latitude: lat,
          longitude: lng,
        },
        meeting_point_type: meetingType === "setMeetingPoint" ? "set_meeting_point" : "choose_meeting_point",
      });
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to get location details. Using manual address.");
      setUseGoogleMaps(false);
      setGoogleMapsError(true);
    }
  };

  const handleDropSelect = async (address: string) => {
    setDropValue(address, false);
    setDropOffAddress(address);
    setOpenDropSuggestions(false);
    clearDropSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      setOptionData({
        ...optionData,
        drop: {
          address,
          landmark: "",
          description: dropOffDescription,
          latitude: lat,
          longitude: lng,
        },
        drop_off_type: dropOffPlace,
      });
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to get drop-off location details. Using manual address.");
      setUseGoogleMaps(false);
      setGoogleMapsError(true);
    }
  };

  const handleManualAddressChange = (type: 'meet' | 'drop', value: string) => {
    if (type === 'meet') {
      setMeetingPointAddress(value);
      setOptionData({
        ...optionData,
        meet: {
          ...optionData.meet,
          address: value,
          latitude: 0,
          longitude: 0,
        }
      });
    } else {
      setDropOffAddress(value);
      setOptionData({
        ...optionData,
        drop: {
          ...optionData.drop,
          address: value,
          latitude: 0,
          longitude: 0,
        }
      });
    }
  };

  const handleDone = async () => {
    if (meetingType === "setMeetingPoint" && !meetingPointAddress.trim()) {
      toast.error("Please provide a meeting point address.");
      return;
    }

    if (dropOffPlace === "different_place" && !dropOffAddress.trim()) {
      toast.error("Please provide a drop-off address.");
      return;
    }

    // Final update with all data
    setOptionData({
      ...optionData,
      meet: {
        ...optionData.meet,
        address: meetingPointAddress,
        description: meetingPointDescription,
      },
      drop: dropOffPlace === "different_place" ? {
        ...optionData.drop,
        address: dropOffAddress,
        description: dropOffDescription,
      } : undefined,
    });

    onNext();
  };

  return (
    <div className="p-4 space-y-6">
      {googleMapsError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Google Maps API not available. Using manual input mode.</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">New Options</h2>
        <h3 className="text-xl font-semibold text-gray-800">Meeting Point or Pickup</h3>
      </div>

      {/* Meeting Type Section */}
      <div className="space-y-4">
        <Label className="font-medium">How do customers get to the activity?</Label>
        <RadioGroup
          value={meetingType}
          onValueChange={(value: "setMeetingPoint" | "pickUp") => setMeetingType(value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="setMeetingPoint" id="setMeetingPoint" />
            <Label htmlFor="setMeetingPoint">They go to a set meeting point</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="pickUp" id="pickUp" />
            <Label htmlFor="pickUp">
              They can choose where you pick them up from certain areas or a list of places
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Meeting Point Section */}
      {meetingType === "setMeetingPoint" && (
        <div className="space-y-4">
          <Label className="font-medium">
            Meeting Point <span className="text-red-500">*</span>
          </Label>
          
          {useGoogleMaps ? (
            <Popover open={openMeetSuggestions} onOpenChange={setOpenMeetSuggestions}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openMeetSuggestions}
                  className="w-full justify-between"
                >
                  {meetValue || "Search for meeting point..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    value={meetValue}
                    onValueChange={(value) => {
                      setMeetValue(value);
                      setMeetingPointAddress(value);
                    }}
                    placeholder="Search meeting point..."
                    className="h-9"
                  />
                  <CommandEmpty>No locations found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {meetStatus === "OK" &&
                      meetData.map(({ place_id, description }) => (
                        <CommandItem
                          key={place_id}
                          value={description}
                          onSelect={() => handleMeetSelect(description)}
                        >
                          {description}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              value={meetingPointAddress}
              onChange={(e) => handleManualAddressChange('meet', e.target.value)}
              placeholder="Enter meeting point address"
              className="w-full"
            />
          )}
          
          <Textarea
            value={meetingPointDescription}
            onChange={(e) => setMeetingPointDescription(e.target.value)}
            placeholder="Describe the meeting point (optional)"
            className="min-h-[100px]"
          />
        </div>
      )}

      {/* Pickup Information Section */}
      {meetingType === "pickUp" && (
        <div className="space-y-4">
          <Label className="font-medium">
            Pickup Information
          </Label>
          <Textarea
            value={meetingPointDescription}
            onChange={(e) => setMeetingPointDescription(e.target.value)}
            placeholder="Describe pickup areas or list of places where customers can be picked up"
            className="min-h-[100px]"
          />
        </div>
      )}

      {/* Arrival Time Section */}
      <div className="space-y-4">
        <Label className="font-medium">When do customers need to arrive?</Label>
        <Select value={arrivalTime} onValueChange={setArrivalTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select arrival time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10 minutes before the activity">10 minutes before the activity</SelectItem>
            <SelectItem value="15 minutes before the activity">15 minutes before the activity</SelectItem>
            <SelectItem value="30 minutes before the activity">30 minutes before the activity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drop-off Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Drop-off</h3>
        <RadioGroup
          value={dropOffPlace}
          onValueChange={(value: "same_place" | "different_place" | "no_service") => setDropOffPlace(value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="same_place" id="same_place" />
            <Label htmlFor="same_place">At the same place you meet them</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="different_place" id="different_place" />
            <Label htmlFor="different_place">At a different place</Label>
          </div>
          {dropOffPlace === "different_place" && (
            <>
              {useGoogleMaps ? (
                <Popover open={openDropSuggestions} onOpenChange={setOpenDropSuggestions}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDropSuggestions}
                      className="w-full justify-between"
                    >
                      {dropValue || "Search for drop-off point..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput
                        value={dropValue}
                        onValueChange={(value) => {
                          setDropValue(value);
                          setDropOffAddress(value);
                        }}
                        placeholder="Search drop-off point..."
                        className="h-9"
                      />
                      <CommandEmpty>No locations found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {dropStatus === "OK" &&
                          dropData.map(({ place_id, description }) => (
                            <CommandItem
                              key={place_id}
                              value={description}
                              onSelect={() => handleDropSelect(description)}
                            >
                              {description}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  value={dropOffAddress}
                  onChange={(e) => handleManualAddressChange('drop', e.target.value)}
                  placeholder="Enter drop-off address"
                  className="w-full"
                />
              )}
              <Textarea
                value={dropOffDescription}
                onChange={(e) => setDropOffDescription(e.target.value)}
                placeholder="Describe the drop-off point (optional)"
                className="min-h-[100px]"
              />
            </>
          )}
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="no_service" id="no_service" />
            <Label htmlFor="no_service">
              No drop-off service, the customer stays at the site or destination
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleDone}>Done</Button>
      </div>
    </div>
  );
}