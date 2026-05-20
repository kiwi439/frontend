import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'types/store';
import { saveFileFromBase64 } from 'services/downloadFile';
import SubmitButton from 'components/SubmitButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_ORDER } from 'graphql/queries/order';
import { GET_INVOICE_PDF } from 'graphql/queries/invoice';
import useRedirect from 'hooks/useRedirect';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import FormContainer from 'components/containers/FormContainer';
import { SHOP_MAIL, SHOP_PHONE } from 'data/uiElements';
import { formatPhoneNumber } from 'utils/helpers';

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  succeeded: 'Opłacono',
  failed: 'Nieopłacono',
  expired: 'Wygasło',
  pending: 'Oczekuje na płatność'
};

const ThankYouPage = () => {
  const blockName = 'thank-you-page';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderID = searchParams.get('order_id') as string;
  const { loggedUserId } = useSelector((store: RootState) => store.user);

  useRedirect({ path: '/', shouldRedirect: !loggedUserId });

  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_ORDER, {
    variables: { id: orderID },
    fetchPolicy: 'network-only',
  });

  const [fetchInvoice, { loading: fetchingInvoice }] = useLazyQuery(GET_INVOICE_PDF, {
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      saveFileFromBase64(response.invoicePdf.pdfBase64, `Faktura za zamówienie: ${orderID}.pdf`);
    },
  });

  const paymentStatus = data?.order?.latestPayment?.status;

  const renderLoadingModal = (): ReactElement => {
    return <LoadingModal isOpen info="Pobieramy status zamówienia i płatności…" />;
  };

  const renderErrorModal = (): ReactElement => (
    <ErrorModal
      isOpen
      handleOnClose={() => navigate('/')}
      body={<p>Wystąpił błąd podczas pobierania zamówienia.</p>}
    />
  );

  const renderSummary = (): ReactElement => {
    const renderPaymentDetails = (includeSupportDetails = false): ReactElement => {
      const latestPayment = data!.order.latestPayment!;
      const paymentProviderLabel = latestPayment.provider.toUpperCase();
      const paymentStatusLabel = PAYMENT_STATUS_LABELS[latestPayment.status];
      const paymentAmountLabel = `${(latestPayment.amountCents / 100).toFixed(2)} zł`;

      return (
        <div className={`${blockName}__payment-details`}>
          <div className={`${blockName}__payment-row`}>
            <span className={`${blockName}__payment-label`}>Provider</span>
            <span className={`${blockName}__payment-value`}>{paymentProviderLabel}</span>
          </div>
          <div className={`${blockName}__payment-row`}>
            <span className={`${blockName}__payment-label`}>Status</span>
            <span className={`${blockName}__payment-value
                              ${data!.order.paid ? `${blockName}__payment-value--status-ok` : `${blockName}__payment-value--status-error`}`}>
              {paymentStatusLabel}
            </span>
          </div>
          <div className={`${blockName}__payment-row`}>
            <span className={`${blockName}__payment-label`}>Kwota</span>
            <span className={`${blockName}__payment-value`}>{paymentAmountLabel}</span>
          </div>
          {includeSupportDetails && (
            <>
              <div className={`${blockName}__payment-row`}>
                <span className={`${blockName}__payment-label`}>ID płatności</span>
                <span className={`${blockName}__payment-value`}>{latestPayment.id}</span>
              </div>
              <div className={`${blockName}__payment-row`}>
                <span className={`${blockName}__payment-label`}>Kontakt</span>
                <span className={`${blockName}__payment-value ${blockName}__payment-value--contact`}>
                  <a href={`tel:${SHOP_PHONE}`} className={`${blockName}__contact-phone`}>
                    {formatPhoneNumber(SHOP_PHONE)}
                  </a>
                  <span className={`${blockName}__contact-separator`}>lub</span>
                  <a href={`mailto:${SHOP_MAIL}`} className={`${blockName}__contact-mail`}>
                    {SHOP_MAIL}
                  </a>
                </span>
              </div>
            </>
          )}
        </div>
      );
    };

    const renderPaymentSuccess = (): ReactElement => (
      <div className={blockName}>
        <FormContainer
          classNames={`${blockName}__form-container`}
          header="Dziękujemy za dokonanie zakupu!"
          form={(
            <>
              <p className={`${blockName}__payment-summary`}>Płatność została opłacona.</p>
              {renderPaymentDetails()}
              <SubmitButton
                value={fetchingInvoice ? 'Pobieranie faktury…' : 'Pobierz fakturę w formacie PDF'}
                classNames={`${blockName}__download-invoice-button`}
                onMouseDown={() => {
                  if (fetchingInvoice) return;

                  fetchInvoice({ variables: { orderId: orderID } });
                }}
              />
            </>
          )}
        />
      </div>
    );
  
    const renderPaymentFailure = (): ReactElement => (
      <div className={blockName}>
        <FormContainer
          classNames={`${blockName}__form-container`}
          header="Dziękujemy za dokonanie zakupu!"
          form={(
            <>
              <p className={`${blockName}__payment-summary ${blockName}__payment-summary--error`}>Niestety płatność nie została zrealizowana.</p>
              {renderPaymentDetails(true)}
            </>
          )}
        />
      </div>
    );

    if (data.order.paid) {
      return renderPaymentSuccess();
    }

    return renderPaymentFailure();
  };

  useEffect(() => {
    if (paymentStatus === 'pending') {
      startPolling(2000);
    } else {
      stopPolling();
    }
  }, [paymentStatus]);

  if (loading || paymentStatus === 'pending') return renderLoadingModal();
  if (error) return renderErrorModal();

  return renderSummary();
};

export default ThankYouPage;
