import { IEvents } from "./base/events";
import { IAppState, TFormErrors, TOrder, IProduct, TBasket} from "../types";

export class AppState implements IAppState {

  basket: TBasket = {
    total: 0,
    items: [],
};
  catalog: IProduct[] = [];
  preview: string | null; 
  order: TOrder;
  formErrors: TFormErrors = {};
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
};

  setProducts(catalog: IProduct[]) {
    this.catalog = catalog;
    this.events.emit('cards:changed', this.catalog);
  }

  addProductBasket(item: IProduct) {
    this.basket.items.push(item.id);
    this.basket.total = this.basket.total + item.price;
    this.events.emit('basket:changed', this.basket);
  }

  deleteProductBasket(item: IProduct, payload?: Function) {
    this.basket.items = this.basket.items.filter(id => id !== item.id);
    this.basket.total = this.basket.total - item.price;
    this.events.emit('basket:changed', this.basket);
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.events.emit('preview:changed', item);
  }

  checkIdInbasket(item: IProduct) {
    return this.basket.items.includes(item.id);
  }

  clearBasket() {
    this.basket.total = 0;
    this.basket.items = [];
    this.events.emit('basket:changed');
  }

  checkValidAddress() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты'
    }
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
  }

  checkValidContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
  }

  clearInputOrder(): void {
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
  };
}

setOrderField(field: keyof TOrder, value: string) {
  this.order[field] = value;

  if (this.checkValidAddress()) {
      this.events.emit('order:ready', this.order);
  }
}

setContactsField(field: keyof TOrder, value: string) {
  this.order[field] = value;

  if (this.checkValidContact()) {
      this.events.emit('order:ready', this.order);
  }
}
}