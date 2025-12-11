import { EventEmitter } from '../components/base/events';

export type ConfirmPurchaseResponse = {
	id: string;
	total: number;
};

export type GetItemsResponse = {
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
	add: (product: Product) => void;
	remove: (product: Product) => void;
	getTotal: () => number;
	getItemsCount: () => number;
	clear: () => void;
	getItems: () => Product[];
	getItem: (id: string) => Product | undefined;
};

export type CatalogModel = {
	setItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
	getItems: () => Product[];
};

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
	getValidationError: () => string;
};

export type OrderFormDetails = Pick<OrderDetails, 'paymentVariant' | 'address'>;
export type ContactsFormDetails = Pick<OrderDetails, 'email' | 'phoneNumber'>;

export type ModalView = {
	setContent: (content: Element) => void;
	open: () => void;
	close: () => void;
};

export type BaseElementView = {
	render: (...args: unknown[]) => void;
	getElement: () => Element;
};

export type BaseFormView = {
	reset: () => void;
	setError: (message: string) => void;
	setSubmitButtonStatus: (isActive: boolean) => void;
};

export type BasketViewItem = {
	createBasketItems: (products: Product[]) => Element[];
	createBasketItem: (product: Product, index: string) => Element;
};

export type BasketViewItemConstructor = {
	onDelete: (product: Product) => void;
};

export type BasketView = {
	render: (args: { products: Element[]; total: number }) => void;
};

export type BasketViewConstructor = {
	onStartOrder: (e: Event) => void;
	onBasketOpen: () => void;
};

export type CardDetails = {
	render: (product: Product) => void;
};

export type CardDetailsConstructor = {
	onBasketAdd: (e: Event) => void;
	isBasketButtonActive: boolean;
};

export type OrderForm = {
	render: (details: OrderFormDetails) => void;
};

export type OrderFormConstructor = {
	onSubmit: (details: OrderFormDetails) => void;
	onOrderDetailsChange: (details: OrderFormDetails) => void;
};

export type ContactsForm = {
	render: (details: ContactsFormDetails) => void;
};

export type ContactsFormConstructor = {
	onSubmit: (details: ContactsFormDetails) => void;
	onOrderDetailsChange: (details: ContactsFormDetails) => void;
};

export type OrderConfirmationView = {
	render: (totalPrice: number) => void;
};

export type OrderConfirmationViewConstructor = {
	onCloseButtonClick: () => void;
};

export type HeaderView = {
	render: (totalItemsCount: number) => void;
};

export type GalleryItemViewConstructor = {
	template: HTMLTemplateElement;
	onItemClick: (product: Product) => void;
};

export type GalleryView = {
	render: (products: Element[]) => void;
};

export type PreviewOpenEvent = { product: Product };
export type BasketAddEvent = { product: Product };
export type BasketRemoveEvent = { product: Product };
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
	total: number;
} & {
	items: Product['id'][];
};
