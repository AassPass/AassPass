// utils/compressImage.js
import imageCompression from 'browser-image-compression';

export const compressImage = async (file, maxSizeMB = 1) => {
  if (!file) return null;

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    return compressedFile;
  } catch (err) {
    console.error('Image compression failed:', err);
    return file; // fallback to original
  }
};
