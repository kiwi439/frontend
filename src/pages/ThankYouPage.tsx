import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'types/store';
import fetchFileOnLocalFileSystem from 'services/fetchFileOnLocalFileSystem';
import SubmitButton from 'components/SubmitButton';

const ThankYouPage = () => {
  const blockName = 'thank-you-page';
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const orderID: string = '123'; // TODO: Realna wartosc

  const downloadInvoice = () => {
    const key = `users/${loggedUserId}/invoices/${orderID}.pdf`;
    const fileName = `Faktura za zamówienie: ${orderID}`;

    fetchFileOnLocalFileSystem(key, fileName);
  };

  return (
    <div className={blockName}>
      <h1 className={`${blockName}__main-header`}>Dziękujemy za dokonanie zakupu!</h1>
      <SubmitButton
        value="Pobierz fakturę w formacie PDF"
        classNames={`${blockName}__download-invoice-button`}
        onMouseDown={downloadInvoice}
      />
    </div>
  );
};

export default ThankYouPage;
