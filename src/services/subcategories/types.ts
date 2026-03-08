/**
 * Subcategories API types (TECHSPEC §4.1). Match backend OpenAPI schemas.
 */

export type SubcategoryRead = {
  id: string;
  category_id: string;
  category_name: string;
  name: string;
  description: string | null;
  belongs_to_income: boolean;
  user_id: string | null;
};

export type SubcategoryCreate = {
  category_id: string;
  name: string;
  description?: string | null;
  belongs_to_income?: boolean;
};

export type SubcategoryUpdate = {
  category_id?: string | null;
  name?: string | null;
  description?: string | null;
  belongs_to_income?: boolean | null;
};

/** GET /subcategories/ response */
export type GetSubcategoriesResponse = SubcategoryRead[];
