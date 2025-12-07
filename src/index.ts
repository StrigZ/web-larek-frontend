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
	OrderSubmitEvent,
	PreviewOpenEvent,
	ProductList,
} from './types';
import { OrderFormModal } from './models/OrderFormModal';

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

const orderFormModal = OrderFormModal.initOrderFormModal({
	queries: {
		modal: '.modal:has(.order)',
		formTemplate: '#order',
	},
	modalConfig,
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
	orderFormModal.populateOrderForm(appState.orderDetails);
	orderFormModal.showOrder();
});
appState.events.on('order:close', () => orderFormModal.hideOrder());
appState.events.on<OrderSubmitEvent>('order:submit', ({ details }) => {
	appState.orderDetails = { ...appState.orderDetails, ...details };
	orderFormModal.hideOrder();
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
