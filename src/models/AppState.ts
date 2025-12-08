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

		return {
			...this.orderDetails,
			phone: this.orderDetails.phoneNumber,
			payment: paymentVariant,
			total: this.basket.getTotal(),
			items: this.basket.getItemsArray().map(({ id }) => id),
		};
	}
	public setOrderDetails(details: Partial<OrderDetails>) {
		this.orderDetails = { ...this.orderDetails, ...details };
	}
}
