import React, { Fragment } from 'react';
import clsx from 'clsx';
import useFetchUrl from 'hooks/useFetchUrl';
import { Product as ProductType } from 'types/product';
import ShadowedContainer from 'components/containers/ShadowedContainer';
import { APPEARING_IN_SEQUENCE } from 'data/animations';
import { formatPrice, calculateGrossPrice } from 'utils/pricing';
import AddToBasketForm from './AddToBasketForm';
import ProductNotAvailable from './ProductNotAvailable';
import SelectedQuantityPresenter from './SelectedQuantityPresenter';

type ProductProps = {
  product: ProductType['attributes'],
  index: number,
  mode: 'main' | 'basket'
};

const Product = ({ product, index, mode }: ProductProps) => {
  const blockName = 'product';
  const { id, name, price, pictureBucket, pictureKey, availableQuantity, vatRate } = product;
  const grossPrice = calculateGrossPrice(price, vatRate);
  const isMainMode = mode === 'main';
  const isBasketMode = mode === 'basket';

  const pictureURL = useFetchUrl({ bucket: pictureBucket, key: pictureKey });

  if (isMainMode && availableQuantity === 0) {
    return <ProductNotAvailable product={product} index={index} />;
  }

  return (
    <ShadowedContainer
      classNames={clsx(blockName, isBasketMode && `${blockName}--basket`)}
      animationAttributes={{
        variants: APPEARING_IN_SEQUENCE,
        custom: index,
        initial: APPEARING_IN_SEQUENCE.hidden,
        animate: APPEARING_IN_SEQUENCE.visible(index)
      }}
      dataTestId="product-container"
    >
      <Fragment>
        <div className={`${blockName}__img-wrapper`}>
          <img
            src={pictureURL}
            alt="Zdjęcie produktu"
            className={`${blockName}__img`}
          />
        </div>
        <div className={`${blockName}__info-wrapper`}>
          <h2 className={`${blockName}__name`}>{name}</h2>
          <h3 className={`${blockName}__price`}>{formatPrice(grossPrice)} zł</h3>
          <p className={`${blockName}__description`}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus, consequatur. Ex blanditiis accusamus nam molestiae officiis totam repellendus labore beatae ullam quas, hic facilis fugit illum tenetur, magni est distinctio.
          </p>
          { isMainMode && <AddToBasketForm product={product} /> }
          { isBasketMode && <SelectedQuantityPresenter productID={id} /> }
        </div>
      </Fragment>
    </ShadowedContainer>
  );
};

export default Product;
