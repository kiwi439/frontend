import React, { Fragment, useContext } from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { OrderContext } from 'contexts/contexts';
import CheckBox from 'components/inputs/CheckBox';
import SubmitButton from 'components/SubmitButton';

const PaymentMethod = () => {
  const blockName = 'payment-method';
  const { setStep } = useContext(OrderContext);

  const handleSubmitOnMouseDown = () => setStep(3);

  return (
    <div className={`order__form-part-container ${blockName}`}>
      <CheckBox
        checked
        label={(
          <Fragment>
            <CreditCardIcon className={`${blockName}__icon`} />
            <span className={`${blockName}__icon-label`}>Płatność Stripe</span>
          </Fragment>
        )}
        dataTestId="stripe-payment-checkbox"
      />
      <SubmitButton
        classNames="button--client-details"
        onMouseDown={handleSubmitOnMouseDown}
        value="Dalej"
      />
    </div>
  );
};

export default PaymentMethod;
