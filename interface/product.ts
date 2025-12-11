interface Product {
  id: string;
  title: string;
  avg_rating: number;
  basePrice: string;
  category: string;
  duration: string;
  images: { image: string }[];
  status: boolean;
  option:IOption;
}

interface Tag {
  id?: number;
  name: string;
}