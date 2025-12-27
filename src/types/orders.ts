import { DeepReadonly } from 'utility-types';

type Order = DeepReadonly<{
  id: string,
  totalPrice: number,
  createdAt: string,
  __typename: string
}>

type Orders = Array<Order>;

export type GetOrdersResponse = DeepReadonly<{
  orders: {
    totalCount: number,
    orders: Orders,
    __typename: string
  }
}>;
