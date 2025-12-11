interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  city: string;
  country: string;
  blood_group: string | null;
  total_bookings: number;
  reserved_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
}

interface ApiResponse<T> {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  };
}
