import { Avatars } from 'types/avatar';

export type Opinion = {
  content: string,
  mark: number,
  updatedAt: string,
  user: {
    avatars: Avatars,
    email: string,
    __typename: string
  }
};

export type Opinions = Array<Opinion>;

export type GetOpinionsResponse = {
  opinionsDetails: {
    totalCount: number,
    opinions: Array<Opinion>,
    __typename: string
  }
}