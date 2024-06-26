export default interface StorageStrategy {
  uploadFile(
    file: Express.Multer.File,
    options?: any,
  ): Promise<{
    storageKey: string;
  }>;
  getSignedUrl(
    fileKey: string,
    options?: {
      expiresIn?: number;
    },
  ): Promise<string>;
  deleteFile(fileUrl: string, options?: any): Promise<void>;
}
