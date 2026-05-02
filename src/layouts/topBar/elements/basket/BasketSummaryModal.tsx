import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'types/store';
import { Modal } from '@mui/material';
import Product from 'components/product/Product';
import SubmitButton from 'components/SubmitButton';

type BasketSummaryModalProps = {
  open: boolean,
  handleOnClose: (...args: any[]) => void
};

const BasketSummaryModal = ({ open, handleOnClose }: BasketSummaryModalProps) => {
  const blockName = 'modal';
  const productsInBasket = useSelector((store: RootState) => store.basket.addedProducts);
  const navigate = useNavigate();

  const handleSubmitOnMouseDown = () => {
    handleOnClose();
    navigate('/order');
  };

  return (
    <Modal
      className={blockName}
      open={open}
      onClose={handleOnClose}
      id="basket-with-products-modal"
    >
      <div className={`${blockName}__content-wrapper`}>
        {
          productsInBasket.map(({ id, attributes }, index) => (
            <Product
              product={attributes}
              key={id}
              index={index}
              mode="basket"
            />
          ))
        }
        <div className={`${blockName}__buttons-wrapper`}>
          <SubmitButton
            onMouseDown={handleSubmitOnMouseDown}
            value="Kontynuuj zakupy"
          />
        </div>
      </div>
    </Modal>
  );
};

export default BasketSummaryModal;
