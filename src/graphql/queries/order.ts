import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query ($input: OrdersInput) {
    orders: orders(input: $input) {
      totalCount,
      orders {
        id,
        totalPrice,
        createdAt
      }
    }
  }
`;
