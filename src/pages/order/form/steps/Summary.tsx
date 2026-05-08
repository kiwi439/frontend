import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from 'types/store';
import { clearBasket } from 'redux_/basket/actionCreators';
import { countOrderTotalPrice, formatPrice } from 'utils/helpers';
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
            <th className={`${blockName}__col ${blockName}__col--thead`}>Nazwa</th>
            <th className={`${blockName}__col ${blockName}__col--thead`}>Cena</th>
            <th className={`${blockName}__col ${blockName}__col--thead`}>Ilość</th>
          </tr>
        </thead>
        <tbody className={`${blockName}__tbody`}>
          {
            addedProducts.map(({ quantity, attributes: { name, price } }) => (
              <tr className={`${blockName}__row`} key={uuidv4()}>
                <td className={`${blockName}__col`}>{name}</td>
                <td className={`${blockName}__col`}>{formatPrice(price)} zł</td>
                <td className={`${blockName}__col`}>{quantity}</td>
              </tr>
            ))
          }
          <tr className={`${blockName}__row`}>
            <td className={`${blockName}__col`}>{`Dostawa: ${DELIVERY_METHODS_CONFIGURATION[deliveryMethod].label}`}</td>
            <td className={`${blockName}__col`}>{formatPrice(DELIVERY_METHODS_CONFIGURATION[deliveryMethod].price)} zł</td>
            <td className={`${blockName}__col`}>1</td>
          </tr>
          <tr className={`${blockName}__row`}>
            <th className={`${blockName}__col ${blockName}__col--sum-label`}>
              Suma całkowita
            </th>
            <td className={`${blockName}__col ${blockName}__col--price`}>
              {formatPrice(countOrderTotalPrice(addedProducts, deliveryMethod))} zł
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
