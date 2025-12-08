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
	add: (product: Product) => void;
	remove: (product: Product) => void;
	getTotal: () => number;
	getItemsCount: () => number;
	clear: () => void;
	getItemsMap: () => Map<string, number>;
	getItemsArray: () => Product[];
};

export type CatalogModel = {
	setItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
	getItems: () => Product[];
};

export type BasketView = {
	render: (args: {
		productsMap: Map<string, number>;
		productsArray: Product[];
		total: number;
	}) => void;
};

export type BasketViewConstructor = {
	onStartOrder: (e: Event) => void;
	onBasketItemRemove: (product: Product) => void;
	onBasketOpen: () => void;
};

export type CardDetails = {
	render: (product: Product) => void;
};

export type CardDetailsConstructor = { onBasketAdd: (e: Event) => void };

export type PaymentVariant = 'Онлайн' | 'При получении';

export type OrderDetails = {
	paymentVariant: PaymentVariant;
	address: string;
	email: string;
	phoneNumber: string;
};

export type AppStateModel = {
	getOrderRequestBody: () => OrderRequestBody;
	getBasket: () => BasketModel;
	getCatalog: () => CatalogModel;
	getEvents: () => EventEmitter;
	setOrderDetails: (details: OrderFormDetails | ContactsFormDetails) => void;
};

export type GalleryView = {
	render: (items: Product[]) => void;
};

export type GalleryViewConstructor = {
	onCardClick: (product: Product) => void;
};

export type PreviewOpenEvent = { product: Product };
export type BasketAddEvent = { product: Product };
export type BasketRemoveEvent = { product: Product };

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

export type BaseViewElement = {
	render: (...args: unknown[]) => void;
	getElement: () => Element;
};

export type OrderForm = {
	reset: () => void;
};

export type OrderFormConstructor = {
	onSubmit: (details: OrderFormDetails) => void;
	onOrderDetailsChange: (details: OrderFormDetails) => void;
};

export type OrderConfirmationView = {
	render: (totalPrice: number) => void;
};

export type OrderConfirmationViewConstructor = {
	onCloseButtonClick: () => void;
};

export type HeaderView = {
	render: (totalItemsCount: number) => void;
	reset: () => void;
};

export type ContactsForm = {
	render: (details: ContactsFormDetails) => void;
	reset: () => void;
};

export type ContactsFormConstructor = {
	onSubmit: (details: ContactsFormDetails) => void;
	onOrderDetailsChange: (details: ContactsFormDetails) => void;
};

export type OrderFormChangeEvent = {
	details: OrderFormDetails;
};

export type ContactsFormChangeEvent = {
	details: ContactsFormDetails;
};

export type OrderRequestBody = Omit<
	OrderDetails,
	'paymentVariant' | 'phoneNumber'
> & {
	phone: string;
	payment: 'online' | 'cash';
	total: number | 'Бесценно';
} & {
	items: Product['id'][];
};

export type ContactsFormSubmitEvent = {
	details: ContactsFormDetails;
};

export type OrderFormSubmitEvent = {
	details: OrderFormDetails;
};
