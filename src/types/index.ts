export interface IAppData {
	products: IProduct[];
	basket: IProduct[];
	order: IOrder | null;
}

export enum PayMethod {
	CASH = 'cash',
	CARD = 'card',
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IBasket {
	items: IProduct[];
	totalPrice: number;
	addItem(item: IProduct): void;
	removeItem(itemId: IProduct): void;
	calculateTotalPrice(): number;
}

export interface IOrder {
	phone: string;
	email: string;
	address: string;
	payment: PayMethod;
	items: string[];
	total: number;
}

export interface IOrderStatus {
	status: string;
	totalPrice: number;
}
