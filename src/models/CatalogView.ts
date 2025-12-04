import { EventEmitter } from '../components/base/events';
import { Product, GalleryView as TGalleryView } from '../types';
import { CDN_URL } from '../utils/constants';

export class GalleryView implements TGalleryView {
	private galleryEl: Element;
	private cardTemplateEl: HTMLTemplateElement;
	private events: EventEmitter;
	constructor({
		events,
		cardTemplateEl,
		galleryEl,
	}: {
		galleryEl: Element;
		cardTemplateEl: HTMLTemplateElement;
		events: EventEmitter;
	}) {
		this.events = events;
		this.galleryEl = galleryEl;
		this.cardTemplateEl = cardTemplateEl;
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

		cardElement.addEventListener('click', () =>
			this.events.emit('preview:open', { id })
		);
		return cardElement;
	}

	public static initGalleryView({
		queries,
		config,
	}: {
		queries: {
			gallery: string;
			cardTemplate: string;
		};
		config: { events: EventEmitter };
	}) {
		const galleryEl = document.querySelector(queries.gallery);
		if (!galleryEl) {
			throw new Error('initGalleryView: Gallery element was not found!');
		}

		const cardTemplateEl = document.querySelector(
			queries.cardTemplate
		) as HTMLTemplateElement | null;
		if (!cardTemplateEl) {
			throw new Error('initGalleryView: Card template element was not found!');
		}

		return new GalleryView({ cardTemplateEl, galleryEl, ...config });
	}
}
