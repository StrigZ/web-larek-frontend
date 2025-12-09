import { GalleryView as TGalleryView } from '../../types';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения галереи товаров.
 * Отображает каталог товаров в виде сетки карточек.
 * @extends BaseElementView
 * @implements TGalleryView
 */
export class GalleryView extends BaseElementView implements TGalleryView {
	protected baseElement;

	/**
	 * Создает экземпляр GalleryView.
	 * @param onCardClick - Обработчик клика по карточке товара.
	 */
	constructor() {
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

		this.baseElement = galleryEl;
	}

	/**
	 * Отображает список товаров в галерее.
	 * @param products - Массив товаров для отображения.
	 */
	public render(products: Element[]) {
		products.forEach((product) => this.baseElement.append(product));
	}

	/**
	 * Создает DOM-элемент карточки товара.
	 * @private
	 * @param product - Данные товара.
	 * @returns DOM-элемент карточки товара.
	 */
}
