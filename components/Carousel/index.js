import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.createSlides();
    this.initCarousel();
    this.buttonEvent();
  }

  createSlides() {
    const html = `
        <div class="carousel">
          <div class="carousel__arrow carousel__arrow_right">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </div>
          <div class="carousel__arrow carousel__arrow_left">
            <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
          </div>
          <div class="carousel__inner"></div>
        </div>
        `;

    let carousel = createElement(html);
    
    this.elem = carousel;

    let carouselInner = carousel.querySelector('.carousel__inner');
    carouselInner.innerHTML += this.slides.map( obj => {

      return `
        <div class="carousel__slide" data-id="${obj.id}">
          <img src="/assets/images/carousel/${obj.image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${obj.price.toFixed(2)}</span>
            <div class="carousel__title">${obj.name}</div>
            <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>`
    });

    Array.from(carouselInner.childNodes).forEach((el) => {
      if (el.nodeName === '#text') {
        el.remove();
      }
    });

    return carousel;

  }

  initCarousel() {
    const rightArrow = this.elem.querySelector('.carousel__arrow_right');
    const leftArrow = this.elem.querySelector('.carousel__arrow_left');

    let carouselInner = this.elem.querySelector('.carousel__inner');
    let slide = this.elem.querySelector('.carousel__slide');
    let position = 0;
    let condition = () => {
      if (-position >= slide.offsetWidth * (this.slides.length - 1)){
        rightArrow.style.display = 'none';
      } else if (position === 0) {
        leftArrow.style.display = 'none';
      } else {
      rightArrow.style.display = '';
      leftArrow.style.display = '';
      }
    };

    leftArrow.style.display = 'none';

    rightArrow.addEventListener('click', () => {     
      position -= slide.offsetWidth;
      carouselInner.style.transform = `translateX(${position}px)`;

      condition();
    });

    leftArrow.addEventListener('click', () => {
      position += slide.offsetWidth;
      carouselInner.style.transform = `translateX(${position}px)`;

      condition();
    });

  }

  buttonEvent() {

    let btn = this.elem.querySelectorAll('.carousel__button');
    let myProductsCart = [];
    
    for (let i = 0; i < btn.length; i++) {
      btn[i].addEventListener('click', (event) => {
        const slideId = event.target.closest('.carousel__slide').dataset.id;
        myProductsCart.push(slideId)

        const custom = new CustomEvent("product-add", { 
          detail: slideId,
          bubbles: true 
        })

        this.elem.dispatchEvent(custom);
      })
    }
  }
}
  


