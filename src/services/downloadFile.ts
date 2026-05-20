import FileSaver from 'file-saver';
import { getObject } from 'services/s3';
import { AWS_BUCKET } from 'utils/environment';

export const saveFileFromBase64 = (base64: string, fileName: string, mimeType = 'application/pdf') => {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: mimeType });
  FileSaver.saveAs(blob, fileName);
};

export const saveFileFromS3 = (key: string, fileName: string, bucket: string = AWS_BUCKET, mimeType = 'application/pdf') => {
  getObject(key, bucket, (error, data) => {
      if (error) return;

      // @ts-ignore
      const blob = new Blob([data.Body!], { type: mimeType });
      FileSaver.saveAs(blob, fileName);
    }
  );
};
