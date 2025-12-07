import './scss/styles.scss';

import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { BasketModal } from './models/BasketModal';
import { Catalog } from './models/Catalog';

import type {
	BasketAddEvent,
	BasketRemoveEvent,
	ModalConfig,
	PreviewOpenEvent,
	ProductList,
} from './types';
import { OrderForm } from './models/OrderForm';
import { BaseModalView } from './components/base/BaseModalView';
import { Preview } from './models/Preview';
import { GalleryView } from './models/GalleryView';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const appState = new AppState(basket, catalog, events);

const baseModalView = new BaseModalView();

const modalConfig: ModalConfig = {
	closeButtonQuery: '.modal__close',
	modalContainerQuery: '.modal__container',
	activeModalClass: 'modal_active',
	catalog,
	events,
};

const basketModal = BasketModal.initBasketModal({
	queries: {
		modal: '.modal:has(.basket)',
		cardTemplate: '#card-basket',
		itemList: '.basket__list',
		totalPrice: '.basket__price',
		openBasketButton: '.header__basket',
	},
	modalConfig,
});

const galleryView = new GalleryView({
	onCardClick: onGalleryCardClick,
});

const orderForm = new OrderForm({
	onSubmit: onOrderFormSubmit,
});

appState.events.on<PreviewOpenEvent>('preview:open', ({ id }) => {
	const productData = appState.catalog.getItemById(id);
	const preview = new Preview({
		onBasketAdd: () => appState.basket.add(id),
	});
	preview.render(productData);
	baseModalView.setContent(preview.getElement());
	baseModalView.open();
});

appState.events.on<BasketAddEvent>('basket:add', (event) =>
	appState.basket.add(event.id)
);
appState.events.on<BasketRemoveEvent>('basket:remove', (event) =>
	appState.basket.remove(event.id)
);
appState.events.on('basket:change', () => basketModal.updateBasket());
appState.events.on('basket:open', () => basketModal.showModal());
appState.events.on('basket:close', () => basketModal.closeModal());

appState.events.on('order:open', () => {
	orderForm.render(appState.orderDetails);
	baseModalView.setContent(orderForm.getElement());
	baseModalView.open();
});
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
function onGalleryCardClick(id: string) {
	appState.events.emit('preview:open', { id });
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
