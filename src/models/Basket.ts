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
		this.items.set(id, this.items.has(id) ? this.items.get(id)! + 1 : 1);
		this._changed();
	}

	remove(id: string) {
		if (!this.items.has(id)) {
			return;
		}

		if (this.items.get(id) === 1) {
			return this.items.delete(id);
		}

		this.items.set(id, this.items.get(id)! - 1);
		this._changed();
	}

	private _changed() {
		this.events.emit('basket:change', { items: Array.from(this.items.keys()) });
	}
}
