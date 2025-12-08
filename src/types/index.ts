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
	getItemCount: () => number;
	clear: () => void;
	getItemsMap: () => Map<string, number>;
	getItemsArray: () => Product[];
};

export type CatalogModel = {
	items: Product[];
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

export type OnConfirmPurchase = {
	requestBody: OrderRequestBody;
};
