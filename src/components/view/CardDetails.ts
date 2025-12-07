import { CardDetails as TCardDetails, Product } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardDetails implements TCardDetails {
	private cardDetailsEl: Element;

	constructor({ onBasketAdd }: { onBasketAdd: (e: Event) => void }) {
		const cardDetailsTemplate = document.querySelector(
			'#card-preview'
		) as HTMLTemplateElement | null;
		if (!cardDetailsTemplate)
			throw new Error('Preview: preview template was not found!');
		const clone = cardDetailsTemplate.content.cloneNode(true) as Element;
		const cardDetailsEl = clone.firstElementChild;
		if (!cardDetailsEl)
			throw new Error(
				'Preview: preview was not found inside preview template!'
			);

		this.cardDetailsEl = cardDetailsEl;
		const addToBasketButton =
			this.cardDetailsEl.querySelector('.card__row button');
		if (!addToBasketButton) {
			throw new Error('initPreview: addToBasketButton was not found!');
		}
		addToBasketButton.addEventListener('click', onBasketAdd);
	}

	public render({ category, description, image, price, title }: Product) {
		const titleEl = this.cardDetailsEl.querySelector('.card__title');
		if (!titleEl) {
			throw new Error('initPreview: titleEl was not found!');
		}
		const categoryEl = this.cardDetailsEl.querySelector('.card__category');
		if (!categoryEl) {
			throw new Error('initPreview: categoryEl was not found!');
		}
		const imageEl = this.cardDetailsEl.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		if (!imageEl) {
			throw new Error('initPreview: imageEl was not found!');
		}
		const priceEl = this.cardDetailsEl.querySelector('.card__price');
		if (!priceEl) {
			throw new Error('initPreview: priceEl was not found!');
		}
		const descriptionEl = this.cardDetailsEl.querySelector('.card__text');
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
		return this.cardDetailsEl;
	}
}
