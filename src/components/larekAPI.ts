import { IFullOrder, IOrderStatus, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

interface IApi {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	postOrder: (order: IFullOrder) => Promise<IOrderStatus>;
}

export class larekAPI extends Api implements IApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	postOrder(order: IFullOrder): Promise<IOrderStatus> {
		return this.post('/order', order).then((data: IOrderStatus) => data);
	}
}
