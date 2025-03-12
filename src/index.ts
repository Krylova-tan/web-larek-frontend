import './scss/styles.scss';
import { AppLarekApi } from './components/AppLarekApi';
import { Product } from './components/Product';
import { ContactsForm } from './components/ContactsForm';
import { OrderForm } from './components/OrderForm';
import { Page } from './components/Page';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { IProduct, TContactsForm, TOrder, TOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AppLarekApi(CDN_URL, API_URL);

// шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// модель состояния приложения
const appState = new AppState(events);

// глобавльные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => modal.close(),
});

// Бизнес-логика
events.on('cards:changed', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Product(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item)
		});

		return card.render(item);
	})
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

events.on('card:select', (item: IProduct) => {
  appState.setPreview(item);
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('preview:changed', (item: IProduct) => {
  const card = new Product(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (appState.checkIdInbasket(item)) {
      	appState.deleteProductBasket(item);
      	card.button = 'В корзину';
    	} else {
      	appState.addProductBasket(item);
      	card.button = 'Удалить из корзины';
    	}
		}
  })

	card.button = appState.checkIdInbasket(item) ? 'Удалить из корзины' : 'В корзину';
  modal.render({ content: card.render(item) });
});

api.getProductList()
  .then(appState.setProducts.bind(appState))
  .catch(err => {
    console.log(err);
});

events.on('basket:changed', () => {
  page.counter = appState.basket.items.length;
  basket.items = appState.basket.items.map((id, index) => {
  const item = appState.catalog.find((item) => item.id === id);
  const card = new Product(cloneTemplate(cardBasketTemplate), {
    onClick: () => {
      appState.deleteProductBasket(item);
      basket.total = appState.basket.total;
    },
  });
  card.index = index;
  return card.render(item);
});

basket.selected = appState.basket.items;
basket.total = appState.basket.total;
});

events.on('order:open', () => {
	appState.clearInputOrder();
	modal.render({
		content: orderForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
  modal.render({
  content: contacts.render({
    email: '',
    phone: '',
    valid: false,
    errors: [],
  }),
  });
});

events.on(
	/^order\..*:change$/,
	(data: { field: keyof TOrderForm; value: string }) => {
		appState.setOrderField(data.field, data.value);
		appState.checkValidAddress();
	}
);

events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof TContactsForm; value: string }) => {
		appState.setContactsField(data.field, data.value);
		appState.checkValidContact();
	}
);

events.on('orderFormErrors:change', (error: Partial<TOrder>) => {
	const { payment, address } = error;
	const formIsValid = !payment && !address;
	orderForm.valid = formIsValid;
	if (!formIsValid) {
		orderForm.errors = address || payment;
	} else {
		orderForm.errors = '';
	}
});

events.on('contactsFormErrors:change', (error: Partial<TOrder>) => {
	const { email, phone } = error;
	const formIsValid = !email && !phone;
	contacts.valid = formIsValid;
	if (!formIsValid) {
		contacts.errors = email || phone;
	} else {
		contacts.errors = '';
	}
});

events.on('contacts:submit', () => {
	api
		.orderDataProducts({ ...appState.order, ...appState.basket })
		.then((data) => {
			modal.render({
				content: success.render(),
			});
			success.total = data.price;
			appState.clearBasket();
			appState.clearInputOrder();
		})
		.catch(console.error)
});

