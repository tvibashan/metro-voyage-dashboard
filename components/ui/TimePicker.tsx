import { Input } from "./input";
import { useState } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [time, setTime] = useState(value || "00:00");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange(newTime);
  };

  return (
    <Input
      type="time"
      value={time}
      onChange={handleTimeChange}
      className="w-full justify-start text-left font-normal"
    />
  );
}
