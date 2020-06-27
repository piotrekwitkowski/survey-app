console.log('app.js loaded');
import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

class AppElement extends LitElement {
  createRenderRoot() { return this; }

  constructor() {
    super();
    console.log('web3 version:', web3.version);
    console.log('switching to window.web3 provider...');
    web3 = new Web3(window.web3.currentProvider);
    console.log('web3:', web3);
    console.log('new web3 version:', web3.version);

    fetch("Master.json")
      .then(res => res.json())
      .then(contract => {
        console.log('abi:', contract);
        this.masterInstance = new web3.eth.Contract(contract.abi)
      })
  }

  static get properties() {
    return {
      masterInstance: { type: Object },
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('masterInstance')) {
      console.log('masterInstance', this.masterInstance);
      this.masterInstance.methods.getSurveys().then(surveys => {
        console.log('surveys:', surveys);
        this.surveys = surveys;
      })
    }
  }

  render() {
    console.log('render');

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
