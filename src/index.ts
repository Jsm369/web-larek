import './scss/styles.scss';

import { AppData } from './components/appData';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Contacts } from './components/common/Contacts';
import { Modal } from './components/common/Modal';
import { Order } from './components/common/Order';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, PayMethod, TOrder } from './types';
import { webLarekApi } from './components/webLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { SuccessOrder } from './components/common/SuccessfulOrder';

// Шаблоны для рендеринга компонентов
const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successfulOrderTemplate = ensureElement<HTMLTemplateElement>('#success');
//

const events = new EventEmitter();
const api = new webLarekApi(CDN_URL, API_URL);

// Инициализация контейнеров компонентов
const modal = new Modal(modalTemplate, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new SuccessOrder(
	cloneTemplate(successfulOrderTemplate),
	events,
	{
		onClick: () => modal.close(),
	}
);
//

// бизнес логика
api
	.getProductList()
	.then((products) => {
		const appData = new AppData({ products: products }, events);

		events.on('modal:open', () => {
			page.locked = true;
		});

		events.on('modal:close', () => {
			page.locked = false;
		});

		events.on('card:select', (item: IProduct) => {
			appData.setProductDetails(item);
		});

		events.on('items:changed', (items: IProduct[]) => {
			page.catalog = items.map((item) => {
				const card = new Card(cloneTemplate(cardCatalog), {
					onClick: () => events.emit('card:select', item),
				});
				return card.render(item);
			});
		});

		events.on('card:select', (item: IProduct) => {
			const card = new Card(cloneTemplate(cardPreview), {
				onClick: () => {
					if (appData.isInBasket(item)) {
						appData.removeFromBasket(item);
						card.button = 'В корзину';
					} else {
						appData.addToBasket(item);
						card.button = 'Удалить из корзины';
					}
				},
			});
			if (appData.isInBasket(item)) {
				card.button = 'Удалить из корзины';
			} else {
				card.button = 'В корзину';
			}

			modal.render({ content: card.render(item) });
		});

		events.on('basket:open', () => {
			modal.render({
				content: basket.render(),
			});
		});

		events.on('basket:update', () => {
			page.counter = appData.getBasketLength();

			basket.items = appData.basket.map((product) => {
				const item = appData.products.find((item) => item.id === product.id);
				if (!item) return;
				const card = new Card(cloneTemplate(cardBasketTemplate), {
					onClick: () => appData.removeFromBasket(item),
				});

				return card.render(item);
			});

			basket.total = appData.getTotalPrice();
		});

		events.on('order:open', () => {
			appData.clearOrder();
			modal.render({
				content: orderForm.render({
					address: '',
					payment: PayMethod.CARD,
					isValid: false,
					errors: [],
				}),
			});
		});

		events.on(
			/^order\..*:change$/,
			(data: { field: keyof TOrder; value: string }) => {
				appData.updateOrderField(data.field, data.value);
				appData.validateOrderForm();
			}
		);

		events.on('orderFormErrors:change', (error: Partial<TOrder>) => {
			const { payment, address } = error;
			const isValid = !payment && !address;
			orderForm.valid = isValid;
			if (!isValid) {
				orderForm.errors = address;
			} else {
				orderForm.errors = '';
			}
		});

		events.on('order:submit', () => {
			modal.render({
				content: contactsForm.render({
					email: '',
					phone: '',
					isValid: false,
					errors: [],
				}),
			});
		});

		events.on(
			/^contacts\..*:change$/,
			(data: { field: keyof TOrder; value: string }) => {
				appData.updateOrderField(data.field, data.value);
				appData.validateContactsForm();
			}
		);

		events.on('contactsFormErrors:change', (error: Partial<TOrder>) => {
			const { email, phone } = error;
			const formIsValid = !email && !phone;
			contactsForm.valid = formIsValid;
			if (!formIsValid) {
				contactsForm.errors = email || phone;
			} else {
				contactsForm.errors = '';
			}
		});

		events.on('contacts:submit', () => {
			const { email, phone, address, payment } = appData.order;
			const orderData = {
				email,
				phone,
				address,
				payment,
				items: appData.basket.map((item) => item.id),
				total: appData.getTotalPrice(),
			};

			api
				.postOrder(orderData)
				.then((data) => {
					modal.render({
						content: success.render(),
					});
					success.total = data.totalPrice;
					appData.clearBasket();
					appData.clearOrder();
				})
				.catch(console.error);
		});

		appData.setProducts(products);
		appData.loadBasketFromStorage();
	})
	.catch((err) => {
		console.log(err);
	});
