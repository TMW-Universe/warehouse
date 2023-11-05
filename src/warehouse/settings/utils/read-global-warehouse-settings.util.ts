import { readFileSync } from 'fs';
import { FilesystemType } from 'src/types/warehouse/filesystem/filesystem-type.enum';

export const readGlobalWarehouseSettings = () =>
  JSON.parse(readFileSync('/config/settings.json', 'utf-8')) as {
    warehouses: {
      name: string;
      filesystemType?: FilesystemType;
      path: string;
    }[];
  };
