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
	PreviewOpenEvent,
	ProductList,
} from './types';
import { OrderForm } from './components/view/OrderForm';
import { BaseModalView } from './components/base/BaseModalView';
import { GalleryView } from './components/view/GalleryView';
import { CardDetails } from './components/view/CardDetails';

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
	onCardClick: onGalleryCardClick,
});

const orderForm = new OrderForm({
	onSubmit: onOrderFormSubmit,
});

appState.events.on('preview:open', onPreviewOpen);

appState.events.on('basket:add', onBasketAdd);
appState.events.on('basket:remove', onBasketRemove);
appState.events.on('basket:change', onBasketChange);
appState.events.on('basket:open', onBasketOpen);

appState.events.on('order:open', onOrderOpen);
appState.events.on('order:submit', () => {
	// render contact form
	// set its content to modal view
	// show modal view ?
});

function onOrderFormSubmit(e: Event) {
	e.preventDefault();
	const form = e.currentTarget as HTMLFormElement | null;
	if (!form) return;

	const formData = new FormData(form);
	const formObject = Object.fromEntries(formData) as Partial<OrderForm>;

	const elements = form.elements;
	const isCashPayment = (
		elements.namedItem('cash') as HTMLElement
	).classList.contains('button_alt-active');

	appState.setOrderDetails({
		...formObject,
		paymentVariant: isCashPayment ? 'При получении' : 'Онлайн',
	});

	appState.events.emit('order:submit');
}
function onOrderOpen() {
	orderForm.render(appState.orderDetails);
	baseModalView.setContent(orderForm.getElement());
	baseModalView.open();
}
function onGalleryCardClick(id: string) {
	appState.events.emit('preview:open', { id });
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
function onBasketRemove({ id }: BasketRemoveEvent) {
	appState.basket.remove(id);
}
function onBasketAdd({ id }: BasketAddEvent) {
	appState.basket.add(id);
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
async function fetchProducts() {
	return await apiClient.get<ProductList>('/product/');
}

fetchProducts()
	.then((products) => {
		const { items } = products;
		appState.catalog.setItems(items);
		galleryView.populateGallery(items);
	})
	.catch((e) => console.error(e));
