import QRCode from 'qrcode';

export async function generateTefillinQr(tefilinId: string): Promise<string> {
  const url = `https://localhost:3001/api/tefilin/${tefilinId}`;
    try {
    const qrDataUrl = await QRCode.toDataURL(url);

    // return qrDataUrl;
     const compressedQr = Buffer.from(qrDataUrl).toString('base64');
    return compressedQr;
  } catch (error) {
    console.error('error in create QR:', error);
    throw new Error('faild create QR Code');
  }
}