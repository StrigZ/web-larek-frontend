import { BaseElementView as TBaseElementView } from '../../types';

export abstract class BaseElementView implements TBaseElementView {
	protected abstract baseElement: Element;

	public getElement() {
		return this.baseElement;
	}

	abstract render(...args: unknown[]): void;
}
