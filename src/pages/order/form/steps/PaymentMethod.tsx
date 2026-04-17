import React, { Fragment, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'types/store';
import { setPaymentMethod } from 'redux_/order/actionsCreator';
import { OrderContext } from 'contexts/contexts';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckBox from 'components/inputs/CheckBox';
import SubmitButton from 'components/SubmitButton';

const PaymentMethod = () => {
  const blockName = 'payment-method';
  const { setStep } = useContext(OrderContext);
  const { stripePayment, traditionalTransfer } = useSelector((store: RootState) => store.order.payment);
  const dispatch = useDispatch();

  const handleSubmitOnMouseDown = () => setStep(3);

  const handlePaymentMethodOnChange = (paymentMethod: 'stripe' | 'traditional') => {
    if (paymentMethod === 'stripe') {
      dispatch(setPaymentMethod({ stripePayment: true, traditionalTransfer: false }));
    } else {
      dispatch(setPaymentMethod({ stripePayment: false, traditionalTransfer: true }));
    }
  };

  return (
    <div className={`order__form-part-container ${blockName}`}>
      <CheckBox
        onChange={() => handlePaymentMethodOnChange('stripe')}
        checked={stripePayment}
        label={(
          <Fragment>
            <CreditCardIcon className={`${blockName}__icon`} />
            <span className={`${blockName}__icon-label`}>Płatność Stripe</span>
          </Fragment>
        )}
        dataTestId="stripe-payment-checkbox"
      />
      <CheckBox
        onChange={() => handlePaymentMethodOnChange('traditional')}
        checked={traditionalTransfer}
        label={(
          <Fragment>
            <PaymentIcon className={`${blockName}__icon`} />
            <span className={`${blockName}__icon-label`}>Przelew tradycyjny</span>
          </Fragment>
        )}
        dataTestId="traditional-transfer-checkbox"
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
