import React from 'react';
import useFetchUrl from 'hooks/useFetchUrl';
import { Product as ProductType } from 'types/product';
import ShadowedContainer from 'components/containers/ShadowedContainer';
import { APPEARING_IN_SEQUENCE } from 'data/animations';
import { formatPrice, calculateGrossPrice } from 'utils/pricing';

type ProductNotAvailableProps = {
  product: ProductType['attributes'],
  index: number
};

const ProductNotAvailable = ({ product, index }: ProductNotAvailableProps) => {
  const blockName = 'product';
  const { name, price, pictureBucket, pictureKey, vatRate } = product;
  const grossPrice = calculateGrossPrice(price, vatRate);
  const pictureURL = useFetchUrl({ bucket: pictureBucket, key: pictureKey });

  return (
    <ShadowedContainer
      classNames={blockName}
      animationAttributes={{
        variants: APPEARING_IN_SEQUENCE,
        custom: index,
        initial: APPEARING_IN_SEQUENCE.hidden,
        animate: APPEARING_IN_SEQUENCE.visible(index)
      }}
      dataTestId="product-container"
    >
      <div className={`${blockName}__unavailable-overlay`}>
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
          <p className={`${blockName}__unavailable-label`} role="status">
            Produkt niedostępny
          </p>
        </div>
      </div>
    </ShadowedContainer>
  );
};

export default ProductNotAvailable;
