/**
 * Image compression utility to reduce file size before upload
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'jpeg' | 'webp' | 'png';
  maxSizeKB?: number; // Maximum file size in KB
}

export async function compressImage(
  file: File | string, 
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format = 'jpeg',
    maxSizeKB = 1024 // 1MB default
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Get compressed result
        const mimeType = `image/${format}`;
        let compressedDataUrl = canvas.toDataURL(mimeType, quality);

        // Check if we need further compression
        const sizeKB = (compressedDataUrl.length * 0.75) / 1024; // Rough estimate
        
        if (sizeKB > maxSizeKB && quality > 0.1) {
          // Try with lower quality
          const newQuality = Math.max(0.1, quality * 0.7);
          compressedDataUrl = canvas.toDataURL(mimeType, newQuality);
        }

        resolve(compressedDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    if (typeof file === 'string') {
      img.src = file;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    }
  });
}

export function getImageSizeKB(dataUrl: string): number {
  // Remove data URL prefix and calculate size
  const base64 = dataUrl.split(',')[1];
  return (base64.length * 0.75) / 1024;
}

export async function compressToTarget(
  imageDataUrl: string,
  targetSizeKB: number = 500
): Promise<string> {
  let quality = 0.9;
  let compressed = imageDataUrl;
  
  while (getImageSizeKB(compressed) > targetSizeKB && quality > 0.1) {
    quality *= 0.8;
    compressed = await compressImage(imageDataUrl, { 
      quality,
      maxSizeKB: targetSizeKB 
    });
  }
  
  return compressed;
}