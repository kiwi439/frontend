// @ts-nocheck
import FileSaver from 'file-saver';
import * as S3Service from 'services/s3';
import { saveFileFromBase64, saveFileFromS3 } from 'services/downloadFile';

describe('saveFileFromBase64', () => {
  let saveAsSpy = null;

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(global.URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(() => 'mock-blob-url')
    });

    saveAsSpy = jest.spyOn(FileSaver, 'saveAs');
  });

  it('saves decoded base64 as pdf file', () => {
    saveFileFromBase64('dGVzdA==', 'test.pdf');
    const blob = saveAsSpy.mock.calls[0][0];

    expect(saveAsSpy).toHaveBeenCalledTimes(1);
    expect(saveAsSpy).toHaveBeenCalledWith(blob, 'test.pdf');
    expect(blob).toBeInstanceOf(Blob);
  });
});

describe('saveFileFromS3', () => {
  let getObjectSpy, saveAsSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(global.URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(() => 'mock-blob-url')
    });

    getObjectSpy = jest.spyOn(S3Service, 'getObject');
    saveAsSpy = jest.spyOn(FileSaver, 'saveAs');
  });

  describe('success path', () => {
    beforeEach(() => {
      getObjectSpy.mockImplementation((_key, _bucket, responseHandler) => {
        const binaryData = Buffer.from('binary-fake-data', 'utf8');
        responseHandler(null, { Body: binaryData });
      });
    });

    it('saves file from S3 as pdf file', () => {
      saveFileFromS3('testKey', 'Polityka prywatnosci.pdf');
      const blob = saveAsSpy.mock.calls[0][0];
  
      expect(getObjectSpy).toHaveBeenCalledTimes(1);
      expect(getObjectSpy).toHaveBeenCalledWith('testKey', 'budoman-development', expect.any(Function));
      expect(saveAsSpy).toHaveBeenCalledTimes(1);
      expect(saveAsSpy).toHaveBeenCalledWith(blob, 'Polityka prywatnosci.pdf');
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('failure path', () => {
    beforeEach(() => {
      getObjectSpy.mockImplementation((key, bucket, responseHandler) => {
        responseHandler(new Error('Some S3 error'), null);
      });
    });

    it('does not save file from S3 if cannot fetch file from storage', () => {
      saveFileFromS3('testKey', 'Polityka prywatnosci.pdf', 'testBucket');
  
      expect(getObjectSpy).toHaveBeenCalledTimes(1);
      expect(getObjectSpy).toHaveBeenCalledWith('testKey', 'testBucket', expect.any(Function));
      expect(saveAsSpy).toHaveBeenCalledTimes(0);
    });
  });
});
