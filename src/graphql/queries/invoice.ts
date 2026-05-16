import { gql } from '@apollo/client';

export const GET_INVOICE_PDF = gql`
  query InvoicePdf($orderId: ID!) {
    invoicePdf(orderId: $orderId) {
      pdfBase64
    }
  }
`;
