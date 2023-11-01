import { readFileSync } from 'fs';

export const readGlobalWarehouseSettings = () =>
  JSON.parse(readFileSync('/config/settings.json', 'utf-8')) as {
    warehouses: { name: string }[];
  };
