import { IOrder } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';

export class Order extends Form<IOrder> {
	protected _payments: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(name: string) {
		this._payments.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
}
