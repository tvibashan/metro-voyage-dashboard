
interface TimeSlot {
  start_time: string;
  end_time: string;
  total_capacity: number;
  total_booked: number;
  available_capacity: number;
}

interface OperatingHours {
  opening_time: string;
  closing_time: string;
  total_capacity: number;
  total_booked: number;
  available_capacity: number;
}

interface Option {
  option_id: number;
  name: string;
  availability_type: "fixed" | "operating";
  time_slots?: TimeSlot[];
  operating_hours?: OperatingHours[];
}

interface Product {
  product_id: number;
  title: string;
  options: Option[];
}

interface CalendarData {
  date: string;
  products: Product[];
}