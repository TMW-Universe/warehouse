export interface IFilesystem {
  uploadFile(fileName: string, fileBuffer: Buffer, path: string): Promise<void>;
  downloadFile(fileName: string, path: string): Promise<Buffer>;
}
