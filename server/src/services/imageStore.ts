import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

const API_KEY = process.env.API_KEY_CLOUDINARY;
const API_SECRET = process.env.API_SECRET_CLOUDINARY;

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: 'dmmtzycyf', 
    api_key: API_KEY, 
    api_secret: API_SECRET 
});

/**
 * Uploads an image to Cloudinary.
 * @param filePath - The path or URL of the image to upload.
 * @param publicId - Optional public ID to assign to the image.
 * @returns A promise that resolves to the secure URL of the uploaded image.
 */
export async function uploadImage(filePath: string, publicId?: string): Promise<string> {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, { public_id: publicId });
        // Log or process the result as needed
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Image upload failed: ' + error);
    }
}

/**
* Deletes an image from Cloudinary using its public ID.
* @param publicId - The public ID of the image to delete.
*/
export async function deleteImage(publicId: string): Promise<void> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Image deletion failed:', error);
    }
}
