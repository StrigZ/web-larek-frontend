import { BaseViewElement as TBaseViewElement } from '../../types';

export abstract class BaseViewElement implements TBaseViewElement {
	protected abstract baseElement: Element;

	public getElement() {
		return this.baseElement;
	}

	abstract render(...args: unknown[]): void;
}
