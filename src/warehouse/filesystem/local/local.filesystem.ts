import { readFileSync, writeFileSync } from 'fs';
import { IFilesystem } from 'src/types/warehouse/filesystem/filesystem.interface';

export class LocalFilesystem implements IFilesystem {
  async uploadFile(fileName: string, fileBuffer: Buffer, path: string) {
    writeFileSync(`${path}/${fileName}`, fileBuffer);
  }
  async downloadFile(fileName: string, path: string): Promise<Buffer> {
    const file = readFileSync(`${path}/${fileName}`);
    return file;
  }
}
