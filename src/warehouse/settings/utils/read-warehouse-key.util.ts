import { readFileSync } from 'fs';

export const readWarehouseKey = (warehouseName: string, keyName: string) =>
  readFileSync(`/config/${warehouseName}/${keyName}.key`, 'utf-8');
