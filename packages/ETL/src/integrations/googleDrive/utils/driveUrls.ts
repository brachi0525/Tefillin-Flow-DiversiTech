
export function getGoogleDriveDirectUrl(fileId: string): string {
    return `https://drive.google.com/thumbnail?id=${fileId}`;
}

export function getGoogleDriveVideoEmbedUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/preview`;
}