import { Preview as TPreview, Product } from '../types';
import { CDN_URL } from '../utils/constants';

export class Preview implements TPreview {
	private previewEl: Element;

	constructor({ onBasketAdd }: { onBasketAdd: (e: Event) => void }) {
		const previewTemplate = document.querySelector(
			'#card-preview'
		) as HTMLTemplateElement | null;
		if (!previewTemplate)
			throw new Error('Preview: preview template was not found!');
		const clone = previewTemplate.content.cloneNode(true) as Element;
		const previewEl = clone.firstElementChild;
		if (!previewEl)
			throw new Error(
				'Preview: preview was not found inside preview template!'
			);

		this.previewEl = previewEl;
		const addToBasketButton = this.previewEl.querySelector('.card__row button');
		if (!addToBasketButton) {
			throw new Error('initPreview: addToBasketButton was not found!');
		}
		addToBasketButton.addEventListener('click', onBasketAdd);
	}

	public render({ category, description, image, price, title }: Product) {
		const titleEl = this.previewEl.querySelector('.card__title');
		if (!titleEl) {
			throw new Error('initPreview: titleEl was not found!');
		}
		const categoryEl = this.previewEl.querySelector('.card__category');
		if (!categoryEl) {
			throw new Error('initPreview: categoryEl was not found!');
		}
		const imageEl = this.previewEl.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		if (!imageEl) {
			throw new Error('initPreview: imageEl was not found!');
		}
		const priceEl = this.previewEl.querySelector('.card__price');
		if (!priceEl) {
			throw new Error('initPreview: priceEl was not found!');
		}
		const descriptionEl = this.previewEl.querySelector('.card__text');
		if (!descriptionEl) {
			throw new Error('initPreview: descriptionEl was not found!');
		}

		titleEl.textContent = title;
		categoryEl.textContent = category;
		imageEl.src = `${CDN_URL}${image}`;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
		descriptionEl.textContent = description;
	}

	public getElement() {
		return this.previewEl;
	}
}
