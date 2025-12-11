interface IReview {
  id?: string;
  user?: IUser;
  product_id?: string;
  product_title?: string;
  product_duration?: string;
  departure_from?: string;
  departure_date_time?: any;
  product_image: string;
  product_price: number;
  product_location?: string;
  rating: number;
  comment: string;
  api_category: string;
  created_at: Date;
}
