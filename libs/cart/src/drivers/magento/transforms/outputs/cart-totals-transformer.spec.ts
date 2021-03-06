import { TestBed } from '@angular/core/testing';

import { MagentoCart, DaffCart, DaffCartTotalTypeEnum } from '@daffodil/cart';
import { MagentoCartFactory } from '@daffodil/cart/testing';
import { daffAdd } from '@daffodil/core';

import { transformCartTotals } from './cart-totals-transformer';

describe('transformCartTotals', () => {
	let stubMagentoCart: MagentoCart;
	let expectedTotals: {totals: DaffCart['totals']};

	beforeEach(() => {
    TestBed.configureTestingModule({});

		stubMagentoCart = new MagentoCartFactory().create({
			shipping_addresses: [
				{
					selected_shipping_method: {
						amount: {
							value: 100
						}
					}
				}
			]
		});
		const totalTax = stubMagentoCart.prices.applied_taxes.reduce((acc, tax) => (daffAdd(acc, tax.amount.value)), 0);
		expectedTotals = {
			totals: [
				{
					name: DaffCartTotalTypeEnum.grandTotal,
					label: 'Grand Total',
					value: stubMagentoCart.prices.grand_total.value
				},
				{
					name: DaffCartTotalTypeEnum.subtotalExcludingTax,
					label: 'Subtotal Excluding Tax',
					value: stubMagentoCart.prices.subtotal_excluding_tax.value
				},
				{
					name: DaffCartTotalTypeEnum.subtotalIncludingTax,
					label: 'Subtotal Including Tax',
					value: stubMagentoCart.prices.subtotal_including_tax.value
				},
				{
					name: DaffCartTotalTypeEnum.subtotalWithDiscountExcludingTax,
					label: 'Subtotal with Discount Excluding Tax',
					value: stubMagentoCart.prices.subtotal_with_discount_excluding_tax.value
				},
				{
					name: DaffCartTotalTypeEnum.subtotalWithDiscountIncludingTax,
					label: 'Subtotal with Discount Including Tax',
					value: daffAdd(stubMagentoCart.prices.subtotal_with_discount_excluding_tax.value, totalTax)
				},
				{
					name: DaffCartTotalTypeEnum.tax,
					label: 'Tax',
					value: totalTax
				},
				...stubMagentoCart.prices.discounts.map(discount => ({
					name: DaffCartTotalTypeEnum.discount,
					label: discount.label,
					value: discount.amount.value
				})),
				{
					name: DaffCartTotalTypeEnum.shipping,
					label: 'Shipping',
					value: stubMagentoCart.shipping_addresses[0].selected_shipping_method.amount.value
				}
			]
		};
  });

	it('should transform cart totals', () => {
		expect(transformCartTotals(stubMagentoCart)).toEqual(expectedTotals);
	});

	it('should transform cart totals when magento gives null/empty values', () => {
		expectedTotals = {
			totals: [
				{
					name: DaffCartTotalTypeEnum.grandTotal,
					label: 'Grand Total',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalExcludingTax,
					label: 'Subtotal Excluding Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalIncludingTax,
					label: 'Subtotal Including Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalWithDiscountExcludingTax,
					label: 'Subtotal with Discount Excluding Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalWithDiscountIncludingTax,
					label: 'Subtotal with Discount Including Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.tax,
					label: 'Tax',
					value: 0
				},
				{
					name: DaffCartTotalTypeEnum.shipping,
					label: 'Shipping',
					value: null
				}
			]
		};
		stubMagentoCart.prices.applied_taxes = [];
		stubMagentoCart.prices.discounts = [];
		stubMagentoCart.prices.grand_total.value = null;
		stubMagentoCart.prices.subtotal_excluding_tax.value = null;
		stubMagentoCart.prices.subtotal_including_tax.value = null;
		stubMagentoCart.prices.subtotal_with_discount_excluding_tax.value = null;
		stubMagentoCart.shipping_addresses[0].selected_shipping_method.amount.value = null;

		expect(transformCartTotals(stubMagentoCart)).toEqual(expectedTotals);
  });

  it('should transform cart totals when magento gives empty shipping addresses', () => {
		expectedTotals = {
			totals: [
				{
					name: DaffCartTotalTypeEnum.grandTotal,
					label: 'Grand Total',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalExcludingTax,
					label: 'Subtotal Excluding Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalIncludingTax,
					label: 'Subtotal Including Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalWithDiscountExcludingTax,
					label: 'Subtotal with Discount Excluding Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.subtotalWithDiscountIncludingTax,
					label: 'Subtotal with Discount Including Tax',
					value: null
				},
				{
					name: DaffCartTotalTypeEnum.tax,
					label: 'Tax',
					value: 0
				},
				{
					name: DaffCartTotalTypeEnum.shipping,
					label: 'Shipping',
					value: null
				}
			]
		};
		stubMagentoCart.prices.applied_taxes = [];
		stubMagentoCart.prices.discounts = [];
		stubMagentoCart.prices.grand_total.value = null;
		stubMagentoCart.prices.subtotal_excluding_tax.value = null;
		stubMagentoCart.prices.subtotal_including_tax.value = null;
		stubMagentoCart.prices.subtotal_with_discount_excluding_tax.value = null;
		stubMagentoCart.shipping_addresses = null;

		expect(transformCartTotals(stubMagentoCart)).toEqual(expectedTotals);
	});
});
