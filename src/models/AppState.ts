import { EventEmitter } from '../components/base/events';
import {
	AppStateModel,
	BasketModel,
	CatalogModel,
	OrderDetails,
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

	setOrderDetails(details: Partial<OrderDetails>) {
		this.orderDetails = { ...this.orderDetails, ...details };
	}
}
