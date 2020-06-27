// import { LitElement, html, css, customElement, property } from 'lit-element';
import { LitElement, html, css } from 'lit-element';

import './StateCreated.js'

export const init = (web3, surveyInstance) => {
  const appNode = document.querySelector("x-app");
  appNode.web3 = web3;
  appNode.surveyInstance = surveyInstance;
}

class AppElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      web3: { type: Object },
      surveyInstance: { type: Object },
      surveyState: { type: Object }
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('surveyInstance')) {
      console.log('surveyInstance', this.surveyInstance);
      this.surveyInstance.state().then(state => {
        console.log('state', state);
        this.surveyState = state.c;
      })
    }
  }

  render() {
    console.log('render');
    console.log('this.web3', this.web3);

    return html`
      <div class="container">
        <div class="row">
          <div class="col">
            <p>surveyInstance is ${this.surveyInstance ? 'present' : 'not present'}, surveyState is ${this.surveyState ? this.surveyState : 'not present'}</p>
            ${this.surveyState == 0 ? html`<x-state-created .surveyInstance=${this.surveyInstance} .web3=${this.web3}></x-state-created>` : ''}
            ${this.surveyState == 1 ? html`<x-state-open/>` : ''}
            ${this.surveyState == 2 ? html`<x-state-ended/>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('x-app', AppElement);
