interface MeetingPoint {
  id: number;
  name: string;
  address: string;
}

interface DropOff {
  id: number;
  name: string;
  location: string;
}

interface HostLanguage {
  id: number;
  language: string;
  proficiency: string;
}

interface AudioGuideLanguage {
  id: number;
  language: string;
  available: boolean;
}

interface BookletLanguage {
  id: number;
  language: string;
  available: boolean;
}

interface IOption {
  id: number;
  name: string;
  description: string;
  meet: MeetingPoint | null;
  drop: DropOff | null;
  host_languages: HostLanguage[];
  audio_guides_languages: AudioGuideLanguage[];
  booklet_languages: BookletLanguage[];
  price: number;
  duration: string;
}

// -------------------

interface LocationDetails {
  address: string;
  landmark: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface Language {
  keyword: string;
}

interface Option {
  id: number;
  meet: LocationDetails;
  drop: LocationDetails;
  host_languages: Language[];
  audio_guides_languages: string[];
  booklet_languages: string[];
  name: string;
  reference_code: string;
  maximum_group_size: number;
  is_wheelchair_accessible: boolean;
  skip_the_line: boolean;
  valid_for: number;
  has_fixed_time: boolean;
  audio_guide: boolean;
  booklet: boolean;
  is_private: boolean;
  drop_off_type: string;
  meeting_point_type: string;
  availabilities?: Availability[];
}

interface DiscountOffer {
  id?: number;
  title: string;
  tiers?: any;
  days?: string[];
  start_time: string | null;
  end_time: string | null;
  start_date: string;
  end_date: string;
  min_participants: number;
  max_participants: number;
  percent: number;
  fixed_amount?: number | null;
  discount_type: "percent" | "fixed";
  availability?: number;
}

interface Availability {
  id?: number;
  availability_type: "fixed" | "operating";
  price_type: "person" | "group";
  schedule_name: string;
  start_date: string | undefined;
  end_date: string | undefined;
  fixed_time_slots: { day: string; start_time: string; end_time: string }[];
  operating_hours: {
    day: string;
    opening_time: string;
    closing_time: string;
  }[];
  exceptions: { date: string; opening_time: string; closing_time: string }[];
  pricing_tiers?: PricingTier[];
  discount: DiscountOffer | null;
}

interface ParticipantType {
  id?: number;
  name: string;
  min_age: number;
  max_age: number;
}

interface PricingTier {
  participant_type?: ParticipantType;
  min_participants?: number;
  max_participants?: number;
  price?: number;
  id?: number;
}

interface OptionData {
  id?: number;
  name: string;
  reference_code?: string;
  maximum_group_size?: number;
  is_wheelchair_accessible?: boolean;
  skip_the_line?: boolean;
  audio_guide?: boolean;
  host_language?: boolean;
  has_fixed_time?: boolean;
  valid_for?: number;
  booklet?: boolean;
  is_private?: boolean;
  drop_off_type?: "different_place" | "same_place" | "no_service";
  meeting_point_type?: string;
  skip_the_line_option?: string;
  skip_the_line_enabled?: boolean;
  host_languages?: { keyword: string }[];
  audio_guides_languages?: { keyword: string }[];
  booklet_languages?: { keyword: string }[];
  meet?: {
    address?: string;
    landmark?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
  };
  drop?: {
    address?: string;
    landmark?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
  };
  availabilities?: Availability[];
}
