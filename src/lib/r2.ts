import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "kanban-attachments";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "https://auto.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a presigned URL for direct client-to-R2 upload
 */
export async function getPresignedUploadUrl(key: string, contentType: string) {
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    // In dev without R2 credentials, return placeholder for local mock
    return {
      uploadUrl: `/api/mock-upload?key=${encodeURIComponent(key)}`,
      publicUrl: `/uploads/${key}`,
      key,
    };
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  const publicUrl = R2_PUBLIC_DOMAIN
    ? `${R2_PUBLIC_DOMAIN}/${key}`
    : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteR2Object(key: string) {
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return;
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });
  await r2Client.send(command);
}
