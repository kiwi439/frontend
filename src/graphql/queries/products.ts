import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query ProductsDetails ($input: ProductInput) {
    productsDetails: products(input: $input) {
      totalCount,
      products {
        id
        name
        price
        availableQuantity
        pictureKey
        pictureBucket
      }
    }
  }
`;
