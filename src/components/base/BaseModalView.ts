import { BaseModalView as TBaseModalView } from '../../types';

export class BaseModalView implements TBaseModalView {
	private modalEl: Element;
	private contentEl: Element;

	constructor() {
		const modalEl = document.querySelector('#modal-container');
		if (!modalEl) throw new Error('BaseModalView: modal was not found!');

		const contentEl = modalEl.querySelector('.modal__content');
		if (!contentEl)
			throw new Error('BaseModalView: modal content was not found!');

		this.modalEl = modalEl;
		this.contentEl = contentEl;
		this._attachListeners();
	}

	setContent(content: Element) {
		this.contentEl.replaceChildren(content);
	}

	open() {
		this.modalEl.classList.add('modal_active');
		document.body.style.overflow = 'hidden';
	}
	close() {
		this.modalEl.classList.remove('modal_active');
		document.body.style.overflow = '';
	}

	private _attachListeners() {
		this.modalEl.addEventListener('click', () => this.close());
		this.contentEl.addEventListener('click', (e) => e.stopPropagation());

		const closeButton = this.modalEl.querySelector('.modal__close');
		if (!closeButton) {
			throw new Error('attachListenersToModals: close button was not found!');
		}
		closeButton.addEventListener('click', () => this.close());
	}
}
