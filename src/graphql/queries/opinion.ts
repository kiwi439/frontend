import { gql } from '@apollo/client';

export const GET_OPINIONS = gql`
  query OpinionsDetails ($input: OpinionFilterInput) {
    opinionsDetails: opinions(input: $input) {
      opinions {
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
      totalCount
    }
  }
`;
