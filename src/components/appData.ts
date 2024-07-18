import {
	loadFromLocalStorage,
	saveToLocalStorage,
} from './storage/localStorage';
import { IAppData, IProduct, PayMethod, IOrder } from '../types';
import { Model } from './base/Model';
import {
	emailRegex,
	phoneRegex,
	addressRegex,
	BasketStorageKey,
} from '../utils/constants';

export class AppData extends Model<IAppData> {
	products: IProduct[] = [];
	details: IProduct | null;
	basket: IProduct[] = [];
	order: IOrder;
	formErrors: Partial<Record<keyof IOrder, string>>;

	loadBasketFromStorage() {
		const storedItems = loadFromLocalStorage<IProduct[]>(BasketStorageKey);
		if (storedItems) {
			this.basket = storedItems;
			this.emitChanges('basket:update', this.basket);
		}
	}

	private saveBasketToStorage() {
		saveToLocalStorage({ key: BasketStorageKey, value: this.basket });
	}

	addToBasket(product: IProduct) {
		this.basket.push(product);
		this.emitChanges('basket:update', this.basket);
		this.saveBasketToStorage();
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.emitChanges('basket:update', this.basket);
		this.saveBasketToStorage();
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:update', { basket: this.basket });
		this.saveBasketToStorage();
	}

	isInBasket(product: IProduct): boolean {
		return this.basket.some((item) => item.id === product.id);
	}

	getBasketLength(): number {
		return this.basket.length;
	}

	getTotalPrice(): number {
		const total = this.basket.reduce((acc, current) => acc + current.price, 0);
		this.emitChanges('basket:total', { total });
		return total;
	}

	setPaymentMethod(paymentMethod: PayMethod) {
		this.order.payment = paymentMethod;
	}

	updateOrderField(field: keyof IOrder, value: string | PayMethod) {
		if (field === 'payment') {
			this.setPaymentMethod(value as PayMethod);
		} else {
			this.order[field] = value as string;
		}
	}

	validateOrderForm() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!addressRegex.test(this.order.address)) {
			errors.address = 'Укажите существующий адрес';
		}

		this.formErrors = errors;
		this.emitChanges('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm() {
		const errors: Partial<Record<'email' | 'phone', string>> = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = 'Неправильно указан email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegex.test(this.order.phone)) {
			errors.phone = 'Неправильно указан телефон';
		}

		this.formErrors = errors as typeof this.formErrors;
		this.emitChanges('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder() {
		this.order = {
			phone: '',
			email: '',
			address: '',
			payment: PayMethod.CARD,
		};
	}

	setProducts(items: IProduct[]) {
		this.products = items;
		this.emitChanges('items:changed', this.products);
	}

	setProductDetails(item: IProduct) {
		this.details = item;
		this.emitChanges('details:changed', this.details);
	}
}
