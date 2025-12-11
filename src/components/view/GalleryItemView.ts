import {
	GalleryItemViewConstructor,
	Product,
	GalleryItemView as TGalleryItemView,
} from '../../types';
import { CDN_URL } from '../../utils/constants';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения элементов галерии.
 * @extends BaseElementView
 * @implements TGalleryItemView
 */
export class GalleryItemView
	extends BaseElementView
	implements TGalleryItemView
{
	protected baseElement: Element;
	private onItemClick: (product: Product) => void;

	private static template: HTMLTemplateElement | null = null;

	/**
	 * Создает экземпляр GalleryItemView.
	 * @param onItemClick - Обработчик клика по товару в галерее.
	 */
	constructor({ onItemClick }: GalleryItemViewConstructor) {
		super();

		// Если шаблона нет в кеше, то кешируем его
		if (!GalleryItemView.template) {
			const template = document.querySelector(
				'#card-catalog'
			) as HTMLTemplateElement | null;
			if (!template)
				throw new Error('GalleryItemView: template was not found!');
			GalleryItemView.template = template;
		}

		const clone = GalleryItemView.template.content.cloneNode(
			true
		) as DocumentFragment;
		const galleryItem = clone.firstElementChild;
		if (!galleryItem)
			throw new Error(
				'GalleryItemView: galleryItem was not found inside template!'
			);

		this.onItemClick = onItemClick;
		this.baseElement = galleryItem;
	}

	/**
	 * Орисовывает элемент
	 * @param product - данные о товаре.
	 */
	public render(product: Product) {
		const { category, image, price, title } = product;

		const titleEl = this.baseElement.querySelector('.card__title');
		const categoryEl = this.baseElement.querySelector('.card__category');
		const imageEl = this.baseElement.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		const priceEl = this.baseElement.querySelector('.card__price');

		if (!categoryEl || !imageEl || !priceEl || !titleEl) {
			throw new Error('GalleryItemView: required card elements were not found');
		}

		// Заполнение данными
		titleEl.textContent = title;
		categoryEl.textContent = category;
		imageEl.src = `${CDN_URL}${image}`;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';

		// Обработчик клика по товару
		this.baseElement.addEventListener('click', () => this.onItemClick(product));
	}
}
