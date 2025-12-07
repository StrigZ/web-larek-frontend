import { Product, GalleryView as TGalleryView } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class GalleryView implements TGalleryView {
	private galleryEl: Element;
	private cardTemplateEl: HTMLTemplateElement;
	private onCardClick: (id: string) => void;
	constructor({ onCardClick }: { onCardClick: (id: string) => void }) {
		const galleryEl = document.querySelector('.gallery');
		if (!galleryEl) {
			throw new Error('GalleryView: Gallery element was not found!');
		}
		this.galleryEl = galleryEl;
		const cardTemplateEl = document.querySelector(
			'#card-catalog'
		) as HTMLTemplateElement | null;
		if (!cardTemplateEl) {
			throw new Error('GalleryView: Card template element was not found!');
		}
		this.cardTemplateEl = cardTemplateEl;
		this.onCardClick = onCardClick;
	}

	public populateGallery(items: Product[]) {
		items.forEach((data) =>
			this.galleryEl.append(this._createProductCard(data))
		);
	}

	private _createProductCard({ category, image, price, title, id }: Product) {
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

		cardElement.addEventListener('click', () => this.onCardClick(id));
		return cardElement;
	}
}
