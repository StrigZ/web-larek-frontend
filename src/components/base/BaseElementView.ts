import { BaseElementView as TBaseElementView } from '../../types';

/**
 * Базовый абстрактный класс для UI-компонентов.
 * Предоставляет общий интерфейс работы с DOM-элементами.
 * @abstract
 * @implements {TBaseElementView}
 */
export abstract class BaseElementView implements TBaseElementView {
	/** DOM-элемент компонента. Должен быть реализован в наследниках. */
	protected abstract baseElement: Element;

	/** Возвращает DOM-элемент компонента. */
	public getElement() {
		return this.baseElement;
	}

	/** Абстрактный метод отрисовки компонента. */
	abstract render(...args: unknown[]): void;
}
