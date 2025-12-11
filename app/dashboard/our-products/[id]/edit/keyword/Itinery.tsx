"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useProductEditStore } from "@/app/store/useEditProductStore";

interface ItineraryItem {
  title: string;
  description?: string;
  order: number;
  is_main_stop: boolean;
  latitude: number;
  longitude: number;
  id?: string;
}

const Itinery: React.FC = () => {
  const { productData, setProductData } = useProductEditStore();
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(
    productData.itineraries || []
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [googleMapsError, setGoogleMapsError] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Single instance of places autocomplete for the component
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      /* Add any request options here if needed */
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      setUseGoogleMaps(false);
      setGoogleMapsError(true);
      toast.warning("Google Maps not loaded. Using manual input mode.");
    }
  }, []);

  const handleLocationSelect = async (address: string, index: number) => {
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      const newItinerary = [...itinerary];
      newItinerary[index] = {
        ...newItinerary[index],
        title: address,
        latitude: lat,
        longitude: lng,
      };
      setItinerary(newItinerary);
      setActiveIndex(null);
      clearSuggestions();
    } catch (error) {
      console.error("Error: ", error);
      toast.error(
        "Failed to get location details. Please enter coordinates manually."
      );
      setUseGoogleMaps(false);
      setGoogleMapsError(true);
    }
  };

  const handleAdd = () => {
    const newItem: ItineraryItem = {
      title: "",
      description: "",
      order: itinerary.length + 1,
      is_main_stop: itinerary.length === 0, // First item is main stop by default
      latitude: 0,
      longitude: 0,
      id: Date.now().toString(),
    };
    setItinerary([...itinerary, newItem]);

    setTimeout(() => {
      inputRefs.current[itinerary.length]?.focus();
    }, 100);
  };

  const handleRemove = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);

    // Update order numbers after removal
    const updatedItinerary = newItinerary.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    setItinerary(updatedItinerary);
    setActiveIndex(null);
    toast.info("Stop removed");
  };

  const handleChange = (
    index: number,
    field: keyof ItineraryItem,
    value: any
  ) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  // Modified to allow multiple main stops
  const toggleMainStop = (index: number, checked: boolean) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      is_main_stop: checked,
    };
    setItinerary(newItinerary);
  };

  const saveItinerary = () => {
    const hasInvalidCoordinates = itinerary.some(
      (item) => isNaN(item.latitude) || isNaN(item.longitude)
    );

    if (hasInvalidCoordinates) {
      toast.error("Please enter valid coordinates");
      return;
    }

    const hasEmptyTitle = itinerary.some((item) => !item.title.trim());
    if (hasEmptyTitle) {
      toast.error("Please fill in all required fields");
      return;
    }

    const itinerariesToSave = itinerary.map(({ id, ...rest }) => ({
      ...rest,
      latitude: Number(rest.latitude),
      longitude: Number(rest.longitude),
    }));

    setProductData({ ...productData, itineraries: itinerariesToSave });
    toast.success("Itinerary saved successfully!");
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === itinerary.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newItinerary = [...itinerary];
    [newItinerary[index], newItinerary[newIndex]] = [
      newItinerary[newIndex],
      newItinerary[index],
    ];

    const updatedItinerary = newItinerary.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    setItinerary(updatedItinerary);
    toast(`Moved stop ${index + 1} ${direction}`);
  };

  return (
    <div className="pt-2 space-y-6  mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Icon icon="mdi:route" className="h-6 w-6" />
              <span>Itinerary Planner</span>
            </CardTitle>
            <Button
              onClick={saveItinerary}
              variant="secondary"
              size="sm"
              className="shadow-md"
            >
              <Icon icon="mdi:content-save" className="mr-2 h-4 w-4" />
              Save Itinerary
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {itinerary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Icon
                  icon="mdi:map-marker-path"
                  className="h-16 w-16 text-primary/30"
                />
                <Icon
                  icon="mdi:plus-circle"
                  className="h-8 w-8 text-primary absolute -bottom-2 -right-2 bg-white rounded-full"
                />
              </div>
              <p className="text-muted-foreground text-lg">
                Your itinerary is empty
              </p>
              <p className="text-muted-foreground text-sm text-center max-w-md">
                Start building your perfect trip by adding stops to your
                itinerary
              </p>
              <Button
                onClick={handleAdd}
                className="mt-4 px-6 py-3 rounded-full shadow-md"
              >
                <Icon icon="mdi:plus" className="mr-2 h-5 w-5" />
                Add First Stop
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div key={item.id || index} className="group relative">
                  <Card className="border shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              item.is_main_stop ? "default" : "secondary"
                            }
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                          >
                            {item.order}
                          </Badge>
                          <h3 className="font-medium text-lg">
                            Stop {item.order}
                          </h3>
                          {item.is_main_stop && (
                            <Badge className="ml-2">
                              <Icon icon="mdi:star" className="h-3 w-3 mr-1" />
                              Main Stop
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor={`main-stop-${index}`}
                            className="text-sm"
                          >
                            Main Stop
                          </Label>
                          <Switch
                            id={`main-stop-${index}`}
                            checked={item.is_main_stop}
                            onCheckedChange={(checked) =>
                              toggleMainStop(index, checked)
                            }
                          />
                        </div>
                      </div>

                      {/* Rest of the component remains the same */}
                      <div className="space-y-2 relative">
                        <Label htmlFor={`title-${index}`}>Location*</Label>
                        {useGoogleMaps ? (
                          <Popover
                            open={activeIndex === index}
                            onOpenChange={(open) => {
                              if (open) {
                                setActiveIndex(index);
                                setValue(item.title);
                              } else {
                                setActiveIndex(null);
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={activeIndex === index}
                                className="w-full justify-between"
                                disabled={!ready}
                              >
                                {item.title || "Search for location..."}
                                <Icon
                                  icon="mdi:chevron-down"
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  value={value}
                                  onValueChange={(val) => {
                                    setValue(val);
                                    handleChange(index, "title", val);
                                  }}
                                  placeholder="Search location..."
                                  className="h-9"
                                />
                                <CommandEmpty>No locations found.</CommandEmpty>
                                <CommandGroup className="max-h-[200px] overflow-y-auto">
                                  {status === "OK" &&
                                    data.map(({ place_id, description }) => (
                                      <CommandItem
                                        key={place_id}
                                        value={description}
                                        onSelect={() => {
                                          handleLocationSelect(
                                            description,
                                            index
                                          );
                                          clearSuggestions();
                                        }}
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
                            value={item.title}
                            onChange={(e) =>
                              handleChange(index, "title", e.target.value)
                            }
                            placeholder="Enter location name"
                            className="w-full"
                          />
                        )}
                        {googleMapsError && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Google Maps not available. Entering manually.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`description-${index}`}
                          value={item.description || ""}
                          onChange={(e) =>
                            handleChange(index, "description", e.target.value)
                          }
                          placeholder="Add notes about this stop..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Coordinates</Label>
                          <div className="flex space-x-2">
                            <Input
                              value={item.latitude}
                              onChange={(e) =>
                                handleChange(index, "latitude", e.target.value)
                              }
                              type="number"
                              step="0.000001"
                              placeholder="Latitude"
                              className="flex-1"
                            />
                            <Input
                              value={item.longitude}
                              onChange={(e) =>
                                handleChange(index, "longitude", e.target.value)
                              }
                              type="number"
                              step="0.000001"
                              placeholder="Longitude"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="flex items-end justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, "up")}
                            disabled={index === 0}
                            className="h-8"
                          >
                            <Icon icon="mdi:arrow-up" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, "down")}
                            disabled={index === itinerary.length - 1}
                            className="h-8"
                          >
                            <Icon icon="mdi:arrow-down" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(index)}
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <Icon icon="mdi:trash" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
                  Add Another Stop
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Itinery;
