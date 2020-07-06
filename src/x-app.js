import { LitElement, html } from 'lit-element';
import './x-survey.js';
const cryptico = require('cryptico-es6');

class AppElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      masterInstance: { type: Object },
      surveys: { type: Array },
      newSurveyEncrypted: { type: Boolean }
    }
  }

  constructor() {
    super();
    ethereum.enable();
    console.log('web3 version:', web3.version);
    console.log('switching to window.web3.currentProvider');
    web3 = new Web3(window.web3.currentProvider);
    console.log('web3 new version:', web3.version);

    fetch("Master.json")
      .then(res => res.json())
      .then(contractJSON => {
        console.log('contractJSON:', contractJSON);
        web3.eth.net.getId().then(networkId => {
          const deployedAddress = contractJSON.networks[networkId].address;
          this.masterInstance = new web3.eth.Contract(contractJSON.abi, deployedAddress)
        })
      })
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
    const name = this.renderRoot.querySelector('#newSurveyName').value;
    const participants = this.renderRoot.querySelector('#newSurveyParticipants').value || 0;
    const deposit = this.renderRoot.querySelector('#newSurveyDeposit').value || 0;
    const reward = this.renderRoot.querySelector('#newSurveyReward').value || 0;
    const questions = this.renderRoot.querySelector('#newSurveyQuestions').value.split(';').filter(x => x);
    const answersEncrypted = this.renderRoot.querySelector('#newSurveyAnswersEncrypted').checked;
    const publicKey = answersEncrypted ? this.getPublicKey() : '';

    const options = {
      from: web3.currentProvider.selectedAddress,
      value: web3.utils.toWei("" + participants * reward, 'wei')
      // it really works, wei is really small and MetaMask will often show it as simply '0 eth'
      // but Ganache displays the value of the transaction correctly
    };

    console.log('createSurvey', 'name:', name, 'participants:', participants, 'deposit:', deposit, 'reward:', reward, 'questions', questions, 'publicKey', publicKey);
    this.masterInstance.methods.createSurvey(name, participants, deposit, reward, questions, publicKey).send(options).then(transaction => {
      console.log('createSurvey transaction:', transaction);
      this.reloadSurveys();
    })
  }

  getPublicKey() {
    const passphrase = this.renderRoot.querySelector('#newSurveyPassphrase').value;
    const senderPrivateKey = cryptico.generateRSAKey(passphrase, 1024);
    return cryptico.publicKeyString(senderPrivateKey);
  }

  render() {
    return html`
      <div class="container">
        <div class="row">
          <div class="col">
            ${this.masterInstance ? html`
              <span class="badge badge-pill badge-success">Master contract OK</span>` : html`
              <span class="badge badge-pill badge-danger">Master contract instance not loaded!</span>`}
              
            ${this.surveys ? html`
              <p>Surveys count: ${this.surveys.length}</p>
              ${this.surveys.map(address => html`<x-survey .address=${address}></x-survey>`)}` : html`
              <p>No surveys</p>`}

            <button type="button" class="btn btn-success" data-toggle="modal" data-target='#createSurveyModal'>New survey</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="createSurveyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">New survey</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="m-2">
                <label class="flex-fill mr-2">Survey name</label>
                <input type="text" class="form-control" id="newSurveyName">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Number of participants</label>
                <input type="number" class="form-control" id="newSurveyParticipants">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Deposit of this survey (wei per participant)</label>
                <input type="number" class="form-control" id="newSurveyDeposit">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Reward for this survey (wei per participant)</label>
                <input type="number" class="form-control" id="newSurveyReward">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Questions (split with ;)</label>
                <input type="text" class="form-control" id="newSurveyQuestions">
              </div>
              <div class="mx-2 form-check">
                <input type="checkbox" class="form-check-input" id="newSurveyAnswersEncrypted" @input=${e => this.newSurveyEncrypted = e.target.checked}>
                <label class="form-check-label">I want the answers to be encrypted with a public key </label>
              </div>
              <div class="m-2" .hidden=${!this.newSurveyEncrypted}>
                <label class="flex-fill mr-2">Passphrase for RSA generation</label>
                <input type="text" class="form-control" id="newSurveyPassphrase">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-success" data-dismiss="modal"  @click=${this.createSurvey}>Create survey</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('x-app', AppElement);
