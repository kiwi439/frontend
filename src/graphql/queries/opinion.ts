import { gql } from '@apollo/client';

export const GET_OPINIONS = gql`
  query Opinions ($first: Int, $after: String) {
    opinions(first: $first, after: $after) {
      totalCount
      edges {
        cursor
        node {
          id
          content
          mark
          updatedAt
          user {
            email
            avatars {
              main
              key
              bucket
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
