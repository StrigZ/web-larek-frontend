import { EventEmitter } from '../components/base/events';
import { BasketModel } from '../types';

export class Basket implements BasketModel {
	items = new Map<string, number>();
	events: EventEmitter;

	constructor(events: EventEmitter) {
		this.items = new Map<string, number>();
		this.events = events;
	}

	add(id: string) {
		const doesExist = this.items.has(id);
		if (doesExist) {
			const currIndex = this.items.get(id);
			if (!currIndex) return;
			this.items.set(id, currIndex + 1);
		} else {
			this.items.set(id, 1);
		}

		this._changed();
	}

	remove(id: string) {
		const doesExist = this.items.has(id);
		if (!doesExist) {
			return;
		}

		const currIndex = this.items.get(id);
		if (!currIndex) return;

		if (currIndex === 1) {
			this.items.delete(id);
			this._changed();
			return;
		}

		this.items.set(id, currIndex - 1);
		this._changed();
	}
	clear() {
		this.items = new Map<string, number>();
		this._changed();
	}
	private _changed() {
		console.log(this.items);

		this.events.emit('basket:change');
	}
}
