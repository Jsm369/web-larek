import { IOrderForm, PayMethod } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './Form';

export class Order extends Form<IOrderForm> {
	protected _payments: HTMLButtonElement[];
	protected _paymentMethods: PayMethod = PayMethod.CARD;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._payments = Array.from(container.querySelectorAll('.button_alt'));

		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			this.container
		);

		this._payments.forEach((button) => {
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
		this._payments.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
}
