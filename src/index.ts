import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { Catalog } from './models/Catalog';
import './scss/styles.scss';
import { Product, ProductList } from './types';
import { CDN_URL } from './utils/constants';

const eventEmitter = new EventEmitter();
const basket = new Basket(eventEmitter);
const catalog = new Catalog<Product>(eventEmitter);
const appState = new AppState(basket, catalog, eventEmitter);

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

	if (!categoryEl || !imageEl || !priceEl || !titleEl || !descriptionEl) {
		throw new Error('Required card elements not found');
	}

	titleEl.textContent = title;
	categoryEl.textContent = category;
	imageEl.src = `${CDN_URL}${image}`;
	priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
	descriptionEl.textContent = description;
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

function showCardPreview({ id }: { id: string }) {
	const cardData = appState.catalog.getItemById(id);
	if (!cardData) {
		throw new Error('showCardPreview: Preview Card data was not found!');
	}

	const modalContainer = document.querySelector('.modal:has(.card)');
	if (!modalContainer) {
		throw new Error(
			'showCardPreview: Preview card modal container was not found!'
		);
	}
	modalContainer.addEventListener('click', () =>
		appState.events.emit('preview:close', { modal: modalContainer })
	);

	const closeButton = modalContainer.querySelector('.modal__close');
	if (!closeButton) {
		throw new Error('showCardPreview: close button was not found!');
	}
	closeButton.addEventListener('click', () =>
		appState.events.emit('preview:close', { modal: modalContainer })
	);

	const previewCardContainer = modalContainer.querySelector('.card');
	if (!previewCardContainer) {
		throw new Error(
			"showCardPreview: Preview card modal container doesn't have .card child!"
		);
	}
	previewCardContainer.addEventListener('click', (e) => e.stopPropagation());

	populatePreviewCard({ previewCardEl: previewCardContainer, data: cardData });

	modalContainer.classList.add('modal_active');
}

function closeModal(modalEl: HTMLElement) {
	modalEl.classList.remove('modal_active');
}

appState.events.on('card:click', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		showCardPreview({ id: event.id });
	}
});
appState.events.on('preview:close', (event) => {
	if ('modal' in event && event.modal instanceof HTMLElement) {
		closeModal(event.modal);
	}
});

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
