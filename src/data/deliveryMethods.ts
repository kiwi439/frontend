export type DeliveryMethods = keyof typeof DELIVERY_METHODS_CONFIGURATION;
export type DeliveryMethodConfig = (typeof DELIVERY_METHODS_CONFIGURATION)[DeliveryMethods];

export const DELIVERY_METHODS_CONFIGURATION = {
  in_post: {
    label: 'Inpost',
    price: 10.99,
    vatRate: 23
  },
  dpd: {
    label: 'DPD',
    price: 15.99,
    vatRate: 23
  },
  pick_up_at_the_point: {
    label: 'Odbiór w punkcie',
    price: 0.00,
    vatRate: 23
  }
} as const;
