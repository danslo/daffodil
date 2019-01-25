import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpBoxComponent } from './help-box.component';

import {
  DaffLinkModule
} from '@daffodil/design';

@NgModule({
  imports: [
    CommonModule,
    DaffLinkModule
  ],
  declarations: [
    HelpBoxComponent
  ],
  exports: [
    HelpBoxComponent
  ]
})
export class HelpBoxModule { }