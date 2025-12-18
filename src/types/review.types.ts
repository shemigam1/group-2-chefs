export interface ReviewResponse {
  id: string;
  userId: string;
  recipeId: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: Date;
  updated_at: Date;
  user: {
    id: string;
    username: string;
    profile_pic: string | null;
  };
}


export interface CreateReviewInput {
  rating: number;
  comment?: string | null;
}


export interface UpdateReviewInput {
  rating?: number;
  comment?: string | null;
}

export interface RatingStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface FlagReviewInput {
  flag_reason: string;
}
export interface ListReviewsQuery {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}