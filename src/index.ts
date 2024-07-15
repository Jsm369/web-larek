import './scss/styles.scss';

import { AppData } from './components/appData';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Contacts } from './components/common/Contacts';
import { Form } from './components/common/Form';
import { Modal } from './components/common/Modal';
import { Order } from './components/common/Order';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder, IBasket } from './types';
import { webLarekApi } from './components/webLarekApi';
import { API_URL, CDN_URL } from './utils/constants';

// Шаблоны
const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
//

const events = new EventEmitter();
const api = new webLarekApi(CDN_URL, API_URL);

// Контейнеры
const modal = new Modal(modalTemplate, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
//

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

			modal.render({ content: card.render(item) });
		});

		events.on('basket:open', () => {
			console.log(basket.render());
			modal.render({
				content: basket.render(),
			});
		});

		events.on('basket:changed', () => {
			page.counter = appData.getBasketLength();

			basket.items = appData.basket.map((product) => {
				const card = new Card(cloneTemplate(basketTemplate), {
					onClick: () => appData.removeFromBasket(product),
				});
				return card.render(product);
			});

			basket.total = appData.getTotalPrice();
		});

		appData.setProducts(products);
	})
	.catch((err) => {
		console.log(err);
	});
