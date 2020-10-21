import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { DaffioDocService, DOCS_BASE_URL } from './docs.service';
import { DaffioDoc } from '../models/doc';
import { DaffioGuideList } from '../models/guide-list';

describe('DaffioDocService', () => {
  let service: DaffioDocService<DaffioDoc, DaffioGuideList>;
	let httpClient: HttpClient;
	const docPath = 'my/path';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
		})

		service = TestBed.get(DaffioDocService);
		httpClient = TestBed.get(HttpClient);
		spyOn(httpClient, 'get');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to retrieve a doc', () => {
		service.get(docPath);

		expect(httpClient.get).toHaveBeenCalledWith(DOCS_BASE_URL + docPath + '.json');
	});

  it('should retrieve the correct doc when there is a fragment in the url', () => {
		const docFragment = '#fragment';
		service.get(docPath + docFragment);

		expect(httpClient.get).toHaveBeenCalledWith(DOCS_BASE_URL + docPath + '.json');
	});

  it('should be able to retrieve a guide list', () => {
		service.getGuideList();

		expect(httpClient.get).toHaveBeenCalledWith(DOCS_BASE_URL + 'docs/guides/guide-list.json');
  });
});
