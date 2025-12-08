import { BaseElementView } from './BaseElementView';
import { BaseFormView as TBaseFormView } from '../../types';

/**
 * Абстрактный базовый класс для форм.
 * Предоставляет функциональность для работы с ошибками и состоянием кнопки отправки.
 * @extends BaseElementView
 * @implements TBaseFormView
 */
export abstract class BaseFormView
	extends BaseElementView
	implements TBaseFormView
{
	/** Контейнер для отображения сообщений об ошибках. */
	protected abstract errorContainer: Element;

	/** Кнопка отправки формы. */
	protected abstract submitButton: HTMLButtonElement;

	constructor() {
		super();
	}

	/** Устанавливает текст ошибки в контейнер. */
	public setError(message: string) {
		this.errorContainer.textContent = message;
	}

	/** Управляет состоянием кнопки отправки формы. */
	public setSubmitButtonStatus(isActive: boolean) {
		this.submitButton.disabled = !isActive;
	}

	/** Абстрактный метод сброса формы к начальному состоянию. */
	abstract reset(): void;
}
