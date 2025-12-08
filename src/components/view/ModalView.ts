import { ModalView as TModalView } from '../../types';

/**
 * Класс управления модальным окном.
 * Управляет открытием, закрытием и содержимым модального окна.
 * @implements TModalView
 */
export class ModalView implements TModalView {
	private modalEl: Element;
	private contentEl: Element;

	constructor() {
		const modalEl = document.querySelector('#modal-container');
		if (!modalEl) throw new Error('ModalView: modal was not found!');

		const contentEl = modalEl.querySelector('.modal__content');
		if (!contentEl) throw new Error('ModalView: modal content was not found!');

		this.modalEl = modalEl;
		this.contentEl = contentEl;
		this._attachListeners();
	}

	/**
	 * Устанавливает содержимое модального окна.
	 * @param content - DOM-элемент для отображения в модальном окне.
	 */
	setContent(content: Element) {
		this.contentEl.replaceChildren(content);
	}

	/**
	 * Открывает модальное окно.
	 */
	open() {
		this.modalEl.classList.add('modal_active');
		document.body.style.overflow = 'hidden';
	}

	/**
	 * Закрывает модальное окно.
	 */
	close() {
		this.modalEl.classList.remove('modal_active');
		document.body.style.overflow = '';
	}

	/**
	 * Прикрепляет обработчики событий для модального окна.
	 * @private
	 */
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
