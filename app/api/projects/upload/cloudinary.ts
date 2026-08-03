import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (make sure to do this once in your application)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drpc1o6de',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

async function UploadToCloudinary({ files, videos }: { files: File[], videos: File[] }) {
  try {
    // Upload images in parallel
    const imageUploadPromises = files.map(file => uploadFile(file, 'image'));
    const videoUploadPromises = videos.map(video => uploadFile(video, 'video'));

    // Wait for all uploads to complete
    const [imageResults, videoResults] = await Promise.all([
      Promise.all(imageUploadPromises),
      Promise.all(videoUploadPromises)
    ]);

    // Extract public IDs or URLs
    const imageUrls = imageResults.map(result => result.secure_url);
    const videoUrls = videoResults.map(result => result.secure_url);

    return { imageUrls, videoUrls };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

async function uploadFile(file: File, type: 'image' | 'video'): Promise<CloudinaryUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: type === 'video' ? 'video' : 'auto',
        folder: "archweb",
        // You can add additional upload options here if needed
        // e.g., quality: 'auto', format: 'webp' for images
      },
      (error, result) => {
        if (error) {
          console.error(`Error uploading ${type}:`, error);
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Unknown error occurred during upload'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export default UploadToCloudinary;