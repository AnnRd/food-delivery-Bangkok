import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.elem;
    this.escapeEvent();
    this.render();
  }

  render() {
    this.elem = createElement(`
    <div class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title"></h3>
      </div>
      <div class="modal__body"></div>
    </div>
  </div>
    `);
  }

  open() {

    document.body.append(this.elem);
    document.body.classList.add('is-modal-open');

    let button = this.elem.querySelector('.modal__close');
    button.addEventListener('click', () => {
      this.close();
    });

    this.keydownEvent = (event) => this.escapeEvent(event);
    document.body.classList.contains('is-modal-open');
    document.addEventListener('keydown', this.keydownEvent);

  }

  setTitle(title) {
    let modalTitle = this.elem.querySelector('.modal__title');
    modalTitle.textContent = title;
  }

  setBody(node) {
    let modalBody = this.elem.querySelector('.modal__body');
    modalBody.innerHTML = '';
    modalBody.append(node);
  }

  close() {
    document.removeEventListener('keydown', this.keyDownEvent);
    document.body.classList.remove('is-modal-open');
    this.elem.remove();
  }

  escapeEvent(event) {
    if (event?.code === 'Escape') {
      event.preventDefault();
      this.close();
    }
  };
}
