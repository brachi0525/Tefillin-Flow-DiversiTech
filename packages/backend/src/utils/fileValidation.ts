export async function validateAndGetMediaType(
  buffer: Buffer,
  originalFileName: string,
): Promise<string> {
  const fileType = await import('file-type');
  const detectedFileType = await fileType.fileTypeFromBuffer(buffer);

  if (!detectedFileType) {
    throw new Error(`Unsupported file format for "${originalFileName}". Could not determine file type from content.`);
  }

  const realMimeType = detectedFileType.mime;

  const sizeInBytes = buffer.length;
  if (realMimeType.startsWith('image/')) {
    const maxImageSize = 2 * 1024 * 1024; 
    if (sizeInBytes > maxImageSize) {
      throw new Error(`Image too large: ${sizeInBytes} bytes. Max allowed is ${maxImageSize} bytes.`);
    }
  } else if (realMimeType.startsWith('video/')) {
    const maxVideoSize = 100 * 1024 * 1024; 
    if (sizeInBytes > maxVideoSize) {
      throw new Error(`Video too large: ${sizeInBytes} bytes. Max allowed is ${maxVideoSize} bytes.`);
    }
  } else {
    throw new Error(`Unsupported file type detected for "${originalFileName}": "${realMimeType}". Only image and video files are allowed.`);
  }

  return realMimeType;
}
