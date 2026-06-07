import { DeepReadonly } from 'utility-types';

export type Order = DeepReadonly<{
  id: string,
  totalPrice: number,
  createdAt: string,
  paid: boolean,
  __typename: string
}>;

export type GetOrdersResponse = DeepReadonly<{
  orders: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: Order
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
    __typename: string
  }
}>;
