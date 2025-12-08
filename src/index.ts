import './scss/styles.scss';

import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { BasketView } from './components/view/BasketView';
import { Catalog } from './models/Catalog';

import type {
	BasketAddEvent,
	BasketRemoveEvent,
	ContactsFormChangeEvent,
	ContactsFormSubmitEvent,
	OrderFormChangeEvent,
	OrderFormSubmitEvent,
	OrderRequestBody,
	PreviewOpenEvent,
	ProductList,
} from './types';
import { OrderForm } from './components/view/OrderForm';
import { BaseModalView } from './components/base/BaseModalView';
import { GalleryView } from './components/view/GalleryView';
import { CardDetails } from './components/view/CardDetails';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderConfirmationView } from './components/view/OrderConfirmationView';
import { HeaderView } from './components/view/HeaderView';

const appState = new AppState(
	new Basket({
		onBasketChange: () => appState.events.emit('basket:change'),
	}),
	new Catalog(),
	new EventEmitter()
);

const baseModalView = new BaseModalView();

const headerView = new HeaderView();
const basketView = new BasketView({
	onStartOrder: () => appState.events.emit('order:open'),
	onBasketItemRemove: (product) =>
		appState.events.emit<BasketRemoveEvent>('basket:remove', { product }),
	onBasketOpen: () => appState.events.emit('basket:open'),
});

const galleryView = new GalleryView({
	onCardClick: (product) =>
		appState.events.emit<PreviewOpenEvent>('preview:open', { product }),
});

const orderForm = new OrderForm({
	onSubmit: (details) =>
		appState.events.emit<OrderFormSubmitEvent>('order:submit', { details }),
	onOrderDetailsChange: (details) =>
		appState.events.emit<OrderFormChangeEvent>('order:change', { details }),
});

const contactsForm = new ContactsForm({
	onSubmit: (details) => appState.events.emit('contacts:submit', { details }),
	onOrderDetailsChange: (details) =>
		appState.events.emit<ContactsFormChangeEvent>('contacts:change', {
			details,
		}),
});

const orderConfirmationView = new OrderConfirmationView({
	onCloseButtonClick: () => baseModalView.close(),
});

appState.events.on<PreviewOpenEvent>('preview:open', handlePreviewOpen);

appState.events.on('basket:change', handleBasketChange);
appState.events.on<BasketAddEvent>('basket:add', handleBasketAdd);
appState.events.on<BasketRemoveEvent>('basket:remove', handleBasketRemove);
appState.events.on('basket:open', handleBasketOpen);

appState.events.on('order:open', handleOrderFormOpen);
appState.events.on<OrderFormChangeEvent>('order:change', handleOrderFormChange);
appState.events.on<OrderFormSubmitEvent>('order:submit', handleOrderFormSubmit);

appState.events.on('contacts:open', handleContactsFormOpen);
appState.events.on<ContactsFormChangeEvent>(
	'contacts:change',
	handleContactsFormChange
);
appState.events.on<ContactsFormSubmitEvent>(
	'contacts:submit',
	handleContactsFormSubmit
);

function handlePreviewOpen({ product }: PreviewOpenEvent) {
	const productData = appState.catalog.getItemById(product.id);
	const preview = new CardDetails({
		onBasketAdd: () => appState.events.emit('basket:add', { product }),
	});
	preview.render(productData);
	baseModalView.setContent(preview.getElement());
	baseModalView.open();
}
function handleBasketChange() {
	basketView.render({
		productsArray: appState.basket.getItemsArray(),
		total: appState.basket.getTotal(),
		productsMap: appState.basket.getItemsMap(),
	});
	headerView.render(appState.basket.getItemsCount());
}
function handleBasketAdd({ product }: BasketAddEvent) {
	appState.basket.add(product);
}
function handleBasketRemove({ product }: BasketRemoveEvent) {
	appState.basket.remove(product);
}
function handleBasketOpen() {
	baseModalView.setContent(basketView.getElement());
	baseModalView.open();
}
function handleOrderFormOpen() {
	orderForm.reset();
	baseModalView.setContent(orderForm.getElement());
	baseModalView.open();
}
function handleOrderFormChange({ details }: OrderFormChangeEvent) {
	orderForm.setSubmitButtonStatus(false);
	if (!details.address) {
		orderForm.setError('Адрес не может быть пустым!');
		return;
	}
	orderForm.setError('');
	orderForm.setSubmitButtonStatus(true);
}
function handleOrderFormSubmit({ details }: OrderFormSubmitEvent) {
	appState.setOrderDetails(details);

	appState.events.emit('contacts:open');
}
function handleContactsFormOpen() {
	contactsForm.reset();
	baseModalView.setContent(contactsForm.getElement());
	baseModalView.open();
}
function handleContactsFormChange({ details }: ContactsFormChangeEvent) {
	contactsForm.setSubmitButtonStatus(false);
	if (!details.email) {
		contactsForm.setError('Email не может быть пустым!');
		return;
	}
	if (!details.phoneNumber) {
		contactsForm.setError('Номер телефона не может быть пустым!');
		return;
	}
	contactsForm.setError('');
	contactsForm.setSubmitButtonStatus(true);
}
function handleContactsFormSubmit({ details }: ContactsFormSubmitEvent) {
	appState.setOrderDetails(details);
	const requestBody = appState.getOrderRequestBody();

	makePurchaseRequest(requestBody)
		.then(() => {
			appState.basket.getTotal();
			orderConfirmationView.render(appState.basket.getTotal());
			baseModalView.setContent(orderConfirmationView.getElement());

			appState.basket.clear();
			headerView.reset();
		})
		.catch((e) => console.log('Error: ' + e));
}

async function fetchProducts() {
	return await apiClient.get<ProductList>('/product/');
}
async function makePurchaseRequest(requestBody: OrderRequestBody) {
	return await apiClient.post<ProductList>('/order/', requestBody);
}

fetchProducts()
	.then((products) => {
		const { items } = products;
		appState.catalog.setItems(items);
		galleryView.populateGallery(items);
	})
	.catch((e) => console.error(e));
