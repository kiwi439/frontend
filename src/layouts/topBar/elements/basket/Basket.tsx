import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'types/store';
import { isEmpty } from 'lodash';
import { countProductsTotalPrice, formatPrice } from 'utils/helpers';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EmptyBasketModal from 'layouts/topBar/elements/basket/EmptyBasketModal';
import BasketSummaryModal from 'layouts/topBar/elements/basket/BasketSummaryModal';

const Basket = () => {
  const productsInBasket = useSelector((store: RootState) => store.basket.addedProducts);
  const [isBasketSummaryOpen, setIsBasketSummaryOpen] = useState(false);
  const [isEmptyBasketModalOpen, setIsEmptyBasketModalOpen] = useState(false);
  const blockName = 'top-bar-elements';
  const isBasketEmpty = isEmpty(productsInBasket);

  const openEmptyBasketModal = () => setIsEmptyBasketModalOpen(true);
  const closeEmptyBasketModal = () => setIsEmptyBasketModalOpen(false);
  const openBasketSummary = () => setIsBasketSummaryOpen(true);
  const closeBasketSummary = () => setIsBasketSummaryOpen(false);
  const handleBasketOnMouseDown = () => isBasketEmpty ? openEmptyBasketModal() : openBasketSummary();

  return (
    <div className={`${blockName}__basket`}>
      <span className={`${blockName}__basket-price`}>
        {formatPrice(countProductsTotalPrice(productsInBasket))} zł
      </span>
      <ShoppingBasketIcon
        className={`${blockName}__basket-icon`}
        onMouseDown={handleBasketOnMouseDown}
        role="button"
        tabIndex={0}
        data-testid="basket-icon"
      />
      <EmptyBasketModal
        open={isEmptyBasketModalOpen}
        handleOnClose={closeEmptyBasketModal}
      />
      <BasketSummaryModal
        open={isBasketSummaryOpen}
        handleOnClose={closeBasketSummary}
      />
    </div>
  );
};

export default Basket;
