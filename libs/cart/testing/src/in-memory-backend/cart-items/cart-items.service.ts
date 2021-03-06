import { Injectable } from '@angular/core';
import { STATUS, InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import {
  DaffCart,
  DaffCartItem,
  DaffCartItemInput
} from '@daffodil/cart';
import { DaffInMemoryDataServiceInterface } from '@daffodil/core/testing';

import { DaffCartItemFactory } from '../../factories/cart-item/cart-item.factory';

@Injectable({
  providedIn: 'root'
})
export class DaffInMemoryBackendCartItemsService implements DaffInMemoryDataServiceInterface {
  constructor(private cartItemFactory: DaffCartItemFactory) {}

  get(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      let body;
      const action = this.getAction(reqInfo);

      if (action) {
        body = this.getItem(reqInfo, action);
      } else {
        body = this.listItems(reqInfo);
      }

      return {
        body,
        status: STATUS.OK
      };
    });
  }

  put(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => ({
      body: this.updateItem(reqInfo, this.getAction(reqInfo)),
      status: STATUS.OK
    }));
  }

  post(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => ({
      body: this.addItem(reqInfo),
      status: STATUS.OK
    }));
  }

  delete(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => ({
      body: this.deleteItem(reqInfo, this.getAction(reqInfo)),
      status: STATUS.OK
    }));
  }

  /**
   * Gets whatever follows the cart ID section of the request URL.
   */
  private getAction(reqInfo: RequestInfo): string {
    return reqInfo.url.replace(`/${reqInfo.resourceUrl}${reqInfo.id}/`, '')
  }

  private getCart(reqInfo: RequestInfo): DaffCart {
    return reqInfo.utils.findById<DaffCart>(reqInfo.collection, Number(reqInfo.id))
  }

  private transformItemInput(itemInput: DaffCartItemInput) {
    return {
      ...this.cartItemFactory.create(),
      ...itemInput,
      product_id: itemInput.productId
    }
  }

  private listItems(reqInfo): DaffCartItem[] {
    return this.getCart(reqInfo).items;
  }

  private getItem(reqInfo: RequestInfo, itemId: DaffCartItem['item_id']): DaffCartItem {
    const cart = this.getCart(reqInfo);

    return cart.items.find(({item_id}) => String(item_id) === String(itemId))
  }

  private updateItem(reqInfo: RequestInfo, itemId: DaffCartItem['item_id']): DaffCart {
    const cart = this.getCart(reqInfo);
    const item = reqInfo.utils.getJsonBody(reqInfo.req);
    const itemIndex = cart.items.findIndex(({item_id}) => String(itemId) === String(item_id))

    cart.items[itemIndex] = {
      ...cart.items[itemIndex],
      ...item
    };
		cart.items = Object.assign([], cart.items);

    return cart
  }

  private addItem(reqInfo: RequestInfo): DaffCart {
    const cart = this.getCart(reqInfo);
		const itemInput = reqInfo.utils.getJsonBody(reqInfo.req);
		const existingCartItemIndex = cart.items.findIndex(item => item.product_id === itemInput.productId);
		if(existingCartItemIndex > -1) {
			cart.items[existingCartItemIndex].qty = cart.items[existingCartItemIndex].qty + itemInput.qty;
		} else {
			cart.items.push(this.transformItemInput(itemInput));
		}
		cart.items = Object.assign([], cart.items);

    return cart;
  }

  private deleteItem(reqInfo: RequestInfo, itemId: DaffCartItem['item_id']): DaffCart {
    const cart = this.getCart(reqInfo);
    const itemIndex = cart.items.findIndex(({item_id}) => String(itemId) === String(item_id));

		cart.items.splice(itemIndex, 1);
		cart.items = Object.assign([], cart.items);

    return cart;
  }
}
