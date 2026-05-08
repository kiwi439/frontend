export type DeliveryMethods = keyof typeof DELIVERY_METHODS_CONFIGURATION;

export const DELIVERY_METHODS_CONFIGURATION = {
  in_post: {
    label: 'Inpost',
    price: 10.99
  },
  dpd: {
    label: 'DPD',
    price: 15.99
  },
  pick_up_at_the_point: {
    label: 'Odbiór w punkcie',
    price: 0.00
  }
} as const;
