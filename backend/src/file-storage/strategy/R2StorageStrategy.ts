import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import envVariables from '../../common/envVariables';
const cloudflare = envVariables.cloudflare;
import StorageStrategy from './StorageStrategy';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ONE_WEEK_IN_SECONDS } from '../../common/constants';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class R2StorageStrategy implements StorageStrategy {
  private static instance: R2StorageStrategy;
  private s3Client: S3Client;
  private bucketName: string = cloudflare.s3BucketName;
  private constructor() {
    // console.log('R2StorageStrategy constructor');
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${cloudflare.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: cloudflare.s3AccessKeyId,
        secretAccessKey: cloudflare.s3SecretAccessKey,
      },
    });
  }

  static getInstance(): R2StorageStrategy {
    if (!this.instance) {
      this.instance = new R2StorageStrategy();
    }
    return this.instance;
  }

  /**
   * Uploads a file to the storage service, and returns the key of the file
   * @param file
   * @param options
   * @returns
   */
  async uploadFile(
    file: Express.Multer.File,
    options?: {
      key?: string;
    },
  ) {
    const { originalname, buffer } = file;
    const extension = path.extname(originalname);

    const key = options?.key
      ? `${options.key}/${uuidv4()}${extension}`
      : `${uuidv4()}${extension}`;
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.mimetype,
    };
    const sendCommand = new PutObjectCommand(uploadParams);
    await this.s3Client.send(sendCommand);
    return {
      storageKey: key,
    };
  }

  async getSignedUrl(
    fileKey: string,
    options?: {
      expiresIn?: number;
    },
  ): Promise<string> {
    const expiresIn =
      options?.expiresIn && options.expiresIn <= ONE_WEEK_IN_SECONDS
        ? options.expiresIn
        : ONE_WEEK_IN_SECONDS;

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresIn,
    });
    return url;
  }

  async deleteFile(fileUrl: string, options?: any): Promise<void> {
    console.log('options', options, fileUrl);
    // Your code to delete the file goes here
    return;
  }
}
