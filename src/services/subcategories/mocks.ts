import { faker } from '@faker-js/faker';
import type { SubcategoryRead } from './types';

export function subcategoryMock(
  data: Partial<SubcategoryRead> = {},
): SubcategoryRead {
  return {
    id: faker.string.uuid(),
    category_id: faker.string.uuid(),
    category_name: faker.commerce.department(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    belongs_to_income: false,
    user_id: faker.string.uuid(),
    ...data,
  };
}

export function subcategoriesMock(count: number = 10): SubcategoryRead[] {
  return Array.from({ length: count }, () => subcategoryMock());
}
