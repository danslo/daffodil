import gql from 'graphql-tag';

import { cartFragment } from './fragments/public_api';
import { DocumentNode } from 'graphql';

export type FragmentDocument = {
  name: string,
  fragment: DocumentNode
}

export const setSelectedPaymentMethod = (fragment: FragmentDocument = null) => gql`
  mutation SetSelectedPaymentMethod($cartId: String!, $payment: PaymentMethodInput!) {
    setPaymentMethodOnCart(input: {
      cart_id: $cartId
      payment_method: $payment
    }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;
