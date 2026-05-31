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
    <div className={`order__form-part-container ${blockName}`}>
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
              const unitProductVatAmount = unitProductGrossPrice - unitProductNettoPrice;

              return (
                <tr className={`${blockName}__row`} key={uuidv4()}>
                  <td className={`${blockName}__col ${blockName}__col--name`}>{name}</td>
                  <td className={`${blockName}__col ${blockName}__col--net-price`} data-label="Cena netto">{formatPrice(unitProductNettoPrice)}&nbsp;zł</td>
                  <td className={`${blockName}__col ${blockName}__col--vat`} data-label="VAT">{formatPrice(unitProductVatAmount)}&nbsp;zł</td>
                  <td className={`${blockName}__col ${blockName}__col--quantity`} data-label="Ilość">{quantity}</td>
                </tr>
              );
            })
          }
          <tr className={`${blockName}__row`}>
            <td className={`${blockName}__col ${blockName}__col--name`}>{`Dostawa: ${selectedDelivery.label}`}</td>
            <td className={`${blockName}__col ${blockName}__col--net-price`} data-label="Cena netto">
              {formatPrice(selectedDelivery.price)}&nbsp;zł
            </td>
            <td className={`${blockName}__col ${blockName}__col--vat`} data-label="VAT">
              {formatPrice(calculateDeliveryVatAmount())}&nbsp;zł
            </td>
            <td className={`${blockName}__col ${blockName}__col--quantity`} data-label="Ilość">1</td>
          </tr>
          <tr className={`${blockName}__row ${blockName}__row--pay-total`}>
            <td className={`${blockName}__col ${blockName}__col--pay-total-cell`}>
              <span className={`${blockName}__pay-total-label`}>Razem do zapłaty:</span>
              <span className={`${blockName}__pay-total-value`}>
                {formatPrice(calculateOrderTotalPrice(addedProducts, selectedDelivery))}&nbsp;zł
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
        body={<p>Niestety nie udało się złożyć zamówienia.</p>}
      />
    </div>
  );
};

export default Summary;
