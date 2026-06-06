import FileSaver from 'file-saver';
import { getSignedUrl } from 'services/s3';
import { AWS_BUCKET } from 'utils/environment';

export const saveFileFromBase64 = (base64: string, fileName: string, mimeType = 'application/pdf') => {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: mimeType });
  FileSaver.saveAs(blob, fileName);
};

export const saveFileFromS3 = (key: string, fileName: string, bucket: string = AWS_BUCKET) => {
  const url = getSignedUrl(key, bucket, fileName);
  window.open(url, '_blank', 'noopener,noreferrer');
};
