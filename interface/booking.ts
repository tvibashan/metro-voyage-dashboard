interface IUser {
  id?: string;
  email: string;
  date_joined: Date;
  last_login: Date;
  registration_method: "email" | "google";
  date_of_birth?: Date;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  blood_group?: string;
  image?: string;
}

interface IBooking {
  id?: string;
  user?: IUser;
  booking_reference?: string;
  email?: string;
  product_id?: string;
  total_persons?: number;
  product_title?: string;
  subtitle?: string;
  duration?: string;
  departure_from?: string;
  is_guest?: boolean;
  departure_date_time?: any;
  product_thumbnail: string;
  total_amount: number;
  currency_type: string;
  gross_amount: number;
  original_total_amount: number;
  original_gross_amount: number;
  location?: string;
  qr_code?: string;
  api_category: string;
  status: "Reserved" | "Confirmed" | "Cancelled" | "Refunded";
  is_valid: boolean;
  ticket_checker?: string;
  updated_at: any;
  created_at: any;
}

interface IParticipant {
  id?: string;
  booking: IBooking;
  participant_type: string;
  quantity: number;
  cost_per_unit: number;
  original_cost_per_unit: number;
  original_discounted_cost_per_unit: number;
  ticket?: string;
  ticket_info?: string;
  option_name?: string;
}
