import {
	GalleryItemViewConstructor,
	Product,
	GalleryItemView as TGalleryItemView,
} from '../../types';
import { CDN_URL } from '../../utils/constants';

/**
 * Класс для создания элементов галереи товаров.
 * Генерирует DOM-элементы для отображения товаров в каталоге.
 */
export class GalleryItemView implements TGalleryItemView {
	private template: HTMLTemplateElement;
	private onItemClick: (product: Product) => void;

	/**
	 * Создает экземпляр GalleryItemView.
	 * @param onItemClick - Обработчик клика по товару в галерее.
	 */
	constructor({ onItemClick }: GalleryItemViewConstructor) {
		const template = document.querySelector(
			'#card-catalog'
		) as HTMLTemplateElement | null;
		if (!template) throw new Error('GalleryItemView: template was not found!');

		this.template = template;
		this.onItemClick = onItemClick;
	}

	/**
	 * Создает массив DOM-элементов товаров для галереи.
	 * @param products - Массив товаров для отображения.
	 * @returns Массив DOM-элементов товаров.
	 */
	public createGalleryItems(products: Product[]) {
		const galleryItemsView: Element[] = [];
		products.forEach((item) =>
			galleryItemsView.push(this.createGalleryItem(item))
		);
		return galleryItemsView;
	}

	/**
	 * Создает DOM-элемент для одного товара в галерее.
	 * @param product - Данные товара.
	 * @returns DOM-элемент товара.
	 */
	public createGalleryItem(product: Product) {
		const clone = this.template.content.cloneNode(true) as DocumentFragment;
		const galleryItem = clone.firstElementChild;

		if (!galleryItem)
			throw new Error(
				'GalleryItemView: galleryItem was not found inside template!'
			);

		const { category, image, price, title } = product;

		const titleEl = galleryItem.querySelector('.card__title');
		const categoryEl = galleryItem.querySelector('.card__category');
		const imageEl = galleryItem.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		const priceEl = galleryItem.querySelector('.card__price');

		if (!categoryEl || !imageEl || !priceEl || !titleEl) {
			throw new Error('GalleryItemView: required card elements were not found');
		}

		// Заполнение данными
		titleEl.textContent = title;
		categoryEl.textContent = category;
		imageEl.src = `${CDN_URL}${image}`;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';

		// Обработчик клика по товару
		galleryItem.addEventListener('click', () => this.onItemClick(product));

		return galleryItem;
	}
}
