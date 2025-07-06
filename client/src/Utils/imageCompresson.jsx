// utils/compressImage.js
import imageCompression from 'browser-image-compression';

export const compressImage = async (file, maxSizeMB = 0.2) => {
  if (!file) return null;

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight: 720,
      useWebWorker: true,
    });
    console.log(compressedFile);

    return compressedFile;
  } catch (err) {
    console.error('Image compression failed:', err);
    return file; // fallback to original
  }
};
