import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { BasketModal } from './models/BasketModal';
import { Catalog } from './models/Catalog';
import { PreviewModal } from './models/PreviewModal';
import './scss/styles.scss';
import type { ModalConfig, Product, ProductList } from './types';
import { CDN_URL } from './utils/constants';

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
async function fetchProducts() {
	return await apiClient.get<ProductList>('/product/');
}

function createProductCard({
	cardTemplate,
	category,
	image,
	price,
	title,
	id,
}: {
	cardTemplate: HTMLTemplateElement;
} & Product) {
	const card = cardTemplate.content.cloneNode(true) as DocumentFragment;
	const titleEl = card.querySelector('.card__title');
	const categoryEl = card.querySelector('.card__category');
	const imageEl = card.querySelector('.card__image') as HTMLImageElement | null;
	const priceEl = card.querySelector('.card__price');

	if (!categoryEl || !imageEl || !priceEl || !titleEl) {
		throw new Error('Required card elements not found');
	}
	const cardElement = card.querySelector('.card') as HTMLElement;

	titleEl.textContent = title;
	categoryEl.textContent = category;
	imageEl.src = `${CDN_URL}${image}`;
	priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';

	cardElement.addEventListener('click', () =>
		appState.events.emit('preview:open', { id })
	);
	return cardElement;
}

function populateGallery({
	products,
	galleryQuery,
	cardTemplateQuery,
}: {
	galleryQuery: string;
	cardTemplateQuery: string;
	products: Product[];
}) {
	const gallery = document.querySelector(`${galleryQuery}`);
	if (!gallery) {
		throw new Error('populateGallery: Gallery element was not found!');
	}

	const cardTemplate = document.querySelector(
		`${cardTemplateQuery}`
	) as HTMLTemplateElement | null;

	if (!cardTemplate) {
		throw new Error('populateGallery: Card template element was not found!');
	}

	products.forEach((data) =>
		gallery.append(
			createProductCard({
				cardTemplate,
				...data,
			})
		)
	);
}

appState.events.on('preview:open', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		previewModal.showPreview(event.id);
	}
});
appState.events.on('preview:close', () => previewModal.hidePreview());
appState.events.on('basket:add', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		appState.basket.add(event.id);
	}
});
appState.events.on('basket:remove', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		appState.basket.remove(event.id);
	}
});
appState.events.on('basket:change', () => basketModal.updateBasket());
appState.events.on('basket:open', () => basketModal.showModal());
appState.events.on('basket:close', () => basketModal.closeModal());

fetchProducts()
	.then((products) => {
		appState.catalog.setItems(products.items);
		populateGallery({
			galleryQuery: '.gallery',
			cardTemplateQuery: '#card-catalog',
			products: appState.catalog.getItems(),
		});
	})
	.catch((e) => console.error(e));
