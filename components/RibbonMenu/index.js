import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.createMenu();
    this.scrollMenu();
    this.chooseCategory();
  }

  createMenu() {
    let ribbonMenu = document.createElement('DIV');
    ribbonMenu.className = 'ribbon';
    ribbonMenu.innerHTML = `
    <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    <nav class="ribbon__inner">
      <a href="#" class="ribbon__item ribbon__item_active" data-id="">All</a>
      <a href="#" class="ribbon__item" data-id="salads">Salads</a>
      <a href="#" class="ribbon__item" data-id="soups">Soups</a>
      <a href="#" class="ribbon__item" data-id="chicken-dishes">Chicken dishes</a>
      <a href="#" class="ribbon__item" data-id="beef-dishes">Beef dishes</a>
      <a href="#" class="ribbon__item" data-id="seafood-dishes">Seafood dishes</a>
      <a href="#" class="ribbon__item" data-id="vegetable-dishes">Vegetable dishes</a>
      <a href="#" class="ribbon__item" data-id="bits-and-bites">Bits and bites</a>
      <a href="#" class="ribbon__item" data-id="on-the-side ribbon__item_active">On the side</a>
    </nav>
    <button class="ribbon__arrow ribbon__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    `;

    this.elem = ribbonMenu;

    return ribbonMenu;
  }

  scrollMenu() {
    const leftArrow = this.elem.querySelector('.ribbon__arrow_left');
    const rightArrow = this.elem.querySelector('.ribbon__arrow_right');
    const ribbonInner = this.elem.querySelector('.ribbon__inner');

    leftArrow.classList.toggle('ribbon__arrow_visible');
    rightArrow.classList.toggle('ribbon__arrow_visible');

    const scrollCheck = () => {
    let scrollWidth = ribbonInner.scrollWidth;
    let scrollLeft = ribbonInner.scrollLeft;
    let clientWidth = ribbonInner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;

    if (scrollRight < 1) {
      rightArrow.classList.toggle('ribbon__arrow_visible');
      } else {
        rightArrow.classList.add('ribbon__arrow_visible');
      };

    if (scrollLeft === 0) {
      leftArrow.classList.toggle('ribbon__arrow_visible');
      } else {
        leftArrow.classList.add('ribbon__arrow_visible');
      };
    }

    rightArrow.addEventListener('click', () => {
      ribbonInner.scrollBy(350,0);
    });

    leftArrow.addEventListener('click', () => {
      ribbonInner.scrollBy(-350,0);
    });

    ribbonInner.addEventListener('scroll', scrollCheck);

  }

  chooseCategory() {
    const link = this.elem.querySelectorAll('a');
    
    for (let i = 0; i < link.length; i++) {
      link[i].addEventListener('click', event => {
        event.preventDefault();

        let activeItem = this.elem.querySelector('.ribbon__item_active');
        let categoryId = event.target.dataset.id;

        event.target.classList.toggle('ribbon__item_active');
        activeItem.classList.toggle('ribbon__item_active');

        const custom = new CustomEvent('ribbon-select', {
          detail: categoryId,
          bubbles: true
          });

        this.elem.dispatchEvent(custom);

      });

    };

  }

}
