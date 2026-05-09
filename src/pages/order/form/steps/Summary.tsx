import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from 'types/store';
import { clearBasket } from 'redux_/basket/actionCreators';
import { calculateOrderTotalPrice, formatPrice, calculateGrossPrice } from 'utils/pricing';
import { DELIVERY_METHODS_CONFIGURATION, DeliveryMethods } from 'data/deliveryMethods';
import { ADD_ORDER } from 'graphql/mutations/order';
import { generateAddOrderPayload } from 'services/orders';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import SubmitButton from 'components/SubmitButton';

const Summary = () => {
  const blockName = 'summary';
  const dispatch = useDispatch();
  const { addedProducts } = useSelector((store: RootState) => store.basket);
  const deliveryMethod = useSelector((store: RootState) => store.order.deliveryMethod) as DeliveryMethods;
  const [orderError, setOrderError] = useState(false);

  const selectedDelivery = DELIVERY_METHODS_CONFIGURATION[deliveryMethod];

  const calculateDeliveryVatAmount = (): number => {
    const grossPrice = calculateGrossPrice(selectedDelivery.price, selectedDelivery.vatRate);

    return grossPrice - selectedDelivery.price;
  };

  const [addOrder, { loading }] = useMutation(ADD_ORDER, {
    variables: { input: generateAddOrderPayload() },
    onCompleted: ({ paymentUrl }) => {
      dispatch(clearBasket());
      window.location.assign(paymentUrl);
    },
    onError: () => setOrderError(true),
  });

  return (
    <div className={blockName}>
      <table className={`${blockName}__table`}>
        <thead className={`${blockName}__thead`}>
          <tr className={`${blockName}__row`}>
            <th className={`${blockName}__col ${blockName}__col--thead ${blockName}__col--name`}>Nazwa</th>
            <th className={`${blockName}__col ${blockName}__col--thead ${blockName}__col--net-price`}>Cena netto</th>
            <th className={`${blockName}__col ${blockName}__col--thead ${blockName}__col--vat`}>VAT</th>
            <th className={`${blockName}__col ${blockName}__col--thead ${blockName}__col--quantity`}>Ilość</th>
          </tr>
        </thead>
        <tbody className={`${blockName}__tbody`}>
          {
            addedProducts.map(({ quantity, attributes }) => {
              const { name, price: unitProductNettoPrice, vatRate } = attributes;
              const unitProductGrossPrice = calculateGrossPrice(unitProductNettoPrice, vatRate);
              const productLineNettoPrice = unitProductNettoPrice * quantity;
              const productLineGrossPrice = unitProductGrossPrice * quantity;

              return (
                <tr className={`${blockName}__row`} key={uuidv4()}>
                  <td className={`${blockName}__col ${blockName}__col--name`}>{name}</td>
                  <td className={`${blockName}__col ${blockName}__col--net-price`}>{formatPrice(unitProductNettoPrice)} zł</td>
                  <td className={`${blockName}__col ${blockName}__col--vat`}>{formatPrice(productLineGrossPrice - productLineNettoPrice)} zł</td>
                  <td className={`${blockName}__col ${blockName}__col--quantity`}>{quantity}</td>
                </tr>
              );
            })
          }
          <tr className={`${blockName}__row`}>
            <td className={`${blockName}__col ${blockName}__col--name`}>{`Dostawa: ${selectedDelivery.label}`}</td>
            <td className={`${blockName}__col ${blockName}__col--net-price`}>
              {formatPrice(selectedDelivery.price)} zł
            </td>
            <td className={`${blockName}__col ${blockName}__col--vat`}>
              {formatPrice(calculateDeliveryVatAmount())} zł
            </td>
            <td className={`${blockName}__col ${blockName}__col--quantity`}>1</td>
          </tr>
          <tr className={`${blockName}__row ${blockName}__row--pay-total`}>
            <td className={`${blockName}__col ${blockName}__col--pay-total-cell`}>
              <span className={`${blockName}__pay-total-label`}>Razem do zapłaty:</span>
              <span className={`${blockName}__pay-total-value`}>
                {formatPrice(calculateOrderTotalPrice(addedProducts, selectedDelivery))} zł
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <SubmitButton
        classNames="button--order"
        onMouseDown={addOrder}
        value="Kupuje i płacę"
      />
      <LoadingModal
        isOpen={loading}
        info="Trwa przetwarzanie twojego zamówienia!"
      />
      <ErrorModal
        isOpen={orderError}
        handleOnClose={() => setOrderError(false)}
        info="Niestety nie udało się złożyć zamówienia."
      />
    </div>
  );
};

export default Summary;
