import { EventEmitter } from '../components/base/events';
import {
	AppStateModel,
	BasketModel,
	CatalogModel,
	OrderDetails,
} from '../types';
import { DEFAULT_ORDER_DETAILS } from '../utils/constants';

export class AppState<T> implements AppStateModel<T> {
	basket: BasketModel;
	catalog: CatalogModel<T>;
	orderDetails: OrderDetails;
	events: EventEmitter;

	constructor(
		basket: BasketModel,
		catalog: CatalogModel<T>,
		events: EventEmitter
	) {
		this.basket = basket;
		this.catalog = catalog;
		this.events = events;
		this.orderDetails = DEFAULT_ORDER_DETAILS;
	}

	setOrderDetails(details: Partial<OrderDetails>) {
		this.orderDetails = { ...this.orderDetails, ...details };
	}

	protected _detailsChange() {
		this.events.emit('details:change', this.orderDetails);
	}
}
