import { gql } from '@apollo/client';

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
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
