import { Injectable } from '@angular/core';

import { DaffMagentoCartAddressTransformer } from './cart-address.service';
import { MagentoCartAddress } from '../../models/outputs/cart-address';
import { DaffCartAddress } from '../../../../models/cart-address';

/**
 * Transforms magento addresses into an object usable by daffodil.
 */
@Injectable({
  providedIn: 'root'
})
export class DaffMagentoBillingAddressTransformer {
  constructor (
    public addressTransformer: DaffMagentoCartAddressTransformer
  ) {}

  /**
   * Transforms the magento MagentoCart from the magento cart query into a DaffCartAddress.
   * @param address the address from a magento cart query.
   */
  transform(address: MagentoCartAddress): DaffCartAddress {
    return address ? {
      ...this.addressTransformer.transform(address),
      address_type: 'billing',
    } : null
  }
}
