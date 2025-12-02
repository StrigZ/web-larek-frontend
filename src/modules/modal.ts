import { ModalConfig } from '../types';

export class Modal {
	activeModalClass: string;
	closeButtonQuery: string;
	modalContainerQuery: string;
	constructor({
		activeModalClass,
		closeButtonQuery,
		modalContainerQuery,
	}: ModalConfig) {
		this.activeModalClass = activeModalClass;
		this.closeButtonQuery = closeButtonQuery;
		this.modalContainerQuery = modalContainerQuery;
	}

	showModal(modal: Element) {
		modal.classList.add(this.activeModalClass);
	}
	closeModal(modal: Element) {
		modal.classList.remove(this.activeModalClass);
	}

	attachListeners(modal: Element, listener?: () => void) {
		const closeButton = modal.querySelector(this.closeButtonQuery);
		if (!closeButton) {
			throw new Error('attachListenersToModals: close button was not found!');
		}

		const modalContainer = modal.querySelector(this.modalContainerQuery);
		if (!modalContainer) {
			throw new Error(
				"attachListenersToModals: Modal doesn't have modal container!"
			);
		}

		modal.addEventListener('click', () =>
			listener ? listener() : this.closeModal(modal)
		);
		closeButton.addEventListener('click', () =>
			listener ? listener() : this.closeModal(modal)
		);
		modalContainer.addEventListener('click', (e) => e.stopPropagation());
	}
}
