import { Avatars } from 'types/avatar';

export type Opinion = {
  id: string,
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
  opinions: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: Opinion
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
    __typename: string
  }
}