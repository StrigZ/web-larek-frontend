export class ModalManager {
	modalQuery: string;
	activeModalClass: string;
	closeButtonQuery: string;
	modalContainerQuery: string;
	constructor({
		modalQuery,
		activeModalClass,
		closeButtonQuery,
		modalContainerQuery,
	}: {
		modalQuery: string;
		activeModalClass: string;
		closeButtonQuery: string;
		modalContainerQuery: string;
	}) {
		this.modalQuery = modalQuery;
		this.activeModalClass = activeModalClass;
		this.closeButtonQuery = closeButtonQuery;
		this.modalContainerQuery = modalContainerQuery;
	}

	showModal(modal: Element) {
		modal.classList.add(this.activeModalClass);
	}
	closeModal(modal: Element) {
		console.log(modal, this.activeModalClass);
		modal.classList.remove(this.activeModalClass);
	}
	attachListenersToModals() {
		const modals = document.querySelectorAll(this.modalQuery);

		modals.forEach((modal) => {
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

			modal.addEventListener('click', () => this.closeModal(modal));
			closeButton.addEventListener('click', () => this.closeModal(modal));
			modalContainer.addEventListener('click', (e) => e.stopPropagation());
		});
	}
}
