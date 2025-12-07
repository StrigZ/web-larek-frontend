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

export type Basket = Map<Product['id'], number>;

export type BasketModel = {
	items: Basket;
	add: (id: string) => void;
	remove: (id: string) => void;
	events: EventEmitter;
};

export type CatalogModel = {
	items: Product[];
	setItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
	getItems: () => Product[];
	events: EventEmitter;
};

export type BasketModal = {
	updateBasket: () => void;
};

export type BasketModalConstructor = {
	modal: Element;
	itemListEl: Element;
	totalPriceEl: Element;
	cardTemplateEl: HTMLTemplateElement;
	openBasketButton: Element;
	goToOrderButton: HTMLButtonElement;
} & ModalConfig;

export type ModalConfig = {
	activeModalClass: string;
	closeButtonQuery: string;
	modalContainerQuery: string;
	events: EventEmitter;
	catalog: Catalog;
};

export type PreviewModal = {
	hidePreview: () => void;
	showPreview: (id: string) => void;
};

export type PreviewModalConstructor = {
	modal: Element;
	titleEl: Element;
	categoryEl: Element;
	imageEl: HTMLImageElement;
	priceEl: Element;
	descriptionEl: Element;
	addToBasketButton: Element;
} & ModalConfig;

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
