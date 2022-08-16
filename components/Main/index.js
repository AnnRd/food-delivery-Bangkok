// import Carousel from '../../6-module/3-task/index.js';
import Carousel from '../Carousel/index.js';
import slides from '../Carousel/slides.js';
// import slides from '../../6-module/3-task/slides.js';

// import RibbonMenu from '../../7-module/RibbonMenu/index.js';
import RibbonMenu from '../RibbonMenu/index.js';
import categories from '../RibbonMenu/categories.js'
// import categories from '../../components/RibbonMenu/categories.js.js.js';

// import StepSlider from '../../components/StepSlider/index.js';
import StepSlider from '../StepSlider/index.js';
import ProductsGrid from '../ProductGrid/index.js';

import CartIcon from '../CartIcon/index.js';
import Cart from '../Cart/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    let carousel = new Carousel(slides);
    document.querySelector('[data-carousel-holder]').append(carousel.elem);

    let ribbonMenu = new RibbonMenu(categories);
    document.querySelector('[data-ribbon-holder]').append(ribbonMenu.elem);

    let stepSlider = new StepSlider({
      steps: 5,
      value: 3
    });
    document.querySelector('[data-slider-holder]').append(stepSlider.elem);

    let cartIcon = new CartIcon();
    document.querySelector('[data-cart-icon-holder]').append(cartIcon.elem);

    let cart = new Cart(cartIcon);

    let response = await fetch('products.json');
    let products = await response.json();

    let productsGrid = new ProductsGrid(products);
    document.querySelector('[data-products-grid-holder]').innerHTML = '';
    document.querySelector('[data-products-grid-holder]').append(productsGrid.elem);

    productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: stepSlider.value,
      category: ribbonMenu.value
    });

    document.body.addEventListener('product-add', event => {
      let product = products.find(product => event.detail === product.id);
      cart.addProduct(product);
    });

    stepSlider.elem.addEventListener('slider-change', event => {
      productsGrid.updateFilter({
        maxSpiciness: event.detail
      });
    });

    ribbonMenu.elem.addEventListener('ribbon-select', event => {
      productsGrid.updateFilter({
        category: event.detail
      });
    });

    document.querySelector('#nuts-checkbox').addEventListener('change', event => {
      productsGrid.updateFilter({
        noNuts: event.target.checked
      });
    });

    document.querySelector('#vegeterian-checkbox').addEventListener('change', event => {
      productsGrid.updateFilter({
        vegeterianOnly: event.target.checked
      });
    });
  }
}
