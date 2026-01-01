import { gql } from '@apollo/client';

// TODO: Get completed URL to product picture from backend
// TODO: Why is this called ProductsDetails? - Common Products would be better

export const GET_PRODUCTS = gql`
  query ProductsDetails ($first: Int, $after: String, $promoted: Boolean, $type: String) {
    products(first: $first, after: $after, promoted: $promoted, type: $type) {
      totalCount
      edges {
        cursor
        node {
          id
          name
          price
          availableQuantity
          pictureKey
          pictureBucket
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
