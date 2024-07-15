import { IAppData, IOrder, IProduct, PayMethod } from '../types';
import { Model } from './base/Model';

export class AppData extends Model<IAppData> {
	products: IProduct[];
	details: IProduct | null;
	basket: IProduct[] = [];
	order: IOrder = {
		phone: '',
		email: '',
		address: '',
		payment: PayMethod.CARD,
		items: [],
		total: 0,
	};

	addToBasket(product: IProduct) {
		this.basket.push(product);
		this.emitChanges('basket:update', this.basket);
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.emitChanges('basket:update', this.basket);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:update', { basket: this.basket });
	}

	isInBasket(product: IProduct): boolean {
		return this.basket.some((item) => item.id === product.id);
	}

	getBasketLength(): number {
		return this.basket.length + 1;
	}

	getTotalPrice(): number {
		const total = this.basket.reduce((acc, current) => acc + current.price, 0);
		this.emitChanges('basket:total', { total });
		return total;
	}

	setPaymentMethod(paymentMethod: PayMethod) {
		this.order.payment = paymentMethod;
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
