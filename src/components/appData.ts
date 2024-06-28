import { IAppData, IOrder, IProduct } from '../types';
import { Model } from './base/Model';

export class AppData extends Model<IAppData> {
	catalog: IProduct[];
	basket: IProduct[] = [];
	order: IOrder = {
		phone: '',
		email: '',
		address: '',
		payment: 'Online',
		items: [],
		total: 0,
	};

	addToBasket(product: IProduct) {
		this.basket.push(product);
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
	}

	clearBasket() {
		this.basket = [];
	}

	getBasketLenght(): number {
		return this.basket.length;
	}

	getTotalPrice(): number {
		return this.basket.reduce((acc, current) => acc + current.price, 0);
	}
}
