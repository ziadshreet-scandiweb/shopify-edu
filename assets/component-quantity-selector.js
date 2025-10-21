import { Component } from '@theme/component';
import { QuantitySelectorUpdateEvent } from '@theme/events';

/**
 * A custom element that allows the user to select a quantity.
 *
 * @typedef {Object} Refs
 * @property {HTMLInputElement} quantityInput
 *
 * @extends {Component<Refs>}
 */
class QuantitySelectorComponent extends Component {
  /**
   * Handles the quantity increase event.
   * @param {Event} event - The event.
   */
  increaseQuantity(event) {
    if (!(event.target instanceof HTMLElement)) return;

    event.preventDefault();
    this.refs.quantityInput.stepUp();
    this.#onQuantityChange();
  }

  /**
   * Handles the quantity decrease event.
   * @param {Event} event - The event.
   */
  decreaseQuantity(event) {
    if (!(event.target instanceof HTMLElement)) return;

    event.preventDefault();
    this.refs.quantityInput.stepDown();
    this.#onQuantityChange();
  }

  /**
   * When our input gets focused, we want to fully select the value.
   * @param {FocusEvent} event
   */
  selectInputValue(event) {
    const { quantityInput } = this.refs;
    if (!(event.target instanceof HTMLInputElement) || document.activeElement !== quantityInput) return;

    quantityInput.select();
  }

  /**
   * Handles the quantity set event.
   * @param {Event} event - The event.
   */
  setQuantity(event) {
    if (!(event.target instanceof HTMLElement)) return;

    event.preventDefault();
    if (event.target instanceof HTMLInputElement) {
      this.refs.quantityInput.value = event.target.value;
    }
    this.#onQuantityChange();
  }

  /**
   * Handles the quantity change event.
   */
  #onQuantityChange() {
    const { quantityInput } = this.refs;

    this.#checkQuantityRules();
    const newValue = parseInt(quantityInput.value);

    quantityInput.dispatchEvent(new QuantitySelectorUpdateEvent(newValue, Number(quantityInput.dataset.cartLine)));
  }

  /**
   * Checks the quantity rules are met
   */
  #checkQuantityRules = () => {
    const { quantityInput } = this.refs;
    const { min, max, value: newValue } = quantityInput;
    const minInt = parseInt(min);
    const maxInt = parseInt(max);
    const newValueInt = parseInt(newValue);

    if (newValueInt < minInt && min) quantityInput.value = min;
    if (newValueInt > maxInt && max) quantityInput.value = max;
  };

  /**
   * Gets the quantity input.
   * @returns {HTMLInputElement} The quantity input.
   */
  get quantityInput() {
    if (!this.refs.quantityInput) {
      throw new Error('Missing <input ref="quantityInput" /> inside <quantity-selector-component />');
    }

    return this.refs.quantityInput;
  }
}

if (!customElements.get('quantity-selector-component')) {
  customElements.define('quantity-selector-component', QuantitySelectorComponent);
}
