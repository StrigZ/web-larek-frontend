import { apiClient } from './components/base/api';
import './scss/styles.scss';
import { Product, ProductList } from './types';
import { CDN_URL } from './utils/constants';

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

fetchProducts()
	.then((products) =>
		populateGallery({
			galleryQuery: '.gallery',
			cardTemplateQuery: '#card-catalog',
			products: products.items,
		})
	)
	.catch((e) => console.error(e));
