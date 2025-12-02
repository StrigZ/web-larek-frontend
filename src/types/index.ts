import { EventEmitter } from '../components/base/events';
import { Catalog } from '../models/Catalog';
import { ModalManager } from '../modules/modal';

export type ProductList = {
	total: number;
	items: Product[];
};

export type Product = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
};

export type Order = {
	id: string;
	total: number;
};

export type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое'
	| 'другое'
	| 'другое'
	| 'хард-скил'
	| 'другое';

export type BasketModel = {
	items: Map<string, number>;
	add: (id: string) => void;
	remove: (id: string) => void;
	events: EventEmitter;
};

export type CatalogModel<T> = {
	items: T[];
	setItems: (items: T[]) => void;
	getItemById: (id: string) => T;
	getItems: () => T[];
	events: EventEmitter;
};

export type BasketViewModel = {
	modal: Element;
	items: Map<Product['id'], number>;
	itemListEl: Element;
	totalPriceEl: Element;
	cardTemplateEl: HTMLTemplateElement;
	events: EventEmitter;
	modalManager: ModalManager;
	catalog: Catalog<Product>;
	hideBasket: () => void;
	showBasket: () => void;
};

export type BasketViewModelConstructor = Omit<
	BasketViewModel,
	'hideBasket' | 'showBasket'
>;

export type BasketViewModelConfig = Omit<
	BasketViewModel,
	| 'hideBasket'
	| 'showBasket'
	| 'itemListEl'
	| 'totalPriceEl'
	| 'modal'
	| 'cardTemplateEl'
>;

export type PaymentVariant = 'Онлайн' | 'При получениее';

export type OrderDetails = {
	paymentVariant: PaymentVariant;
	address: string;
	email: string;
	phoneNumber: string;
};

export type AppStateModel<T> = {
	basket: BasketModel;
	catalog: CatalogModel<T>;
	orderDetails: OrderDetails;
	events: EventEmitter;
	setOrderDetails: (details: Partial<OrderDetails>) => void;
};
