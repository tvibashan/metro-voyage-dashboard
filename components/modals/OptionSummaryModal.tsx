"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Check } from "lucide-react";

export default function OptionSummaryModal({ data }:any) {
  if (!data) return null;

  return (
    <div className="space-y-8 p-8 w-full mx-auto overflow-scroll">
      <h2 className="text-2xl font-bold text-gray-900">Option Summary</h2>

      {/* General Information */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
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
            <RowColumn label="Name" value={data.name} />
            <RowColumn
              label="Reference Code"
              value={data.reference_code || "N/A"}
            />
            <RowColumn
              label="Maximum Group Size"
              value={
                data.maximum_group_size !== undefined
                  ? data.maximum_group_size.toString()
                  : "N/A"
              }
            />
            <RowColumn
              label="Wheelchair Accessible"
              value={data.is_wheelchair_accessible ? "Yes" : "No"}
              status={data.is_wheelchair_accessible ? "success" : "error"}
            />
            <RowColumn
              label="Skip the Line"
              value={data.skip_the_line_enabled ? "Yes" : "No"}
              status={data.skip_the_line_enabled ? "success" : "error"}
            />
            <RowColumn
              label="Valid For"
              value={`${data.valid_for} day(s)`}
            />
            <RowColumn
              label="Meeting Point Type"
              value={data.meeting_point_type}
            />
            <RowColumn label="Drop Off Type" value={data.drop_off_type} />
          </div>
        </CardContent>
      </Card>

      {/* Availabilities */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 p-2 rounded-full">
              <Check className="w-5 h-5" />
            </span>
            Availabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.availabilities?.map((availability:any, index:number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-medium text-gray-700">
                  {availability.schedule_name}
                </CardTitle>
              </CardHeader>
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
                        {availability.fixed_time_slots.map((slot:any, slotIndex:any) => (
                          <TableRow key={slotIndex}>
                            <TableCell>{slot.day}</TableCell>
                            <TableCell>{slot.start_time}</TableCell>
                            <TableCell>{slot.end_time}</TableCell>
                          </TableRow>
                        ))}
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
                        {availability.operating_hours.map((hour:any, hourIndex:any) => (
                          <TableRow key={hourIndex}>
                            <TableCell>{hour.day}</TableCell>
                            <TableCell>{hour.opening_time}</TableCell>
                            <TableCell>{hour.closing_time}</TableCell>
                          </TableRow>
                        ))}
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
                        {availability.exceptions.map((exception:any, exIndex:any) => (
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

                {availability.pricing_tiers &&
                  availability.pricing_tiers.length > 0 && (
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
                          {availability.pricing_tiers.map((tier:any, tierIndex:any) => (
                            <TableRow key={tierIndex}>
                              <TableCell>
                                {tier.participant_type.name}
                              </TableCell>
                              <TableCell>
                                {tier.participant_type.min_age}
                              </TableCell>
                              <TableCell>
                                {tier.participant_type.max_age}
                              </TableCell>
                              <TableCell>{tier.min_participants}</TableCell>
                              <TableCell>{tier.max_participants}</TableCell>
                              <TableCell>€{tier.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Section>
                  )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
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