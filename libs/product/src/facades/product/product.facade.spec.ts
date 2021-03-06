import { TestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold } from 'jasmine-marbles';

import {
	DaffProductLoad, 
	DaffProductLoadSuccess,
	daffProductReducers,
	DaffProductReducersState
} from '@daffodil/product';

import { DaffProductFacade } from './product.facade';
import { DaffProductFactory } from '@daffodil/product/testing';

describe('DaffProductFacade', () => {
  let store: MockStore<Partial<DaffProductReducersState>>;
  let facade: DaffProductFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        StoreModule.forRoot({
          product: combineReducers(daffProductReducers),
        })
      ],
      providers: [
        DaffProductFacade,
      ]
    })

    store = TestBed.get(Store);
    facade = TestBed.get(DaffProductFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should be able to dispatch an action to the store', () => {
    spyOn(store, 'dispatch');
    const action = {type: 'SOME_TYPE'};

    facade.dispatch(action);
    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  describe('loading$', () => {
    it('should be false if the product state is not loading', () => {
      const expected = cold('a', { a: false });
      expect(facade.loading$).toBeObservable(expected);
    });
  
    it('should be true if the product state is loading', () => {
      const expected = cold('a', { a: true });
      store.dispatch(new DaffProductLoad('1'));
      expect(facade.loading$).toBeObservable(expected);
    });
  });

  describe('product$', () => {
    it('should initially be undefined', () => {
      const initial = cold('a', { a: undefined });
      expect(facade.product$).toBeObservable(initial);
    });

    it('should be an observable of the currently selected product', () => {
      const product = new DaffProductFactory().create();
      const expected = cold('a', { a: product});
      store.dispatch(new DaffProductLoad(product.id));
      store.dispatch(new DaffProductLoadSuccess(product));
      expect(facade.product$).toBeObservable(expected);
    })
	});
	
	describe('getProduct()', () => {
		it('should be an observable of a product', () => {
			const product = new DaffProductFactory().create();
      const expected = cold('a', { a: product});
      store.dispatch(new DaffProductLoad(product.id));
      store.dispatch(new DaffProductLoadSuccess(product));
      expect(facade.getProduct(product.id)).toBeObservable(expected);
		});
	});
	
	describe('hasDiscount()', () => {
		it('should be an observable of whether the given product has discount', () => {
			const product = {id: '1', name: 'Some Name', discount: { amount: 20, percent: 10 }};
      const expected = cold('a', { a: true });
      store.dispatch(new DaffProductLoad(product.id));
      store.dispatch(new DaffProductLoadSuccess(product));
      expect(facade.hasDiscount(product.id)).toBeObservable(expected);
		});
	});
	
	describe('getDiscountAmount()', () => {
		it('should be an observable of whether the given product has discount', () => {
			const product = {id: '1', name: 'Some Name', discount: { amount: 20, percent: 10 }};
      const expected = cold('a', { a: 20 });
      store.dispatch(new DaffProductLoad(product.id));
      store.dispatch(new DaffProductLoadSuccess(product));
      expect(facade.getDiscountAmount(product.id)).toBeObservable(expected);
		});
	});
	
	describe('getDiscountPercent()', () => {
		it('should be an observable of whether the given product has discount', () => {
			const product = {id: '1', name: 'Some Name', discount: { amount: 20, percent: 10 }};
      const expected = cold('a', { a: 10 });
      store.dispatch(new DaffProductLoad(product.id));
      store.dispatch(new DaffProductLoadSuccess(product));
      expect(facade.getDiscountPercent(product.id)).toBeObservable(expected);
		});
	});
	
	describe('isOutOfStock()', () => {
		it('should be an observable of whether the given product is out of stock', () => {
			const product = {id: '1', name: 'Some Name', discount: { amount: 20, percent: 10 }, in_stock: false};
      const expected = cold('a', { a: true });
      store.dispatch(new DaffProductLoad(product.id));
      store.dispatch(new DaffProductLoadSuccess(product));
      expect(facade.isOutOfStock(product.id)).toBeObservable(expected);
		});
	});
});
