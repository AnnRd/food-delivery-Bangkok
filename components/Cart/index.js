import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../Modal/index.js';

export default class Cart {
  cartItems = []; 

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product){
      return;
    }

    let cartItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (!cartItem) {
      cartItem = {
        product,
        count: 1
      };
      this.cartItems.push(cartItem);
    } else {
      cartItem.count++;
    }  

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(
      item => item.product.id === productId
    );

    if (amount >= 0 ) {
      cartItem.count++;
    } else {
      cartItem.count--
    }

    if (cartItem.count === 0){
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    if (this.cartItems.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getTotalCount() {
    return this.cartItems.reduce( (total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce( (total, item) => total + item.count * item.product.price, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();

    this.modal.setTitle('Your order');

    this.modalBody = createElement(`<div></div>`); 
    
    for (let cartItem of this.cartItems) {
      const productCard = this.renderProduct(cartItem.product, cartItem.count);
      this.modalBody.append(productCard);
    }    

    this.modalBody.append(this.renderOrderForm());

    this.modalBody.addEventListener('click', this.modalClickEvent);
    this.modalBody.querySelector('form').onsubmit = (event) => this.onSubmit(event);


    this.modal.setBody(this.modalBody);

    this.modal.open();
  }

  modalClickEvent = (event) =>  {
    let target = event.target.closest('.cart-counter__button');

    if (target){
      const productId = target.closest('.cart-product').dataset.productId;

      if (target.classList.contains('cart-counter__button_minus')) {
        this.updateProductCount(productId, -1);
      } else {
        this.updateProductCount(productId, 1);
      }
    
    }

  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    let {product, count} = cartItem;

    if (document.body.classList.contains('is-modal-open') && this.cartItems.length === 0) {
      this.modal.close();
    }
    if (document.body.classList.contains('is-modal-open') && !count == 0) {
      let productCount = this.modalBody.querySelector(`[data-product-id="${product.id}"] .cart-counter__count`); 
      let productPrice = this.modalBody.querySelector(`[data-product-id="${product.id}"] .cart-product__price`);
      let infoPrice = this.modalBody.querySelector(`.cart-buttons__info-price`); 

      productCount.innerHTML = count;
      productPrice.innerHTML = `€${(product.price * count).toFixed(2)}`;
      infoPrice.innerHTML = `€${(product.price * count).toFixed(2)}`;
    } else if (count == 0) {
      this.modalBody.querySelector(`[data-product-id="${product.id}"]`).remove();
    }

    if (this.modalBody != undefined) {
      this.modalBody.querySelector(`.cart-buttons__info-price`).innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }


  }

  async onSubmit(event) {
    event.preventDefault();

    this.modalBody.querySelector('button[type="submit"]').classList.add("is-loading");

    let cartForm = new FormData(this.modalBody.querySelector('.cart-form'));

    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: cartForm
    });

    try {
      let result = await response.json();

      this.modal.setTitle('Success!');
      this.cartItems = [];
      this.modalBody.innerHTML = `
      <div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="/assets/images/delivery.gif">
      </p>
    </div>
      `;
    } catch (error) {
      new Error(error);
    }
    

  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

