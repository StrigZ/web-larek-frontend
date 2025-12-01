import { apiClient } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './models/AppState';
import { Basket } from './models/Basket';
import { Catalog } from './models/Catalog';
import './scss/styles.scss';
import { Product, ProductList } from './types';
import { CDN_URL } from './utils/constants';

const eventEmitter = new EventEmitter();
const appState = new AppState(
	new Basket(eventEmitter),
	new Catalog<Product>(eventEmitter),
	eventEmitter
);

const previewCardModal = document.querySelector('.modal:has(.card)');

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

	previewCardModal.classList.add('modal_active');
}

function closeModal(modalEl: HTMLElement) {
	modalEl.classList.remove('modal_active');
}

appState.events.on('card:click', (event) => {
	if ('id' in event && typeof event.id == 'string') {
		const cardData = appState.catalog.getItemById(event.id);
		showCardPreview(cardData);
	}
});
appState.events.on('preview:close', (event) => {
	if ('modal' in event && event.modal instanceof HTMLElement) {
		closeModal(event.modal);
	}
});

function attachListenersToModals() {
	const modals = document.querySelectorAll('.modal');
	modals.forEach((modal) => {
		modal.addEventListener('click', () =>
			appState.events.emit('preview:close', { modal })
		);
		const closeButton = modal.querySelector('.modal__close');
		if (!closeButton) {
			throw new Error('attachListenersToModals: close button was not found!');
		}
		closeButton.addEventListener('click', () =>
			appState.events.emit('preview:close', { modal })
		);

		const previewCardContainer = modal.querySelector('.modal__container');
		if (!previewCardContainer) {
			throw new Error(
				"attachListenersToModals: Modal doesn't have modal container!"
			);
		}
		previewCardContainer.addEventListener('click', (e) => e.stopPropagation());
	});
}

attachListenersToModals();
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
