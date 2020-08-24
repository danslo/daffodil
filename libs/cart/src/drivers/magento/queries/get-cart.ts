import gql from 'graphql-tag';

import { cartFragment } from './fragments/public_api';
import { FragmentDocument } from './set-selected-payment-method';

export const getCart = (fragment: FragmentDocument = null) => gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      ...cart
      ...${fragment.name}

    }
  }
  ${cartFragment}
  ${fragment.fragment}
`;
