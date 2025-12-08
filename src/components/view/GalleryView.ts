import {
	GalleryViewConstructor,
	Product,
	GalleryView as TGalleryView,
} from '../../types';
import { CDN_URL } from '../../utils/constants';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения галереи товаров.
 * Отображает каталог товаров в виде сетки карточек.
 * @extends BaseElementView
 * @implements TGalleryView
 */
export class GalleryView extends BaseElementView implements TGalleryView {
	protected baseElement;
	private cardTemplateEl: HTMLTemplateElement;
	private onCardClick: (product: Product) => void;

	/**
	 * Создает экземпляр GalleryView.
	 * @param onCardClick - Обработчик клика по карточке товара.
	 */
	constructor({ onCardClick }: GalleryViewConstructor) {
		super();
		const galleryEl = document.querySelector('.gallery');
		if (!galleryEl) {
			throw new Error('GalleryView: Gallery element was not found!');
		}

		const cardTemplateEl = document.querySelector(
			'#card-catalog'
		) as HTMLTemplateElement | null;
		if (!cardTemplateEl) {
			throw new Error('GalleryView: Card template element was not found!');
		}

		this.onCardClick = onCardClick;

		this.baseElement = galleryEl;
		this.cardTemplateEl = cardTemplateEl;
	}

	/**
	 * Отображает список товаров в галерее.
	 * @param items - Массив товаров для отображения.
	 */
	public render(items: Product[]) {
		items.forEach((data) =>
			this.baseElement.append(this._createProductCard(data))
		);
	}

	/**
	 * Создает DOM-элемент карточки товара.
	 * @private
	 * @param product - Данные товара.
	 * @returns DOM-элемент карточки товара.
	 */
	private _createProductCard(product: Product) {
		const { category, image, price, title } = product;
		const card = this.cardTemplateEl.content.cloneNode(
			true
		) as DocumentFragment;
		const titleEl = card.querySelector('.card__title');
		const categoryEl = card.querySelector('.card__category');
		const imageEl = card.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		const priceEl = card.querySelector('.card__price');

		if (!categoryEl || !imageEl || !priceEl || !titleEl) {
			throw new Error(
				'_createProductCard: Required card elements were not found in cardTemplate'
			);
		}
		const cardElement = card.querySelector('.card') as HTMLElement;

		titleEl.textContent = title;
		categoryEl.textContent = category;
		imageEl.src = `${CDN_URL}${image}`;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';

		cardElement.addEventListener('click', () => this.onCardClick(product));
		return cardElement;
	}
}
