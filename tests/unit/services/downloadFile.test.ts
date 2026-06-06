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
  let getSignedUrlSpy, windowOpenSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    getSignedUrlSpy = jest.spyOn(S3Service, 'getSignedUrl').mockReturnValue('https://signed-url.example/file.pdf');
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  it('opens signed S3 url in new tab', () => {
    saveFileFromS3('testKey', 'Polityka prywatnosci.pdf');

    expect(getSignedUrlSpy).toHaveBeenCalledTimes(1);
    expect(getSignedUrlSpy).toHaveBeenCalledWith('testKey', 'budoman-development', 'Polityka prywatnosci.pdf');
    expect(windowOpenSpy).toHaveBeenCalledWith('https://signed-url.example/file.pdf', '_blank', 'noopener,noreferrer');
  });

  it('uses custom bucket when provided', () => {
    saveFileFromS3('testKey', 'Polityka prywatnosci.pdf', 'testBucket');

    expect(getSignedUrlSpy).toHaveBeenCalledWith('testKey', 'testBucket', 'Polityka prywatnosci.pdf');
  });
});
