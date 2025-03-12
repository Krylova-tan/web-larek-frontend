import { Form } from "./common/Form";
import { TOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export class OrderForm extends Form<TOrderForm> {
  protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentCard = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
    this._paymentCash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);

    this._paymentCard.addEventListener('click', () => {
    this.payment = 'card';
    this.onInputChange('payment', 'card');
    });

    this._paymentCash.addEventListener('click', () => {
    this.payment = 'cash';
    this.onInputChange('payment', 'cash');
    });
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set payment(value: string) {
		this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
  }
}