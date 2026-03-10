import { faker } from '@faker-js/faker';
import type { HangoutRead } from './types';

export function hangoutMock(data: Partial<HangoutRead> = {}): HangoutRead {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    date: faker.date.recent().toISOString().slice(0, 10),
    user_id: faker.string.uuid(),
    ...data,
  };
}

export function hangoutsMock(count: number = 10): HangoutRead[] {
  return Array.from({ length: count }, () => hangoutMock());
}
