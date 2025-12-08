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
	ConfirmPurchaseResponse,
	ContactsFormChangeEvent,
	ContactsFormSubmitEvent,
	GetItemsResponse,
	OrderFormChangeEvent,
	OrderFormSubmitEvent,
	OrderRequestBody,
	PreviewOpenEvent,
} from './types';
import { OrderForm } from './components/view/OrderForm';
import { GalleryView } from './components/view/GalleryView';
import { CardDetails } from './components/view/CardDetails';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderConfirmationView } from './components/view/OrderConfirmationView';
import { HeaderView } from './components/view/HeaderView';
import { ModalView } from './components/view/ModalView';

const appState = new AppState(
	new Basket({
		onBasketChange: () => appState.getEvents().emit('basket:change'),
	}),
	new Catalog(),
	new EventEmitter()
);

const modalView = new ModalView();

const headerView = new HeaderView();
const basketView = new BasketView({
	onStartOrder: () => appState.getEvents().emit('order:open'),
	onBasketItemRemove: (product) =>
		appState.getEvents().emit<BasketRemoveEvent>('basket:remove', { product }),
	onBasketOpen: () => appState.getEvents().emit('basket:open'),
});

const galleryView = new GalleryView({
	onCardClick: (product) =>
		appState.getEvents().emit<PreviewOpenEvent>('details:open', { product }),
});

const orderForm = new OrderForm({
	onSubmit: (details) =>
		appState
			.getEvents()
			.emit<OrderFormSubmitEvent>('order:submit', { details }),
	onOrderDetailsChange: (details) =>
		appState
			.getEvents()
			.emit<OrderFormChangeEvent>('order:change', { details }),
});

const contactsForm = new ContactsForm({
	onSubmit: (details) =>
		appState.getEvents().emit('contacts:submit', { details }),
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
appState
	.getEvents()
	.on<OrderFormSubmitEvent>('order:submit', handleOrderFormSubmit);

appState.getEvents().on('contacts:open', handleContactsFormOpen);
appState
	.getEvents()
	.on<ContactsFormChangeEvent>('contacts:change', handleContactsFormChange);
appState
	.getEvents()
	.on<ContactsFormSubmitEvent>('contacts:submit', handleContactsFormSubmit);

function handlePreviewOpen({ product }: PreviewOpenEvent) {
	const productData = appState.getCatalog().getItemById(product.id);
	const cardDetails = new CardDetails({
		onBasketAdd: () => appState.getEvents().emit('basket:add', { product }),
	});
	cardDetails.render(productData);
	modalView.setContent(cardDetails.getElement());
	modalView.open();
}
function handleBasketChange() {
	basketView.render({
		productsArray: appState.getBasket().getItemsArray(),
		total: appState.getBasket().getTotal(),
		productsMap: appState.getBasket().getItemsMap(),
	});
	headerView.render(appState.getBasket().getItemsCount());
}
function handleBasketAdd({ product }: BasketAddEvent) {
	appState.getBasket().add(product);
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
	orderForm.setSubmitButtonStatus(false);
	if (!details.address.trim()) {
		orderForm.setError('Адрес не может быть пустым!');
		return;
	}
	orderForm.setError('');
	orderForm.setSubmitButtonStatus(true);
}
function handleOrderFormSubmit({ details }: OrderFormSubmitEvent) {
	appState.setOrderDetails(details);
	appState.getEvents().emit('contacts:open');
}
function handleContactsFormOpen() {
	contactsForm.reset();
	modalView.setContent(contactsForm.getElement());
	modalView.open();
}
function handleContactsFormChange({ details }: ContactsFormChangeEvent) {
	contactsForm.setSubmitButtonStatus(false);
	if (!details.email.trim()) {
		contactsForm.setError('Email не может быть пустым!');
		return;
	}
	if (!details.phoneNumber.trim()) {
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
			appState.getBasket().getTotal();
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
		galleryView.render(items);
	})
	.catch((e) => console.error(e));
