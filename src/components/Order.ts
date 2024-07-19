import { IOrderForm, PayMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderForm extends Form<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _paymentMethods: PayMethod = PayMethod.CARD;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentButtons = Array.from(
			container.querySelectorAll('.button_alt')
		);

		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			this.container
		);

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const paymentMethod = button.name as PayMethod;
				this.payment = paymentMethod;
			});
		});
	}

	set address(value: string) {
		this._address.value = value;
	}

	set payment(name: string) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
}
