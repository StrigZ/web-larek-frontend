import './scss/styles.scss';

import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { BasketModal } from './models/BasketModal';
import { Catalog } from './models/Catalog';
import { GalleryView } from './models/CatalogView';
import { PreviewModal } from './models/PreviewModal';

import type {
	BasketAddEvent,
	BasketRemoveEvent,
	ModalConfig,
	PreviewOpenEvent,
	ProductList,
} from './types';
import { OrderForm } from './models/OrderForm';
import { BaseModalView } from './components/base/BaseModalView';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const appState = new AppState(basket, catalog, events);

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
const previewModal = PreviewModal.initPreviewModal({
	queries: {
		addButton: '.card__row button',
		category: '.card__category',
		description: '.card__text',
		image: '.card__image',
		modal: '.modal:has(.card)',
		price: '.card__price',
		title: '.card__title',
	},
	modalConfig,
});

const baseModalView = new BaseModalView();
const orderForm = new OrderForm({
	onSubmit: (e) => {
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
	},
});

const galleryView = GalleryView.initGalleryView({
	queries: { cardTemplate: '#card-catalog', gallery: '.gallery' },
	config: { events },
});

appState.events.on<PreviewOpenEvent>('preview:open', (event) =>
	previewModal.showPreview(event.id)
);
appState.events.on('preview:close', () => previewModal.hidePreview());

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
