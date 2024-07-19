import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface ISuccessOrder {
	total: number;
}

interface ISuccessOrderAction {
	onClick: () => void;
}

export class SuccessOrder extends Component<ISuccessOrder> {
	protected _closeButton: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: IEvents,
		protected action: ISuccessOrderAction
	) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (action?.onClick) {
			this._closeButton.addEventListener('click', action.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
