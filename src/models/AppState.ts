import { EventEmitter } from '../components/base/events';
import {
	AppStateModel,
	BasketModel,
	CatalogModel,
	OrderDetails,
	OrderRequestBody,
} from '../types';
import { DEFAULT_ORDER_DETAILS } from '../utils/constants';

export class AppState implements AppStateModel {
	basket: BasketModel;
	catalog: CatalogModel;
	orderDetails: OrderDetails;
	events: EventEmitter;

	constructor(
		basket: BasketModel,
		catalog: CatalogModel,
		events: EventEmitter
	) {
		this.basket = basket;
		this.events = events;
		this.catalog = catalog;
		this.orderDetails = DEFAULT_ORDER_DETAILS;
	}

	public getOrderRequestBody(): OrderRequestBody {
		const paymentVariant =
			this.orderDetails.paymentVariant === 'Онлайн' ? 'online' : 'cash';
		const itemsArray: string[] = [];

		let total = 0;
		let isPriceless = false;
		Array.from(this.basket.items).map(([productId, index]) => {
			for (let i = 0; i < index; i++) {
				itemsArray.push(productId);
			}
			const product = this.catalog.getItemById(productId);
			if (!product.price) {
				return (isPriceless = true);
			}
			total += product.price * index;
		});
		return {
			...this.orderDetails,
			phone: this.orderDetails.phoneNumber,
			payment: paymentVariant,
			total: isPriceless ? 'Бесценно' : total,
			items: itemsArray,
		};
	}
	public setOrderDetails(details: Partial<OrderDetails>) {
		this.orderDetails = { ...this.orderDetails, ...details };
	}
}
