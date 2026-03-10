import { faker } from '@faker-js/faker';
import type { CategoryRead } from './types';

export function categoryMock(data: Partial<CategoryRead> = {}): CategoryRead {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    is_income: false,
    user_id: faker.string.uuid(),
    ...data,
  };
}

export function categoriesMock(count: number = 10): CategoryRead[] {
  return Array.from({ length: count }, () => categoryMock());
}
