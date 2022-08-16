
export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.createCard();
  }

  createCard() {
    let card = document.createElement('DIV')
    card.className = 'card';
    this.elem = card;

    card.innerHTML = `
    <div class="card__top">
      <img src="/assets/images/products/${this.product.image}" class="card__image" alt="product">
      <span class="card__price">€${this.product.price.toFixed(2)}</span>
    </div>
    <div class="card__body">
      <div class="card__title">${this.product.name}</div>
      <button type="button" class="card__button">
        <img src="/assets/images/icons/plus-icon.svg" alt="icon">
      </button>
    </div>
    `;

    let btn = card.querySelector('button');
    let myProductsCart = [];

    btn.addEventListener('click', event => {
      const customEvent = new CustomEvent('product-add', {
        detail: this.product.id,
        bubbles: true,
      });

      btn.dispatchEvent(customEvent);
    })

    btn.addEventListener('product-add', event => {
      if (event.target.closest('button')){
        myProductsCart.push(event.detail);
      }
    });

    return card;
  }

}