import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { addTypenameToDocument } from 'apollo-utilities';
import { catchError } from 'rxjs/operators';
import { GraphQLError } from 'graphql';

import { schema } from '@daffodil/driver/magento';
import {
  DaffCart,
  DaffCartAddress,
  daffMagentoNoopCartFragment
} from '@daffodil/cart';
import {
  MagentoCartFactory,
  DaffCartFactory,
  MagentoShippingAddressFactory,
  DaffCartAddressFactory,
  MagentoCartAddressInputFactory
} from '@daffodil/cart/testing';

import { DaffMagentoCartShippingAddressService } from './cart-shipping-address.service';
import { DaffMagentoCartTransformer } from './transforms/outputs/cart.service';
import { MagentoCart } from './models/outputs/cart';
import { MagentoGetShippingAddressResponse } from './models/responses/get-shipping-address';
import {
  getShippingAddress,
  updateShippingAddress,
  updateShippingAddressWithEmail
} from './queries/public_api';
import { MagentoUpdateShippingAddressResponse } from './models/responses/update-shipping-address';
import { DaffMagentoShippingAddressTransformer } from './transforms/outputs/shipping-address.service';
import { DaffMagentoShippingAddressInputTransformer } from './transforms/inputs/shipping-address.service';
import { MagentoShippingAddress } from './models/outputs/shipping-address';
import { MagentoShippingAddressInput } from './models/inputs/shipping-address';
import { MagentoUpdateShippingAddressWithEmailResponse } from './models/responses/public_api';
import { DaffMagentoExtraCartFragments } from './injection-tokens/public_api';

describe('Driver | Magento | Cart | CartShippingAddressService', () => {
  let service: DaffMagentoCartShippingAddressService;
  let controller: ApolloTestingController;

  let daffCartFactory: DaffCartFactory;
  let magentoCartFactory: MagentoCartFactory;
  let magentoShippingAddressFactory: MagentoShippingAddressFactory;
  let magentoCartAddressInputFactory: MagentoCartAddressInputFactory;
  let daffCartAddressFactory: DaffCartAddressFactory;

  let magentoCartTransformerSpy;
  let magentoShippingAddressTransformerSpy;
  let magentoShippingAddressInputTransformerSpy;

  let cartId;
  let email;
  let mockDaffCart: DaffCart;
  let mockMagentoCart: MagentoCart;
  let mockMagentoShippingAddress: MagentoShippingAddress;
  let mockMagentoShippingAddressInput: MagentoShippingAddressInput;
  let mockDaffCartAddress: DaffCartAddress;
  let mockUpdateShippingAddressResponse: MagentoUpdateShippingAddressResponse;
  let mockUpdateShippingAddressWithEmailResponse: MagentoUpdateShippingAddressWithEmailResponse;
  let mockGetShippingAddressResponse: MagentoGetShippingAddressResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ],
      providers: [
        DaffMagentoCartShippingAddressService,
        {
          provide: DaffMagentoCartTransformer,
          useValue: jasmine.createSpyObj('DaffMagentoCartTransformer', ['transform'])
        },
        {
          provide: DaffMagentoShippingAddressTransformer,
          useValue: jasmine.createSpyObj('DaffMagentoShippingAddressTransformer', ['transform'])
        },
        {
          provide: DaffMagentoShippingAddressInputTransformer,
          useValue: jasmine.createSpyObj('DaffMagentoShippingAddressInputTransformer', ['transform'])
        },
        {
          provide: DaffMagentoExtraCartFragments,
          useValue: daffMagentoNoopCartFragment,
          multi: true
        },
				{
					provide: APOLLO_TESTING_CACHE,
					useValue: new InMemoryCache({
						addTypename: true,
						fragmentMatcher: new IntrospectionFragmentMatcher({
							introspectionQueryResultData: schema,
						}),
					}),
				}
      ]
    });

    service = TestBed.get(DaffMagentoCartShippingAddressService);
    controller = TestBed.get(ApolloTestingController);

    magentoCartTransformerSpy = TestBed.get(DaffMagentoCartTransformer);
    magentoShippingAddressTransformerSpy = TestBed.get(DaffMagentoShippingAddressTransformer);
    magentoShippingAddressInputTransformerSpy = TestBed.get(DaffMagentoShippingAddressInputTransformer);

    daffCartFactory = TestBed.get(DaffCartFactory);
    magentoCartFactory = TestBed.get(MagentoCartFactory);
    magentoShippingAddressFactory = TestBed.get(MagentoShippingAddressFactory);
    daffCartAddressFactory = TestBed.get(DaffCartAddressFactory);
    magentoCartAddressInputFactory = TestBed.get(MagentoCartAddressInputFactory);

    mockDaffCart = daffCartFactory.create();
    mockMagentoCart = magentoCartFactory.create();
    mockMagentoShippingAddress = magentoShippingAddressFactory.create();
    mockDaffCartAddress = daffCartAddressFactory.create();
    mockMagentoShippingAddressInput = {
      address: magentoCartAddressInputFactory.create()
    }

    cartId = mockDaffCart.id;
    email = mockMagentoShippingAddress.email;
    mockMagentoCart.email = email;
    mockDaffCartAddress.email = email;
    mockDaffCart.shipping_address = mockDaffCartAddress;
    mockGetShippingAddressResponse = {
      cart: {
				__typename: 'Cart',
        shipping_addresses: [mockMagentoShippingAddress],
        email
      }
    };
    mockUpdateShippingAddressResponse = {
      setShippingAddressesOnCart: {
				__typename: 'SetShippingAddresses',
        cart: mockMagentoCart
      },
    };
    mockUpdateShippingAddressWithEmailResponse = {
      setShippingAddressesOnCart: {
				__typename: 'SetShippingAddresses',
        cart: mockMagentoCart
      },
      setGuestEmailOnCart: {
        cart: {
          email
        }
      }
    };

    magentoCartTransformerSpy.transform.withArgs(mockMagentoCart).and.returnValue(mockDaffCart);
    magentoShippingAddressTransformerSpy.transform.and.returnValue(mockDaffCartAddress);
    magentoShippingAddressInputTransformerSpy.transform.withArgs(mockDaffCartAddress).and.returnValue(mockMagentoShippingAddressInput);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get | getting the shipping address', () => {
    it('should call the transformer with the correct argument', done => {
      service.get(cartId).subscribe(() => {
        // can't check for all args because available_shipping_methods and selected_shipping_method are stripped out of the mock response by apollo
        expect(magentoShippingAddressTransformerSpy.transform).toHaveBeenCalledWith(jasmine.objectContaining({
          email,
          street: mockMagentoShippingAddress.street,
          region: mockMagentoShippingAddress.region,
        }));
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(getShippingAddress([daffMagentoNoopCartFragment])));

      op.flush({
        data: mockGetShippingAddressResponse
      });
    });

    it('should return the correct value', done => {
      service.get(cartId).subscribe(result => {
        expect(result).toEqual(jasmine.objectContaining(mockDaffCartAddress));
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(getShippingAddress([daffMagentoNoopCartFragment])));

      op.flush({
        data: mockGetShippingAddressResponse
      });
    });

    describe('when the response is an empty array', () => {
      beforeEach(() => {
        mockGetShippingAddressResponse.cart.shipping_addresses = [];
      });

      it('should return null and not throw', done => {
        service.get(cartId).subscribe(result => {
          expect(result).toBeNull();
          done();
        });

        const op = controller.expectOne(addTypenameToDocument(getShippingAddress([daffMagentoNoopCartFragment])));

        op.flush({
          data: mockGetShippingAddressResponse
        });
      });
    });

    afterEach(() => {
      controller.verify();
    });
  });

  describe('update | updates the cart\'s email and shipping address', () => {
    describe('when the call to the Magento API is unsuccessful', () => {
      it('should throw an Error', done => {
        service.update(cartId, mockDaffCartAddress).pipe(
          catchError(err => {
            expect(err).toEqual(jasmine.any(Error));
            done();
            return [];
          })
        ).subscribe();

        const op = controller.expectOne(addTypenameToDocument(updateShippingAddressWithEmail([daffMagentoNoopCartFragment])));

        op.graphqlErrors([new GraphQLError(
          'Can\'t find a cart with that ID.',
          null,
          null,
          null,
          null,
          null,
          {category: 'graphql-no-such-entity'}
        )]);
      });
    });

    describe('when the call to the Magento API is successful', () => {
      describe('when the email is included', () => {
        let street;

        beforeEach(() => {
          street = 'updatedStreet';

          mockMagentoShippingAddress.street = [street];
          mockDaffCartAddress.street = street;
        });

        it('should return the correct value', done => {
          service.update(cartId, mockDaffCartAddress).subscribe(result => {
            expect(result.shipping_address.street).toEqual(street);
            expect(result.shipping_address.email).toEqual(email);
            done();
          });

          const op = controller.expectOne(addTypenameToDocument(updateShippingAddressWithEmail([daffMagentoNoopCartFragment])));

          op.flush({
            data: mockUpdateShippingAddressWithEmailResponse
          });
        });
      });

      describe('when the email is not included', () => {
        let street;

        beforeEach(() => {
          street = 'updatedStreet';

          mockMagentoShippingAddress.street = [street];
          mockDaffCartAddress.street = street;
          mockDaffCartAddress.email = null;
        });

        it('should return the correct value', done => {
          service.update(cartId, mockDaffCartAddress).subscribe(result => {
            expect(result.shipping_address.street).toEqual(street);
            done();
          });

          const op = controller.expectOne(addTypenameToDocument(updateShippingAddress([daffMagentoNoopCartFragment])));

          op.flush({
            data: mockUpdateShippingAddressResponse
          });
        });
      });
    });

    afterEach(() => {
      controller.verify();
    });
  });
});
