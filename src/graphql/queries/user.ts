import { gql } from '@apollo/client';

export const IS_USER_LOGGED = gql`
  query IsUserLogged {
    auth: isUserLogged {
      id
    }
  }
`;

export const USER_PERSONAL_DETAILS = gql`
  query User ($userId: ID!) {
    user: user(userId: $userId) {
      name
      surname
      email
      phoneNumber
      city
      postalCode
      street
    }
  }
`;

export const IS_USER_SAVED_TO_NEWSLETTER = gql`
  query IsUserSavedToNewsletter ($userId: ID!) {
    user(userId: $userId) {
      savedToNewsletter,
      email
    }
  }
`;
