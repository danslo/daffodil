import {
  Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy,
  ElementRef, Input, HostBinding, Renderer2
} from '@angular/core';

import { daffColorMixin, DaffColorable, DaffPalette } from '../../core/colorable/colorable';

import { 
  DaffPrefixable, 
  DaffSuffixable, 
  daffPrefixableMixin,
  daffSuffixableMixin
} from '../../core/prefix-suffix/public_api';

import { daffSizeMixin } from '../../core/sizeable/sizeable-mixin';
import { DaffSizeable, DaffSizeSmallType, DaffSizeMediumType, DaffSizeLargeType } from '../../core/sizeable/sizeable';

/**
* List of classes to add to DaffButtonComponent instances based on host attributes to style as different variants.
*/
const BUTTON_HOST_ATTRIBUTES: DaffButtonType[] = [
  'daff-button',
  'daff-stroked-button',
  'daff-raised-button',
  'daff-icon-button',
  'daff-underline-button'
];

/**
 * An _elementRef and an instance of renderer2 are needed for the button mixins
 */
class DaffButtonBase{
  constructor(public _elementRef: ElementRef, public _renderer: Renderer2) {}
}

const _daffButtonBase = daffPrefixableMixin(daffSuffixableMixin(daffColorMixin(daffSizeMixin(DaffButtonBase, 'md'),'theme-contrast')));

export type DaffButtonType = 'daff-button' | 'daff-stroked-button' | 'daff-raised-button' | 'daff-icon-button' | 'daff-underline-button' | undefined;

/**
 * The DaffSizeable types that the DaffButtonComponent can implement
 */
export type DaffButtonSize = DaffSizeSmallType | DaffSizeMediumType | DaffSizeLargeType;

enum DaffButtonTypeEnum {
  Default = 'daff-button',
  Stroked = 'daff-stroked-button',
  Raised = 'daff-raised-button',
  Icon = 'daff-icon-button',
  Underline = 'daff-underline-button'
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: '' +
    'button[daff-button]' + ',' +
    'button[daff-stroked-button]' + ',' +
    'button[daff-raised-button]' + ',' +
    'button[daff-icon-button]' + ',' +
    'button[daff-underline-button]' + ',' +
    'a[daff-button]' + ',' +
    'a[daff-stroked-button]' + ',' +
    'a[daff-raised-button]' + ',' +
    'a[daff-icon-button]' + ',' +
    'a[daff-underline-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DaffButtonComponent
  extends _daffButtonBase
  implements OnInit, DaffPrefixable, DaffSuffixable, DaffColorable, DaffSizeable<DaffButtonSize> {
    @Input() color: DaffPalette;
		@Input() size: DaffButtonSize;
		
    private buttonType: DaffButtonType;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
      super(elementRef, renderer);

      for (const attr of BUTTON_HOST_ATTRIBUTES) {
        if (this._hasHostAttributes(attr)) {
          (elementRef.nativeElement as HTMLElement).classList.add(attr);
        }
      }
    }


		/**
		 * @docs-private
		 */
    ngOnInit() {
      for (const attr of BUTTON_HOST_ATTRIBUTES) {
        if (this._hasHostAttributes(attr)) {
          this.buttonType = attr;
        }
      }
    }

		/**
		 * @docs-private
		 */
    @HostBinding('class.daff-button') get button() {
      return this.buttonType === DaffButtonTypeEnum.Default || this.buttonType === undefined;
    }
  
		/**
		 * @docs-private
		 */
    @HostBinding('class.daff-stroked-button') get stroked() {
      return this.buttonType === DaffButtonTypeEnum.Stroked;
    }

		/**
		 * @docs-private
		 */
    @HostBinding('class.daff-raised-button') get raised() {
      return this.buttonType === DaffButtonTypeEnum.Raised;
    }
  
		/**
		 * @docs-private
		 */
    @HostBinding('class.daff-icon-button') get icon() {
      return this.buttonType === DaffButtonTypeEnum.Icon;
    }

		/**
		 * @docs-private
		 */
    @HostBinding('class.daff-underline-button') get underline() {
      return this.buttonType === DaffButtonTypeEnum.Underline;
    }

    private _getHostElement() {
      return this.elementRef.nativeElement;
    }
  
    /** 
		 * Gets whether the button has one of the given attributes. 
		 * */
    private _hasHostAttributes(...attributes: string[]) {
      return attributes.some(attribute => this._getHostElement().hasAttribute(attribute));
    }
}
