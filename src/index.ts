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
	ContactsFormDetails,
	OnConfirmPurchase,
	OrderDetails,
	PreviewOpenEvent,
	ProductList,
} from './types';
import { OrderForm } from './components/view/OrderForm';
import { BaseModalView } from './components/base/BaseModalView';
import { GalleryView } from './components/view/GalleryView';
import { CardDetails } from './components/view/CardDetails';
import { ContactsForm } from './components/view/ContactForm';
import { OrderConfirmationView } from './components/view/OrderConfirmationView';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const appState = new AppState(basket, catalog, events);

const baseModalView = new BaseModalView();

const basketView = new BasketView({
	onStartOrder: () => appState.events.emit('order:open'),
	onBasketItemRemove: (id) => appState.events.emit('basket:remove', { id }),
	onBasketOpen: () => appState.events.emit('basket:open'),
});

const galleryView = new GalleryView({
	onCardClick: (id: string) => appState.events.emit('preview:open', { id }),
});

const orderForm = new OrderForm({
	onSubmit: onOrderFormSubmit,
	onPaymentDetailsChange: onPaymentDetailsChange,
});
const contactsFrom = new ContactsForm({
	onSubmit: onContactsFormSubmit,
	onPaymentDetailsChange: onContactsChange,
});

const orderConfirmationView = new OrderConfirmationView({
	onCloseButtonClick: () => baseModalView.close(),
});

appState.events.on('preview:open', onPreviewOpen);

appState.events.on<BasketAddEvent>('basket:add', ({ id }) =>
	appState.basket.add(id)
);
appState.events.on<BasketRemoveEvent>('basket:remove', ({ id }) =>
	appState.basket.remove(id)
);
appState.events.on('basket:change', onBasketChange);
appState.events.on('basket:open', onBasketOpen);

appState.events.on('order:open', onOrderOpen);
appState.events.on('order:submit', () => {
	contactsFrom.reset();
	baseModalView.setContent(contactsFrom.getElement());
	baseModalView.open();
});

appState.events.on<OnConfirmPurchase>('contacts:submit', (event) => {
	confirmPurchase(event)
		.then(() => {
			let total = 0;
			let isPriceless = false;
			const productsMap = appState.basket.items;
			Array.from(productsMap).map(([productId, index]) => {
				const product = appState.catalog.getItemById(productId);
				if (!product.price) {
					return (isPriceless = true);
				}
				total += product.price * index;
			});
			orderConfirmationView.render(isPriceless ? 'Бесценно' : total);
			baseModalView.setContent(orderConfirmationView.getElement());

			appState.basket.clear();
		})
		.catch((e) => console.log('Error ' + e));
});

function onOrderFormSubmit(details: Partial<OrderDetails>) {
	appState.setOrderDetails(details);
	appState.events.emit('order:submit');
}
function onOrderOpen() {
	orderForm.reset();
	baseModalView.setContent(orderForm.getElement());
	baseModalView.open();
}

function onBasketChange() {
	const productMap = Array.from(appState.basket.items).map(
		([productId, index]) => {
			const product = appState.catalog.getItemById(productId);
			return { ...product, index };
		}
	);
	basketView.render(productMap);
}
function onBasketOpen() {
	baseModalView.setContent(basketView.getElement());
	baseModalView.open();
}

function onPreviewOpen({ id }: PreviewOpenEvent) {
	const productData = appState.catalog.getItemById(id);
	const preview = new CardDetails({
		onBasketAdd: () => appState.basket.add(id),
	});
	preview.render(productData);
	baseModalView.setContent(preview.getElement());
	baseModalView.open();
}
function onContactsChange(details: Partial<ContactsFormDetails>) {
	contactsFrom.setSubmitButtonStatus(false);
	if (!details.email) {
		contactsFrom.setError('Email не может быть пустым!');
		return;
	}
	if (!details.phoneNumber) {
		contactsFrom.setError('Номер телефона не может быть пустым!');
		return;
	}
	contactsFrom.setError('');
	contactsFrom.setSubmitButtonStatus(true);
}
function onPaymentDetailsChange(details: Partial<OrderDetails>) {
	orderForm.setSubmitButtonStatus(false);
	if (!details.address) {
		orderForm.setError('Адрес не может быть пустым!');
		return;
	}
	orderForm.setError('');
	orderForm.setSubmitButtonStatus(true);
}
function onContactsFormSubmit(details: Partial<ContactsFormDetails>) {
	appState.setOrderDetails(details);
	const requestBody = appState.getOrderRequestBody();

	appState.events.emit<OnConfirmPurchase>('contacts:submit', { requestBody });
}
async function fetchProducts() {
	return await apiClient.get<ProductList>('/product/');
}

async function confirmPurchase({ requestBody }: OnConfirmPurchase) {
	return await apiClient.post<ProductList>('/order/', requestBody);
}
fetchProducts()
	.then((products) => {
		const { items } = products;
		appState.catalog.setItems(items);
		galleryView.populateGallery(items);
	})
	.catch((e) => console.error(e));
