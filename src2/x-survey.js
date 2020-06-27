import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

class SurveyElement extends LitElement {
  createRenderRoot() { return this; }

  constructor() {
    super();
  }

  static get properties() {
    return {
      survey: { type: Object },
    }
  }

  render() {
  return html`${this.survey}<br>`
  }
}

customElements.define('x-survey', SurveyElement);
