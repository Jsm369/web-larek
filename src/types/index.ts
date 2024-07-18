export interface IAppData {
	products: IProduct[];
	basket: IProduct[];
	order: IFullOrder | null;
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
}

export interface IFullOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}

export interface IOrder extends IOrderForm, IContactsForm {}

export interface IOrderForm {
	address: string;
	payment: PayMethod;
}

export interface IContactsForm {
	phone: string;
	email: string;
}

export interface IOrderStatus {
	status: string;
	totalPrice: number;
}
