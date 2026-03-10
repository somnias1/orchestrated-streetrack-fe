import { faker } from '@faker-js/faker';
import type { TransactionRead } from './types';

export function transactionMock(
  data: Partial<TransactionRead> = {},
): TransactionRead {
  return {
    id: faker.string.uuid(),
    subcategory_id: faker.string.uuid(),
    subcategory_name: faker.commerce.department(),
    value: faker.number.int({ min: 100, max: 10000 }),
    description: faker.commerce.productDescription(),
    date: faker.date.recent().toISOString().slice(0, 10),
    hangout_id: null,
    hangout_name: null,
    user_id: faker.string.uuid(),
    ...data,
  };
}

export function transactionsMock(count: number = 10): TransactionRead[] {
  return Array.from({ length: count }, () => transactionMock());
}
