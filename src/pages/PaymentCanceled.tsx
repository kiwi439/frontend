import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ShadowedContainer from 'components/containers/ShadowedContainer';
import SubmitButton from 'components/SubmitButton';

// TODO
// Kazdy tu moze wejść
// Brak powiązania z platnościa
// Brak pokazywania danych platnosci

const PaymentCanceled = () => {
  const blockName = 'payment-canceled';
  const navigate = useNavigate();

  return (
    <ShadowedContainer classNames={blockName}>
      <Fragment>
        <h1 className={`${blockName}__header`}>Płatność anulowana</h1>
        <p className={`${blockName}__description`}>
          Nie udalo sie sfinalizowac platnosci. Możesz spróbować ponownie.
        </p>
        <SubmitButton
          value="Wróć do zamówienia"
          classNames={`${blockName}__button`}
          onMouseDown={() => navigate('/')}
        />
      </Fragment>
    </ShadowedContainer>
  );
};

export default PaymentCanceled;
