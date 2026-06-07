import { gql } from '@apollo/client';

export const GET_ORDER = gql`
  query Order($id: ID!) {
    order(id: $id) {
      paid
      latestPayment {
        id
        status
        amountCents
        provider
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query Orders ($first: Int, $after: String, $userId: ID) {
    orders(first: $first, after: $after, userId: $userId) {
      totalCount
      edges {
        cursor
        node {
          id
          totalPrice
          createdAt
          paid
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
