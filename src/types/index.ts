import { EventEmitter } from '../components/base/events';

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

export type Basket = Map<Product['id'], number>;

export type BasketModel = {
	items: Basket;
	add: (id: string) => void;
	remove: (id: string) => void;
	clear: () => void;
	events: EventEmitter;
};

export type CatalogModel = {
	items: Product[];
	setItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
	getItems: () => Product[];
	events: EventEmitter;
};

export type BasketView = {
	render: (products: (Product & { index: number })[]) => void;
	getElement: () => void;
};

export type CardDetails = {
	render: (product: Product) => void;
	getElement: () => void;
};

export type PaymentVariant = 'Онлайн' | 'При получении';

export type OrderDetails = {
	paymentVariant: PaymentVariant;
	address: string;
	email: string;
	phoneNumber: string;
};

export type AppStateModel = {
	basket: BasketModel;
	catalog: CatalogModel;
	orderDetails: OrderDetails;
	events: EventEmitter;
	setOrderDetails: (details: Partial<OrderDetails>) => void;
};

export type GalleryView = {
	populateGallery: (items: Product[]) => void;
};

export type PreviewOpenEvent = { id: string };
export type BasketAddEvent = { id: string };
export type BasketRemoveEvent = { id: string };

export type OrderFormModal = {
	showOrderForm: () => void;
	hideOrderForm: () => void;
	populateOrderForm: (details: OrderFormDetails) => void;
};

export type OrderModalConstructor = {
	formTemplateQuery: string;
};

export type OrderFormDetails = Pick<OrderDetails, 'paymentVariant' | 'address'>;
export type ContactsFormDetails = Pick<OrderDetails, 'email' | 'phoneNumber'>;

export type OrderSubmitEvent = { details: OrderFormDetails };

export type BaseModalView = {
	setContent: (content: Element) => void;
	open: () => void;
	close: () => void;
};

export type OrderForm = {
	render: () => void;
	getElement: () => void;
	reset: () => void;
};

export type ContactsForm = {
	render: () => void;
	getElement: () => void;
	reset: () => void;
};
