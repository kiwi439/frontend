import { gql } from '@apollo/client';

export const ADD_ORDER = gql`
  mutation addOrder($input: AddOrderInput!) {
    paymentUrl: addOrder(input: $input)
  }
`;
