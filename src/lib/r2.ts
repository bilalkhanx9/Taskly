import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.R2_BUCKET_NAME || "";
const publicDomain = process.env.R2_PUBLIC_DOMAIN || "";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Upload a file buffer directly to Cloudflare R2
 */
export async function uploadToR2({
  fileKey,
  buffer,
  contentType,
}: {
  fileKey: string;
  buffer: Buffer;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const publicUrl = publicDomain
    ? `${publicDomain.replace(/\/$/, "")}/${fileKey}`
    : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${fileKey}`;

  return {
    key: fileKey,
    url: publicUrl,
  };
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(fileKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  return r2Client.send(command);
}

/**
 * Generate a pre-signed URL for direct client-side upload to R2
 */
export async function getPresignedUploadUrl(fileKey: string, contentType: string, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}
