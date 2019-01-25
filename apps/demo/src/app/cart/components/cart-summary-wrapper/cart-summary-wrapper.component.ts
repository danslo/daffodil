import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Cart } from '@daffodil/core';

@Component({
  selector: 'demo-cart-summary-wrapper',
  templateUrl: './cart-summary-wrapper.component.html',
  styleUrls: ['./cart-summary-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartSummaryWrapperComponent {

  @Input() cart: Cart;
  @Input() loading: boolean;
  @Input() cartTitle: string;
}