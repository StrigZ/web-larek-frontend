import { BaseElementView } from './BaseElementView';
import { BaseFormView as TBaseFormView } from '../../types';

export abstract class BaseFormView
	extends BaseElementView
	implements TBaseFormView
{
	protected abstract errorContainer: Element;
	protected abstract submitButton: HTMLButtonElement;
	constructor() {
		super();
	}

	public setError(message: string) {
		this.errorContainer.textContent = message;
	}
	public setSubmitButtonStatus(isActive: boolean) {
		this.submitButton.disabled = !isActive;
	}
	abstract reset(): void;
}
