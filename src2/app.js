console.log('app.js loaded');
import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';
import './x-survey.js';

class AppElement extends LitElement {
  createRenderRoot() { return this; }

  constructor() {
    super();
    ethereum.enable();
    console.log('web3 version:', web3.version);
    console.log('switching to window.web3 provider...');
    web3 = new Web3(window.web3.currentProvider);
    console.log('web3:', web3);
    console.log('new web3 version:', web3.version);

    fetch("Master.json")
      .then(res => res.json())
      .then(contractJSON => {
        console.log('contractJSON:', contractJSON);

        // this.masterInstance = new web3.eth.Contract(contractJSON.abi)
        web3.eth.net.getId().then(networkId => {
          const deployedAddress = contractJSON.networks[networkId].address;
          this.masterInstance = new web3.eth.Contract(contractJSON.abi, deployedAddress)
        })
      })
  }

  static get properties() {
    return {
      masterInstance: { type: Object },
      surveys: { type: Array },
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('masterInstance')) {
      console.log('masterInstance', this.masterInstance);
      this.reloadSurveys();
    }
  }

  reloadSurveys() {
    this.masterInstance.methods.getSurveys().call().then(surveys => {
      console.log('surveys:', surveys);
      this.surveys = surveys;
    })
  }

  createSurvey() {
    console.log('createSurvey');
    web3.eth.getAccounts().then(accounts => {
      const options = { from: accounts[0] };
      this.masterInstance.methods.createSurvey(["Question1"]).send(options).then(transaction => {
        console.log('transaction:', transaction);
        this.reloadSurveys();  
      });
    })
  }

  render() {
    return html`
      <div class="container">
        <div class="row">
          <div class="col">
            <p>Master contract instance is ${this.masterInstance ? 'loaded' : 'not present'}</p>
            <button type="button" class="btn btn-secondary" @click=${this.reloadSurveys}>Reload surveys</button>

            ${this.surveys ? html`
              <p>this.surveys.length is ${this.surveys.length}</p>
              ${this.surveys.map(address => html`<x-survey .address=${address}></x-survey>`)}
            ` : html`<p>No surveys</p>`}

            <!-- <p>-----------------------------------</p>
            <label class="flex-fill mr-2">How many participants?</label>
            <input type="number" class="flex-fill form-control m-2" value=${this.participants}>
            <button type="button" class="btn btn-primary m-2" @click=${this.addQuestion}>Add questions</button> -->

            <button type="button" class="btn btn-success" @click=${this.createSurvey}>Create test survey</button>

          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('x-app', AppElement);
