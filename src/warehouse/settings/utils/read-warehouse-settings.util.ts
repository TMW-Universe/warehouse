import { readFileSync } from 'fs';

export const readWarehouseSettings = (warehouseName: string) =>
  JSON.parse(
    readFileSync(`/config/${warehouseName}/settings.json`, 'utf-8'),
  ) as {
    apiKeys: string[];
  };
