import { Storage } from '@google-cloud/storage';
import { config } from '../config.js';
import crypto from 'crypto';

const storage = new Storage({
  projectId: config.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: config.GOOGLE_CLOUD_KEY_FILE
});

const bucket = storage.bucket('onpaperdevassetsbucket');

export async function uploadImageToGCS(file: Express.Multer.File): Promise<string> {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', async () => {
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/onpaperdevassetsbucket/${fileName}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}