export interface SignedToken {
  fileIds: string[];
  expiresAt: Date;
  salt: string;
}
