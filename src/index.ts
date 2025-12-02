import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { BasketView } from './models/BasketView';
import { Catalog } from './models/Catalog';
import { ModalManager } from './modules/modal';
import './scss/styles.scss';
import type { Product, ProductList } from './types';
import { CDN_URL } from './utils/constants';

const eventEmitter = new EventEmitter();
const catalog = new Catalog<Product>(eventEmitter);
const basket = new Basket(eventEmitter);
const appState = new AppState(basket, catalog, eventEmitter);

const modalManager = new ModalManager({
	closeButtonQuery: '.modal__close',
	modalContainerQuery: '.modal__container',
	modalQuery: '.modal',
	activeModalClass: 'modal_active',
});
const previewCardModal = document.querySelector('.modal:has(.card)');

const openBasketButton = document.querySelector('.header__basket');

const basketView = BasketView.initBasketView({
	queries: {
		basketModalQuery: '.modal:has(.basket)',
		cardTemplateQuery: '#card-basket',
		itemListQuery: '.basket__list',
		totalPriceQuery: '.basket__price',
	},
	config: { catalog, events: eventEmitter, items: basket.items, modalManager },
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
		appState.events.emit('card:click', { id })
	);
	return cardElement;
}

function populatePreviewCard({
	previewCardEl,
	data,
}: {
	previewCardEl: Element;
	data: Product;
}) {
	const { category, description, image, price, title } = data;

	const titleEl = previewCardEl.querySelector('.card__title');
	const categoryEl = previewCardEl.querySelector('.card__category');
	const imageEl = previewCardEl.querySelector(
		'.card__image'
	) as HTMLImageElement | null;
	const priceEl = previewCardEl.querySelector('.card__price');
	const descriptionEl = previewCardEl.querySelector('.card__text');
	const addToBasketButton = previewCardEl.querySelector('.card__row button');

	if (
		!categoryEl ||
		!imageEl ||
		!priceEl ||
		!titleEl ||
		!descriptionEl ||
		!addToBasketButton
	) {
		throw new Error('Required card elements not found');
	}

	titleEl.textContent = title;
	categoryEl.textContent = category;
	imageEl.src = `${CDN_URL}${image}`;
	priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
	descriptionEl.textContent = description;
	addToBasketButton.addEventListener('click', () =>
		appState.events.emit('basket:add', { productData: data })
	);
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

function showCardPreview(cardData: Product) {
	if (!previewCardModal) {
		throw new Error("showCardPreview: previewCardModal doesn't exist");
	}

	const previewCardContainer = previewCardModal.querySelector('.card');
	if (!previewCardContainer) {
		throw new Error(
			"showCardPreview: Preview card modal container doesn't have .card child!"
		);
	}

	populatePreviewCard({ previewCardEl: previewCardContainer, data: cardData });

	modalManager.showModal(previewCardModal);
}

openBasketButton?.addEventListener('click', () => basketView.showBasket());

appState.events.on('card:click', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		const cardData = appState.catalog.getItemById(event.id);
		showCardPreview(cardData);
	}
});
appState.events.on('basket:add', (event) => {
	if ('productData' in event) {
		appState.basket.add((event.productData as Product).id);
	}
});
appState.events.on('basket:remove', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		appState.basket.remove(event.id);
	}
});
appState.events.on('basket:change', () => basketView.updateBasket());

modalManager.attachListenersToModals();
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
