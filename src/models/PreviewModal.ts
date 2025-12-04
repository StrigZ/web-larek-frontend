import { Modal } from '../modules/modal';
import {
	ModalConfig,
	PreviewModalConstructor,
	PreviewModal as TPreviewModal,
	Product,
} from '../types';
import { CDN_URL } from '../utils/constants';

export class PreviewModal extends Modal implements TPreviewModal {
	private modal: Element;
	private addToBasketButton: Element;
	private categoryEl: Element;
	private descriptionEl: Element;
	private imageEl: HTMLImageElement;
	private priceEl: Element;
	private titleEl: Element;
	private clickListener: (() => void) | null;

	constructor({
		modal,
		addToBasketButton,
		categoryEl,
		descriptionEl,
		imageEl,
		priceEl,
		titleEl,
		...modalConfig
	}: PreviewModalConstructor) {
		super(modalConfig);
		this.modal = modal;
		this.addToBasketButton = addToBasketButton;
		this.categoryEl = categoryEl;
		this.descriptionEl = descriptionEl;
		this.imageEl = imageEl;
		this.priceEl = priceEl;
		this.titleEl = titleEl;
		this.clickListener = null;

		super.attachListeners(this.modal, () => this.events.emit('preview:close'));
	}

	showPreview(id: string) {
		const previewItem = this.catalog.getItemById(id);
		this._populatePreviewCard(previewItem);
		this.clickListener = () => this.events.emit('basket:add', { id });
		this._attachListeners();
		super.showModal(this.modal);
	}
	hidePreview() {
		this._removeListeners();
		this.clickListener = null;
		super.closeModal(this.modal);
	}

	private _attachListeners() {
		if (this.clickListener) {
			this.addToBasketButton.addEventListener('click', this.clickListener);
		}
	}
	private _removeListeners() {
		if (this.clickListener) {
			this.addToBasketButton.removeEventListener('click', this.clickListener);
		}
	}
	private _populatePreviewCard({
		category,
		description,
		image,
		price,
		title,
	}: Product) {
		this.titleEl.textContent = title;
		this.categoryEl.textContent = category;
		this.imageEl.src = `${CDN_URL}${image}`;
		this.priceEl.textContent = price
			? `${price.toString()} синапсов`
			: 'Бесценно';
		this.descriptionEl.textContent = description;
	}
	public static initPreviewModal({
		queries,
		modalConfig,
	}: {
		queries: {
			modal: string;
			title: string;
			category: string;
			image: string;
			price: string;
			description: string;
			addButton: string;
		};
		modalConfig: ModalConfig;
	}) {
		const modal = document.querySelector(queries.modal);
		if (!modal) {
			throw new Error('initPreviewModal: modal was not found!');
		}
		const titleEl = document.querySelector(queries.title);
		if (!titleEl) {
			throw new Error('initPreviewModal: titleEl was not found!');
		}
		const categoryEl = document.querySelector(queries.category);
		if (!categoryEl) {
			throw new Error('initPreviewModal: categoryEl was not found!');
		}
		const imageEl = document.querySelector(
			queries.image
		) as HTMLImageElement | null;
		if (!imageEl) {
			throw new Error('initPreviewModal: imageEl was not found!');
		}
		const priceEl = document.querySelector(queries.price);
		if (!priceEl) {
			throw new Error('initPreviewModal: priceEl was not found!');
		}
		const descriptionEl = document.querySelector(queries.description);
		if (!descriptionEl) {
			throw new Error('initPreviewModal: descriptionEl was not found!');
		}
		const addToBasketButton = document.querySelector(queries.addButton);
		if (!addToBasketButton) {
			throw new Error('initPreviewModal: addToBasketButton was not found!');
		}

		return new PreviewModal({
			modal,
			titleEl,
			categoryEl,
			imageEl,
			priceEl,
			descriptionEl,
			addToBasketButton,
			...modalConfig,
		});
	}
}
