import { TestBed } from '@angular/core/testing';

import { ProductNode } from '@daffodil/product';
import { DaffCategoryFactory, DaffCategoryPageConfigurationStateFactory } from '@daffodil/category/testing';

import { DaffMagentoCategoryPageConfigTransformerService } from './category-page-config-transformer.service';
import { DaffCategory } from '../../../models/category';
import { DaffCategoryPageConfigurationState } from '../../../models/category-page-configuration-state';
import { MagentoCategory } from '../models/category';
import { MagentoAggregation } from '../models/aggregation';
import { MagentoPageInfo } from '../models/page-info';
import { MagentoSortFields } from '../models/sort-fields';
import { MagentoCompleteCategoryResponse } from '../models/complete-category-response';
import { DaffCategoryFilterType } from '../../../models/category-filter';

describe('DaffMagentoCategoryPageConfigTransformerService', () => {

  let service: DaffMagentoCategoryPageConfigTransformerService;
  const categoryFactory: DaffCategoryFactory = new DaffCategoryFactory();
  const stubCategory: DaffCategory = categoryFactory.create();

  const categoryPageConfigurationStateFactory: DaffCategoryPageConfigurationStateFactory = new DaffCategoryPageConfigurationStateFactory();
  const stubCategoryPageConfigurationState: DaffCategoryPageConfigurationState = categoryPageConfigurationStateFactory.create();
  delete stubCategoryPageConfigurationState.applied_filters;
  delete stubCategoryPageConfigurationState.applied_sort_direction;
  delete stubCategoryPageConfigurationState.applied_sort_option;
	stubCategoryPageConfigurationState.id = stubCategory.id;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DaffMagentoCategoryPageConfigTransformerService
      ]
    });
    service = TestBed.get(DaffMagentoCategoryPageConfigTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('transform', () => {
		let completeCategoryResponse: MagentoCompleteCategoryResponse;
		let category: MagentoCategory;
		let aggregates: MagentoAggregation[];
		let page_info: MagentoPageInfo;
		let sort_fields: MagentoSortFields;
		let products: ProductNode[];

		beforeEach(() => {
			category = {
        id: stubCategory.id,
        name: stubCategory.name,
        breadcrumbs: [{
          category_id: stubCategory.breadcrumbs[0].categoryId,
          category_name: stubCategory.breadcrumbs[0].categoryName,
          category_level: stubCategory.breadcrumbs[0].categoryLevel,
          category_url_key: stubCategory.breadcrumbs[0].categoryUrlKey
        }],
        children_count: stubCategory.children_count
			}
			
			aggregates = [{
				attribute_code: stubCategoryPageConfigurationState.filters[0].name,
				count: stubCategoryPageConfigurationState.filters[0].items_count,
				label: stubCategoryPageConfigurationState.filters[0].label,
				options: [
					{
						value: stubCategoryPageConfigurationState.filters[0].options[0].value,
						count: stubCategoryPageConfigurationState.filters[0].options[0].items_count,
						label: stubCategoryPageConfigurationState.filters[0].options[0].label
					},
					{
						value: stubCategoryPageConfigurationState.filters[0].options[1].value,
						count: stubCategoryPageConfigurationState.filters[0].options[1].items_count,
						label: stubCategoryPageConfigurationState.filters[0].options[1].label
					}
				]
			}];
			
			page_info = {
				page_size: stubCategoryPageConfigurationState.page_size,
				current_page: stubCategoryPageConfigurationState.current_page,
				total_pages: stubCategoryPageConfigurationState.total_pages
			};

			sort_fields = {
				default: stubCategoryPageConfigurationState.sort_options[0].value,
				options: stubCategoryPageConfigurationState.sort_options
			};

			products = [
				{
					sku: stubCategoryPageConfigurationState.product_ids[0],
					id: 2,
					name: 'name',
					price: {
						regularPrice: {
							amount: {
								value: 123,
								currency: null
							}
						}
					},
					url_key: 'url_key',
					image: {
						url: 'url',
						label: 'label'
					}
				}
			];

			completeCategoryResponse = {
				category: category,
				aggregates: aggregates,
				page_info: page_info,
				sort_fields: sort_fields,
				products: products,
				total_count: stubCategoryPageConfigurationState.total_products
			}
		});
		
		describe('when the filter type is category_id', () => {
			
			it('should return a DaffCategoryPageConfigurationState with an equal filter type', () => {
				aggregates[0].attribute_code = 'category_id';
				stubCategoryPageConfigurationState.filters[0].name = 'category_id';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Equal;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is description', () => {
			
			it('should return a DaffCategoryPageConfigurationState with a match filter type', () => {
				aggregates[0].attribute_code = 'description';
				stubCategoryPageConfigurationState.filters[0].name = 'description';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Match;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is name', () => {
			
			it('should return a DaffCategoryPageConfigurationState with a match filter type', () => {
				aggregates[0].attribute_code = 'name';
				stubCategoryPageConfigurationState.filters[0].name = 'name';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Match;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is price', () => {
			
			it('should return a DaffCategoryPageConfigurationState with a range filter type', () => {
				aggregates[0].attribute_code = 'price';
				stubCategoryPageConfigurationState.filters[0].name = 'price';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Range;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is short_description', () => {
			
			it('should return a DaffCategoryPageConfigurationState with a match filter type', () => {
				aggregates[0].attribute_code = 'short_description';
				stubCategoryPageConfigurationState.filters[0].name = 'short_description';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Match;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is sku', () => {
			
			it('should return a DaffCategoryPageConfigurationState with an equal filter type', () => {
				aggregates[0].attribute_code = 'sku';
				stubCategoryPageConfigurationState.filters[0].name = 'sku';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Equal;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is url_key', () => {
			
			it('should return a DaffCategoryPageConfigurationState with an equal filter type', () => {
				aggregates[0].attribute_code = 'url_key';
				stubCategoryPageConfigurationState.filters[0].name = 'url_key';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Equal;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
		
		describe('when the filter type is a custom type', () => {
			
			it('should return a DaffCategoryPageConfigurationState with an equal filter type', () => {
				aggregates[0].attribute_code = 'anything_else';
				stubCategoryPageConfigurationState.filters[0].name = 'anything_else';
				stubCategoryPageConfigurationState.filters[0].type = DaffCategoryFilterType.Equal;

				expect(service.transform(completeCategoryResponse)).toEqual(stubCategoryPageConfigurationState);
			});
		});
  });
});
