import { EventEmitter } from '../components/base/events';
import { Catalog } from '../models/Catalog';

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

export type BasketModal = {
	modal: Element;
	items: Map<Product['id'], number>;
	itemListEl: Element;
	totalPriceEl: Element;
	cardTemplateEl: HTMLTemplateElement;
	events: EventEmitter;
	catalog: Catalog<Product>;
	hideBasket: () => void;
	showBasket: () => void;
} & ModalConfig;

export type BasketModalConstructor = Omit<
	BasketModal,
	'hideBasket' | 'showBasket'
>;

export type BasketModalConfig = Omit<
	BasketModalConstructor,
	keyof ModalConfig | 'itemListEl' | 'totalPriceEl' | 'modal' | 'cardTemplateEl'
>;

export type ModalConfig = {
	activeModalClass: string;
	closeButtonQuery: string;
	modalContainerQuery: string;
};

export type PreviewModal = {
	events: EventEmitter;
	modal: Element;
	catalog: Catalog<Product>;
	clickListener: () => void | null;
	titleEl: Element;
	categoryEl: Element;
	imageEl: HTMLImageElement;
	priceEl: Element;
	descriptionEl: Element;
	addToBasketButton: Element;
	hidePreview: () => void;
	showPreview: () => void;
} & ModalConfig;

export type PreviewModalConstructor = Omit<
	PreviewModal,
	'hidePreview' | 'showPreview' | 'clickListener'
>;

export type PreviewModalConfig = Omit<
	PreviewModalConstructor,
	| keyof ModalConfig
	| 'modal'
	| 'titleEl'
	| 'categoryEl'
	| 'imageEl'
	| 'priceEl'
	| 'descriptionEl'
	| 'addToBasketButton'
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
