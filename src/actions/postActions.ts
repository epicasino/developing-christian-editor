'use server';
import db from '@/db/drizzle';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface iGetSignedURL {
  fileType: string;
  fileSize: number;
  checksum: string;
}

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

import crypto from 'crypto';

const maxFileSize = 1048576 * 100; // 10 MB;

export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
}: iGetSignedURL) => {
  const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString('hex');

  if (fileSize > maxFileSize) {
    return { failure: 'File size too large' };
  }

  const putObjComm = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: generateFileName(),
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, putObjComm, {
    expiresIn: 60,
  });
  return { success: { url: signedURL } };
};
