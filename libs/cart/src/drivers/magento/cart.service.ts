import { Injectable, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { DaffCartServiceInterface } from '../interfaces/cart-service.interface';
import { DaffCart } from '../../models/cart';
import { DaffMagentoCartTransformer } from './transforms/outputs/cart.service';
import { getCart, createCart } from './queries/public_api';
import { DaffCartItemDriver, DaffCartItemServiceInterface } from '../interfaces/cart-item-service.interface';
import { DaffCartItem } from '../../models/cart-item';
import { DaffCartItemInput } from '../../models/cart-item-input';
import { MagentoGetCartResponse } from './models/responses/get-cart';
import { MagentoCreateCartResponse } from './models/responses/create-cart';
import { transformCartMagentoError } from './errors/transform';
import { DaffMagentoExtraCartFragments } from './injection-tokens/public_api';

/**
 * A service for making Magento GraphQL queries for carts.
 */
@Injectable({
  providedIn: 'root'
})
export class DaffMagentoCartService implements DaffCartServiceInterface<DaffCart> {
  constructor(
    private apollo: Apollo,
    public cartTransformer: DaffMagentoCartTransformer,
    @Inject(DaffCartItemDriver) private cartItemDriver: DaffCartItemServiceInterface<
      DaffCartItem,
      DaffCartItemInput,
      DaffCart
    >,
    @Inject(DaffMagentoExtraCartFragments) public extraCartFragments: DocumentNode[],
  ) {}

  get(cartId: string): Observable<DaffCart> {
    return this.apollo.query<MagentoGetCartResponse>({
      query: getCart(this.extraCartFragments),
      variables: {cartId}
    }).pipe(
      catchError((error: Error) => throwError(transformCartMagentoError(error))),
      map(result => this.cartTransformer.transform(result.data.cart))
    );
  }

  create(): Observable<{id: string}> {
    return this.apollo.mutate<MagentoCreateCartResponse>({mutation: createCart}).pipe(
      map(result => ({id: result.data.createEmptyCart}))
    )
  }

  addToCart(productId: string, qty: number): Observable<DaffCart> {
    throw new Error('Method is deprecated. Use DaffCartItemServiceInterface#add instead.');
  }

  clear(cartId: string): Observable<Partial<DaffCart>> {
    return this.cartItemDriver.list(cartId).pipe(
      switchMap(items =>
        forkJoin(...items.map(item =>
          this.cartItemDriver.delete(cartId, item.item_id)
        ))
      ),
			switchMap(() => this.get(cartId))
    )
	}
}
