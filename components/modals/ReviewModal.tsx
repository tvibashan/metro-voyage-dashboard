"use client";
import { useState } from "react"; // Import useState
import { useOptionStore } from "@/app/store/useOptionStore";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react"; // Import Chevron icons
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function ReviewModal({onClose}:{ onClose: () => void }) {
  const { optionData, submitOption } = useOptionStore();
  const [expandedAvailabilities, setExpandedAvailabilities] = useState<{
    [key: number]: boolean;
  }>({});

  const handleSubmit = async () => {
    try {
      await submitOption();
      onClose();
    } catch (error) {
      toast.error("Failed to submit option. Please try again.");
    }
  };

  const toggleAvailability = (index: number) => {
    setExpandedAvailabilities((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className=" ">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">
        Review Your Option
      </h2>

      {/* General Information */}
      <Card className="mb-8 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-full">
              <Check className="w-5 h-5" />
            </span>
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RowColumn label="Name" value={optionData.name} />
            <RowColumn
              label="Reference Code"
              value={optionData.reference_code || "N/A"}
            />
            <RowColumn
              label="Maximum Group Size"
              value={
                optionData.maximum_group_size !== undefined
                  ? optionData.maximum_group_size.toString()
                  : "N/A"
              }
            />
            <RowColumn
              label="Wheelchair Accessible"
              value={optionData.is_wheelchair_accessible ? "Yes" : "No"}
              status={optionData.is_wheelchair_accessible ? "success" : "error"}
            />
            <RowColumn
              label="Skip the Line"
              value={optionData.skip_the_line_enabled ? "Yes" : "No"}
              status={optionData.skip_the_line_enabled ? "success" : "error"}
            />
            <RowColumn
              label="Audio Guide"
              value={optionData.audio_guide ? "Yes" : "No"}
              status={optionData.audio_guide ? "success" : "error"}
            />
            <RowColumn
              label="Booklet"
              value={optionData.booklet ? "Yes" : "No"}
              status={optionData.booklet ? "success" : "error"}
            />
            <RowColumn
              label="Private Option"
              value={optionData.is_private ? "Yes" : "No"}
              status={optionData.is_private ? "success" : "error"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Meeting and Drop-off Points */}
      <Card className="mb-8 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 p-2 rounded-full">
              <Check className="w-5 h-5" />
            </span>
            Meeting & Drop-off Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <LocationSection title="Meeting Point" data={optionData.meet} />
            <LocationSection title="Drop-off Point" data={optionData.drop} />
          </div>
        </CardContent>
      </Card>

      {/* Availabilities */}
      <Card className="mb-8 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 p-2 rounded-full">
              <Check className="w-5 h-5" />
            </span>
            Availabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {optionData.availabilities?.map((availability, index) => (
            <Card key={index} className="">
              <CardHeader
                className="cursor-pointer" // Make the header clickable
                onClick={() => toggleAvailability(index)} // Toggle expanded state
              >
                <CardTitle className="font-medium text-gray-700 flex items-center justify-between">
                  <span>{availability.schedule_name}</span>
                  <span>
                    {expandedAvailabilities[index] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              {expandedAvailabilities[index] && ( // Conditionally render content
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <RowColumn
                      label="Type"
                      value={availability.availability_type}
                    />
                    <RowColumn
                      label="Price Type"
                      value={availability.price_type}
                    />
                    <RowColumn
                      label="Schedule Name"
                      value={availability.schedule_name}
                    />
                    <RowColumn
                      label="Start Date"
                      value={availability.start_date || "N/A"}
                    />
                    <RowColumn
                      label="End Date"
                      value={availability.end_date || "N/A"}
                    />
                  </div>

                  {availability.availability_type === "fixed" && (
                    <Section title="Fixed Time Slots">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availability.fixed_time_slots.map(
                            (slot, slotIndex) => (
                              <TableRow key={slotIndex}>
                                <TableCell>{slot.day}</TableCell>
                                <TableCell>{slot.start_time}</TableCell>
                                <TableCell>{slot.end_time}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </Section>
                  )}

                  {availability.availability_type === "operating" && (
                    <Section title="Operating Hours">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Opening Time</TableHead>
                            <TableHead>Closing Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availability.operating_hours.map(
                            (hour, hourIndex) => (
                              <TableRow key={hourIndex}>
                                <TableCell>{hour.day}</TableCell>
                                <TableCell>{hour.opening_time}</TableCell>
                                <TableCell>{hour.closing_time}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </Section>
                  )}

                  {availability.exceptions.length > 0 && (
                    <Section title="Exceptions">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Opening Time</TableHead>
                            <TableHead>Closing Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availability.exceptions.map((exception, exIndex) => (
                            <TableRow key={exIndex}>
                              <TableCell>{exception.date}</TableCell>
                              <TableCell>{exception.opening_time}</TableCell>
                              <TableCell>{exception.closing_time}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Section>
                  )}

                  {availability?.pricing_tiers &&
                    availability?.pricing_tiers.length > 0 && (
                      <Section title="Pricing Tiers">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Participant Type</TableHead>
                              <TableHead>Min Age</TableHead>
                              <TableHead>Max Age</TableHead>
                              <TableHead>Min Participants</TableHead>
                              <TableHead>Max Participants</TableHead>
                              <TableHead>Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {availability?.pricing_tiers.map(
                              (tier:any, tierIndex) => (
                                <TableRow key={tierIndex}>
                                  <TableCell>
                                    {tier?.participant_type.name}
                                  </TableCell>
                                  <TableCell>
                                    {tier?.participant_type.min_age}
                                  </TableCell>
                                  <TableCell>
                                    {tier?.participant_type.max_age}
                                  </TableCell>
                                  <TableCell>{tier?.min_participants}</TableCell>
                                  <TableCell>{tier?.max_participants}</TableCell>
                                  <TableCell>€{tier?.price}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Section>
                    )}
                </CardContent>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Navigation Button */}
      <div className="sticky bottom-0 py-4">
        <div className="flex justify-end  mx-auto px-4">
          <Button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const RowColumn = ({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "success" | "error";
}) => (
  <div className="grid grid-cols-3 gap-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p
      className={`col-span-2 font-medium text-gray-900 ${
        status === "success"
          ? "text-green-600"
          : status === "error"
          ? "text-red-600"
          : ""
      }`}
    >
      {value}
    </p>
  </div>
);

const LocationSection = ({ title, data }: { title: string; data: any }) => (
  <div>
    <h4 className="font-medium text-gray-700 mb-4">{title}</h4>
    <div className="space-y-2">
      <RowColumn label="Address" value={data?.address || "N/A"} />
      <RowColumn label="Landmark" value={data?.landmark || "N/A"} />
      <RowColumn label="Description" value={data?.description || "N/A"} />
      <RowColumn
        label="Coordinates"
        value={data ? `${data.latitude}, ${data.longitude}` : "N/A"}
      />
    </div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h5 className="font-medium text-gray-700 mb-2">{title}</h5>
    {children}
  </div>
);