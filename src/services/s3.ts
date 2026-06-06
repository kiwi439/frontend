import { S3, AWSError } from 'aws-sdk';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET } from 'utils/environment';

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

export const getSignedUrl = (key: string, bucket: string = AWS_BUCKET, fileName?: string) => {
  const params: S3.Types.GetObjectRequest = { Bucket: bucket, Key: key };

  if (fileName) {
    params.ResponseContentDisposition = `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`;
  }

  return s3.getSignedUrl('getObject', params);
};

export const getObject = async (
  key: string,
  bucket: string = AWS_BUCKET,
  responseHandler: (error: AWSError, data: GetObjectOutput) => void = () => {}
) => s3.getObject({ Bucket: bucket, Key: key }, responseHandler);
