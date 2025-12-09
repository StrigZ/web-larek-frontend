import './scss/styles.scss';

import type {
	BasketAddEvent,
	BasketRemoveEvent,
	ConfirmPurchaseResponse,
	ContactsFormChangeEvent,
	GetItemsResponse,
	OrderFormChangeEvent,
	OrderRequestBody,
	PreviewOpenEvent,
} from './types';

import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { Catalog } from './models/Catalog';

import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { OrderConfirmationView } from './components/view/OrderConfirmationView';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { GalleryView } from './components/view/GalleryView';
import { CardDetails } from './components/view/CardDetails';
import { ContactsForm } from './components/view/ContactsForm';
import { HeaderView } from './components/view/HeaderView';
import { ModalView } from './components/view/ModalView';
import { BasketItemView } from './components/view/BasketItemView';
import { GalleryItemView } from './components/view/GalleryItemView';

const appState = new AppState(
	new Basket({
		onBasketChange: () => appState.getEvents().emit('basket:change'),
	}),
	new Catalog(),
	new EventEmitter()
);

const modalView = new ModalView();

const headerView = new HeaderView();

const basketItemView = new BasketItemView({
	onDelete: (product) =>
		appState.getEvents().emit<BasketRemoveEvent>('basket:remove', { product }),
});

const basketView = new BasketView({
	onStartOrder: () => appState.getEvents().emit('order:open'),
	onBasketOpen: () => appState.getEvents().emit('basket:open'),
});

const galleryItemView = new GalleryItemView({
	onItemClick: (product) =>
		appState.getEvents().emit<PreviewOpenEvent>('details:open', { product }),
});

const galleryView = new GalleryView();

const orderForm = new OrderForm({
	onSubmit: () => appState.getEvents().emit('order:submit'),
	onOrderDetailsChange: (details) =>
		appState
			.getEvents()
			.emit<OrderFormChangeEvent>('order:change', { details }),
});

const contactsForm = new ContactsForm({
	onSubmit: () => appState.getEvents().emit('contacts:submit'),
	onOrderDetailsChange: (details) =>
		appState.getEvents().emit<ContactsFormChangeEvent>('contacts:change', {
			details,
		}),
});

const orderConfirmationView = new OrderConfirmationView({
	onCloseButtonClick: () => modalView.close(),
});

appState.getEvents().on<PreviewOpenEvent>('details:open', handlePreviewOpen);

appState.getEvents().on('basket:change', handleBasketChange);
appState.getEvents().on<BasketAddEvent>('basket:add', handleBasketAdd);
appState.getEvents().on<BasketRemoveEvent>('basket:remove', handleBasketRemove);
appState.getEvents().on('basket:open', handleBasketOpen);

appState.getEvents().on('order:open', handleOrderFormOpen);
appState
	.getEvents()
	.on<OrderFormChangeEvent>('order:change', handleOrderFormChange);
appState.getEvents().on('order:submit', handleOrderFormSubmit);

appState.getEvents().on('contacts:open', handleContactsFormOpen);
appState
	.getEvents()
	.on<ContactsFormChangeEvent>('contacts:change', handleContactsFormChange);
appState.getEvents().on('contacts:submit', handleContactsFormSubmit);

function handlePreviewOpen({ product }: PreviewOpenEvent) {
	const productData = appState.getCatalog().getItemById(product.id);
	const cardDetails = new CardDetails({
		onBasketAdd: () => appState.getEvents().emit('basket:add', { product }),
		isBasketButtonActive: !appState.getBasket().getItem(product.id),
	});
	cardDetails.render(productData);
	modalView.setContent(cardDetails.getElement());
	modalView.open();
}
function handleBasketChange() {
	const basketItems = appState.getBasket().getItems();

	basketView.render({
		products: basketItemView.createBasketItems(basketItems),
		total: appState.getBasket().getTotal(),
	});
	headerView.render(appState.getBasket().getItemsCount());
}
function handleBasketAdd({ product }: BasketAddEvent) {
	appState.getBasket().add(product);
	modalView.close();
}
function handleBasketRemove({ product }: BasketRemoveEvent) {
	appState.getBasket().remove(product);
}
function handleBasketOpen() {
	modalView.setContent(basketView.getElement());
	modalView.open();
}
function handleOrderFormOpen() {
	orderForm.reset();
	modalView.setContent(orderForm.getElement());
	modalView.open();
}
function handleOrderFormChange({ details }: OrderFormChangeEvent) {
	orderForm.render(details);
	modalView.setContent(orderForm.getElement());
	appState.setOrderDetails(details);

	const errorMessage = appState.getValidationError();
	orderForm.setSubmitButtonStatus(!errorMessage);
	orderForm.setError(errorMessage);
}
function handleOrderFormSubmit() {
	appState.getEvents().emit('contacts:open');
}
function handleContactsFormOpen() {
	contactsForm.reset();
	modalView.setContent(contactsForm.getElement());
	modalView.open();
}
function handleContactsFormChange({ details }: ContactsFormChangeEvent) {
	contactsForm.render(details);
	modalView.setContent(contactsForm.getElement());
	appState.setOrderDetails(details);

	const errorMessage = appState.getValidationError();
	contactsForm.setSubmitButtonStatus(!errorMessage);
	contactsForm.setError(errorMessage);
}
function handleContactsFormSubmit() {
	const requestBody = appState.getOrderRequestBody();

	makePurchaseRequest(requestBody)
		.then(() => {
			orderConfirmationView.render(appState.getBasket().getTotal());
			modalView.setContent(orderConfirmationView.getElement());

			appState.getBasket().clear();
			headerView.reset();
		})
		.catch((e) => console.log('Error: ' + e));
}

async function fetchProducts() {
	return await apiClient.get<GetItemsResponse>('/product/');
}
async function makePurchaseRequest(requestBody: OrderRequestBody) {
	return await apiClient.post<ConfirmPurchaseResponse>('/order/', requestBody);
}

fetchProducts()
	.then((products) => {
		const { items } = products;
		appState.getCatalog().setItems(items);
		galleryView.render(galleryItemView.createGalleryItems(items));
	})
	.catch((e) => console.error(e));
