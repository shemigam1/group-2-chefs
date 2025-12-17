export interface RecipeInput {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  cuisine_type?: string[];
  difficulty_level?: string;
  tags?: string[];
  final_img?: string;
  prep_time?: number;
  cook_time?: number;
}

export interface RecipeUpdate extends Partial<RecipeInput> {}

export interface RecipeResponse {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  cuisine_type: string[] | null;
  difficulty_level: string | null;
  tags: string[] | null;
  final_img: string | null;
  prep_time: number | null;
  cook_time: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
