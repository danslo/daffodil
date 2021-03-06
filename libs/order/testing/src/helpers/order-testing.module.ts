import { NgModule } from '@angular/core';

import { DaffOrderFacade } from '@daffodil/order/state';

import { MockDaffOrderFacade } from './mock-order-facade';

@NgModule({
  providers: [
		{ provide: DaffOrderFacade, useClass: MockDaffOrderFacade }
	]
})
export class DaffOrderTestingModule {}
