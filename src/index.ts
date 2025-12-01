import { apiClient } from './components/base/api';
import './scss/styles.scss';
import { Product, ProductCategory, ProductList } from './types';
import { CDN_URL } from './utils/constants';
import { createElement } from './utils/utils';

const cardTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement | null;

const gallery = document.querySelector('.gallery');

async function fetchProducts() {
	return await apiClient.get<ProductList>('/product/');
}

function createProductCard({
	cardTemplate,
	category,
	image,
	price,
	title,
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
	titleEl.textContent = title;
	categoryEl.textContent = category;
	imageEl.src = `${CDN_URL}${image}`;
	priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';

	return card;
}
function populateGallery() {
	if (!cardTemplate) return;

	fetchProducts().then((products) =>
		products.items.forEach((data) =>
			gallery?.append(
				createProductCard({
					cardTemplate,
					...data,
				})
			)
		)
	);
}
populateGallery();
