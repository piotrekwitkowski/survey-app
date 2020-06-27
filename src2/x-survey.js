import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

class SurveyElement extends LitElement {
  createRenderRoot() { return this; }

  constructor() {
    super();

    fetch("Survey.json")
      .then(res => res.json())
      .then(contractJSON => this.instance = new web3.eth.Contract(contractJSON.abi, this.address))
  }

  static get properties() {
    return {
      address: { type: String },
      instance: { type: Object },
    }
  }

  logInstance() {
    console.log('instance:', this.instance);
  }

  logQuestions() {
    this.instance.methods.getInfo().call().then(info => {
      console.log(info)
    })
  }

  render() {
    return html`
      <p>Address: ${this.address}</p>
      <p>
        <button type="button" class="btn btn-secondary" @click=${this.logInstance}>Log instance</button>
        <button type="button" class="btn btn-secondary" @click=${this.logQuestions}>Log questions</button>
        <!-- <button type="button" class="btn btn-secondary" @click=${() => this.logParticipants()}>Log participants</button> -->
        <!-- <button type="button" class="btn btn-secondary" @click=${this.logMaxParticipants}>Log max participants</button> -->
      </p>
    `;
  }
}

customElements.define('x-survey', SurveyElement);
