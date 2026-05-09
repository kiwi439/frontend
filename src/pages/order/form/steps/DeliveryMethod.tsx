import React, { Fragment, useContext } from 'react';
import { OrderContext } from 'contexts/contexts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'types/store';
import { setDeliveryMethod } from 'redux_/order/actionsCreator';
import { DELIVERY_METHODS_CONFIGURATION, type DeliveryMethodConfig } from 'data/deliveryMethods';
import { formatPrice, calculateGrossPrice } from 'utils/pricing';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ApprovalIcon from '@mui/icons-material/Approval';
import CheckBox from 'components/inputs/CheckBox';
import SubmitButton from 'components/SubmitButton';

const DeliveryMethod = () => {
  const blockName = 'delivery-method';
  const { setStep } = useContext(OrderContext);
  const deliveryMethod = useSelector((store: RootState) => store.order.deliveryMethod);
  const dispatch = useDispatch();

  const handleInPostOnChange = () => dispatch(setDeliveryMethod('in_post'));
  const handleDpdOnChange = () => dispatch(setDeliveryMethod('dpd'));
  const handlePickUpAtheThePointOnChange = () => dispatch(setDeliveryMethod('pick_up_at_the_point'));

  const handleSubmitOnMouseDown = () => setStep(2);

  const generateDeliveryOptionLabel = (option: DeliveryMethodConfig) => {
    const price = calculateGrossPrice(option.price, option.vatRate);

    return `${option.label} (${formatPrice(price)} zł)`;
  };

  return (
    <div className={`order__form-part-container ${blockName}`}>
      <CheckBox
        onChange={handleInPostOnChange}
        checked={deliveryMethod === 'in_post'}
        label={(
          <Fragment>
            <LocalShippingIcon className={`${blockName}__icon ${blockName}__icon--inpost`} />
            <span className={`${blockName}__icon-label`}>
              {generateDeliveryOptionLabel(DELIVERY_METHODS_CONFIGURATION.in_post)}
            </span>
          </Fragment>
        )}
        dataTestId="inpost-checkbox"
      />
      <CheckBox
        onChange={handleDpdOnChange}
        checked={deliveryMethod === 'dpd'}
        label={(
          <Fragment>
            <PostAddIcon className={`${blockName}__icon`} />
            <span className={`${blockName}__icon-label`}>
              {generateDeliveryOptionLabel(DELIVERY_METHODS_CONFIGURATION.dpd)}
            </span>
          </Fragment>
        )}
        dataTestId="dpd-checkbox"
      />
      <CheckBox
        onChange={handlePickUpAtheThePointOnChange}
        checked={deliveryMethod === 'pick_up_at_the_point'}
        label={(
          <Fragment>
            <ApprovalIcon className={`${blockName}__icon`} />
            <span className={`${blockName}__icon-label`}>
              {generateDeliveryOptionLabel(DELIVERY_METHODS_CONFIGURATION.pick_up_at_the_point)}
            </span>
          </Fragment>
        )}
        dataTestId="pickup-at-the-point-checkbox"
      />
      <SubmitButton
        classNames="button--client-details"
        onMouseDown={handleSubmitOnMouseDown}
        value="Dalej"
      />
    </div>
  );
};

export default DeliveryMethod;
