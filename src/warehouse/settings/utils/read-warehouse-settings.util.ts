import { readFileSync } from 'fs';
import { FilesystemType } from 'src/types/warehouse/filesystem/filesystem-type.enum';

export const readWarehouseSettings = (warehouseName: string) =>
  JSON.parse(
    readFileSync(`/config/${warehouseName}/settings.json`, 'utf-8'),
  ) as {
    apiKeys: string[];
    filesystemType?: FilesystemType;
    path: string;
  };
